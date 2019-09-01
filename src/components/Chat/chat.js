/**
 * Created by Paul on 13.05.2019.
 */
import React, { Component } from 'react'
import MessageList from '../MessageList/messagelist'
import { store } from '../../store/configureStore'
import emailPropType from 'email-prop-type';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import arrow_down from '../../img/ARROW_DOWN.png'
import arrow_up from '../../img/ARROW_UP.png'
import { API_URL, BASE_HOST, WEBSOCKETPORT, LOCALPUSHERPWD, HOMEWORK_ADD_URL,
        instanceLocator, testToken, chatUserName } from '../../config/config'
import {AddDay, arrOfWeekDays, dateDiff, toYYYYMMDD, instanceAxios, mapStateToProps, prepareMessageToFormat, echoClient, pusherClient} from '../../js/helpers'
import addMsg from '../../img/addMsg.svg'
import { Smile } from 'react-feather';
import { Picker, emojiIndex } from 'emoji-mart';
// import Echo from 'laravel-echo'
// import {Pusher} from 'pusher-js'
import { connect } from 'react-redux'
// import {Pusher} from 'pusher-js'
// import { default as uniqid } from 'uniqid'

import '../../css/colors.css';
import './chat.css';

// export default
class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            curDate: AddDay(new Date(), 1),
            currentUser: null,
            currentRoom: {users:[]},
            messages: [],
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
            localChatMessages : [],
        }
        this.now = new Date()
        this.roomId = this.props.chatroomID //this.props.userSetup.classObj.chatroom_id
        this.initLocalPusher = this.initLocalPusher.bind(this)
        this.initNetPusher = this.initNetPusher.bind(this)
        this.addEmoji = this.addEmoji.bind(this);
        this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this);
        this.sendMessageTextArea = this.sendMessageTextArea.bind(this);
        this.prepareJSON = this.prepareJSON.bind(this)
        this.initChatMessages = this.initChatMessages.bind(this)
        this._handleKeyDown = this._handleKeyDown.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
    }

    componentWillMount(){
        // console.log("this.props.isnew", this.props.isnew)
    }
    componentDidMount(){
        // console.log("this.props.isnew", this.props.isnew)
        if (this.props.isnew)
            this.initLocalPusher()
        else {
            this.initNetPusher()
        }
        this.initChatMessages()
        // if (this.typingTimer) clearTimeout(this.typingTimer)
        this.typingTimer = setInterval(()=>{
            // console.log("setInterval-tag")
            let mp = this.state.typingUsers,
                now = (new Date())
            for (let user of mp.keys()) {
                // console.log("setInterval", user, now, mp.get(user),
                //     Math.abs(now.getUTCSeconds() - mp.get(user).getUTCSeconds()),
                //     Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(mp.get(user).getFullYear(), mp.get(user).getMonth(), mp.get(user).getDate()) ) /(1000)))

                if (Math.abs(now.getUTCSeconds() - mp.get(user).getUTCSeconds()) > 2) {
                    mp.delete(user)
                    this.setState({typingUsers: mp})
                }

            }
        }, 2000)
    }
    componentWillUnmount() {
        if (this.typingTimer) clearInterval(this.typingTimer)
    }
    initLocalPusher=()=>{
        const {chatSSL} = this.props.userSetup

        // const larasocket = pusherClient(store.getState().user.token, chatSSL)
        const echo = echoClient(store.getState().user.token, chatSSL)

        echo.connector.pusher.logToConsole = true
        echo.connector.pusher.log = (msg) => {console.log(msg);};
        echo.connect()
        console.log('echo.pusher', echo.connector.pusher)
        // larasocket.connect()

        const channelName = 'class.'+this.props.userSetup.classID

        // const channel = larasocket.subcribe('private'-channelName)
        // channel.bind('ChatMessageSSL', data => {             console.log('larasocket-message', data.message);         });

        this.setState({Echo: echo})
        // console.log("SOCKET", larasocket, larasocket.allChannels())
        console.log('websocket', echo, channelName)
        if (chatSSL)
        echo.private(channelName)
            .listen('ChatMessageSSL', (e) => {
                console.log("FILTER-SSL")
                let msg = prepareMessageToFormat(e.message), msgorig = e.message, isSideMsg = true
                let localChat =   this.state.localChatMessages,
                    arrChat = []
                // console.log("FILTER-NOT-SSL", this.state.localChatMessages)
                arrChat = localChat.map(
                    item=>
                    {
                        // console.log("map", item, JSON.parse(msg))
                        if (this.state.messagesNew.includes(item.uniqid)) {
                            // Для своих новых
                            if (JSON.parse(msg).uniqid === item.uniqid) {
                                // console.log("MSGORIG", msgorig, msgorig.id)
                                isSideMsg = false
                                let obj = item
                                obj.id = msgorig.id
                                return obj
                            }
                            else {
                                return item
                            }
                        }
                        else {
                            return item
                        }
                    }
                )
                 // Если новое и стороннее!!!
                if  (isSideMsg) arrChat.push(msgorig)

                this.setState({
                    localChatMessages : arrChat,
                    messages: [...arrChat, msg],
                    messagesNew : this.state.messagesNew.filter(item=>!(item.uniqid===JSON.parse(msg).uniqid))
                })
                // this.props.onReduxUpdate("ADD_CHAT_MESSAGES", arrChat)
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
            })
        else
            echo.channel(channelName)
                .listen('ChatMessage', (e) => {
                let msg = prepareMessageToFormat(e.message), msgorig = e.message, isSideMsg = true
                let arr =   this.state.localChatMessages,
                            newArr = []
                    console.log("FILTER-NOT-SSL")
                    // console.log("FILTER-NOT-SSL: this.props", this.props)
                    newArr = arr.map(
                    item=>
                    {
                        // console.log("map", item, JSON.parse(msg))

                        if (this.state.messagesNew.includes(item.uniqid)) {
                            // Для своих новых
                            if (JSON.parse(msg).uniqid === item.uniqid) {
                                // console.log("MSGORIG", msgorig, msgorig.id)
                                isSideMsg = false
                                let obj = item
                                obj.id = msgorig.id
                                return obj
                            }
                            else {
                                return item
                            }
                        }
                        else {
                            return item
                        }
                    }
                )
                // console.log("FILTER-NOT-SSL: stateArr", newArr, JSON.parse(msg), "isSideMsg: " + isSideMsg, this.state.messagesNew)
                // Если новое и стороннее!!!
                if  (isSideMsg) newArr.push(msgorig)

                this.setState({
                    localChatMessages : newArr,
                    messages: [...arr, msg],
                    messagesNew : this.state.messagesNew.filter(item=>!(item.uniqid===JSON.parse(msg).uniqid))
                })
                    // this.props.onReduxUpdate("ADD_CHAT_MESSAGES", newArr)
                    this.props.updatemessage(msg)
            })
        }

    initNetPusher=()=>{
        // console.log("initNetPusher:roomId", this.roomId)
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
                                this.props.newmessage(JSON.parse(message.text).hasOwnProperty('hwdate'));
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

    toggleEmojiPicker=()=>{
        this.setState({            showEmojiPicker: !this.state.showEmojiPicker,        });
    }
    getChatMessages=(classID)=>{
        // console.log('getChatMessages', this.props.userSetup.classID, classID)
        instanceAxios().get(API_URL +`chat/get/${classID}`, [], null)
            .then(resp => {
                this.setState({localChatMessages : resp.data})
                // this.props.onReduxUpdate("ADD_CHAT_MESSAGES", resp.data)
            })
            .catch(error => {
                console.log('getChatMessagesError', error)
            })
    }
    initChatMessages=async ()=>{
        // console.log("initChatMessages", this.props.userSetup.localChatMessages, this.props.userSetup.classID)
        if (this.props.isnew) {
            this.getChatMessages(this.props.userSetup.classID)
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

    prepareJSON=()=>{
        let {classID, userName, userID, studentId, studentName} = this.props.userSetup
        let obj = {}
        switch (this.props.isnew) {
            case true :
                obj.id = 0;
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
                obj.uniqid = new Date().getTime() + this.props.userSetup.userName// uniqid()
                this.setState({messagesNew : [...this.state.messagesNew, obj.uniqid]})
                break;
            default :
                obj.senderId = chatUserName
                obj.text = this.inputMessage.value
                obj.time = (new Date()).toLocaleTimeString().slice(0, 5)
                obj.userID = userID
                obj.userName = userName
                if (!(this.state.selSubjkey === null)) {
                    obj.hwdate = toYYYYMMDD(this.state.curDate)
                    obj.subjkey = this.state.selSubjkey
                    obj.subjname = this.state.selSubjname
                    this.addHomeWork(obj.text)
                }
                break;
        }
        // console.log("prepareJSON", obj, JSON.stringify(obj))
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
        if (this.props.isnew) {
            this.setState({messages: [...this.state.messages, objForState]})
        }
        this.sendMessage(obj, 0)
        if (!(this.state.selSubjkey === null))
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

            if (this.props.isnew)
            this.setState({messages : [...this.state.messages, objForState]})
            // console.log("handleKeyDown", obj, this.state.selSubjkey)

            this.sendMessage(obj, 0)
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
                // console.log(response.data)
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
    sendMessage(text, id) {
        // console.log("sendMessage", this.state.currentUser, text)
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
        // console.log("Next message!", text)
        // Передаём сообщение с определёнными параметрами (ID-сессии + ClassID)
        switch (this.props.isnew) {
            case true :
                let arrChat = this.state.localChatMessages, obj = {}
                console.log("Send message to server.1", "arr.before: ", arr)
                if (id > 0) {
                    arrChat = arrChat.map(item => {
                        obj = item
                        if (Number(obj.id) !== id)
                            return item
                        else {
                            obj.text = JSON.parse(text).message
                            return JSON.stringify(obj)
                        }
                    })
                }
                else {
                   arrChat.push(JSON.parse(text))
                }
                console.log("Send message to server.2", "arr.after: ", arr, text)
                this.setState({messages: arrChat})
                // this.props.onReduxUpdate("ADD_CHAT_MESSAGES", arrChat)
                instanceAxios().post(API_URL + 'chat/add' + (id?`/${id}`:''), text)
                    .then(response => {
                        console.log('ADD_MSG', response)
                    })
                    .catch(response=>
                        console.log("AXIOUS_ERROR", response)
                    )
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

        this.setState({
            newMessage: '',
        });
    }
    btnCloseOwn=()=>{

    }
    render() {
        const {
            showEmojiPicker,
        } = this.state;

        // console.log("RENDER_CHAT", this.state.localChatMessages)
        return (


            <div className={this.props.isnew?"chat-container-new":"chat-container"} style={this.props.display?{opacity: 1 }:{display:"none"}}>

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
                             messages={this.state.messages}
                             localmessages={this.state.localChatMessages}
                             username={chatUserName}
                             isshortmsg={this.state.isServiceChat||!this.state.servicePlus}
                             classID={this.props.classID} addmsgs={this.state.addMsgs} sendmessage={this.sendMessage} isnew={this.props.isnew}/>

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

export default connect(mapStateToProps,
    dispatch => {
    return {
        onReduxUpdate: (key, payload) => dispatch({type: key, payload: payload}),
    }
    })(Chat)