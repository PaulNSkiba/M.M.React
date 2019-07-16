/**
 * Created by Paul on 13.05.2019.
 */
import React, { Component } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom';
import { css } from 'glamor';
import addMsg from '../../img/addMsg.svg'
import './chat.css'

export class MessageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages : this.props.messages
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
        // window.scrollTo(0, document.getElementById('messages').innerHeight)
        return (

            <div className="msg-list">
                {!this.props.isshortmsg?
                    <ScrollToBottom className={ ROOT_CSS }>
                        {this.props.messages.map((message, i) =>{
                                // console.log('MESSAGE', message)
                            let msg = JSON.parse(message)
                            let username = msg.hasOwnProperty('userID')?msg.userName:msg.senderId
                            let hw = msg.hasOwnProperty('hwdate')?(new Date(msg.hwdate)).toLocaleDateString()+':'+msg.subjname:''
                            let ownMsg = (username===this.props.username)
                            // console.log(this.props.hwdate===msg.hwdate)
                            if (this.props.hwdate===null||(!(this.props.hwdate===null)&&((new Date(this.props.hwdate)).toLocaleDateString()===(new Date(msg.hwdate)).toLocaleDateString())))
                            return <div key={i} className="message-block">
                                <div className={ownMsg?"msg-right-side":"msg-left-side"} key={msg.id}>
                                    <div key={'id'+i} className={ownMsg?"msg-right-author":"msg-left-author"}>{username}</div>
                                    <div key={'msg'+i} className="msg-text">{msg.text}</div>
                                    <div className={"btn-add-time"}>{msg.time}</div>
                                    {hw.length?<div key={'idhw'+i} className={ownMsg?"msg-right-ishw":"msg-left-ishw"}>{hw}</div>:""}
                                </div>
                            </div>}
                            )}
                    </ScrollToBottom>
                    :
                    <ScrollToBottom className={ ROOT_CSS }>
                        <div key={1} className="message-block">
                            <div className={"msg-left-side"} key={1}>
                                <div key={'id'+1} className={"msg-left-author"}>{"Команда My.Marks"}</div>
                                <div key={'msg'+1} className="msg-text">{"Здравствуйте. Оставьте, пожалуйста, своё сообщение в этом чате. " +
                                                                        "Оно автоматически будет доставлено в нашу службу поддержки и мы как можно скорее отправим Вам ответ по указанной Вами электронной почте."}</div>
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
// export class MessageTitle extends Component {
//     render() {
//         return (
//             <div className="msg-title" >{"My.Marks CHAT"}</div>
//         )
//     }
// }
// export class SendMessageForm extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             message : '',
//             messages : this.props.messages,
//             }
//     }
//     componentDidMount() {
//         this.inputMessage.focus();
//     }
//     addMessage=()=>{
//         console.log('addMessage', this.inputMessage)
//     }
//     txtOnChange=(e)=>{
//         console.log('txtOnChange', e.target.value)
//     }
//     _handleKeyDown = (e) => {
//         if (e.key === 'Enter') {
//             let obj = {}, messages = this.state.messages
//             obj.senderId = 'username'
//             obj.text = e.target.value
//             this.props.addMsg(obj)
//             // messages.push(obj)
//             // this.setState(messages)
//             e.target.value = ''
//             console.log('handleKeyDown', e.target.value);
//         }
//     }
//     render() {
//         console.log(this.state.messages)
//         return (
//             <div>
//                 <form className="frm-add-msg">
//                     <textarea onKeyDown={this._handleKeyDown} className="msg-add-textarea"
//                               placeholder="Введите сообщение..."  type="text" ref={input=>{this.inputMessage=input}}/>
//                     <div className={"btn-add-message"} type="submit" onClick={this.addMessage.bind(this)}><img height="25px" src={addMsg}/></div>
//                 </form>
//             </div>
//         )
//     }
// }