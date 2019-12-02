/**
 * Created by Paul on 30.11.2019.
 */
import React, {Component} from 'react';
import {UPDATESETUP_URL, SUBJECTS_GET_URL, MARKS_URL, markType, API_URL} from '../../config/config'
import {instanceAxios, mapStateToProps, arrOfWeekDaysLocal, getSubjFieldName, toYYYYMMDD, dateFromYYYYMMDD, axios2} from '../../js/helpers'
import {connect} from 'react-redux'
import '../MarksTable/markstable.css'
import './timetable.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MarkBlank from '../MarkBlank/markblank'

class Timetable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            row : 0,
            column : 0,
            classList: this.initClassList(),
            timetable : new Map(),
            timetableArr : [],
            mainDate : dateFromYYYYMMDD(`${(new Date()).getFullYear()}${(new Date()).getMonth()>=7?"09":"01"}01`),
        }
        this.defClass = "7Г"
        this.renderClasses = this.renderClasses.bind(this)
        this.onClick = this.onClick.bind(this)
    }
    initClassList = () => {
        let classList = []
        for (let i = 1; i < 12; i++) {
            classList.push(`${i}A`)
            classList.push(`${i}Б`)
            classList.push(`${i}В`)
            classList.push(`${i}Г`)
        }
        return classList
    }
    componentDidMount(){
        this.fillTimetable()
    }
    fillTimetable=()=>{
        const {classID, langCode} = this.props.userSetup
        // console.log("TIME", `${(new Date()).getFullYear()},${(new Date()).getMonth()>=7?"09":"01"}01`)
        console.log("fillTimetable")
        axios2('get', `${API_URL}timetable/get/${classID}/${toYYYYMMDD(this.state.mainDate)}`)
            .then(res=>{
                // let markKey = subj_key.replace("#","")+"#"+subj_key.replace("#","")+"#"+ondate
                let {timetable, timetableArr} = this.state
                res.data.forEach(item=>{
                    let key = `${item.subj_key.replace("#","")}#${item.subj_key.replace("#","")}#${item.weekday}`
                    timetable.set(key, item)
                })
                res.data = res.data.map(item=>{item.subj_name=item[getSubjFieldName(langCode)]; return item})
                this.setState({timetable, timetableArr : res.data})

                console.log("INITTIMETABLE", timetable, res.data)
             })
            .catch(res=>{
                console.log("fillTimetable:error")
            })
    }
    renderClasses = () =>
        this.state.classList.map(value =>
            <option key={value} value={value}>
                { value }
            </option>)

    onClick(e){
        console.log("onClick", e.target, e.target.nodeName, e.target.innerHTML)
        let {subjects_list} = this.props.userSetup
        subjects_list = subjects_list.filter(item=>item.subj_key!=="#xxxxxx")

        if (e.target.nodeName === "TD") {
            let row = Number(e.target.id.split('#')[0])//Number(e.target.id.split('c')[0].replace('r', ''));
            let column = Number(e.target.id.split('#')[1])//Number(e.target.id.split('c')[1]);
            let id = Number(e.target.id.split('#')[2])

            // console.log("table_OnClick", row, column)
            if (row===this.state.row&&column===this.state.column) {
                row=-1
                column=-1}
            this.setState(
                {
                    row: row,
                    column: column
                }
            )
        }
        else if(e.target.nodeName === "A" && this.state.row < (subjects_list.length - 1)) {
            let {row} = this.state
            this.setState(
                {
                    row: row + 1
                }
            )
        }
    }
    classNameForSelection=selected=>{
        return ""
    }
    handleDate=(type, var1, date)=>{
        this.setState({mainDate : date})
    }
    changeCell = (cell, value, id) =>{
        console.log("Table_changeCell", value)

        let {userID, classID, subjects_list, langCode, classNumber} = this.props.userSetup;
        let tid = Number(id.split('#')[4])
        let subj_key = `#${id.split('#')[2]}`
        let ondate = id.split('#')[3]
        let key = subj_key.replace("#","")+"#"+subj_key.replace("#","")+"#"+ondate
        let {timetable, timetableArr} = this.state
        const subj = subjects_list.filter(item=>item.subj_key===subj_key)
        const obj = {id : tid, subj_key : subj_key, subj_name : subj.length?subj[0][getSubjFieldName(langCode)]:"", weekday : Number(ondate), position : value.toString().length<4?value:"", ondate : toYYYYMMDD(this.state.mainDate), class_id : classID, class_number : classNumber }
        if ((value.toString().length<4?value:null)!==null) {
            console.log('Добавляем')
            timetable.set(key, value.toString().length < 4 ? obj : null)
            timetableArr = [...timetableArr, obj]
        }
        else {
            console.log('Стираем')
            timetable.delete(key)
            timetableArr = timetableArr.filter(item=>item.subj_key!==subj_key&&item.position!==value.toString().length<4?value:"")
        }

        this.setState({timetable, timetableArr})

        console.log("changeCell", timetable, timetableArr)

        // `id`, `class_id`, `class_number`, `school_id`, `user_id`, `subj_id`, `subj_key`, `subj_name_ua`, `subj_name_ru`, `subj_name_en`, `subj_name_gb`,
        // `weekday`, `position`, `room_id`, `room`, `teacher_id`, `teacher_name`, `dateFrom`, `dateTo`, `authorized_at`, `created_at`, `updated_at`

        const json = `{  "user_id":${userID},
                        "class_id":${classID},
                        "class_number":${classNumber},
                        "school_id":${null},
                        "subj_id":${subj.length?subj[0].id:null},
                        "subj_key":"${subj.length?subj[0].subj_key:null}",
                        "subj_name_ua":"${subj.length?subj[0].subj_name_ua:null}",
                        "subj_name_ru":"${subj.length?subj[0].subj_name_ru:null}",
                        "subj_name_en":"${subj.length?subj[0].subj_name_en:null}",
                        "subj_name_gb":"${subj.length?subj[0].subj_name_gb:null}",
                        "weekday":${ondate},
                        "position":"${value.toString().length<4?value:null}",
                        "dateFrom":"${toYYYYMMDD(new Date(this.state.mainDate))}",
                        "dateTo":${null}}`

        // "mark_type_name":"${this.state.markType>0?this.state.markType===1?'К':(this.state.markType===2?'С':'Т'):marksTypes.get(markKey)}",
        let data = JSON.parse(json);
        console.log("Table_changeCell", cell, value, id, data, JSON.stringify(data))
        // this.props.onclick(this.state.row, this.state.column, value)

        if (userID > 0) {
            // instanceAxios().post(MARKS_URL + '/add', JSON.stringify(data))
            axios2('post', `${API_URL}timetable/add${tid?'/'+tid:''}`, JSON.stringify(data))
                .then(response => {
                    console.log('UPDATE_TIMETABLE', response.data)
                    // dispatch({type: 'UPDATE_STUDENTS_REMOTE', payload: response.data})
                })
                .catch(response => {
                    console.log("UPDATE_TIMETABLE_ERROR", response);
                    // dispatch({type: 'UPDATE_STUDENTS_FAILED', payload: response.data})
                })
        }
    }

    getMarkBlank=(cellID)=>{
        // alert(cellID)
        return(<MarkBlank kind={4} onclickA={this.changeCell} parent={cellID}/>)
    }
    getTimetableHash=key=>this.state.timetable.has(key)?this.state.timetable.get(key):null

    subjListTableHead=(day)=>{
        return <tr>
                    <th>№ п/п</th>
                    <th>{day}</th>
                    <th>№ каб.</th>
                    <th>Нач</th>
                    <th>Кон</th>
                </tr>
    }
    subjListRows=(day)=>{
        const arr = this.state.timetableArr.filter(item=>item.weekday===day).sort((a,b)=> {
            if (a.pos > b.pos) return 1;
            if (a.pos === b.pos) return 0;
            if (a.pos < b.pos) return -1;
        }
        )
        let retArr = []
        arr.forEach((item, key)=> {
                if (item.position.length === 1) {
                retArr.push(<tr key={key}>
                    <td>{item.position}</td>
                    <td>{item.subj_name}</td>
                    <td>{}</td>
                    <td>{}</td>
                    <td>{}</td>
                </tr>)}
                    else {
                    retArr.push(<tr key={key+'.1'}>
                        <td>{item.position.split('-')[0]}</td>
                        <td>{item.subj_name}</td>
                        <td>{}</td>
                        <td>{}</td>
                        <td>{}</td>
                    </tr>)
                    retArr.push(<tr key={key+'.2'}>
                    <td>{item.position.split('-')[1]}</td>
                    <td>{item.subj_name}</td>
                    <td>{}</td>
                    <td>{}</td>
                    <td>{}</td>
                    </tr>
                    )
                }
                }
        )
        return retArr
    }
    render() {
        const {classList} = this.state
        let head = []
            , cell = []
            , rows = [];

        let {subjects_list, langCode} = this.props.userSetup
        subjects_list = subjects_list.filter(item=>item.subj_key!=="#xxxxxx")
        // const map = new Map(subjects_list.map(obj=>[obj.subj_key, obj[getSubjFieldName(langCode)]]))
        const mapDays = new Map()
        for (let i = 0; i < arrOfWeekDaysLocal.length; i++){
            mapDays.set(i, arrOfWeekDaysLocal[i])
        }
        console.log("Timetable", subjects_list, getSubjFieldName(langCode), this.props.userSetup)

        for (let idx = 0; idx < (7 + 2); idx++) {
            let cellID = `h0c${idx}`
            switch (idx) {
                case 0 :
                    cell.push(<th rowSpan={2} key={cellID} id={cellID} className="numbercol head">
                        № п/п
                    </th>)
                    break;
                case 1 :
                    cell.push(<th rowSpan={2} key={cellID} id={cellID} className="namescol head">
                        Предмет
                    </th>)
                    break
                default:
                    cell.push(<th
                        key={cellID} id={cellID} onClick={this.onClick}
                        className="tablehead">
                        <div className={""}>
                            {arrOfWeekDaysLocal[idx-2]}
                        </div>
                    </th>)
                    break;
            }
        }
        head.push(<tr key={"row-1"} id={"row-1"}>{cell}</tr>)
        let j = 0
        for (let i = 0; i < subjects_list.length; i++) {
            let rowID = `row${i}`
            console.log("subjects_list.length", subjects_list.length)
            let cell = []
                for (let idx = 0; idx < (7 + 2); idx++) {
                    j++;
                    // console.log("SUBJ_NAME2", subjects_list[i][getSubjFieldName(langCode)], getSubjFieldName(langCode), subjects_list[i])
                    let cellID = `${i}#${idx}#${subjects_list[i].subj_key.replace("#", '')}#${idx - 2}`
                    switch (idx) {
                        case 0 :
                            cell.push(<th key={cellID} id={cellID} className={"numbercol"}>
                                {i + 1}
                            </th>)
                            break;
                        case 1 :
                            // console.log("SUBJ_NAME", subjects_list[i][getSubjFieldName(langCode)], getSubjFieldName(langCode), subjects_list[i])
                            cell.push(<th key={cellID} id={cellID}
                                          className={this.classNameForSelection(i === this.state.row)}>
                                {subjects_list[i][getSubjFieldName(langCode)]}
                            </th>)
                            break
                        default:
                            // console.log("Current Rows", i, (this.state.row), idx, this.state.column, AddDay(this.state.dateStart, idx - 2), AddDay(this.state.dateStart, idx - 2).getDay())
                            // if ((AddDay(this.state.dateStart, idx - 2).getDay() > 0 && AddDay(this.state.dateStart, idx - 2).getDay() < 6 && this.props.withoutholidays) || (!this.props.withoutholidays)) {
                            const mark = this.getTimetableHash(`${subjects_list[i].subj_key.replace('#', '')}#${subjects_list[i].subj_key.replace('#', '')}#${idx - 2}`);
                            //     let markBefore = this.getMarkHashBefore(this.props.userSetup.selectedSubj.subj_key.replace('#', '') + "#" + students[i].id + "#" + mapDays.get(idx));
                            //     let markTypes = this.getMarkHashType(this.props.userSetup.selectedSubj.subj_key.replace('#', '') + "#" + students[i].id + "#" + mapDays.get(idx));
                            //
                            //     let badmark =   (this.props.userSetup.markBlank.id==="markblank_twelve"&&(mark==='1'||mark==='2'||mark==='3'))||
                            //         (this.props.userSetup.markBlank.id==="markblank_five"&&(mark==='1'||mark==='2'))||
                            //         (this.props.userSetup.markBlank.id==="markblank_letters"&&(mark==='D'||mark==='E/F'))
                            cellID = `${i}#${idx}#${subjects_list[i].subj_key.replace("#", '')}#${idx - 2}#${!(mark===null)?mark.id:0}`
                            cell.push(<td key={cellID} id={cellID} onClick={this.onClick} className={"tableBody"}>

                                {/*{!(mark===null)&&markTypes.length>0&&mark.length?<div className="topMarkLabel">{markTypes}</div>:""}*/}
                                {/*{!(mark===null)&&markBefore.length>0&&mark.length?<div className="topMarkLabelBefore">{markBefore}</div>:""}*/}
                                {!(mark===null)?mark.position:null}
                                {/*{(this.props.userSetup.isadmin===1&&mark===null)&&"X"}*/}
                                {/*/!*{this.getMarkHash(this.props.userSetup.selectedSubj.subj_key.replace('#', '') + "#" + this.props.userSetup.students[i].id + "#" + mapDays.get(idx))}*!/*/}
                                {/*/!*mathem#242#2019-01-31*!/*/}
                                {i === (this.state.row) && idx === this.state.column ? this.getMarkBlank(cellID) : ""}
                            </td>)
                            break;
                    }
                }
                rows.push(<tr key={i} id={rowID}>{cell}</tr>)
            }

        return (

                <div>
                    <div style={{display : "flex", alignItems : "center"}}>
                        <div className="h4">Расписание для {
                            <select name="classes" disabled={true} defaultValue={this.defClass} onClick={this.onClassClick}>
                                {classList.length && this.renderClasses()}
                            </select>}
                         </div>
                        {`${"  на:  "}`}
                        <DatePicker
                            // showMonthYearDropdown
                            // isClearable
                            fixedHeight
                            dateFormat="dd/MM/yy"
                            withPortal
                            locale="ru"
                            selected={new Date(this.state.mainDate)}
                            onChange={date => this.handleDate('start', null, date)}
                            customInput={<input style={{
                                width: "80px",
                                textAlign: "center",
                                backgroundColor: "#7DA8E6",
                                color: "#fff", fontSize: "0.9em"
                            }}/>}
                        />
                    </div>
                <div className={"timetableMain"}>
                    <div style={{width : "40%"}}>
                        <table id="simple-board">
                            <thead className="tablehead">
                            {head}
                            </thead>
                            <tbody>
                            {rows}
                            </tbody>
                        </table>
                    </div>
                    <div className={"subjectsByDayOfWeek"}>
                        <div className={"subjListTableBlock"}>
                            <table id="simple-board">
                                <thead className="tablehead">
                                    {this.subjListTableHead("Понедельник")}
                                </thead>
                                <tbody>
                                    {this.subjListRows(0)}
                                </tbody>
                            </table>
                        </div>
                        <div className={"subjListTableBlock"}>
                            <table id="simple-board">
                                <thead className="tablehead">
                                {this.subjListTableHead("Вторник")}
                                </thead>
                                <tbody>
                                {this.subjListRows(1)}
                                </tbody>
                            </table>
                        </div>
                        <div className={"subjListTableBlock"}>
                            <table id="simple-board">
                                <thead className="tablehead">
                                {this.subjListTableHead("Среда")}
                                </thead>
                                <tbody>
                                {this.subjListRows(2)}
                                </tbody>
                            </table>
                        </div>
                        <div className={"subjListTableBlock"}>
                            <table id="simple-board">
                                <thead className="tablehead">
                                {this.subjListTableHead("Четверг")}
                                </thead>
                                <tbody>
                                {this.subjListRows(3)}
                                </tbody>
                            </table>
                        </div>
                        <div className={"subjListTableBlock"}>
                            <table id="simple-board">
                                <thead className="tablehead">
                                {this.subjListTableHead("Пятница")}
                                </thead>
                                <tbody>
                                {this.subjListRows(4)}
                                </tbody>
                            </table>
                        </div>
                        <div className={"subjListTableBlock"}>
                            <table id="simple-board">
                                <thead className="tablehead">
                                {this.subjListTableHead("Суббота")}
                                </thead>
                                <tbody>
                                {this.subjListRows(5)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
             </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return ({
        onInitState: () => dispatch([]),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(Timetable)