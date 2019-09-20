/**
 * Created by Paul on 13.05.2019.
 */
import React, { Component } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom';
import { css } from 'glamor';
import '../Chat/chat.css'
import MicrolinkCard from '@microlink/react';
import {dateFromYYYYMMDD, mapStateToProps, prepareMessageToFormat} from '../../js/helpers'
import { connect } from 'react-redux'

const insertTextAtIndices = (text, obj) => {
    return text.replace(/./g, function(character, index) {
        return obj[index] ? obj[index] + character : character;
    });
};

class MessageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages : this.props.messages,
            editKey: -1,
            }
        this.onMessageDblClick = this.onMessageDblClick.bind(this)
        this.onSaveMsgClick=this.onSaveMsgClick.bind(this)
        this.onCancelMsgClick=this.onCancelMsgClick.bind(this)
        this.onDelMsgClick=this.onDelMsgClick.bind(this)
        this.curMsgDate = null
    }
    onSaveMsgClick=async (e)=>{
        console.log("onSaveMsgClick", this.textareaValue.value, Number(e.target.id.replace("btn-save-", '')), this.props.isnew)
        if (this.props.isnew) {
            let obj = {}, id
            obj.message = this.textareaValue.value
            id = Number(e.target.id.replace("btn-save-", ''))
            try {
                await this.props.sendmessage(JSON.stringify(obj), id)

            }
            catch (err){
            }
        }
        this.setState({editKey : -1})
    }
    onDelMsgClick=(e)=>{

        this.setState({editKey : -1})
    }
    onCancelMsgClick=(e)=>{
        this.setState({editKey : -1})
    }
    onMessageDblClick=e=>{
        console.log(e.target.id, e.target, e.target, e.target.nodeName)
        const key = e.target.id.replace("msg-text-", '')
        if (e.target.nodeName!=="DIV") return
        // console.log("onMessageDblClick", "e.target.id:", e.target.id, "key", key, "this.state.editKey", this.state.editKey)
        if (Number(key)!==this.state.editKey) this.setState({editKey : Number(key)})
    }
    onAddHomeworkMsgClick=e=>{

    }
    getDateSeparator=(msgDate)=>{
        // console.log("getDateSeparator", this.curMsgDate, msgDate)
        if (msgDate !== this.curMsgDate) {

            this.curMsgDate = msgDate
            return  <div className="mym-msg-date-separator">
                        {new Date(msgDate).toLocaleDateString()}
                    </div>
        }
    }
    render() {
        const ROOT_CSS = css({
            borderRadius: "10px",
            margin : "12px 10px",
            height : "60vh",
            maxHeight : "510px",
            overflow: "auto",
        });
        // console.log("addmsgs", this.props.addmsgs)

        let questionText = "Здравствуйте. Оставьте, пожалуйста, своё сообщение в этом чате. " +
            "Оно автоматически будет доставлено в нашу службу поддержки и мы как можно скорее отправим Вам ответ на "

        questionText = questionText.concat(this.props.classID?"Вашу электронную почту.":"указанную Вами электронной почте.")

        let messages = []
        if (this.props.isnew)
            messages = this.props.localmessages //this.props.chat.localChatMessages.map(item=>prepareMessageToFormat(item))
        else
            messages = this.props.messages
        // console.log('MESSAGES', this.props.localmessages, messages)
        // console.log("RENDERMESSAGES", messages, this.props.userSetup, this.props.localmessages)
        // let curMsgDate = null;
        return (

            <div className="msg-list">
                {!this.props.isshortmsg?
                    <ScrollToBottom className={ ROOT_CSS }>
                        {messages.length?messages.map((message, i) =>{

                            let msg = this.props.isnew?prepareMessageToFormat(message, true):JSON.parse(message)

                                // console.log("MESSAGELIST-MSG", msg)
                            const urlMatches = msg.text.match(/\b(http|https)?:\/\/\S+/gi) || [];
                            let { text } = msg;
                            urlMatches.forEach(link => {
                                const startIndex = text.indexOf(link);
                                const endIndex = startIndex + link.length;
                                text = insertTextAtIndices(text, {
                                    [startIndex]: `<a href="${link}" target="_blank" rel="noopener noreferrer" class="embedded-link">`,
                                    [endIndex]: '</a>',
                                });
                            });
                            // add this line
                            const LinkPreviews = urlMatches.map(link => <MicrolinkCard  key={"url"+i} url={link} />);
                                let username = msg.hasOwnProperty('userID')?msg.userName:msg.senderId

                            let hw = msg.hasOwnProperty('hwdate')&&(!(msg.hwdate===undefined))?(dateFromYYYYMMDD(msg.hwdate)).toLocaleDateString()+':'+msg.subjname:''
                            let ownMsg = (username===this.props.username)
                            // console.log(this.props.hwdate===msg.hwdate)
                            return (this.props.hwdate===null||(!(this.props.hwdate===null)&&((new Date(this.props.hwdate)).toLocaleDateString()===(new Date(msg.hwdate)).toLocaleDateString())))?
                            <div key={i} id={"msg-"+msg.id} className={"message-block"} onClick={()=>i!==this.state.editKey?this.setState({editKey:-1}):null} onDoubleClick={(e)=>this.onMessageDblClick(e)}>

                                {this.getDateSeparator(message.msg_date)}

                                <div className={ownMsg?(hw.length?"msg-right-side homework-border":"msg-right-side  homework-no-border"):(hw.length?"msg-left-side homework-border":"msg-left-side homework-no-border")}
                                     style={this.state.editKey===i?{color:"white", backgroundColor : "white", border: "white 2px solid"}:null} key={msg.id}>

                                        {this.state.editKey===i?<textarea className={ownMsg?"message-block-edit-right":"message-block-edit-left"} ref={input=>{this.textareaValue=input}} defaultValue={msg.text}
                                                                          onKeyPress={this.OnKeyPressTextArea} onChange={this.OnChangeTextArea}>
                                        </textarea>:null}
                                        {this.state.editKey === i ?
                                            <div className="mym-msg-block-buttons">
                                                <div id={"btn-hw-"+msg.id} onClick={this.onAddHomeworkMsgClick} className="mym-msg-block-hw">Домашка</div>
                                                <div id={"btn-save-"+msg.id} onClick={this.onSaveMsgClick} className="mym-msg-block-save">Сохранить</div>
                                                <div id={"btn-cancel-"+msg.id} onClick={this.onCancelMsgClick} className="mym-msg-block-cancel">Отмена </div >
                                                <div id={"btn-del-"+msg.id} onClick={this.onDelMsgClick} className="mym-msg-block-delete">Удалить</div>
                                            </div>
                                            :null}

                                    <div key={'id'+i} className={ownMsg?"msg-right-author":"msg-left-author"} style={this.state.editKey===i?{visibility:"hidden"}:null}>{username}</div>
                                        {urlMatches.length > 0 ? (
                                            <div key={'msg'+i} id={"msg-text-"+i/*msg.id*/} style={this.state.editKey===i?{visibility:"hidden"}:null} className="msg-text">
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: text,
                                                    }}
                                                />
                                                {/*//eslint-disable-next-line*/}
                                                {LinkPreviews}
                                            </div>
                                        ) : (
                                            <div key={'msg'+i} id={"msg-text-"+i/*msg.id*/} style={this.state.editKey===i?{visibility:"hidden"}:null} className="msg-text">
                                                {msg.text}
                                            </div>
                                        )}


                                    <div className={msg.id?"btn-add-time-done":"btn-add-time"} style={this.state.editKey===i?{visibility:"hidden"}:null}>{msg.time}</div>
                                    {hw.length?<div key={'idhw'+i} className={ownMsg?"msg-right-ishw":"msg-left-ishw"} style={this.state.editKey===i?{visibility:"hidden"}:null}>{hw}</div>:""}
                                </div>
                            </div>:null}
                            ):null}
                    </ScrollToBottom>
                    :
                    <ScrollToBottom className={ ROOT_CSS }>
                        <div key={1} className="message-block">
                            <div className={"msg-left-side"} key={1}>
                                <div key={'id'+1} className={"msg-left-author"}>{"Команда My.Marks"}</div>
                                <div key={'msg'+1} className="msg-text">{questionText}</div>
                            </div>
                            {this.props.addmsgs.map((item,i)=>
                            <div className={"msg-right-side"} key={i+100}>
                                <div key={'id'+i+100} className={"msg-right-author"}>{"Вопрос"}</div>
                                <div key={'msg'+i+100} className="msg-text">{item}</div>
                            </div>)}
                            {this.props.addmsgs.length?<div className={"msg-left-side"} key={2}>
                                <div key={'id'+2} className={"msg-left-author"}>{"Команда My.Marks"}</div>
                                <div key={'msg'+2} className="msg-text">{"Благодарим за обращение. Проверьте, пожалуйста, указанную электронную почту и " +
                                " и подтвердите получение письма-заявки."}</div>
                            </div>:""}
                        </div>
                    </ScrollToBottom>        }
            </div>
        )
    }
}

export default connect(mapStateToProps, {})(MessageList)