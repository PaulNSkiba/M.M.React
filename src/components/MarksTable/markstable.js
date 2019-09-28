/**
 * Created by Paul on 15.01.2019.
 */
/* eslint-disable */
import React, { Component } from 'react'
import MarkBlank from '../MarkBlank/markblank'
import { AddDay, getSpanCount, toYYYYMMDD, consoleLog, instanceAxios, mapStateToProps} from '../../js/helpers'
import Select from '../Select/select'
import { connect } from 'react-redux'
import { MARKS_URL, ISDEBUG, markType } from '../../config/config'
import Checkbox from '../CheckBox/checkbox'
import './markstable.css'


class Table extends Component {
    constructor(props){
        super(props);
        this.state = {
            size: this.props.size,
            row : -1,
            column: -1,
            dateStart: AddDay(new Date(this.props.userSetup.mark_date.date),-(this.props.dayscount - 1)),
            dateEnd : new Date(this.props.userSetup.mark_date.date),
            mapDays : new Map(),
            marks : this.fillMarks(AddDay(new Date(this.props.userSetup.mark_date.date),-(this.props.dayscount - 1)), new Date(this.props.userSetup.mark_date.date), (typeof this.props.userSetup.selectedSubj==="object"?this.props.userSetup.selectedSubj.subj_key:'').toString().replace('#',''), (typeof this.props.userSetup.selectedSubj==="object"?this.props.userSetup.selectedSubj.id:0)),
            onlywithmailstudents : this.props.userSetup.userID,
            mailSentCount : 0,
            mailSent : "",
            done : true,
            subjMap : new Map(),
            marksTypes : new Map(),
            marksBefore : new Map(),
            markType : 0,
            msgTimeOut : 4000,

        }
        this.setMarkType = this.setMarkType.bind(this)
    }

