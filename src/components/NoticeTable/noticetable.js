/**
 * Created by Paul on 02.02.2020.
 */
import React, { Component } from 'react'
import {API_URL} from '../../config/config'
import { mapStateToProps, arrOfWeekDaysLocal, getSubjFieldName, toYYYYMMDD, dateFromYYYYMMDD, axios2} from '../../js/helpers'
import {connect} from 'react-redux'
import '../../css/colors.css'
import '../Timetable/timetable.css'
import './noticetable.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import UniversalTable from '../UniversalTable/universaltable'

class NoticeTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msgTitle : "",
            msgText : "",
            msgDate : new Date(),
            isSent : false,
            // notices : this.props.userSetup.classNews.filter(item=>item.is_news===2)
        }
        this.headNotice = [
            {name: "Автор", width : "100px"},
            {name: "Дата", width : "80px"},
            {name: "Адресат", width : "100px"},
            {name: "Заголовок", width : "100px"},
            {name: "Текст", width : "100%"}
        ]
        this.sendMessage=this.sendMessage.bind(this)
    }
    createTableRows=(rowsArr)=>{
        return rowsArr.map((item, key)=>{
            return <tr key={key} style={{height : "100px", minHeight : "100px", maxHeight : "100px", overflowY: "scroll", display: "block"}}>
                <td
                    style={{paddingLeft: "2px", paddingRight: "2px", textAlign: "left", verticalAlign : "top",
                            minWidth : "100px", maxWidth : "100px", width : "100px",
                        height : "100px", minHeight : "100px", maxHeight : "100px", fontSize: "0.8em"}}
                    key={"r" + (key + 1) + "c1"}>
                {item.hasOwnProperty("name")?item.name:''}
                </td>
                <td
                    style={{paddingLeft: "2px", paddingRight: "2px", textAlign: "center", verticalAlign : "top",
                        minWidth : "80px", maxWidth : "80px", width : "80px",
                        height : "100px", minHeight : "100px", maxHeight : "100px", fontSize: "0.8em"}}
                    key={"r" + (key + 1) + "c2"}>
                    {new Date(item.msg_date).toLocaleDateString()}
                </td>
                <td
                    style={{paddingLeft: "2px", paddingRight: "2px", textAlign: "left", verticalAlign : "top",
                        minWidth : "100px", maxWidth : "100px", width : "100px",
                        height : "100px", minHeight : "100px", maxHeight : "100px", fontSize: "0.8em"}}
                    key={"r" + (key + 1) + "c3"}>
                    {item.scool_id!==null&&item.class_id===null?"вся школа":"класс"}
                </td>
                <td
                    style={{paddingLeft: "2px", paddingRight: "2px", textAlign: "left", verticalAlign : "top",
                        minWidth : "100px", maxWidth : "100px", width : "100px",
                        height : "100px", minHeight : "100px", maxHeight : "100px", fontSize: "0.8em"}}
                    key={"r" + (key + 1) + "c4"}>
                    {item.msg_header}
                </td>
                <td
                    style={{paddingLeft: "2px", paddingRight: "2px", textAlign: "left", verticalAlign : "top",
                        minWidth : "100%", maxWidth : "100%", width : "100%", fontSize: "0.8em",
                        height : "100px", minHeight : "100px", maxHeight : "100px"}}
                    key={"r" + (key + 1) + "c5"}>
                    {item.question}
                </td>
            </tr>
        })
    }
    sendMessage=()=>{
        let {userID, school_id, classNews } = this.props.userSetup
        const {msgDate, msgTitle, msgText} = this.state
        const json =        `{
            "user_id" : ${userID},
            "class_id" : ${this.props.curClass},
            "school_id" : ${this.props.curClass!==null?null:school_id},
            "msg_date" : "${toYYYYMMDD(msgDate)}",
            "msg_header" : "${msgTitle}",
            "question" : "${msgText}",
            "answer" : "${msgText}",
            "is_news" : 2
        }`
        console.log('JSON', json)
        axios2('post', `${API_URL}chat/addserv`, json)
            .then(res=>{
                res.data.msg_date = dateFromYYYYMMDD(res.data.msg_date)
                classNews.unshift(res.data)
                this.setState({msgText : "", msgTitle : "", isSent : true})
                this.props.onReduxUpdate('UPDATE_NEWS', classNews)
            })
            .catch(err=>console.log(err))
    }
    render(){
        const {msgDate} = this.state
        const {classNews} = this.props.userSetup
        // console.log("NoticeTable: render", classNews.filter(item=>item.is_news===2))
        let curText = ''
        if (this.props.curLetter!==null){
            curText = 'для ' + this.props.curFigure + this.props.curLetter
        }
        else {
            if (this.props.selectedColumn!==null){
                if (this.props.selectedColumn!==null) {
                    if (this.props.selectedColumn===0)
                        curText = "для всей школы"
                    if (this.props.selectedColumn>0)
                        curText = "для " + this.props.selectedColumn + "-х классов"
                }
            }
        }
        // console.log("NoticeTable:render", curText, this.props.userSetup.school_id, this.props.curClass)

        return (
            <div>
                <div>{`Отправка сообщения [`}<b>{curText.length?curText:'выберите адресат сообщения'}</b>{`]:`}</div>
                <div style={{display: "flex", justifyContent : "space-between", width : "50%", margin : "5px"}}><div>Заголовок</div>
                    <input
                        onChange={e=>this.setState({msgTitle : e.target.value, isSent : false})}
                        defaultValue={this.state.msgTitle}
                        value={this.state.msgTitle}
                        type="text"/>
                    <div>от</div>
                    <div>
                        <DatePicker
                            // showMonthYearDropdown
                            // isClearable
                            fixedHeight
                            dateFormat="dd/MM/yyyy"
                            withPortal
                            locale="ru"
                            selected={new Date(msgDate)}
                            onChange={date => this.setState({msgDate : date})}
                            customInput={<input style={{
                                width: "90px",
                                textAlign: "center",
                                backgroundColor: "#7DA8E6",
                                color: "#fff", fontSize: "0.9em"
                            }}/>}
                        />
                    </div>
                </div>
                <div style={{display: "flex", justifyContent : "space-between", width : "50%", margin : "5px"}}><div>Текст</div>
                    <textarea
                        style={{width : "80%", height : "80px"}}
                        defaultValue={this.state.msgText}
                        value={this.state.msgText}
                        onChange={e=>this.setState({msgText : e.target.value, isSent : false})}
                        type="text"/>
                </div>
                <div onClick={!this.props.selectedColumn===0&&!this.props.curClass>0?null:()=>this.sendMessage()} className="lockTimetable-btn">
                    {!(this.props.selectedColumn===0)&&!(this.props.curClass>0)?"НЕ ВЫБРАН АДРЕСАТ СООБЩЕНИЯ":(!this.state.isSent?`ОТПРАВИТЬ СООБЩЕНИЕ`:`ОТПРАВЛЕНО`)}
                </div>
                <div style={{marginTop : "10px"}}>
                    <UniversalTable head={this.headNotice}
                                    rows={classNews.filter(item=>item.is_news===2)}
                                    createTableRows={this.createTableRows}
                                    classNameOfTD={null}
                                    btncaption={""}
                                    onstudentclick={null}
                                    selectedstudent={null}
                                    objblank={null}
                                    initrows={()=>{return classNews.filter(item=>item.is_news===2)}}
                                    kind={""}/>
                </div>

            </div>
        )
    }
    }

const mapDispatchToProps = dispatch => {
    return ({
        onInitState: () => dispatch([]),
        onReduxUpdate: (key, payload) => dispatch({type: key, payload: payload}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(NoticeTable)