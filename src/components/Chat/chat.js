/**
 * Created by Paul on 13.05.2019.
 */
import React, { Component } from 'react'
import {MessageList} from './messagelist'
import {AddDay, arrOfWeekDays, dateDiff, toYYYYMMDD, instanceLocator, testToken, chatUserName} from '../helpers'
import emailPropType from 'email-prop-type';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import arrow_down from '../../img/ARROW_DOWN.png'
import arrow_up from '../../img/ARROW_UP.png'
import { API_URL, HOMEWORK_ADD_URL, instanceAxios } from '../../config/URLs'

import './chat.css';
import addMsg from '../../img/addMsg.svg'


// import Chatkit from '@pusher/chatkit'

// const DUMMY_DATA = [
//     {
//         senderId: "perborgen",
//         text: "who'll win? xxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxx xxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxx ",
//         time : "00:00"
//     },
//     {
//         senderId: "janedoe",
//         text: "who'll win xxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxx xxxxxxxxxxxxxxxxxx xxxxxxxxxxx?",
//         time : "00:00"
//     }
// ]
// const instanceLocator = "v1:us1:6150d554-65a3-4c66-897a-bc65b2a5402d"
// const testToken = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/6150d554-65a3-4c66-897a-bc65b2a5402d/token"
// const username = "my-marks"
// const roomId = "31220387"
// const commonRoomId = "31220387"

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            now : new Date(),
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
            addMsgs : [],
            isServiceChat : this.props.isservice,
            roomId : this.props.chatroomID,
        }
    }
    //DUMMY_DATA
    componentDidMount(){
        // console.log('this.state.roomId', this.state.roomId)
        if (this.state.roomId) {

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
                        roomId: this.state.roomId.toString(),
                        // messageLimit: 100,
                        hooks: {
                            onMessage: message => {
                                // if (this.state.selDate) {
                                //     if (JSON.parse(message.text).hasOwnProperty('hwdate')) {
                                //         if (JSON.parse(message.text).hwdate === this.state.curDate)
                                //             this.setState({
                                //                 messages: [...this.state.messages, message.text],
                                //             })
                                //     }
                                // }
                                // else
                                if (JSON.parse(message.text).classID = this.props.classID) {
                                    this.setState({
                                        messages: [...this.state.messages, message.text],
                                    })
                                }
                                console.log("MESSAGES", message, JSON.parse(message.text))
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
    // addMsg=(msg)=>{
    //     // let messages = this.state.messages
    //     // messages.push(msg)
    //     // this.setState(messages)
    //  }
    addMessage=()=>{
        // console.log('addMessage', this.inputMessage)
        let obj = {}
        obj.senderId = chatUserName
        obj.text = this.inputMessage.value
        obj.time = (new Date()).toLocaleTimeString().slice(0,5)
        obj.userID = this.props.userID
        obj.userName = this.props.userName
        if (!(this.state.selSubjkey===null)) {
            obj.hwdate = this.state.curDate
            obj.subjkey = this.state.selSubjkey
            obj.subjname = this.state.selSubjname
            this.addHomeWork(obj.text)
        }
        // this.addMsg(obj)
        this.inputMessage.value = ''
        this.setState({
            selSubject : false,
            selDate : false,
        })
        // console.log(obj, this.state.selSubjkey)
        this.sendMessage(JSON.stringify(obj))
        this.addHomeWork(obj.text)
    }
    _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            let obj = {}
            obj.senderId = chatUserName
            obj.text = e.target.value
            obj.time = (new Date()).toLocaleTimeString().slice(0,5)
            obj.userID = this.props.userID
            obj.userName = this.props.userName
            if (!(this.state.selSubjkey===null)) {
                obj.hwdate = this.state.curDate
                obj.subjkey = this.state.selSubjkey
                obj.subjname = this.state.selSubjname
                this.addHomeWork(obj.text)
            }
            // this.addMsg(obj)
            e.target.value = ''
            this.setState({
                selSubject : false,
                selDate : false,
            })
            // console.log(obj, this.state.selSubjkey)
            this.sendMessage(JSON.stringify(obj))
        }
    }
    addHomeWork=(txt)=>{
        let {classID, userName, userID, studentId} = this.props
        // let {homework : homeworkarray} = this.props //this.state;
        let id = this.props.homeworkarray.reduce((max, current)=>(current.id > max?current.id:max), 0) + 1;
        let subj_key = this.state.selSubjkey //selectedSubjects[this.state.curSubjIndex].subj_key
        let subj_name_ua = this.state.selSubjname //selectedSubjects[this.state.curSubjIndex].subj_name_ua
        let ondate = this.state.curDate //new Date("2019-04-09");
        let author = userName //userName
        let instime = new Date() //"16:10"
        instime = ('0'+instime.getHours()).slice(-2) + ':' + ('0'+instime.getMinutes()).slice(-2)

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
    sendMail=(mail, text)=>{
        // mail='paul.n.skiba@gmail.com'
        // text='Check the service!'
        let header = {
            headers: {
                'Content-Type': "application/json",
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' : 'POST',
            }
        }
        let json = `{   "session_id":"${this.props.session_id}",
                        "mailService":"${mail}",
                        "author":"${this.inputName.value}",
                        "mailAuthor":"${this.inputEmail.value}",
                        "text":"${text}"}`

        console.log(json)
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
    sendMessage(text) {
        console.log("sendMessage", this.state.currentUser, text)
        let arr = this.state.addMsgs
        if (this.state.isServiceChat) {
            console.log('Отправим электронку', this.state.addMsgs)
            if (!this.inputName.value.toString().length) {
                console.log("Введите имя")
                return
            }
            if (!this.inputEmail.value.toString().length) {
                console.log("Введите пожалуйста электронку")
                return
            }
            arr.push(JSON.parse(text).text)
            this.sendMail('paul.n.skiba@gmail.com', JSON.parse(text).text)
            this.setState({addMsgs : arr})
            return
        }
        console.log("Next message!")
        // return
        // Передаём сообщение с определёнными параметрами (ID-сессии + ClassID)

        // + Сохраним данные в своей БД

        this.state.currentUser.sendMessage({
            text,
            roomId: this.state.roomId.toString()
        })
        .catch(error => console.error('error', error));
    }
    selectDate=()=>{

    }
    selectSubject=()=>{

    }
    selectUser=()=>{

    }
    daysList=()=>{
        // const daysArr = [ {key:0, name:"Сегодня"}, {key:1, name:"Завтра"}, {key:2, name:"Послезавтра"}]
        // <div className="add-msg-homework-title">
        let daysArr = []
        for (let i = -2; i < 8; i++) {
            let obj = {}
            obj.id = i
            obj.name = this.dateString(AddDay(this.state.now, i))
            // AddDay(this.state.now, i).getDay()
            daysArr.push(obj)
            // console.log()
        }
        console.log("daysArr", daysArr)
        return daysArr.map((item, i)=>(<div key={i} onClick={()=>{this.setState({curDate : AddDay(this.state.now, item.id), selDate : true, dayUp: !this.state.dayUp})}} className="add-msg-homework-day" id={item.id}>{item.name}</div>))
    }
    dateString=(curDate)=>{
        let datediff = dateDiff(this.state.now, curDate)+2;
        let daysArr = ["Позавчера","Вчера","Сегодня","Завтра","Послезавтра"]
        Date.prototype.getWeek = function() {
            var onejan = new Date(this.getFullYear(),0,1);
            return Math.ceil((((this - onejan) / 86400000) + onejan.getDay())/7);
        }
        // console.log("datediff", datediff, curDate);
        if (datediff>=0&&datediff<5)
            return daysArr[datediff].toUpperCase();
        else {
            if ((curDate.getWeek() - this.state.now.getWeek())>=0)
            {
                if (this.state.now.getWeek() === curDate.getWeek()) {
                    return arrOfWeekDays[curDate.getDay()] + '[эта.неделя]'
                }
                else {
                    if ((this.state.now.getWeek() + 1) === curDate.getWeek()) {
                        return arrOfWeekDays[curDate.getDay()] + '[след.неделя]'
                    }
                    else {
                        return arrOfWeekDays[curDate.getDay()] + '  +' + (curDate.getWeek() - this.state.now.getWeek()) +'нед.'
                    }
                }
            }
            else {
                return arrOfWeekDays[curDate.getDay()] + '  ' + (curDate.getWeek() - this.state.now.getWeek()) +'нед.'
            }
        }
        // return ""
        // return "След. Вторник"
    }
    subjList=()=>{
        console.log(this.props.subjs)
        return this.props.subjs.map((item, i)=><div key={i} onClick={()=>{this.setState({selSubjname : item.subj_name_ua, selSubjkey : item.subj_key, selSubject : true, subjUp: !this.state.subjUp})}} className="add-msg-homework-subject" id={item.subj_key}>{item.subj_name_ua}</div>)
    }
    render() {

        return (
            <div className="chat-container" style={{opacity: 1 }}>
                <div className="msg-title" onClick={this.props.btnclose}>
                    <div>{this.state.isServiceChat?"My.Marks CHAT: Вопрос разработчику":"My.Marks CHAT"}</div>
                    <div className="btn-close-chat" onClick={this.props.btnclose}>X</div>
                </div>
                {!this.state.roomId?
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
                             isshortmsg={this.state.isServiceChat}
                             addmsgs={this.state.addMsgs}/>

                <div className={"add-msg-container"}>
                    <form className="frm-add-msg">
                            <div className="input-msg-block">
                                <textarea onKeyDown={this._handleKeyDown} className="msg-add-textarea"
                                  placeholder="Введите сообщение..."  type="text" ref={input=>{this.inputMessage=input}}/>
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