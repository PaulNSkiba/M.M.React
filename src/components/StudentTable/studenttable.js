/**
 * Created by Paul on 15.01.2019.
 */
/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'

import MarkBlank from '../MarkBlank/markblank'
import {numberToLang, AddDay, getSpanCount, toYYYYMMDD} from '../helpers'
import Select from '../Select/select'
import Checkbox from '../CheckBox/checkbox'

import { MARKS_URL, TABLE_GET_URL, instanceAxios } from '../../config/URLs'

import './studenttable.css'

class StudentTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            size: this.props.size,
            row : -1,
            column: -1,
            dateStart: AddDay((new Date(this.props.userSetup.mark_date.date)),-(this.props.dayscount - 1)),
            dateEnd : new Date(this.props.userSetup.mark_date.date),
            mapDays : new Map(),
            marks : new Map(), //this.fillMarks(AddDay((new Date()),-2000), new Date()),
            selectedSubjs : new Map(),
            markSubjs : new Map(),
            subj_key : this.props.userSetup.selectedSubjects[0].subj_key,
            subjMap : new Map(),
            marksTypes : new Map(),
            marksBefore : new Map(),
            markType : 0,
            msgTimeOut : 4000,
            isTable : false,
            tableMarks : [],
        }
    }
    getSubjKeys(){
    }
    componentWillMount(){
        this.setState({
        marks : this.fillMarks(AddDay((new Date()),-2000), new Date())
    })
    }
    componentDidMount(){
    }

    fillMarks(dStart, dEnd){
        document.body.style.cursor = 'progress';
        let marks = new Map()
        let marksBefore = new Map()
        let marksTypes = new Map()
        let selectedSubjs = new Map();
        let arr = []

        let {userID, curClass, selectedSubj,studentId,classID,marks:marksredux} = this.props.userSetup;
        // console.log("marksredux", marksredux)

        if (marksredux.length>0) {
            marks.clear()
            marksBefore.clear()
            marksTypes.clear()

            for (let i = 0; i < marksredux.length; i++) {
                marks.set(marksredux[i].subj_key.replace('#', '')+"#"+marksredux[i].stud_id+"#"+toYYYYMMDD(new Date(marksredux[i].mark_date)), marksredux[i].mark)
                selectedSubjs.set(marksredux[i].subj_key, marksredux[i].subj_name_ua) // Number(selectedSubjs.has(marksredux[i].subj_key)?selectedSubjs.get(marksredux[i].subj_key):0) + 1

                if (!(marksredux[i].mark_before===null)) {
                    marksBefore.set(marksredux[i].subj_key.replace('#', '')+"#"+marksredux[i].stud_id+"#"+toYYYYMMDD(new Date(marksredux[i].mark_date)), marksredux[i].mark_before)
                }
                if (!(marksredux[i].mark_type_name===null)) {
                    marksTypes.set(marksredux[i].subj_key.replace('#', '')+"#"+marksredux[i].stud_id+"#"+toYYYYMMDD(new Date(marksredux[i].mark_date)), marksredux[i].mark_type_name)
                }
            }
            this.setState ({ marks, marksBefore, marksTypes })

            // console.log("marksTypes1", marksTypes)
        }
        else
        instanceAxios().get(MARKS_URL + '/'+userID+'/class/'+classID+'/subject/0'+
            '/subjkey/null'+
            '/periodstart/'+toYYYYMMDD(dStart)+'/periodend/'+toYYYYMMDD(dEnd)+'/student/'+studentId)
            .then(response => {
                console.log('GET_MARKS_REMOTE', response.data, userID)
                marks.clear()
                marksBefore.clear()
                marksTypes.clear()
                for (let i = 0; i < response.data.length; i++) {
                    // console.log("MARKS_MAP", response.data[i])
                    marks.set(response.data[i].subj_key.replace('#', '')+"#"+response.data[i].stud_id+"#"+toYYYYMMDD(new Date(response.data[i].mark_date)), response.data[i].mark)
                    selectedSubjs.set(marksredux[i].subj_key, marksredux[i].subj_name_ua) // Number(selectedSubjs.has(marksredux[i].subj_key)?selectedSubjs.get(marksredux[i].subj_key):0) + 1
                    if (!(response.data[i].mark_before===null)) {
                        marksBefore.set(response.data[i].subj_key.replace('#', '')+"#"+response.data[i].stud_id+"#"+toYYYYMMDD(new Date(response.data[i].mark_date)), response.data[i].mark_before)
                    }
                    if (!(response.data[i].mark_type_name===null)) {
                        marksTypes.set(response.data[i].subj_key.replace('#', '')+"#"+response.data[i].stud_id+"#"+toYYYYMMDD(new Date(response.data[i].mark_date)), response.data[i].mark_type_name)
                    }
                }

                // console.log("marksTypes2", marksTypes)

                this.setState ({ marks, marksBefore, marksTypes })
                document.body.style.cursor = 'default';
            })
            .catch(response => {
                console.log(response);
                document.body.style.cursor = 'default';
                // dispatch({type: 'UPDATE_STUDENTS_FAILED', payload: response.data})
            });

        if (selectedSubjs.size > 0) {
            // arr = Array.from(selectedSubjs.values())
            // arr.sort()

            // console.log("selectedSubjs", selectedSubjs, selectedSubjs.size, Array.from(selectedSubjs.keys())[0])
            this.setState({
                    selectedSubjs : new Map().set(Array.from(selectedSubjs.keys())[0], Array.from(selectedSubjs.values())[0]),
                    markSubjs: selectedSubjs
            })

        }
        // Сэмулируем нажатие кнопки
        // console.log("selectedSubjsOnLoad", selectedSubjs, selectedSubjs.length, selectedSubjs.keys().length, selectedSubjs.keys(), selectedSubjs.values())
        if (selectedSubjs.size)
        this.props.onStudSubjChanged(Array.from(selectedSubjs.keys())[0], Array.from(selectedSubjs.values())[0])

        return marks
    }
    onClick(e){
        // console.log("onClick", e.target, e.target.nodeName, e.target.innerHTML)
        if (e.target.nodeName === "TD") {
            let row = Number(e.target.id.split('#')[0])//Number(e.target.id.split('c')[0].replace('r', ''));
            let column = Number(e.target.id.split('#')[1])//Number(e.target.id.split('c')[1]);
            let id = Number(e.target.id.split('#')[2])

            console.log("table_OnClick", row, column)
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
        else if(e.target.nodeName === "A" && this.state.row < (this.state.size - 1) && this.props.direction==="UPDOWN") {
            let row = this.state.row
            this.setState(
                {
                    row: row + 1
                }
                )
        }
        else if(e.target.nodeName === "A" && this.state.column < (this.props.dayscount - 1) && this.props.direction==="LEFTRIGHT") {
            let column = this.state.column
            this.setState(
                {
                    column: column + 1
                }
            )
        }
    }
    changeCell = (cell, value, id) =>{
         console.log("Table_changeCell", cell, value, id)

        let {userID, selectedSubj,classID} = this.props.userSetup;
        let student_id = id.split('#')[2]
        let ondate = id.split('#')[3]
        let markKey = selectedSubj.subj_key.replace("#","")+"#"+student_id+"#"+ondate
        let {marks} = this.state
        marks.set(markKey, value.toString().length<4?value:"")
        this.setState({marks})

        let json = `{   "user_id":${userID},
                        "class_id":${classID},
                        "subj_id":${selectedSubj.id},
                        "subj_key":"${selectedSubj.subj_key}",
                        "stud_id":${student_id},
                        "mark_date":"${ondate}",
                        "mark":"${value.toString().length<4?value:""}"}`
        let data = JSON.parse(json);
        console.log("Table_changeCell", cell, value, id, data)
        this.props.onclick(this.state.row, this.state.column, value)
        // '/marks/{user_id}/class/{class_id}/subject/{subj_id}/student/{student_id}/ondate/{ondate}'

        if (this.props.userSetup.userID > 0) {
            console.log("MARKS_URL", JSON.stringify(data), MARKS_URL +'/'+ userID+'/class/'+classID+'/subject/'+selectedSubj.id+'/student/'+student_id+'/ondate/'+ondate+'/mark/'+value)
             // return;
            instanceAxios().post(MARKS_URL + '/add', JSON.stringify(data))
                .then(response => {
                    console.log('UPDATE_MARKS_REMOTE', response.data)
                    // dispatch({type: 'UPDATE_STUDENTS_REMOTE', payload: response.data})
                })
                .catch(response => {
                    console.log(response);
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
    getPeriod=()=>{
        let {dateStart, dateEnd} = this.state
        return (dateStart.getDate() +'.'+(dateStart.getMonth() + 1) +'.'+dateStart.getFullYear().toString().slice(-2) + "-" +
        dateEnd.getDate() +'.'+(dateEnd.getMonth() + 1) +'.'+dateEnd.getFullYear().toString().slice(-2))
        }
    getDateForHead=(add)=>{
        let newDate = AddDay(this.state.dateStart, add)
        // console.log("getDateForHead", newDate, newDate.getDay(), newDate.getDay()===1?"\*":"", newDate.getDate() +'.'+ (Number(newDate.getMonth()) + 1).toString(), )
        return (newDate.getDate() +'.'+ (Number(newDate.getMonth()) + 1).toString())// + (newDate.getDay()===1?"\*":"").toString() ) //
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
    }
    classNameSubjButton=(subj_key)=> {
        if (this.state.selectedSubjs.has(subj_key)) {
           return "subjButton active"
        }
        else
            return "subjButton"
    }
    onSubjClick(e){
        //console.log(e.target.id)
        let {selectedSubjs} = this.state
        selectedSubjs.clear()
        // selectedSubjs.set(e.target.id, e.target.id)
        // if (selectedSubjs.has(e.target.id))
        //     selectedSubjs.delete(e.target.id)
        // else
        selectedSubjs.set(e.target.id, e.target.innerHTML)
        this.setState({
            selectedSubjs
        })
        this.props.onStudSubjChanged(e.target.id, e.target.innerHTML)
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
    changeState(name, value) {
        // let json, data;
        // let {pupilCount, students : studs, userID, subjects_list, selectedSubjects, classID} = this.props.userSetup;
        // switch (name) {}
        this.setState({isTable:!this.state.isTable})
        console.log(name, value)
        if (!this.state.tableMarks.length) {
                 let year = new Date().getFullYear();
                let month = new Date().getMonth()
                year = (month < 9)?(year-1):year
                instanceAxios().get(TABLE_GET_URL + '/' + this.props.userSetup.studentId + '/table/' + (year+'0901'), [])
                    .then(response => {
                        this.setState({tableMarks:response.data.table})
                        console.log('TABLE_GET_URL', response.data)
                    })
                    .catch(response => {
                        console.log(response);
                    })
            // }
        }
    }
    render(){
        let head = [];
        let cell = []
        let cell2 = []
        let curMonth = -1
        let mapDays = this.state.mapDays
        mapDays.clear()

        // console.log(this.props)
        console.log('tableMarks', this.state.tableMarks)

        if (this.state.isTable) {
            console.log('this.state.isTable', this.state)
            cell.push(<th rowSpan={2} key={10} id={0} className="numbercol head studcol">
                № п/п
            </th>)
            cell.push(<th rowSpan={2} key={11} id={1} className="namescol head studcol">
                {'Предмет'}
            </th>)
            cell.push(<th
                colSpan={3}
                key={1} id={1}
                onClick={this.onClick.bind(this)}
                className="tablehead">
                {'Табель'}
            </th>)
            cell2.push(<th key={22} id={2}
                           onClick={this.onClick.bind(this)}
                           className={"tablehead"}>
                {'1йСм'}
            </th>)
            cell2.push(<th key={23} id={3}
                           onClick={this.onClick.bind(this)}
                           className={"tablehead"}>
                {'2йСм'}
            </th>)
            cell2.push(<th key={24} id={4}
                           onClick={this.onClick.bind(this)}
                           className={"tablehead"}>
                {'Год'}
            </th>)
            // head.push(<tr key={"row-1"} id={"row-1"}>{cell}</tr>)
            // head.push(<tr key={"row-2"} id={"row-2"}>{cell2}</tr>)
        }
        else {
            for (var idx = 0; idx < (this.props.dayscount + 2); idx++) {
                let cellID = `h0c${idx}`
                switch (idx) {
                    case 0 :
                        cell.push(<th rowSpan={2} key={cellID} id={cellID} className="numbercol head studcol">
                            № п/п
                        </th>)
                        break;
                    case 1 :
                        cell.push(<th rowSpan={2} key={cellID} id={cellID} className="namescol head studcol">
                            {this.state.isTable ? 'Предмет' : 'Предмет +выбор данных для диаграммы'}
                        </th>)
                        break
                    default:
                        if ((AddDay(this.state.dateStart, idx - 2).getDay() > 0 && AddDay(this.state.dateStart, idx - 2).getDay() < 6 && this.props.withoutholidays) || (!this.props.withoutholidays)) {
                            if (curMonth != (AddDay(this.state.dateStart, idx - 2).getMonth())) {
                                cell.push(<th
                                    colSpan={getSpanCount(AddDay(this.state.dateStart, idx - 2), this.props.dayscount, this.props.withoutholidays)}
                                    key={cellID} id={cellID}
                                    onClick={this.onClick.bind(this)}
                                    className="tablehead">
                                    {AddDay(this.state.dateStart, idx - 2).getMonth() + 1 + "." + AddDay(this.state.dateStart, idx - 2).getFullYear().toString().slice(-2)}
                                </th>)
                                curMonth = AddDay(this.state.dateStart, idx - 2).getMonth()
                            }

                            cell2.push(<th key={cellID} id={cellID}
                                           onClick={this.onClick.bind(this)}
                                           className={this.classDateForSelection((idx) === this.state.column)}>
                                {this.getDateForHead(idx - 2)}{(AddDay(this.state.dateStart, (idx - 2)).getDay() === 1 ?
                                <div className="mondayFlagStudent">{"Пн"}</div> : "")}
                            </th>)
                            {
                                mapDays.set(idx, this.getDateForHeadFull(idx - 2))
                            }
                        }
                        break;
                }
            }
        }
        head.push(<tr key={"row-1"} id={"row-1"}>{cell}</tr>)
        head.push(<tr key={"row-2"} id={"row-2"}>{cell2}</tr>)

        let rows = [], subjArr = [];
        let {selectedSubjects, students, studentId} = this.props.userSetup;

        // Отфильтруем только для предметов с оценками
        // console.log("RENDER", selectedSubjects, this.state.markSubjs)
        selectedSubjects = selectedSubjects.filter(val=>(
            this.state.markSubjs.has(val.subj_key)
        ))

        // console.log("markTypes", markTypes)

        if (this.state.isTable) {
            for (var i = 0; i < selectedSubjects.length; i++){
                let rowID = `row${i}`
                let cell = []
                for (var idx = 0; idx < 5; idx++){
                    let cellID = i+"#"+idx+"#"+selectedSubjects[i].id+"#"+mapDays.get(idx)
                    switch (idx) {
                        case 0 :
                            cell.push(<th key={cellID} id={cellID} className="numbercol">
                                {i + 1}
                            </th>)
                            break;
                        case 1 :
                            cell.push(<th key={cellID} id={cellID} className={this.classNameForSelection(i===this.state.row)}>
                                {/*{numberToLang(i + 1, " ", "rus")}*/}
                                <div    id={selectedSubjects[i].subj_key}
                                        className={this.classNameSubjButton(selectedSubjects[i].subj_key)}
                                        onClick={this.onSubjClick.bind(this)}>{selectedSubjects[i].subj_name_ua}</div>
                            </th>)
                            break
                        default:
                            let curLetter = idx===3?"S1":(idx===4?"S2":"A")
                            // console.log(selectedSubjects[i].subj_key, curLetter)
                            let curMark = this.state.tableMarks.filter((item)=>item.subj_key===selectedSubjects[i].subj_key&&item.mark_type_name===curLetter)
                            // console.log(selectedSubjects[i].subj_key, curLetter, curMark)
                            if (curMark.length) curMark = curMark[0]

                                cell.push(<td key={cellID} id={cellID} onClick={this.onClick.bind(this)} className={"tableBody"}>

                                    {!(curMark===null)&&<div className="topMarkLabel">{curMark.place}</div>}
                                    {!(curMark===null)&&curMark.mark}
                                </td>)

                            break;
                    }
                }
                rows.push(<tr key={i} id={rowID}>{cell}</tr>)
            }
        }
        else {
            for (var i = 0; i < selectedSubjects.length; i++){
                let rowID = `row${i}`
                let cell = []
                for (var idx = 0; idx < (this.props.dayscount + 2); idx++){
                    let cellID = i+"#"+idx+"#"+selectedSubjects[i].id+"#"+mapDays.get(idx)
                    switch (idx) {
                        case 0 :
                            cell.push(<th key={cellID} id={cellID} className="numbercol">
                                {i + 1}
                            </th>)
                            break;
                        case 1 :
                            cell.push(<th key={cellID} id={cellID} className={this.classNameForSelection(i===this.state.row)}>
                                {/*{numberToLang(i + 1, " ", "rus")}*/}
                                <div    id={selectedSubjects[i].subj_key}
                                        className={this.classNameSubjButton(selectedSubjects[i].subj_key)}
                                        onClick={this.onSubjClick.bind(this)}>{selectedSubjects[i].subj_name_ua}</div>
                                </th>)
                            break
                        default:
                            if ((AddDay(this.state.dateStart, idx-2).getDay() > 0 && AddDay(this.state.dateStart, idx-2).getDay() < 6 && this.props.withoutholidays) || (!this.props.withoutholidays)) {

                                let markTypes = this.getMarkHashType(selectedSubjects[i].subj_key.replace('#','')+"#"+studentId+"#"+mapDays.get(idx));
                                if (!(markTypes==="A")&&!(markTypes==="S1")&&!(markTypes==="S2")) {
                                    let mark = this.getMarkHash(selectedSubjects[i].subj_key.replace('#', '') + "#" + studentId + "#" + mapDays.get(idx));

                                    let markBefore = this.getMarkHashBefore(selectedSubjects[i].subj_key.replace('#', '') + "#" + studentId + "#" + mapDays.get(idx));


                                    // console.log('Render MarkTypes', markTypes)
                                    let badmark = (this.props.userSetup.markBlank.id === "markblank_twelve" && (mark === '1' || mark === '2' || mark === '3')) ||
                                        (this.props.userSetup.markBlank.id === "markblank_five" && (mark === '1' || mark === '2')) ||
                                        (this.props.userSetup.markBlank.id === "markblank_letters" && (mark === 'D' || mark === 'E/F'))

                                    cell.push(<td key={cellID} id={cellID} onClick={this.onClick.bind(this)}
                                                  className={badmark ? "tableBody badmark" : "tableBody"}>

                                        {!(mark === null) && markTypes.length > 0 && mark.length ?
                                            <div className="topMarkLabel">{markTypes}</div> : ""}
                                        {!(mark === null) && markBefore.length > 0 && mark.length ?
                                            <div className="topMarkLabelBefore">{markBefore}</div> : ""}
                                        {!(mark === null) && mark}

                                        {/*{this.getMarkHash(selectedSubjects[i].subj_key.replace('#','')+"#"+studentId+"#"+mapDays.get(idx))}*/}

                                        {/*{i === (this.state.row) && idx === this.state.column ? this.getMarkBlank(cellID) : ""}*/}

                                    </td>)
                                }
                                else {
                                    cell.push(<td key={cellID} id={cellID} onClick={this.onClick.bind(this)}
                                                  className={"tableBody"}>

                                      </td>)
                                }
                            }
                            break;
                    }
                }
                rows.push(<tr key={i} id={rowID}>{cell}</tr>)
            }
        }
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

                                {this.props.user.id>0&&<Select  list={this.props.userSetup.selectedSubjects}
                                                                selected={this.props.userSetup.selectedSubj.subj_key}
                                                                key={"subj_key"}
                                                                valuename={"subj_name_ua"}
                                                                name={"selectedSubj"}
                                                                caption="Предмет:"
                                                                value={"subj_key"}
                                                                onchange={this.props.changestate}
                                                                />}
                                {this.props.user.id>0&&<Select  list={[{id:"NAME", alias:"ИМЯ"},{id:"NICK", alias:"НИК"}, {id:"EMAIL", alias:"EMAIL"}]}
                                                                selected={this.props.userSetup.titlekind}
                                                                key={"id"}
                                                                valuename={"alias"}
                                                                name={"listnames"}
                                                                caption="Наим-е:"
                                                                value={"id"}
                                                                onchange={this.props.changestate}
                                />}
                            </div>
                         </div>
                        <div>
                            <Checkbox onclick={this.changeState.bind(this)} bold={true} name={"table"} defelem={this.state.isTable} label={" ТАБЕЛЬ"}/>
                        </div>
                        <table id="simple-board">
                            <thead className="marktable">
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
const mapStateToProps = store => {
    // console.log(store) // посмотрим, что же у нас в store?
    return {
        user:       store.user,
        userSetup:  store.userSetup,
    }
}
const mapDispatchToProps = dispatch => {
    return ({
    })
}
export default  connect(mapStateToProps, mapDispatchToProps)(StudentTable)
/* eslint-disable */