     initMap=()=>{
            let map = new Map()
            this.props.userSetup.selectedSubjects.forEach(function(item, i, arr) {
                item.hasOwnProperty('subj_key')&&map.set(item.subj_key, item.id)
            });
            this.setState({subjMap: map})
            // console.log('InitMap', map)
    }
    componentWillMount=()=>{
        // this.setState({marks : this.fillMarks(  AddDay((new Date()),
        //                                         -(this.props.dayscount - 1)),
        //                                         new Date(),
        //                                         (typeof this.props.userSetup.selectedSubj==="object"?this.props.userSetup.selectedSubj.subj_key:'').toString().replace('#','xxxxxx'),
        //                                         (typeof this.props.userSetup.selectedSubj==="object"?this.props.userSetup.selectedSubj.id:0))})
        //
        // dateStart: AddDay((new Date((this.props.userSetup.mark_date.length)?this.props.userSetup.mark_date.date:this.props.userSetup.mark_date)),-(this.props.dayscount - 1)),
        // dateEnd : new Date((this.props.userSetup.mark_date.length)?this.props.userSetup.mark_date.date:this.props.userSetup.mark_date)
    }
    componentDidMount(){
        this.initMap()
    }
    async reInitMarks(subj_key){
            console.log('start reInitMarks')
            await this.fillMarks(this.state.dateStart, this.state.dateEnd, subj_key, this.state.subjMap.get(subj_key))
            console.log('end reInitMarks')
            this.forceUpdate();
    }
    fillMarks(dStart, dEnd, subj_key, subj_id){
        document.body.style.cursor = 'progress';
        let marks = new Map()
        let marksBefore = new Map()
        let marksTypes = new Map()
        let {userID, curClass, classID, selectedSubj} = this.props.userSetup;
        // console.log("fillMarks", userID, curClass, selectedSubj, typeof selectedSubj)

        // instanceAxios().get(MARKS_URL + '/'+userID+'/class/'+classID+'/subject/'+(typeof selectedSubj==="object"?selectedSubj.id:0)+
        //     '/subjkey/'+(typeof selectedSubj==="object"?selectedSubj.subj_key:'').toString().replace('#','')+
        //     '/periodstart/'+toYYYYMMDD(dStart)+'/periodend/'+toYYYYMMDD(dEnd)+'/student/0')
        instanceAxios().get(MARKS_URL + '/'+userID+'/class/'+classID+'/subject/'+subj_id+'/subjkey/'+subj_key.toString().replace('#','')+
            '/periodstart/'+toYYYYMMDD(dStart)+'/periodend/'+toYYYYMMDD(dEnd)+'/student/0')
            .then(response => {

                ISDEBUG&&console.log('GET_MARKS_REMOTE', MARKS_URL + '/'+userID+'/class/'+classID+'/subject/'+subj_id+'/subjkey/'+subj_key.toString().replace('#','')+
                    '/periodstart/'+toYYYYMMDD(dStart)+'/periodend/'+toYYYYMMDD(dEnd)+'/student/0',  response.data)

                marks.clear()
                marksBefore.clear()
                marksTypes.clear()
                for (let i = 0; i < response.data.length; i++) {
                    marks.set(response.data[i].subj_key.replace('#', '')+"#"+response.data[i].stud_id+"#"+toYYYYMMDD(new Date(response.data[i].mark_date)), response.data[i].mark)
                    if (!(response.data[i].mark_before===null)) {
                        marksBefore.set(response.data[i].subj_key.replace('#', '') + "#" + response.data[i].stud_id + "#" + toYYYYMMDD(new Date(response.data[i].mark_date)), response.data[i].mark_before)
                    }
                    if (!(response.data[i].mark_type_name===null)) {
                        marksTypes.set(response.data[i].subj_key.replace('#', '')+"#"+response.data[i].stud_id+"#"+toYYYYMMDD(new Date(response.data[i].mark_date)), response.data[i].mark_type_name)
                    }
                }
                // console.log(marks, marksBefore, marksTypes)
                // dispatch({type: 'UPDATE_STUDENTS_REMOTE', payload: response.data})
                this.setState ({ marks, marksTypes, marksBefore })
                document.body.style.cursor = 'default';
            })
            .catch(response => {
                console.log("GET_AXIOS_ERROR", response);
                document.body.style.cursor = 'default';
                // dispatch({type: 'UPDATE_STUDENTS_FAILED', payload: response.data})
            })

        return marks
    }
    onClick(e){
        // console.log("onClick", e.target, e.target.nodeName, e.target.innerHTML)
        if (e.target.nodeName === "TD") {
            let row = Number(e.target.id.split('#')[0])//Number(e.target.id.split('c')[0].replace('r', ''));
            let column = Number(e.target.id.split('#')[1])//Number(e.target.id.split('c')[1]);
            let id = Number(e.target.id.split('#')[2])

            // console.log("table_OnClick", row, column)
            if (row===this.state.row&&column===this.state.column) {
                row=-1
                column=-1}
            // console.log(row, column, e.target.id.split('c')[1])
            this.setState(
                {
                    row: row,
                    column: column
                }
            )
        }
        // else if(e.target.nodeName === "A" && this.state.row < (this.state.size - 1) && this.props.direction==="UPDOWN") {
        else if(e.target.nodeName === "A" && this.state.row < (this.props.userSetup.students.length - 1) && this.props.direction==="UPDOWN") {
            let {row} = this.state
            this.setState(
                {
                    row: row + 1
                }
                )
        }
        else if(e.target.nodeName === "A" && this.state.column < (this.props.dayscount + 2) && this.props.direction==="LEFTRIGHT") {
            let {column} = this.state
            // let add = 1;
            console.log("SetColumnState", this.state.row, AddDay(this.state.dateStart, column + 1 - 2).getDay(), AddDay(this.state.dateStart, column + 1 - 2))
            // AddDay(this.state.dateStart, column + 1 - 2).getDay() > 0 && AddDay(this.state.dateStart, column + 1 - 2).getDay() < 6 && this.props.withoutholidays?
            let add = !this.props.withoutholidays?1:AddDay(this.state.dateStart, column + 1 - 2).getDay()===6?3:1;

            this.setState(
                {
                    column: column + add
                }
            )

        }
    }
    changeCell = (cell, value, id) =>{
         // console.log("Table_changeCell", cell, value, id)

        let {userID, selectedSubj,curClass, classID} = this.props.userSetup;
        let student_id = id.split('#')[2]
        let ondate = id.split('#')[3]
        let markKey = selectedSubj.subj_key.replace("#","")+"#"+student_id+"#"+ondate
        let {marks, marksTypes, marksBefore} = this.state
        marks.set(markKey, value.toString().length<4?value:"")

        // marksTypes.set(markKey, this.state.markType>0?this.state.markType===1?'К':(this.state.markType===2?'С':'Т'):(marksTypes.get(markKey)===undefined?"":marksTypes.get(markKey)))
        console.log("changeCell", markType, this.state.markType, markType[this.state.markType])
        marksTypes.set(markKey, markType[this.state.markType].letter)

        this.setState({marks, marksTypes})

        let json = `{   "user_id":${userID},
                        "class_id":${classID},
                        "subj_id":${selectedSubj.id},
                        "subj_key":"${selectedSubj.subj_key}",
                        "stud_id":${student_id},
                        "mark_date":"${ondate}",
                        "mark_type_name":"${markType[this.state.markType].letter}",
                        "mark":"${value.toString().length<4?value:""}"}`

        // "mark_type_name":"${this.state.markType>0?this.state.markType===1?'К':(this.state.markType===2?'С':'Т'):marksTypes.get(markKey)}",
        let data = JSON.parse(json);
        console.log("Table_changeCell", cell, value, id, data, JSON.stringify(data))
        this.props.onclick(this.state.row, this.state.column, value)
        // '/marks/{user_id}/class/{class_id}/subject/{subj_id}/student/{student_id}/ondate/{ondate}'

        if (userID > 0) {
            // console.log("MARKS_URL", JSON.stringify(data), MARKS_URL +'/'+ userID+'/class/'+classID+'/subject/'+selectedSubj.id+'/student/'+student_id+'/ondate/'+ondate+'/mark/'+value)
             // return;
            instanceAxios().post(MARKS_URL + '/add', JSON.stringify(data))
                .then(response => {
                    console.log('UPDATE_MARKS_REMOTE', response.data)
                    // dispatch({type: 'UPDATE_STUDENTS_REMOTE', payload: response.data})
                })
                .catch(response => {
                    console.log("AXIOUS_ERROR", response);
                    // dispatch({type: 'UPDATE_STUDENTS_FAILED', payload: response.data})
                })
        }
        }

