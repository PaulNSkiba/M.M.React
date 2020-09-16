/**
 * Created by Paul on 15.01.2019.
 */
/* eslint-disable */
import React, { Component } from 'react'
import MarkBlank from '../MarkBlank/markblank'
import { addDay, getSpanCount, toYYYYMMDD, consoleLog, instanceAxios, mapStateToProps,
         getSubjFieldName, weekDaysGlobal, axios2, getNearestSeptFirst, dateDiff} from '../../js/helpers'
import Select from '../Select/select'
import { connect } from 'react-redux'
import { API_URL, MARKS_URL, ISDEBUG, markType, UPDATESETUP_URL, ISCONSOLE } from '../../config/config'
import Checkbox from '../CheckBox/checkbox'
import './markstable.css'
import '../../css/colors.css'
import '../CheckBox/checkbox.css'

class MarksTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            size: this.props.size,
            row : -1,
            column: -1,
            subcolumn : 0,
            dateStart: addDay(new Date(this.props.userSetup.mark_date.date),-(this.props.dayscount - 1)),
            dateEnd : new Date(this.props.userSetup.mark_date.date),
            mapDays : new Map(),
            marks : this.fillMarks(addDay(new Date(this.props.userSetup.mark_date.date),-(this.props.dayscount - 1)), new Date(this.props.userSetup.mark_date.date), (typeof this.props.userSetup.selectedSubj==="object"?this.props.userSetup.selectedSubj.subj_key:'').toString().replace('#',''), (typeof this.props.userSetup.selectedSubj==="object"?this.props.userSetup.selectedSubj.id:0)),
            mailSentCount : 0,
            mailSent : "",
            done : true,
            subjMap : new Map(),
            marksTypes : new Map(),
            marksBefore : new Map(),
            markType : 0,
            msgTimeOut : 4000,
            onlywithmailstudents : this.props.userSetup.onlywithmailstudents,
            withtimetable : this.props.userSetup.withtimetable,
            withoutholidays : this.props.userSetup.withoutholidays,
            showStat : false,
            subjStat : this.getSubjStat()
        }
        this.setMarkType = this.setMarkType.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this);
        this.showStat = this.showStat.bind(this)
    }
     initMap=()=>{
            let map = new Map()
            this.props.userSetup.selectedSubjects.forEach(function(item, i, arr) {
                item.hasOwnProperty('subj_key')&&map.set(item.subj_key, item.id)
            });
            this.setState({subjMap: map})
    }
    componentWillMount=()=>{
     }
    componentDidMount(){
        this.initMap()
         const elem = document.getElementById('simple-board')
         if (elem!==null) {
             elem.height = elem.height + 200
             // console.log("elem2", elem.height)
         }
    }
    componentDidUpdate(){
        // console.log("MarksTable : render")
        const markblank = document.getElementById("markblank_twelve")

        if (markblank!==null){
            // console.log("MARKBLANK: Render", window.innerHeight, window.innerWidth, markblank.getBoundingClientRect())
            const rect =  markblank.getBoundingClientRect()
            // console.log(window.innerHeight - (rect.top + rect.height))
            if ((window.innerHeight - (rect.top + rect.height + 20)) < 0) {
                window.scrollBy(0, Math.abs(window.innerHeight - (rect.top + rect.height + 20)))

                const elem = document.getElementById('simple-board')
                if (elem!==null)
                    elem.scrollTop = elem.scrollHeight //- elem.clientHeight + 50;

            }
            // console.log("RECT", window.innerWidth, rect)
            if ((window.innerWidth - (rect.right + rect.width + 20)) < 0) {
                window.scrollBy(Math.abs(window.innerWidth - (rect.right + rect.width + 20)), 0)

                const elem = document.getElementById('simple-board')
                if (elem!==null)
                    elem.scrollLeft = elem.scrollWidth //- elem.clientHeight + 50;

            }

        }
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

         axios2('get', `${MARKS_URL}/${userID}/class/${classID}/subject/${subj_id}/subjkey/${subj_key.toString().replace('#','')}/periodstart/${toYYYYMMDD(dStart)}/periodend/${toYYYYMMDD(dEnd)}/student/0`)
            .then(response => {
                marks.clear()
                marksBefore.clear()
                marksTypes.clear()
                for (let i = 0; i < response.data.length; i++) {
                    let {subj_key, stud_id, mark_date, mark, mark_before, mark_type_name, position} = response.data[i]
                    let key = `${subj_key.replace('#','')}#${stud_id}#${toYYYYMMDD(new Date(mark_date))}#${position===null?0:position}`
                    // console.log("MARK", key, mark)
                    marks.set(key, mark)
                    if ((mark_before!==null)) {
                        marksBefore.set(key, mark_before)
                    }
                    if ((mark_type_name!==null)) {
                        marksTypes.set(key, mark_type_name)
                    }
                }
                // console.log(marks, marksBefore, marksTypes)
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
        ISCONSOLE && console.log("onClick: showMark", e.target, e.target.nodeName)
        if (e.target.nodeName === "TD") {

            let row = Number(e.target.id.split('#')[0])//Number(e.target.id.split('c')[0].replace('r', ''));
            let column = Number(e.target.id.split('#')[1])//Number(e.target.id.split('c')[1]);
            let id = Number(e.target.id.split('#')[2])
            let subcolumn = Number(e.target.id.split('#')[4])

            ISCONSOLE && console.log("table_OnClick", e.target.classList, e.target.id, row, column, subcolumn)

            const elems = document.querySelectorAll(".markstable__selected-cell")
            if (elems!==null)
                elems.forEach(item=>item.classList.remove("markstable__selected-cell"))

            if (row===this.state.row&&column===this.state.column&&subcolumn===this.state.subcolumn)
            {
                row=-1; column=-1;
            }
            else {
                e.target.classList.add("markstable__selected-cell")
            }
            // console.log(row, column, e.target.id.split('c')[1])
            this.setState({ row, column, subcolumn})
        }
        // else if(e.target.nodeName === "A" && this.state.row < (this.state.size - 1) && this.props.direction==="UPDOWN") {
        else if(e.target.nodeName === "A" && this.state.row < (this.props.userSetup.students.length - 1) && this.props.direction==="UPDOWN") {
            let {row} = this.state

            this.setState({ row: row + 1})
        }
        else if(e.target.nodeName === "A" && this.state.column < (this.props.dayscount + 2) && this.props.direction==="LEFTRIGHT") {
            let {column} = this.state

            //console.log("SetColumnState", this.state.row, addDay(this.state.dateStart, column + 1 - 2).getDay(), addDay(this.state.dateStart, column + 1 - 2))

            let add = !this.props.withoutholidays?1:addDay(this.state.dateStart, column + 1 - 2).getDay()===6?3:1;
            this.setState({ column: column + add})
        }
    }
    changeCell = (cell, value, id) =>{
         // console.log("Table_changeCell", cell, value, id)
        const {userID, selectedSubj,curClass, classID} = this.props.userSetup;
        const student_id = id.split('#')[2]
        const ondate = id.split('#')[3]
        const position = id.split('#')[4]
        const markKey = selectedSubj.subj_key.replace("#","")+"#"+student_id+"#"+ondate+"#"+position
        const {marks, marksTypes} = this.state
        marks.set(markKey, value.toString().length<4?value:"")

        ISCONSOLE && console.log("changeCell", id, id.split('#')[4])

        marksTypes.set(markKey, markType[this.state.markType].letter)
        this.setState({marks, marksTypes})

        let json = `{   "user_id":${userID},
                        "class_id":${classID},
                        "subj_id":${selectedSubj.id},
                        "subj_key":"${selectedSubj.subj_key}",
                        "stud_id":${student_id},
                        "mark_date":"${ondate}",
                        "mark_type_name":"${markType[this.state.markType].letter}",
                        "position":${position},
                        "mark":"${value.toString().length<4?value:""}"}`
        // "mark_type_name":"${this.state.markType>0?this.state.markType===1?'К':(this.state.markType===2?'С':'Т'):marksTypes.get(markKey)}",
        let data = JSON.parse(json);
        // console.log("Table_changeCell", cell, value, id, data, JSON.stringify(data))

        const elems = document.querySelectorAll(".markstable__selected-cell")
        if (elems!==null)
            elems.forEach(item=>item.classList.remove("markstable__selected-cell"))

        this.props.onclick(this.state.row, this.state.column, value)

        // '/marks/{user_id}/class/{class_id}/subject/{subj_id}/student/{student_id}/ondate/{ondate}'
        if (userID > 0) {
            axios2('post',`${MARKS_URL}/add`, JSON.stringify(data))
            .then(response => {
                ISCONSOLE && console.log('UPDATE_MARKS_REMOTE', response.data)
                // dispatch({type: 'UPDATE_STUDENTS_REMOTE', payload: response.data})
            })
            .catch(response => {
                ISCONSOLE && console.log("AXIOUS_ERROR", response);
                // dispatch({type: 'UPDATE_STUDENTS_FAILED', payload: response.data})
            })
        }
    }
    getMarkBlank =(cellID)=>{
        // console.log(this.props.markblank)
        return(<MarkBlank kind={this.props.markblank} onclickA={this.changeCell} parent={cellID}/>)
    }
    getMark = (key)=> {
        const {marks} = this.state
        if (marks.has(key))
            return marks.get(key)
        else
            return ""
    }
    getMarkHash = (key)=> {
        const {marks} = this.state
        if (marks.has(key))
            return marks.get(key)
        else
            return ""
    }
    getMarkHashType = (key)=> {
        const {marksTypes} = this.state
        if (marksTypes.has(key))
            return marksTypes.get(key)===undefined?"":marksTypes.get(key)
        else
            return ""
    }
    getMarkHashBefore = (key)=> {
        const {marksBefore} = this.state
        if (marksBefore.has(key))
            return marksBefore.get(key)===undefined?"":marksBefore.get(key)
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
        let newDate = addDay(this.state.dateStart, add)
        // console.log("getDateForHead", newDate, newDate.getDay(), newDate.getDay()===1?"\*":"", newDate.getDate() +'.'+ (Number(newDate.getMonth()) + 1).toString(), )
        return (newDate.getDate() +'.'+ (Number(newDate.getMonth()) + 1).toString()) //+ (newDate.getDay()===1?<div className="mondayFlag">Пн</div>:"").toString() ) //
        // (newDate.getDay()===1?"\*":"").toString() )
    }
    getDateForHeadFull=(add, position)=>{
        let newDate = addDay(this.state.dateStart, add)
        return (newDate.getFullYear().toString()+('0' + (Number(newDate.getMonth()) + 1)).toString().slice(-2) + ('0' + newDate.getDate()).slice(-2) + '#' + position)
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
                dateStart = addDay(dateStart, -(this.props.dayscount - 1))
                dateEnd = addDay(dateEnd, -(this.props.dayscount - 1))
                break;
            case "daysforward" :
                // console.log("daysforward", addDay(dateEnd, (this.props.dayscount - 1)), (new Date), (new Date) - addDay(dateEnd, (this.props.dayscount - 1)) )
                if ((new Date) - addDay(dateEnd, (this.props.dayscount - 1)) >= 0) {
                    dateStart = addDay(dateStart, (this.props.dayscount - 1))
                    dateEnd = addDay(dateEnd, (this.props.dayscount - 1))
                }
                break;
            case "daysforwardone" :
                // console.log("daysforward", addDay(dateEnd, (this.props.dayscount - 1)), (new Date), (new Date) - addDay(dateEnd, (this.props.dayscount - 1)) )
                if ((new Date) - addDay(dateEnd, 1) >= 0) {
                    dateStart = addDay(dateStart, 1)
                    dateEnd = addDay(dateEnd, 1)
                }
                else {
                        dateStart = addDay((new Date()),-(this.props.dayscount - 1))
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
        this.setState({onlywithmailstudents : !this.state.onlywithmailstudents})
    }

    sendMail(){
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
        this.setState({markType:this.state.markType===marktype?0:marktype})
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
        const json = `{"${name}":${value}}`;
        console.log("UPDATE", `${UPDATESETUP_URL}/${this.props.userSetup.userID}`, json)
        this.props.onReduxUpdate("UPDATE_SETUP_LOCALLY", JSON.parse(json))
            axios2('post', `${UPDATESETUP_URL}/${this.props.userSetup.userID}`, json)
            .then(res => {
                console.log('UPDATE_SETUP_SUCCESSFULLY', res.data);
            })
            .catch(res => {
                console.log('UPDATE_SETUP_FAILED', res);
            })
    }
    getSubjStat=()=>{
        const {classID, selectedSubjects, langCode} = this.props.userSetup
        axios2('post',`${API_URL}class/getmarkstat/${classID}/${toYYYYMMDD(getNearestSeptFirst())}`)
            .then(res=> {
                    this.setState({subjStat : res.data})
                    // rows = selectedSubjects.forEach((item, key)=> {
                    //         let arr = res.data.filter(itemData=>itemData.subj_key===item.subj_key)
                    //         let subjData = arr.length?arr[0]:null
                    //         // let cell = []
                    //         //console.log(item[getSubjFieldName(langCode)])
                    //         //     cell.push(<td key={"td1"+key}>{item[getSubjFieldName(langCode)]}</td>)
                    //         // cell.push(<td key={"td1"+key}>{"ttt"}</td>)
                    //         rows.push(<tr key={key}><td key={"td1"+key}>{item[getSubjFieldName(langCode)]}</td></tr>)
                    //         // return <tr key={key}><td key={"td1"+key}>{item[getSubjFieldName(langCode)]}</td></tr>
                    //     }
                    // )
                    // console.log("showStat:data", res.data, rows)
                }
            )
            .catch(err=>{
                console.log(err)
            })
    }
    selectSubject=(subj_key, subj_name)=>{
        this.props.changestate("selectedSubj", [subj_key, subj_name])
        this.reInitMarks(subj_key)
        this.forceUpdate()
    }
    showStat = ()=>{
        const {selectedSubjects, langCode} = this.props.userSetup
        const rows = selectedSubjects.map((item, key)=> {
           let arr = this.state.subjStat.filter(itemData=>itemData.subj_key===item.subj_key)
           let subjData = arr.length?arr[0]:null
                            let diff = subjData!==null?dateDiff(new Date(subjData.mark_date), new Date()):0

                            return <tr key={key} style={{backgroundColor : diff > 21?"#ecabb9": diff >= 10?"#FFEB9C":"white"}}>
                                <td key={"td1"+key} className="subjStatName"
                                    onClick={()=>this.selectSubject(item.subj_key, item[getSubjFieldName(langCode)])}>{item[getSubjFieldName(langCode)]}</td>
                                <td key={"td2"+key} style={{textAlign :"right"}}>{subjData!==null?subjData.cnt:null}</td>
                                <td key={"td3"+key} style={{textAlign :"right"}}>{subjData!==null?new Date(subjData.created_at).toLocaleDateString():null}</td>
                                <td key={"td4"+key} style={{textAlign :"right"}}>{subjData!==null?new Date(subjData.mark_date).toLocaleDateString():null}</td>
                                <td key={"td5"+key} style={{textAlign :"right"}}>{subjData!==null?dateDiff(new Date(subjData.mark_date), new Date()):null}</td>
                            </tr>
                        }
                    )
                    // console.log("showStat:data", res.data, rows)
        return <div className="markstable-showstat">
            <div onClick={()=>this.setState({showStat : false})} className={"btn-close"}>X</div>
            <table style={{backgroundColor : "white"}}>
                <thead style={{backgroundColor : "lightgrey"}}>
                <tr>
                    <th style={{width :"150px"}}>Предмет</th>
                    <th style={{width :"50px"}}>Оценок</th>
                    <th style={{width :"80px"}}>Заполнялись</th>
                    <th style={{width :"70px"}}>Дата оценок</th>
                    <th style={{width :"50px"}}>Даты не актуальны (дней)</th>
                    </tr>
                </thead>
                <tbody style={{fontSize : ".75em"}}>
                    {rows}
                </tbody>
            </table>
        </div>
    }
    render(){
        const {students, selectedSubj, timetable, isadmin, markBlank} = this.props.userSetup
        let {withtimetable, dateStart, mapDays, withoutholidays} = this.state
        const {dayscount} = this.props

        let  head = []
            ,cell = []
            ,cell2 = []
            ,curMonth = -1
            // ,mapDays = mapDays
            ,doneFirst = false
        mapDays.clear()

        const subjDays = timetable.filter(item=>item!==null).filter(item=>item.subj_key===selectedSubj.subj_key)

            for (let idx = 0; idx < (this.props.dayscount + 2); idx++){
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
                            <div className={"markstable__selected-student " + ((this.state.row>=0&&this.state.column>=0)?"": " hidden ") }> {this.state.row>=0&&students.filter((item,key)=>key===this.state.row)[0].student_name} </div>
                        </th>)
                        break
                    default:
                        // ToDO: Двойной день, когда пара предметов
                        const isDay = (addDay(dateStart, idx-2).getDay() > 0 && addDay(dateStart, idx-2).getDay() < 6 && withoutholidays)
                        const newWeekDay = addDay(dateStart, idx-2).getDay()===0?6:addDay(dateStart, idx-2).getDay()-1
                        const timetableDay = subjDays.filter(item=>Number(item.weekday)===Number(newWeekDay))
                        let condition = false
                        if (withtimetable) {
                            if (timetableDay.length)
                            condition = true
                        }
                        else {
                            condition = isDay || (!withoutholidays)
                        }
                        // if (timetableDay.length)
                        // console.log("TimeTable", condition, timetableDay.length&&timetableDay[0].position)
                        if (condition) {
                        if (curMonth !== (addDay(this.state.dateStart, idx - 2).getMonth())) {
                                let markArr = markType.filter(item=>item.id>0)
                                let markDivs = markArr.map((item, i)=><div className={this.state.markType===item.id?"markType-selected":"markType"} key={i} id={`marktype-${item.id}`} onClick={this.setMarkType}>{item.letter}<div className="hoverText">{item.name}</div></div>)
                                cell.push(<th
                                    colSpan={getSpanCount(addDay(dateStart, idx - 2), dayscount - (idx - 2), withoutholidays, withtimetable, subjDays)}
                                    key={cellID}
                                    id={cellID}
                                    onClick={this.onClick.bind(this)}
                                    className="tablehead">
                                    {addDay(dateStart, idx - 2).getMonth() + 1 + "." + addDay(dateStart, idx - 2).getFullYear().toString().slice(-2)}
                                    {!doneFirst?<div className={this.state.markType===0?"addMarkTypes":"addMarkTypes-selected"}>
                                        {markDivs}
                                    </div>:""}
                                </th>)
                                curMonth = addDay(this.state.dateStart, idx - 2).getMonth()
                                {!doneFirst?doneFirst=true:""}
                            }
                            {
                             if   (withtimetable&&timetableDay.length&&(timetableDay[0].position.length>1)) {
                                 cell2.push(<th key={cellID+'#0'} id={cellID+'#0'} onClick={this.onClick.bind(this)}
                                                className={this.classDateForSelection((idx) === this.state.column)}>
                                     <div className="tableheadtd">
                                         {`${this.getDateForHead(idx - 2)}`}
                                          <div className={addDay(dateStart, (idx - 2)).getDay() === 0 ? "holidayFlag" : "mondayFlag"}>{weekDaysGlobal[addDay(dateStart, (idx - 2)).getDay()]}</div>
                                          <div className={"markstable-doubleDay"}>{"/1"}</div>
                                     </div>
                                 </th>)
                                 // console.log("mapDays.1", idx+"#0", this.getDateForHeadFull(idx - 2, 0))
                                 {mapDays.set(idx+"#0", this.getDateForHeadFull(idx - 2, 0))}
                                 cell2.push(<th key={cellID+'#1'} id={cellID+'#1'} onClick={this.onClick.bind(this)}
                                                className={this.classDateForSelection((idx) === this.state.column)}>
                                     <div className="tableheadtd">
                                         {`${this.getDateForHead(idx - 2)}`}
                                         <div className={addDay(dateStart, (idx - 2)).getDay() === 0 ? "holidayFlag" : "mondayFlag"}>{weekDaysGlobal[addDay(dateStart, (idx - 2)).getDay()]}</div>
                                         <div className={"markstable-doubleDay"}>{"/2"}</div>
                                     </div>
                                 </th>)
                                 // console.log("mapDays.2", idx+"#1", this.getDateForHeadFull(idx - 2, 1))
                                 {mapDays.set(idx+"#1", this.getDateForHeadFull(idx - 2, 1))}
                             }
                             else
                                cell2.push(<th key={cellID} id={cellID+'#0'} onClick={this.onClick.bind(this)}
                                               className={this.classDateForSelection((idx) === this.state.column)}>
                                    <div className="tableheadtd">
                                        {this.getDateForHead(idx - 2)}
                                        {/*{(addDay(dateStart, (idx - 2)).getDay()===1?<div className="mondayFlag">{"Пн"}</div>:"")}*/}
                                        <div
                                            className={addDay(dateStart, (idx - 2)).getDay()===0 ? "holidayFlag" : "mondayFlag"}>{weekDaysGlobal[addDay(dateStart, (idx - 2)).getDay()]}
                                        </div>
                                    </div>
                                </th>)
                                // console.log("mapDays", idx+"#0", this.getDateForHeadFull(idx - 2, 0))
                                {mapDays.set(idx+"#0", this.getDateForHeadFull(idx - 2, 0))}
                                {mapDays.set(idx+"#1", this.getDateForHeadFull(idx - 2, 1))}
                            }
                        }
                        break;
                }
            }
        head.push(<tr key={"row-1"} id={"row-1"}>{cell}</tr>)
        head.push(<tr key={"row-2"} id={"row-2"}>{cell2}</tr>)

        // console.log("onlywithmailstudents", this.state.onlywithmailstudents, this.state.size)
        let rows = [];
        // for (var i = 0; i < this.state.size; i++) {
        for (let i = 0; i < students.length; i++) {
            let rowID = `row${i}`
            let cell = [], cellID = ''
            // console.log(this.props.userSetup.students, this.props.userSetup.students[i])
            if ((!(students[i].isout===1)) &&
                (   ( this.state.onlywithmailstudents && (students[i].email===null?"":students[i].email).length)
                    || (!this.state.onlywithmailstudents)
                    || (students[i].isRealName===1))) {
                for (let idx = 0; idx < (this.props.dayscount + 2); idx++) {
                    cellID = i + "#" + idx + "#" + students[i].id + "#" + mapDays.get(idx)
                    switch (idx) {
                        case 0 :
                            cell.push(<th key={cellID} id={cellID} className={"numbercol"}>
                                {i + 1}
                            </th>)
                            break;
                        case 1 :
                            cell.push(<th key={cellID} id={cellID}
                                          className={this.classNameForSelection(i === this.state.row)}>
                                {/*{numberToLang(i + 1, " ", "rus")}*/}
                                {this.props.titlekind === "NICK" ? students[i].student_nick : (this.props.titlekind === "NAME" ? students[i].student_name : students[i].email)}
                            </th>)
                            break
                        default:
                            // console.log("Current Rows", i, (this.state.row), idx, this.state.column)
                            const isDay = (addDay(dateStart, idx-2).getDay() > 0 && addDay(dateStart, idx-2).getDay() < 6 && withoutholidays)
                            const newWeekDay = addDay(dateStart, idx-2).getDay()===0?6:addDay(dateStart, idx-2).getDay()-1
                            const timetableDay = subjDays.filter(item=>Number(item.weekday)===Number(newWeekDay))
                            let condition = false
                            if (withtimetable) {
                                if (timetableDay.length)
                                    condition = true
                            }
                            else {
                                condition = isDay || (!withoutholidays)
                            }
                            if (condition) { //((addDay(this.state.dateStart, idx - 2).getDay() > 0 && addDay(this.state.dateStart, idx - 2).getDay() < 6 && this.props.withoutholidays) || (!this.props.withoutholidays)) {
                                let markBefore = this.getMarkHashBefore(selectedSubj.subj_key.replace('#', '') + "#" + students[i].id + "#" + mapDays.get(idx));
                                let markTypes = this.getMarkHashType(selectedSubj.subj_key.replace('#', '') + "#" + students[i].id + "#" + mapDays.get(idx));
                                let badmark =   (markBlank.id==="markblank_twelve"&&(mark==='1'||mark==='2'||mark==='3'))||
                                                (markBlank.id==="markblank_five"&&(mark==='1'||mark==='2'))||
                                                (markBlank.id==="markblank_letters"&&(mark==='D'||mark==='E/F'))
                                let mark = null,
                                    key = ''
                                if   (withtimetable&&timetableDay.length&&(timetableDay[0].position.length>1)) {
                                    // console.log("MARK_IN_TABLE.1", idx + "#0", mapDays.get(idx + "#0"))
                                    cellID = i + "#" + idx + "#" + students[i].id + "#" + mapDays.get(idx+"#0")
                                    key = selectedSubj.subj_key.replace('#','') + "#" + students[i].id + "#" + mapDays.get(idx + "#0") //+ "#0"
                                    mark = this.getMarkHash(key);
                                    cell.push(<td key={cellID+'#0'} id={cellID+'#0'} onClick={this.onClick.bind(this)}
                                                  className={badmark ? "tableBody badmark" : "tableBody"}>
                                        {!(mark === null) && markTypes.length > 0 && mark.length ?
                                            <div className="topMarkLabel">{markTypes}</div> : ""}
                                        {!(mark === null) && markBefore.length > 0 && mark.length ?
                                            <div className="topMarkLabelBefore">{markBefore}</div> : ""}
                                        {!(mark === null) && mark}
                                        {(isadmin === 1 && mark === null) && "X"}
                                        {/*mathem#242#2019-01-31*/}
                                        {i===this.state.row&&idx===this.state.column&&this.state.subcolumn===0?this.getMarkBlank(cellID):null}
                                    </td>)
                                    cellID = i + "#" + idx + "#" + students[i].id + "#" + mapDays.get(idx+"#1")
                                    key = selectedSubj.subj_key.replace('#','') + "#" + students[i].id + "#" + mapDays.get(idx + "#1")
                                    mark = this.getMarkHash(key);
                                    cell.push(<td key={cellID+'#1'} id={cellID+'#1'} onClick={this.onClick.bind(this)}
                                                  className={badmark ? "tableBody badmark" : "tableBody"}>
                                        {!(mark === null) && markTypes.length > 0 && mark.length ?
                                            <div className="topMarkLabel">{markTypes}</div> : ""}
                                        {!(mark === null) && markBefore.length > 0 && mark.length ?
                                            <div className="topMarkLabelBefore">{markBefore}</div> : ""}
                                        {!(mark === null) && mark}
                                        {(isadmin === 1 && mark === null) && "X"}
                                        {/*mathem#242#2019-01-31*/}
                                        {i===this.state.row&&idx===this.state.column&&this.state.subcolumn===1?this.getMarkBlank(cellID):null}
                                    </td>)
                                }
                                else {
                                    // console.log("MARK_IN_TABLE.2", idx + "#0", mapDays.get(idx + "#0"))
                                    cellID = i + "#" + idx + "#" + students[i].id + "#" + mapDays.get(idx+"#0")
                                    key = selectedSubj.subj_key.replace('#','') + "#" + students[i].id + "#" + mapDays.get(idx + "#0")// + "#0"
                                    let key2 = selectedSubj.subj_key.replace('#','') + "#" + students[i].id + "#" + mapDays.get(idx + "#1")// + "#0"
                                    mark = this.getMarkHash(key);
                                    let mark2 = this.getMarkHash(key2);
                                    cell.push(<td key={cellID+'#0'} id={cellID+'#0'} onClick={this.onClick.bind(this)}
                                              className={"tableBody " + (badmark ? " badmark " : "") + (i===this.state.row&&idx===this.state.column&&this.state.subcolumn===0 ? " markstable__selected-cell " : "")}>
                                    {(mark!==null) && markTypes.length > 0 && mark.length ?
                                        <div className="topMarkLabel">{markTypes}</div> : ""}
                                    {(mark!==null) && markBefore.length > 0 && mark.length ?
                                        <div className="topMarkLabelBefore">{markBefore}</div> : ""}
                                    {(mark!==null) && mark}
                                    {/*{console.log("mark2", mark2)}*/}
                                    {(mark2!=="")?
                                        <div className="bottomDoubleMark">{'/'+mark2}</div>
                                     :null}

                                    {(isadmin === 1 && mark === null) && "X"}
                                    {/*mathem#242#2019-01-31*/}
                                    {i===this.state.row&&idx===this.state.column&&this.state.subcolumn===0?this.getMarkBlank(cellID):null}
                                </td>)
                            }
                            }
                            break;
                    }
                }
                rows.push(<tr key={i} id={rowID}>{cell}</tr>)
            }
        }

        const {userID, langCode, token, cnt_marks, subj_cnt, stud_cnt, selectedSubjects } = this.props.userSetup;
        //console.log("marksTable", this.props.userSetup.selectedSubj.subj_key)
        return(

            <div className="containertable">
                <div className="row">
                    <div className="col s12 board">
                        <div className="periodName">
                            <div className="markTableStatCaption">
                            <label><b>За три дня: </b>
                                Оценки/студенты/предметы: <b>{cnt_marks}/{stud_cnt}/{subj_cnt}</b></label>
                            </div>
                            <div className="periodTitle">
                                <a id="daysback" onClick={this.daysMove.bind(this)}>{"-" + this.props.dayscount + "дн"}</a>
                                    <b>{this.getPeriod()}</b>
                                <a id="daysforward" onClick={this.daysMove.bind(this)}>{"+" + this.props.dayscount + "дн"}</a>
                                <a id="daysforwardone" onClick={this.daysMove.bind(this)}>{"+1дн"}</a>
                            </div>
                            <div className="selectGroup">
                                {userID>0&&<Select  list={selectedSubjects}
                                                    selected={this.props.userSetup.selectedSubj.subj_key}
                                                    key={"subj_key"}
                                                    valuename={getSubjFieldName(langCode)}
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
                            {userID > 0 &&<div className={"markstable-checkbox-group"}>
                                <div className="checkboxLabel">
                                    <input
                                           name="withtimetable"
                                           type="checkbox"
                                           checked={!timetable.length?false:this.state.withtimetable}
                                           disabled={!timetable.length}
                                           onChange={this.handleInputChange}/>
                                    {" Журнал с учётом расписания"}
                                </div>
                                <div className="checkboxLabel">
                                    <input
                                        name="withoutholidays"
                                        type="checkbox"
                                        checked={this.state.withoutholidays}
                                        onChange={this.handleInputChange}/>
                                    {"  Убрать выходные дни"}
                                </div>
                                <div className="checkboxLabel">
                                    <input
                                        name="onlywithmailstudents"
                                        type="checkbox"
                                        checked={this.state.onlywithmailstudents}
                                        onChange={this.handleInputChange}/>
                                    {" Только студенты с email"}
                                </div>
                            </div>}
                            <div style={{display: "flex", jusitifyContent : "space-between", width : "50%", justifyContent : "space-between"}}>
                                <div style={{position : "relative"}}>
                                    <div className={"btn-showStat"} onClick={()=>this.setState({showStat : !this.state.showStat})}>Статистика ввода оценок</div>
                                    {this.state.showStat?this.showStat():null}
                                    </div>
                                <div style={{display: "flex", flexDirection : "column", jusitifyContent : "flex-end", alignItems : "flex-end"}}>
                                    <div className={"selectGroup-btn"} onClick={this.sendMail.bind(this)}>Разослать оценки за 3 недели</div>
                                    <div style={{textAlign: "center", fontSize : "0.7em"}}>[Предыдущая рассылка: {this.props.userSetup.lastmarkssent}]</div>
                                </div>
                            </div>
                            {this.state.mailSent.length?
                            <div className={this.state.mailSent.length?"popup2 show":"popup2"} onClick={this.hidePopup.bind(this)}>
                                {this.state.mailSent.length?<span className="popuptext2" id="myPopup">{this.state.mailSent}</span>:""}
                            </div>:null}
                        </div>}

                        <table id="simple-board">
                            <thead className="tablehead">
                            {head}
                            </thead>
                            <tbody id="simple-board-body">
                            {rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate: (key, payload) => dispatch({type: key, payload: payload}),
        onStopLoading: () => dispatch({type: 'APP_LOADED'}),
        onStartLoading: () => dispatch({type: 'APP_LOADING'}),
    })
}
export default  connect(mapStateToProps, mapDispatchToProps)(MarksTable)
/* eslint-disable */