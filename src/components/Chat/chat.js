/**
 * Created by Paul on 13.05.2019.
 */
import React, { Component } from 'react'
import {MessageList} from './messagelist'
import {AddDay, arrOfWeekDays, dateDiff, toYYYYMMDD,
        instanceLocator, testToken, chatUserName,
        } from '../helpers'
import { store } from '../../store/configureStore'
import emailPropType from 'email-prop-type';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import arrow_down from '../../img/ARROW_DOWN.png'
import arrow_up from '../../img/ARROW_UP.png'
import { API_URL, BASE_HOST, WEBSOCKETPORT, LOCALPUSHERPWD, HOMEWORK_ADD_URL, instanceAxios } from '../../config/URLs'
import './chat.css';
import addMsg from '../../img/addMsg.svg'
import { Smile } from 'react-feather';
import { Picker, emojiIndex } from 'emoji-mart';
import Echo from 'laravel-echo'
import {Pusher} from 'pusher-js'
import { connect } from 'react-redux'
import { default as uniqid } from 'uniqid'


// export default
class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            curDate: AddDay(new Date(), 1),
            currentUser: null,
            currentRoom: {users:[]},
            messages: this.initChatMessages(),
            users: [],
            selSubject : false,
            selSubjkey : null,
            selSubjname : null,
            selDate : false,
            selUser : false,
            dayUp : true,
            subjUp : true,
            userUp : true,
            hwPlus : true,
            servicePlus : true,
            addMsgs : [],
            isServiceChat : this.props.isservice,
            showEmojiPicker : false,
            newMessage: '',
            messagesNew : [],
            Echo : {},
            typingUsers : new Map(),
        }
        this.now = new Date()
        this.roomId = this.props.userSetup.classObj.chatroom_id
        this.initLocalPusher = this.initLocalPusher.bind(this)
        this.initNetPusher = this.initNetPusher.bind(this)
        this.addEmoji = this.addEmoji.bind(this);
        this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this);
        this.sendMessageTextArea = this.sendMessageTextArea.bind(this);
        this.prepareJSON = this.prepareJSON.bind(this)
        // this.prepareMessageToFormat = this.prepareMessageToFormat.bind(this)
        this.initChatMessages = this.initChatMessages.bind(this)
        this._handleKeyDown = this._handleKeyDown.bind(this)
    }
    toggleEmojiPicker=()=>{
        this.setState({            showEmojiPicker: !this.state.showEmojiPicker,        });
    }
    initChatMessages=()=>{
        // console.log("this.props.messages", this.props.messages,
        //     this.prepareMessageArrayToFormat(this.props.messages), item=>this.prepareMessageToFormat(item))
        if (this.props.isnew) {
            return this.props.messages.map(item=>this.prepareMessageToFormat(item))
        }
        else {
            return []
        }
    }
    addEmoji=(emoji)=>{
        const { newMessage } = this.state;
        const text = `${newMessage}${emoji.native}`;
        this.setState({
            newMessage: text,
            showEmojiPicker: false,
        });
        this.inputMessage.value = this.inputMessage.value + emoji.native
    }

    prepareMessageToFormat=(msg)=>{
        let obj = {}
        obj.senderId = msg.user_name
        obj.text = msg.message
        obj.time = msg.msg_time
        obj.userID = msg.user_id
        obj.userName = msg.user_name
        obj.uniqid = msg.uniqid
        if (!(msg.homework_date === null)) {
            obj.hwdate = msg.homework_date
            obj.subjkey = msg.homework_subj_key
            obj.subjname = msg.homework_subj_name
            obj.subjid = msg.homework_subj_id
        }
        obj.id = msg.id
        //"{"senderId":"my-marks","text":"выучить параграф 12","time":"14:59","userID":209,"userName":"Menen",
        // "hwdate":"2019-07-16T21:00:00.000Z","subjkey":"#lngukr","subjname":"Українська мова"}"
        // console.log('obj', JSON.stringify(obj))
        return JSON.stringify(obj)
    }
    initLocalPusher=()=>{
        let {token} = store.getState().user
        let echo = new Echo(
            {
                broadcaster : 'pusher',
                key : LOCALPUSHERPWD,
                cluster : 'mt1',
                wsHost : BASE_HOST,
                wsPort : WEBSOCKETPORT,
                wssPort: WEBSOCKETPORT,
                disableStats: true,
                enabledTransports: ['ws', 'wss'],
                auth: {
                    headers: {
                        'V-Auth': true,
                        Authorization: `Bearer ${token}`,
                    }
                }
            }
        )

        let channelName = 'class.'+this.props.userSetup.classID
        this.setState({Echo: echo})
        console.log('websocket', echo, channelName)
        echo.private(channelName)
            .listen('ChatMessage', (e) => {
                let msg = this.prepareMessageToFormat(e.message)
                // console.log('chatRecieve', e.message,
                //     JSON.parse(msg).uniqid,
                //     this.state.messagesNew,
                //     this.state.messagesNew.includes(JSON.parse(msg).uniqid),
                //     this.state.messages.filter(item=>!(this.state.messagesNew.includes(JSON.parse(msg).uniqid))));
                let stateArr = this.state.messages.filter(
                    item=>
                    {
                        // console.log("FILTER", JSON.parse(msg).uniqid, item, item.uniqid, JSON.parse(msg).uniqid === item.uniqid, this.state.messagesNew.includes(item.uniqid))
                        return    !(JSON.parse(msg).uniqid === JSON.parse(item).uniqid && this.state.messagesNew.includes(JSON.parse(item).uniqid))
                    }
                )
                this.setState({
                    messages: [...stateArr, msg],
                    messagesNew : this.state.messagesNew.filter(item=>!(item.uniqid===JSON.parse(msg).uniqid))
                })
                this.props.updatemessage(msg)
            })
            .listenForWhisper('typing', (e) => {
                if (!this.state.typingUsers.has(e.name)) {
                    let mp = this.state.typingUsers
                    mp.set(e.name, new Date())
                    console.log('SetTypingState', e.name);
                    this.setState({typingUsers: mp})
                }
                console.log('typing', e.name);
            });
        ;
    }

    initNetPusher=()=>{
        console.log("initNetPusher:roomId", this.roomId)
        if (this.roomId) {
            const chatManager = new ChatManager({
                instanceLocator: instanceLocator,
                userId: chatUserName,
                tokenProvider: new TokenProvider({url: testToken}),
                connectionTimeout: 20000
            })
            chatManager
                .connect()
                .then(currentUser => {
                    this.setState({currentUser: currentUser})
                    return currentUser.subscribeToRoom({
                        roomId: this.roomId.toString(),
                        // messageLimit: 100,
                        hooks: {
                            onMessage: message => {
                                if (JSON.parse(message.text).classID === this.props.classID) {
                                    this.setState({
                                        messages: [...this.state.messages, message.text],
                                    })
                                }
                                // console.log("MESSAGES", message, JSON.parse(message.text))
                            },
                        }
                    })
                })
                .then(currentRoom => {
                    this.setState({
                        currentRoom,
                        users: currentRoom.userIds
                    })
                })
                .catch(error => console.log(error))

            // console.log("this.inputEmail", this.inputEmail)

            if (this.inputEmail)
                this.inputEmail.propTypes = {
                    emailAddress: emailPropType.isRequired, // can also specify emailPropType if it is not required
                }
        }
    }
    componentDidMount(){
        if (this.props.isnew)
            this.initLocalPusher()
        else {
            this.initNetPusher()
        }
        // if (this.typingTimer) clearTimeout(this.typingTimer)
        this.typingTimer = setInterval(()=>{
            // console.log("setInterval-tag")
            let mp = this.state.typingUsers,
                now = (new Date())
            for (let user of mp.keys()) {
                console.log("setInterval", user, now, mp.get(user),
                    Math.abs(now.getUTCSeconds() - mp.get(user).getUTCSeconds()),
                    Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(mp.get(user).getFullYear(), mp.get(user).getMonth(), mp.get(user).getDate()) ) /(1000)))

                if (Math.abs(now.getUTCSeconds() - mp.get(user).getUTCSeconds()) > 2) {
                    mp.delete(user)
                    this.setState({typingUsers: mp})
                }

            }
            if (this.props.isnew)
            console.log("maps", mp, this.state.typingUsers, mp.size, this.state.typingUsers.size)
            // if (!(mp.size === this.state.typingUsers.size)) {
            //     console.log("deleteMap")
            //     this.setState({typingUsers: mp})
            //     // this.forceUpdate()
            // }
        }, 2000)
     }
    componentWillUnmount() {
        if (this.typingTimer) clearInterval(this.typingTimer)
    }

    prepareJSON=()=>{
        let {classID, userName, userID, studentId, studentName} = this.props.userSetup
        let obj = {}
        switch (this.props.isnew) {
            case true :
                obj.class_id = classID;
                obj.message = this.inputMessage.value;
                obj.msg_date = toYYYYMMDD(new Date());
                obj.msg_time = (new Date()).toLocaleTimeString().slice(0, 5);
                if (!(this.state.selSubjkey === null)) {
                    obj.homework_date = toYYYYMMDD(this.state.curDate)
                    obj.homework_subj_key = this.state.selSubjkey
                    obj.homework_subj_name = this.state.selSubjname
                    this.addHomeWork(obj.text)
                }
                obj.user_id = userID
                obj.user_name = userName
                obj.student_id = studentId
                obj.student_name = studentName
                obj.uniqid = uniqid()
                this.setState({messagesNew : [...this.state.messagesNew, obj.uniqid]})
                break;
            default :
                obj.senderId = chatUserName
                obj.text = this.inputMessage.value
                obj.time = (new Date()).toLocaleTimeString().slice(0, 5)
                obj.userID = this.props.userID
                obj.userName = this.props.userName
                if (!(this.state.selSubjkey === null)) {
                    obj.hwdate = toYYYYMMDD(this.state.curDate)
                    obj.subjkey = this.state.selSubjkey
                    obj.subjname = this.state.selSubjname
                    this.addHomeWork(obj.text)
                }
                // this.addMsg(obj)
                break;
        }
        this.inputMessage.value = ''
        this.setState({
            selSubject: false,
            selDate: false,
        })
        return JSON.stringify(obj)
    }
    prepareMessageToState=(objFrom)=>{
        objFrom = JSON.parse(objFrom)
        let obj = {}
        obj.senderId = objFrom.user_name
        obj.text = objFrom.message
        obj.time = objFrom.msg_time
        obj.userID = objFrom.user_id
        obj.userName = objFrom.user_name
        obj.uniqid = objFrom.uniqid
        if (!(objFrom.homework_date === null)) {
            obj.hwdate = objFrom.homework_date
            obj.subjkey = objFrom.homework_subj_key
            obj.subjname = objFrom.homework_subj_name
            obj.subjid = objFrom.homework_subj_id
        }
        obj.id = 0
        //"{"senderId":"my-marks","text":"выучить параграф 12","time":"14:59","userID":209,"userName":"Menen",
        // "hwdate":"2019-07-16T21:00:00.000Z","subjkey":"#lngukr","subjname":"Українська мова"}"
        // console.log('obj', JSON.stringify(obj))
        return JSON.stringify(obj)
    }
    addMessage=()=>{
        let obj = this.prepareJSON()
        let objForState = this.prepareMessageToState(obj)
        this.setState({messages : [...this.state.messages, objForState]})
        this.sendMessage(obj)
        this.addHomeWork(this.props.isnew?JSON.parse(obj).message:JSON.parse(obj).text)
    }
    _handleKeyDown = (e) => {
        // console.log("_handleKeyDown", this.state.Echo)
        if (this.props.isnew) {
            let channelName = 'class.'+this.props.userSetup.classID
            this.state.Echo.private(channelName)
                .whisper('typing', {
                        name: this.props.userSetup.userName
                    })
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            let obj = this.prepareJSON()
            let objForState = this.prepareMessageToState(obj)
            this.setState({messages : [...this.state.messages, objForState]})
            // console.log(obj, this.state.selSubjkey)
            this.sendMessage(obj)
        }
        else {
            // console.log('e', e.target.value, e.target.value.slice(-1), e.key)
            if ((e.target.value.slice(-1) === ':' && (e.key.trim().length)) || e.key===')' || e.key==='(') {
                console.log('emojiIndex',
                emojiIndex
                    .search(e.target.value.slice(-1)+e.key)
                    .filter(item=>item.emoticons.indexOf(e.target.value.slice(-1)+e.key)>=0)
                    .map(o => ({
                        colons: o.colons,
                        native: o.native,
                        }))
                )
                let smile = emojiIndex
                    .search(e.target.value.slice(-1)+e.key)
                    .filter(item=>item.emoticons.indexOf(e.target.value.slice(-1)+e.key)>=0)
                    .map(o => ({
                        colons: o.colons,
                        native: o.native,
                    }))

                if (smile.length) {
                    this.inputMessage.value = this.inputMessage.value.substring(0, this.inputMessage.value.length - 1) + smile[0].native
                    e.preventDefault();
                }
                console.log("smile", emojiIndex.search(e.key), e.target.value.slice(-1) + e.key)

                // this.inputMessage.value = this.inputMessage.value +                 emojiIndex
                //         .search(e.target.value.slice(-1)+e.key)
                //         .filter(item=>item.emoticons.indexOf(e.target.value.slice(-1)+e.key)>=0)
                //         .map(o => ({
                //             colons: o.colons,
                //             native: o.native,
                //         })).native

            }

        }
    }
    addHomeWork=(txt)=>{
        let {classID, userID, studentId} = this.props.userSetup
        // let {userName} = this.props.userSetup
        // let {homework : homeworkarray} = this.props //this.state;
        // let id = this.props.homeworkarray.reduce((max, current)=>(current.id > max?current.id:max), 0) + 1;
        let subj_key = this.state.selSubjkey //selectedSubjects[this.state.curSubjIndex].subj_key
        let subj_name_ua = this.state.selSubjname //selectedSubjects[this.state.curSubjIndex].subj_name_ua
        let ondate = this.state.curDate //new Date("2019-04-09");
        // let author = userName //userName
        // let instime = new Date() //"16:10"
        // instime = ('0'+instime.getHours()).slice(-2) + ':' + ('0'+instime.getMinutes()).slice(-2)

        // let json = `{"id":${id}, "subj_key":"${subj_key}", "subj_name_ua": "${subj_name_ua}", "homework": "${txt}", "ondate": "${ondate}", "author": "${author}", "instime" : "${instime}"}`;
        // console.log(json)
        // json = JSON.parse(json);

        let json = `{"subj_key":"${subj_key}", "subj_name_ua": "${subj_name_ua}", "homework": "${txt}", "ondate": "${toYYYYMMDD(ondate)}", "user_id": "${userID}", "student_id":"${studentId}"}`;
        console.log(json);
        instanceAxios().post(HOMEWORK_ADD_URL + '/' + classID + '/hw/' + 0, json)
            .then(response => {
                console.log(response.data)
                this.props.onHomeWorkChanged(response.data)
                // this.setState({
                //     emails : response.data//response.data.map((item, i) => (<div className="itemInEmailList" key={item.id}>{item.email}<button id={item.id} onClick={this.deleteItemInList.bind(this)}>-</button></div>))
                // })
                // dispatch({type: 'UPDATE_SETUP_REMOTE', payload: response.data})
                // this.props.onInitState(response.data.subjects_list, response.data.subjects_count);
            })
            .catch(response => {
                console.log(response);
            })
        this.setState({sideListLeft: true, editId : 0})
    }
    /*
    * Отправляем электронного письмо
    * (в данном случае в службу техподдержки
    * ToDO: Создать событие на добавлении данных в таблицу техподдержки и уже оттуда отправлять письмо
    * */
    sendMail=(mail, text)=>{
        // let header = {
        //     headers: {
        //         'Content-Type': "application/json",
        //         'Access-Control-Allow-Origin' : '*',
        //         'Access-Control-Allow-Methods' : 'POST',
        //     }
        // }
        let author = !this.inputName===undefined?this.inputName.value:"",
            mailAuthor = !this.inputEmail===undefined?this.inputEmail.value:""
        let json = `{   "session_id":"${this.props.session_id}",
                        "mailService":"${mail}",
                        "author":"${author}",
                        "mailAuthor":"${mailAuthor}",
                        "text":"${text}",
                        "classID":${this.props.classID},
                        "userID":${this.props.userID}}`
        // console.log(json)
        let data = JSON.parse(json);
         if (true) {
            instanceAxios().post(API_URL + 'mail', JSON.stringify(data))
                .then(response => {
                    console.log('SEND_MAIL', response)
                    // dispatch({type: 'UPDATE_STUDENTS_REMOTE', payload: response.data})
                })
                .catch(response => {
                    console.log("AXIOUS_ERROR", response);
                    // dispatch({type: 'UPDATE_STUDENTS_FAILED', payload: response.data})
                })
        }
    }
    /*
    * Отправляем сообщение на сервер Pusher
    * или же просто в state в случае письма в техподдержку
    * ToDo: Вывести сообщение (сделать умный input) в случае незаполнения полей имени и электронки
    * */
    sendMessage(text) {
        console.log("sendMessage", this.state.currentUser, text)
        let arr = this.state.addMsgs
        if (this.state.isServiceChat||!this.state.servicePlus) {
            console.log('Отправим электронку', this.state.addMsgs)
            if (!this.props.userID) {
                if (!this.inputName.value.toString().length) {
                    console.log("Введите имя")
                    return
                }
                if (!this.inputEmail.value.toString().length) {
                    console.log("Введите пожалуйста электронку")
                    return
                }
            }
            arr.push(JSON.parse(text).text)
            this.sendMail('paul.n.skiba@gmail.com', JSON.parse(text).text)
            this.setState({addMsgs : arr})
            return
        }
        console.log("Next message!", text)
        // return
        // Передаём сообщение с определёнными параметрами (ID-сессии + ClassID)

        // + Сохраним данные в своей БД

        switch (this.props.isnew) {
            case true :

                instanceAxios().post(API_URL + 'chat/add', text)
                    .then(response => {
                        console.log('ADD_MSG', response)
                    })
                break;
            default :
            this.state.currentUser.sendMessage({
                    text,
                    roomId: this.roomId.toString()
                })
                    .catch(error => console.error('error Sending message', error));
            break;
        }
    }

    daysList=()=>{
        // const daysArr = [ {key:0, name:"Сегодня"}, {key:1, name:"Завтра"}, {key:2, name:"Послезавтра"}]
        // <div className="add-msg-homework-title">
        let daysArr = []
        for (let i = -2; i < 8; i++) {
            let obj = {}
            obj.id = i
            obj.name = this.dateString(AddDay(this.now, i))
            daysArr.push(obj)
        }
        console.log("daysArr", daysArr)
        return daysArr.map((item, i)=>(<div key={i} onClick={()=>{this.setState({curDate : AddDay(this.now, item.id), selDate : true, dayUp: !this.state.dayUp})}} className="add-msg-homework-day" id={item.id}>{item.name}</div>))
    }
    dateString=(curDate)=>{
        let datediff = dateDiff(this.now, curDate)+2;
        let daysArr = ["Позавчера","Вчера","Сегодня","Завтра","Послезавтра"]
        Date.prototype.getWeek = function() {
            let onejan = new Date(this.getFullYear(),0,1);
            return Math.ceil((((this - onejan) / 86400000) + onejan.getDay())/7);
        }
        // console.log("datediff", datediff, curDate);
        if (datediff>=0&&datediff<5)
            return daysArr[datediff].toUpperCase();
        else {
            if ((curDate.getWeek() - this.now.getWeek())>=0)
            {
                if (this.now.getWeek() === curDate.getWeek()) {
                    return arrOfWeekDays[curDate.getDay()] + '[эта.неделя]'
                }
                else {
                    if ((this.now.getWeek() + 1) === curDate.getWeek()) {
                        return arrOfWeekDays[curDate.getDay()] + '[след.неделя]'
                    }
                    else {
                        return arrOfWeekDays[curDate.getDay()] + '  +' + (curDate.getWeek() - this.now.getWeek()) +'нед.'
                    }
                }
            }
            else {
                return arrOfWeekDays[curDate.getDay()] + '  ' + (curDate.getWeek() - this.now.getWeek()) +'нед.'
            }
        }
        // return ""
        // return "След. Вторник"
    }
    subjList=()=>{
        console.log(this.props.subjs)
        return this.props.subjs.map((item, i)=><div key={i} onClick={()=>{this.setState({selSubjname : item.subj_name_ua, selSubjkey : item.subj_key, selSubject : true, subjUp: !this.state.subjUp})}} className="add-msg-homework-subject" id={item.subj_key}>{item.subj_name_ua}</div>)
    }

    handleKeyPress=(event)=> {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.sendMessageTextArea();
        }
    }
    handleInput=(event) =>{
        const { value, name } = event.target;

        this.setState({
            [name]: value,
        });
    }
    sendMessageTextArea=()=> {
        const { newMessage } = this.state;

        if (newMessage.trim() === '') return;

        // currentUser.sendMessage({
        //     text: newMessage,
        //     roomId: `${currentRoom.id}`,
        // });

        this.setState({
            newMessage: '',
        });
    }
    render() {
        const {
            showEmojiPicker,
            // newMessage,
        } = this.state;

        // console.log('this.state.messages', this.state.messages)
        return (


            <div className={this.props.isnew?"chat-container-new":"chat-container"} style={{opacity: 1 }}>

                {showEmojiPicker ? (
                    <div className="picker-background">
                        <Picker set="emojione"
                                onSelect={this.addEmoji}
                                style={{ position: 'absolute', overflow : 'auto',
                                    zIndex: '30', height : '400px', width : '340px',
                                    marginTop : '10px', background : 'white'}}
                                emojiSize={20}
                                include={['people']}
                                i18n={{
                                    search: 'Поиск',
                                    categories: {
                                            search: 'Результаты поиска',
                                            recent: 'Недавние',
                                            people: 'Смайлы & Люди',
                                        }
                                    }}
                        />
                    </div>

                    // <NimblePicker set='messenger' data={data} />
                    ) : null}

                <div className={this.props.isnew?"msg-title-new":"msg-title"} onClick={this.props.btnclose}>
                    <div>{this.state.isServiceChat?"My.Marks CHAT: Вопрос разработчику":"My.Marks CHAT"}</div>
                    <div className="btn-close-chat" onClick={this.props.btnclose}>X</div>
                </div>
                {this.props.userSetup.classID?<div className="service-plus" onClick={()=>{this.setState({servicePlus : !this.state.servicePlus})}}>{this.state.servicePlus?"+":"-"} Вопрос разработчику</div>:""}
                {!this.roomId?
                    <div className="msg-title-userdata">
                        <label>Имя</label><input type="text" className="msg-title-userdata-name" ref={input => {
                        this.inputName = input
                    }}></input>
                        <label>Email</label><input type="email" className="msg-title-userdata-email" ref={input => {
                        this.inputEmail = input
                    }}></input>
                    </div>
                    :""}

                <MessageList hwdate={this.state.selDate?this.state.curDate:null}
                             messages={this.state.messages} username={chatUserName}
                             isshortmsg={this.state.isServiceChat||!this.state.servicePlus}
                             classID={this.props.classID}
                             addmsgs={this.state.addMsgs}/>

                <div className="who-typing">
                    {this.state.typingUsers.size > 0?"Сообщение набира" + ((this.state.typingUsers.size===1?"е":"ю") + "т: ") + Array.from(this.state.typingUsers.keys()).join(', '):""}
                </div>
                <div className={"add-msg-container"}>
                    <form className="frm-add-msg">
                            <div className="input-msg-block">
                                <button
                                    type="button"
                                    className="toggle-emoji"
                                    onClick={this.toggleEmojiPicker}
                                >
                                    <Smile />
                                </button>

                                {/*<ReactTextareaAutocomplete*/}
                                    {/*className="message-input msg-add-textarea"*/}
                                    {/*name="newMessage"*/}
                                    {/*value={newMessage}*/}
                                    {/*loadingComponent={() => <span>Загрузка</span>}*/}
                                    {/*onKeyPress={this.handleKeyPress}*/}
                                    {/*onChange={this.handleInput}*/}
                                    {/*placeholder="Введите сообщение..."*/}
                                    {/*trigger={{*/}
                                        {/*':': {*/}
                                            {/*dataProvider: token =>{*/}
                                                {/*console.log("token", token)*/}
                                                {/*// console.log("newMessage", newMessage)*/}
                                                {/*console.log("emojiIndex.search(token)"*/}
                                                    {/*, emojiIndex.search(token)*/}
                                                    {/*, emojiIndex.search(token)*/}
                                                        {/*.filter(item=>item.emoticons.indexOf(':'+token)>=0)*/}
                                                        {/*// .map(*/}
                                                        {/*//o=>o.emoticons.filter(item=>item.indexOf(token)>=0)*/}
                                                        {/*// )*/}
                                                        {/*// .filter(item=>item.length)*/}
                                                {/*)*/}
                                                {/*// return emojiIndex.search(token).map(o => ({*/}
                                                {/*//     colons: o.colons,*/}
                                                {/*//     native: o.native,*/}
                                                {/*// }))*/}
                                                {/*return emojiIndex.search(token)*/}
                                                    {/*.filter(item=>item.emoticons.indexOf(':'+token)>=0).map(o => ({*/}
                                                        {/*colons: o.colons,*/}
                                                        {/*native: o.native,*/}
                                                    {/*}))*/}
                                            {/*}*/}

                                                {/*,*/}
                                            {/*component: ({ entity: { native, colons } }) => (*/}
                                                {/*<div>{`${native}`}</div>*/}
                                            {/*),*/}
                                            {/*output: item => `${item.native}`,*/}
                                        {/*},*/}
                                    {/*}}*/}
                                {/*/>*/}


                                <textarea onKeyDown={this._handleKeyDown} className="msg-add-textarea"
                                  placeholder="Введите сообщение..."  type="text" ref={input=>{this.inputMessage=input}}
                                />

                                <div className={"btn-add-message"} type="submit" onClick={this.addMessage.bind(this)}><img height="25px" src={addMsg} alt=""/></div>
                                {!this.state.isServiceChat?<div className="homework-plus" onClick={()=>{this.setState({hwPlus : !this.state.hwPlus})}}>{this.state.hwPlus?"+":"-"} Домашка</div>:""}
                            </div>

                        {!this.state.hwPlus?
                            <div className="add-msg-homework-block">
                                <div className="add-msg-homework-title">Домашка</div>
                                <div id={"selDate"} className={!this.state.selDate?"add-msg-homework-day":"add-msg-homework-day active-msg-btn"} onClick={(e)=>{return e.target.nodeName === "DIV"&&e.target.id==="selDate"?this.setState({selDate: !this.state.selDate}):"";}}>
                                    <div className={"showDaysSection"} style={{opacity: !this.state.dayUp?1:0 }}>{!this.state.dayUp?this.daysList():""}</div>
                                    {this.dateString(this.state.curDate)}
                                    <div className={"msg-btn-up"} onClick={(e)=>{this.setState({dayUp: !this.state.dayUp});console.log(e.target.nodeName);e.preventDefault();}}><img src={this.state.dayUp?arrow_up:arrow_down} alt=""/></div></div>
                                <div id={"selSubj"} className={!this.state.selSubject?"add-msg-homework-subject":"add-msg-homework-subject active-msg-btn"} onClick={(e)=>{return e.target.nodeName === "DIV"&&e.target.id==="selSubj"?this.setState({selSubject: (!this.state.selSubject) }):""}}>
                                    <div className={"showSubjSection"} style={{opacity: !this.state.subjUp?1:0 }}>{!this.state.subjUp?this.subjList():""}</div>
                                    {this.state.selSubjkey===null?"ПРЕДМЕТ?":this.state.selSubjname}
                                    <div className={"msg-btn-up"} onClick={(e)=>{e.preventDefault(); this.setState({subjUp: !this.state.subjUp})}}><img src={this.state.subjUp?arrow_up:arrow_down} alt=""/></div></div>
                            </div>:""}
                    </form>
                </div>
            </div>

        )
    }
}

// приклеиваем данные из store
const mapStateToProps = store => {
    // console.log(store) // посмотрим, что же у нас в store?
    return {
        user:       store.user,
        userSetup:  store.userSetup,
    }
}
export default connect(mapStateToProps, {})(Chat)