    getMarkBlank =(cellID)=>{
        // console.log(this.props.markblank)
        return(<MarkBlank kind={this.props.markblank} onclickA={this.changeCell} parent={cellID}/>)
    }
    getMark = (key)=> {
        if (this.props.marks.has(key))
            return this.props.marks.get(key)
        else
            return ""
    }
    getMarkHash = (key)=> {
        if (this.state.marks.has(key))
            return this.state.marks.get(key)
        else
            return ""
    }
    getMarkHashType = (key)=> {
        if (this.state.marksTypes.has(key))
            return this.state.marksTypes.get(key)===undefined?"":this.state.marksTypes.get(key)
        else
            return ""
    }
    getMarkHashBefore = (key)=> {
            if (this.state.marksBefore.has(key))
                return this.state.marksBefore.get(key)===undefined?"":this.state.marksBefore.get(key)
            else
                return ""
        }
    getPeriod=()=>{
        let {dateStart, dateEnd} = this.state
        dateStart = new Date(dateStart)
        dateEnd = new Date(dateEnd)
        return (dateStart.getDate() +'.'+(dateStart.getMonth() + 1) +'.'+dateStart.getFullYear().toString().slice(-2) + "-" +
        dateEnd.getDate() +'.'+(dateEnd.getMonth() + 1) +'.'+dateEnd.getFullYear().toString().slice(-2))
        }
    getDateForHead=(add)=>{
        let newDate = AddDay(this.state.dateStart, add)
        // console.log("getDateForHead", newDate, newDate.getDay(), newDate.getDay()===1?"\*":"", newDate.getDate() +'.'+ (Number(newDate.getMonth()) + 1).toString(), )
        return (newDate.getDate() +'.'+ (Number(newDate.getMonth()) + 1).toString()) //+ (newDate.getDay()===1?<div className="mondayFlag">Пн</div>:"").toString() ) //
        // (newDate.getDay()===1?"\*":"").toString() )
    }
    getDateForHeadFull=(add)=>{
        let newDate = AddDay(this.state.dateStart, add)
        // console.log("getDateForHead", newDate, newDate.getDay(), newDate.getDay()===1?"\*":"", newDate.getDate() +'.'+ (Number(newDate.getMonth()) + 1).toString(), )
        return (newDate.getFullYear().toString()+('0' + (Number(newDate.getMonth()) + 1)).toString().slice(-2) + ('0' + newDate.getDate()).slice(-2)) //
    }
    classNameForSelection=(selected)=>{
        return (selected?"namescol nameselected":"namescol")
    }
    classDateForSelection=(selected)=>{
        return (selected?"tablehead dateselected":"tablehead")
    }
    daysMove=e=> {
        // console.log("daysMove", e.target.id)
        const {dayscount} = this.props
        let {dateStart, dateEnd} = this.state
        let {selectedSubj} = this.props.userSetup;
        switch (e.target.id) {
            case "daysback" :
                dateStart = AddDay(dateStart, -(this.props.dayscount - 1))
                dateEnd = AddDay(dateEnd, -(this.props.dayscount - 1))
                break;
            case "daysforward" :
                // console.log("daysforward", AddDay(dateEnd, (this.props.dayscount - 1)), (new Date), (new Date) - AddDay(dateEnd, (this.props.dayscount - 1)) )
                if ((new Date) - AddDay(dateEnd, (this.props.dayscount - 1)) >= 0) {
                    dateStart = AddDay(dateStart, (this.props.dayscount - 1))
                    dateEnd = AddDay(dateEnd, (this.props.dayscount - 1))
                }
            case "daysforwardone" :
                // console.log("daysforward", AddDay(dateEnd, (this.props.dayscount - 1)), (new Date), (new Date) - AddDay(dateEnd, (this.props.dayscount - 1)) )
                if ((new Date) - AddDay(dateEnd, 1) >= 0) {
                    dateStart = AddDay(dateStart, 1)
                    dateEnd = AddDay(dateEnd, 1)
                }
            else {
                    dateStart = AddDay((new Date()),-(this.props.dayscount - 1))
                    dateEnd = new Date()
            }
            break;
        }
        this.setState({
            dateStart, dateEnd
        })
        this.fillMarks(dateStart, dateEnd, (typeof selectedSubj==="object"?selectedSubj.subj_key:'xxxxx').toString().replace('#',''), (typeof selectedSubj==="object"?selectedSubj.id:0))
    }
    setStudentFilter(name, value){
        // console.log("setStudentFilter", name, value);
        this.setState({onlywithmailstudents : value})
    }
    sendMail(){
        // console.log("sendMail")
        document.body.style.cursor = 'progress';
        instanceAxios().get(MARKS_URL + '/sendall/' + this.props.userSetup.classID, "")
            .then(response => {
                this.setState({
                    mailSentCount : response.data.wasSent,
                    mailSent : "Отправлено писем: " + response.data.wasSent
                });
                document.body.style.cursor = 'default';
                window.setTimeout(() => {
                    this.setState({
                        mailSent: ""
                    });
                }, this.state.msgTimeOut);
            })
            .catch(response => {
                document.body.style.cursor = 'default'
            })
    }
    hidePopup(){
        // console.log("hidePopup")
        this.setState({
            mailSent : ""
        })
    }
    setMarkType=(e)=>{
        let marktype = Number(e.target.id.slice(-1))
        console.log("marktype", marktype)
        // switch (e.target.id){
        //     case "marktype-1":
                this.setState({markType:this.state.markType===marktype?0:marktype})
        //         break;
        //     case "marktype-2":
        //         this.setState({markType:this.state.markType===2?0:2})
        //         break;
        //     case "marktype-3":
        //         this.setState({markType:this.state.markType===3?0:3})
        //         break;
        //     case "marktype-4":
        //         this.setState({markType:this.state.markType===4?0:4})
        //         break;
        //     case "marktype-5":
        //         this.setState({markType:this.state.markType===5?0:5})
        //         break;
        // }
    }
    render(){
        let  head = []
            ,cell = []
            ,cell2 = []
            ,curMonth = -1
            ,mapDays = this.state.mapDays
            ,doneFirst = false
        mapDays.clear()

        // console.log('mark_date', this.props.userSetup.mark_date.date, this.state.dateStart, this.state.dateEnd, this.state.marks)
        // console.log(this.props)

            for (var idx = 0; idx < (this.props.dayscount + 2); idx++){
                let cellID = `h0c${idx}`
                switch (idx) {
                    case 0 :
                        cell.push(<th rowSpan={2} key={cellID} id={cellID} className="numbercol head">
                            № п/п
                        </th>)
                        break;
                    case 1 :
                        cell.push(<th rowSpan={2} key={cellID} id={cellID} className="namescol head">
                            Ученики[{this.props.titlekind==="NICK"?"НИК":this.props.titlekind==="EMAIL"?"EMAIL":"ИМЯ"}]
                        </th>)
                        break
                    default:
                        // let isFirstCol = (idx===2)
                        // console.log("isFirstCol", idx)
                        if ((AddDay(this.state.dateStart, idx-2).getDay() > 0 && AddDay(this.state.dateStart, idx-2).getDay() < 6 && this.props.withoutholidays) || (!this.props.withoutholidays)) {

                            if (curMonth != (AddDay(this.state.dateStart, idx - 2).getMonth())) {
                                let markArr = markType.filter(item=>item.id>0)
                                let markDivs = markArr.map((item, i)=><div className={this.state.markType===item.id?"markType-selected":"markType"} key={i} id={`marktype-${item.id}`} onClick={this.setMarkType}>{item.letter}<div className="hoverText">{item.name}</div></div>)

                                cell.push(<th
                                    colSpan={getSpanCount(AddDay(this.state.dateStart, idx - 2), this.props.dayscount, this.props.withoutholidays)}
                                    key={cellID} id={cellID} onClick={this.onClick.bind(this)}
                                    className="tablehead">
                                    {AddDay(this.state.dateStart, idx - 2).getMonth() + 1 + "." + AddDay(this.state.dateStart, idx - 2).getFullYear().toString().slice(-2)}
                                    {!doneFirst?<div className={this.state.markType===0?"addMarkTypes":"addMarkTypes-selected"}>
                                        {markDivs}
                                        {/*<div className={this.state.markType===1?"markType-selected":"markType"} id={"marktype-1"} onClick={this.setMarkType}>K<div className="hoverText">Контрольная</div></div>*/}
                                        {/*<div className={this.state.markType===2?"markType-selected":"markType"} id={"marktype-2"} onClick={this.setMarkType}>C<div className="hoverText">Самостоятельная</div></div>*/}
                                        {/*<div className={this.state.markType===3?"markType-selected":"markType"} id={"marktype-3"} onClick={this.setMarkType}>T<div className="hoverText">Тематическая</div></div>*/}
                                        {/*<div className={this.state.markType===4?"markType-selected":"markType"} id={"marktype-4"} onClick={this.setMarkType}>S<div className="hoverText">Семестровая</div></div>*/}
                                        {/*<div className={this.state.markType===5?"markType-selected":"markType"} id={"marktype-5"} onClick={this.setMarkType}>A<div className="hoverText">Годовая</div></div>*/}

                                    </div>:""}
                                </th>)
                                curMonth = AddDay(this.state.dateStart, idx - 2).getMonth()
                                {!doneFirst?doneFirst=true:""}
                            }
                            cell2.push(<th key={cellID} id={cellID} onClick={this.onClick.bind(this)}
                                           className={this.classDateForSelection((idx)===this.state.column)}><div className="tableheadtd">
                                {this.getDateForHead(idx - 2)}{(AddDay(this.state.dateStart, (idx - 2)).getDay()===1?<div className="mondayFlag">{"Пн"}</div>:"")}
                            </div>
                            </th>)
                            {mapDays.set(idx, this.getDateForHeadFull(idx - 2))}
                        }
                        break;
                }
            }
        head.push(<tr key={"row-1"} id={"row-1"}>{cell}</tr>)
        head.push(<tr key={"row-2"} id={"row-2"}>{cell2}</tr>)

        // console.log("onlywithmailstudents", this.state.onlywithmailstudents, this.state.size)
        let rows = [];
        // for (var i = 0; i < this.state.size; i++) {
        for (var i = 0; i < this.props.userSetup.students.length; i++) {
            let rowID = `row${i}`
            let cell = []
            // console.log(this.props.userSetup.students, this.props.userSetup.students[i])
            if (this.state.onlywithmailstudents && !(this.props.userSetup.students[i].isout===1) && (this.props.userSetup.students[i].email===null?"":this.props.userSetup.students[i].email).length || (!this.state.onlywithmailstudents  && !(this.props.userSetup.students[i].isout===1)) || ((this.props.userSetup.students[i].isRealName===1))) {
                for (var idx = 0; idx < (this.props.dayscount + 2); idx++) {
                    let cellID = i + "#" + idx + "#" + this.props.userSetup.students[i].id + "#" + mapDays.get(idx)

                    switch (idx) {
                        case 0 :
                            cell.push(<th key={cellID} id={cellID} className="numbercol">
                                {i + 1}
                            </th>)
                            break;
                        case 1 :
                            cell.push(<th key={cellID} id={cellID}
                                          className={this.classNameForSelection(i === this.state.row)}>
                                {/*{numberToLang(i + 1, " ", "rus")}*/}
                                {this.props.titlekind === "NICK" ? this.props.userSetup.students[i].student_nick : (this.props.titlekind === "NAME" ? this.props.userSetup.students[i].student_name : this.props.userSetup.students[i].email)}
                            </th>)
                            break
                        default:
                            // console.log("Current Rows", i, (this.state.row), idx, this.state.column, AddDay(this.state.dateStart, idx - 2), AddDay(this.state.dateStart, idx - 2).getDay())
                            if ((AddDay(this.state.dateStart, idx - 2).getDay() > 0 && AddDay(this.state.dateStart, idx - 2).getDay() < 6 && this.props.withoutholidays) || (!this.props.withoutholidays)) {
                                let mark = this.getMarkHash(this.props.userSetup.selectedSubj.subj_key.replace('#', '') + "#" + this.props.userSetup.students[i].id + "#" + mapDays.get(idx));
                                let markBefore = this.getMarkHashBefore(this.props.userSetup.selectedSubj.subj_key.replace('#', '') + "#" + this.props.userSetup.students[i].id + "#" + mapDays.get(idx));
                                let markTypes = this.getMarkHashType(this.props.userSetup.selectedSubj.subj_key.replace('#', '') + "#" + this.props.userSetup.students[i].id + "#" + mapDays.get(idx));

                                let badmark =   (this.props.userSetup.markBlank.id==="markblank_twelve"&&(mark==='1'||mark==='2'||mark==='3'))||
                                                (this.props.userSetup.markBlank.id==="markblank_five"&&(mark==='1'||mark==='2'))||
                                                (this.props.userSetup.markBlank.id==="markblank_letters"&&(mark==='D'||mark==='E/F'))

                                cell.push(<td key={cellID} id={cellID} onClick={this.onClick.bind(this)} className={badmark?"tableBody badmark":"tableBody"}>

                                {!(mark===null)&&markTypes.length>0&&mark.length?<div className="topMarkLabel">{markTypes}</div>:""}
                                {!(mark===null)&&markBefore.length>0&&mark.length?<div className="topMarkLabelBefore">{markBefore}</div>:""}
                                {!(mark===null)&&mark}
                                    {(this.props.userSetup.isadmin===1&&mark===null)&&"X"}
                                {/*{this.getMarkHash(this.props.userSetup.selectedSubj.subj_key.replace('#', '') + "#" + this.props.userSetup.students[i].id + "#" + mapDays.get(idx))}*/}
                                {/*mathem#242#2019-01-31*/}
                                {i === (this.state.row) && idx === this.state.column ? this.getMarkBlank(cellID) : ""}
                            </td>)
                            }
                            break;
                    }
                }
                rows.push(<tr key={i} id={rowID}>{cell}</tr>)
            }
        }
        // console.log("this.props.user.id", this.props.user.id)
        let {userID} = this.props.userSetup;
        return(

            <div className="containertable">
                <div className="row">
                    <div className="col s12 board">
                        <div className="periodName">
                            <div className="periodTitle">
                                <a id="daysback" onClick={this.daysMove.bind(this)}>{"-" + this.props.dayscount + "дн"}</a>
                                    <b>{this.getPeriod()}</b>
                                <a id="daysforward" onClick={this.daysMove.bind(this)}>{"+" + this.props.dayscount + "дн"}</a>
                                <a id="daysforwardone" onClick={this.daysMove.bind(this)}>{"+1дн"}</a>
                            </div>
                            <div className="selectGroup">
                                {userID>0&&<Select  list={this.props.userSetup.selectedSubjects}
                                                    selected={this.props.userSetup.selectedSubj.subj_key}
                                                    key={"subj_key"}
                                                    valuename={"subj_name_ua"}
                                                    name={"selectedSubj"}
                                                    caption="Предмет:"
                                                    value={"subj_key"}
                                                    onchange={this.props.changestate}
                                                    additionalEvent={this.reInitMarks.bind(this)}
                                                    vertical={true}/>}
                                {userID>0&&<Select  list={[{id2:"UPDOWN", alias:"СВЕРХУ ВНИЗ"},{id2:"LEFTRIGHT", alias:"СЛЕВА НАПРАВО"}]}
                                                    selected={this.props.userSetup.direction}
                                                    key={"id2"}
                                                    valuename={"alias"}
                                                    name={"rangedirection"}
                                                    caption="Напр-е маркера:"
                                                    value={"id2"}
                                                    onchange={this.props.changestate}
                                                    vertical={true}/>}
                                {userID>0&&<Select  list={[{id:"NAME", alias:"ИМЯ"},{id:"NICK", alias:"НИК"}, {id:"EMAIL", alias:"EMAIL"}]}
                                                    selected={this.props.userSetup.titlekind}
                                                    key={"id"}
                                                    valuename={"alias"}
                                                    name={"listnames"}
                                                    caption="Столбец:"
                                                    value={"id"}
                                                    onchange={this.props.changestate}
                                                    vertical={true}/>}
                            </div>
                        </div>

                        {userID > 0 && <div className="selectGroup">
                            {userID > 0 &&<Checkbox onclick={this.setStudentFilter.bind(this)} bold={true}
                                                    defelem={this.state.onlywithmailstudents}
                                                    label=" Только студенты с email"
                                                    name = {"onlywithmailstudents"}/>}
                            <label><b>За три дня: </b>
                                Оценки/студенты/предметы: <b>{this.props.userSetup.cnt_marks}/
                                {this.props.userSetup.stud_cnt}/{this.props.userSetup.subj_cnt}</b></label>
                            <button onClick={this.sendMail.bind(this)}>Разослать оценки за 3 недели [Предыдущая: {this.props.userSetup.lastmarkssent}]</button>
                            <div className={this.state.mailSent.length?"popup2 show":"popup2"} onClick={this.hidePopup.bind(this)}>
                                {this.state.mailSent.length?<span className="popuptext2" id="myPopup">{this.state.mailSent}</span>:""}
                            </div>
                        </div>}

                        <table id="simple-board">
                            <thead className="tablehead">
                            {head}
                            </thead>
                            <tbody>
                            {rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default  connect(mapStateToProps)(Table)
/* eslint-disable */