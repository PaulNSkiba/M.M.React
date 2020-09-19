/**
 * Created by Paul on 30.11.2019.
 */
import React, {Component} from 'react';
import {UPDATESETUP_URL, SUBJECTS_GET_URL, MARKS_URL, markType, API_URL, ISCONSOLE} from '../../config/config'
import {instanceAxios, mapStateToProps, arrOfWeekDaysLocal, getSubjFieldName, toYYYYMMDD, dateFromYYYYMMDD, axios2} from '../../js/helpers'
import {connect} from 'react-redux'
import '../MarksTable/markstable.css'
import '../../css/colors.css'
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
            defClass : "7Г",
            curSubjectList : []
        }

        this.renderClasses = this.renderClasses.bind(this)
        this.onClick = this.onClick.bind(this)
    }
    initClassList = () => {
        let classList = []
        for (let i = 1; i < 12; i++) {
            classList.push(`${i}А`)
            classList.push(`${i}Б`)
            classList.push(`${i}В`)
            classList.push(`${i}Г`)
            classList.push(`${i}Д`)
        }
        return classList
    }
    componentDidMount(){
        this.fillTimetable()
    }
    shouldComponentUpdate(nextProps, nextState){

        return true
    }
    componentDidUpdate(){

        const markblank = document.getElementById("markblank_twelve")

        if (markblank!==null){
            ISCONSOLE && console.log("MARKBLANK: Render", window.innerHeight, window.innerWidth, markblank.getBoundingClientRect())
            const rect =  markblank.getBoundingClientRect()
            // console.log(window.innerHeight - (rect.top + rect.height))
            if ((window.innerHeight - (rect.top + rect.height + 20)) < 0) {
                window.scrollBy(0, Math.abs(window.innerHeight - (rect.top + rect.height + 20)))

                const elem = document.getElementById('simple-board')
                if (elem!==null)
                    elem.scrollTop = elem.scrollHeight //- elem.clientHeight + 50;

            }
            // console.log("RECT", window.innerWidth, rect)
            if ((window.innerWidth / 2 - (rect.right + rect.width + 20)) < 0) {
                window.scrollBy(Math.abs(window.innerWidth / 2 - (rect.right + rect.width + 20)), 0)

                const elem = document.getElementById('simple-board')
                if (elem!==null)
                    elem.scrollLeft = elem.scrollWidth //- elem.clientHeight + 50;

            }

        }
    }
    fillTimetable=()=>{
        const {langCode, school_id} = this.props.userSetup
        // console.log("fillTimetable",this.props.curClass, this.props.curLetter)
        const classNumber = this.props.curClass!==undefined&&this.props.curClass!==null?this.props.curClass:this.props.userSetup.curClass
        const classLetter = this.props.curLetter!==undefined&&this.props.curLetter!==null?this.props.curLetter:this.props.userSetup.class_letter

        ISCONSOLE && console.log("TIME", encodeURI(`${API_URL}timetable/getbyschool/${school_id}/${classNumber}/${classLetter}/${toYYYYMMDD(this.state.mainDate)}`))

        //axios2('get', `${API_URL}timetable/getex/${classID}/${toYYYYMMDD(this.state.mainDate)}`)
        axios2('get', `${API_URL}timetable/getbyschool/${school_id}/${classNumber}/${classLetter}/${toYYYYMMDD(this.state.mainDate)}`)
            .then(res=>{

                // let markKey = subj_key.replace("#","")+"#"+subj_key.replace("#","")+"#"+ondate
                let {timetable} = this.state
                // let {timetable : timetable2} = this.props.userSetup

                //console.log("INITTIMETABLE", res.data, timetable)

                ISCONSOLE && console.log("TimeTable", this.props.userSetup)

                timetable.clear()
                //timetable2.clear()
                res.data = res.data.filter(item=>item!==null)
                res.data.forEach(item=>{
                    let key = `${item.subj_key.replace("#","")}#${item.subj_key.replace("#","")}#${item.weekday}`
                    timetable.set(key, item)
                    //timetable2.set(key, item)
                })
                res.data = res.data.map(item=>{item.subj_name=item[getSubjFieldName(langCode)]; return item})
                this.setState({timetable, timetableArr : res.data})

             })
            .catch(err=>{
                console.log("fillTimetable:error", err)
            })
    }
    renderClasses=(selected)=> {
        // console.log("renderClasses", selected)
        return this.state.classList.map(value =>
            <option key={value} value={value}>
                { value }
            </option>)
    }

    onClick(e){
        ISCONSOLE && console.log("onClick", e.target, e.target.nodeName, e.target.innerHTML)
        let {subjects_list} = this.props.userSetup
        subjects_list = subjects_list.filter(item=>item.subj_key!=="#xxxxxx")

        if (e.target.nodeName === "TD") {
            let row = Number(e.target.id.split('#')[0])//Number(e.target.id.split('c')[0].replace('r', ''));
            let column = Number(e.target.id.split('#')[1])//Number(e.target.id.split('c')[1]);
            let id = Number(e.target.id.split('#')[2])

            const elems = document.querySelectorAll(".markstable__selected-cell")
            if (elems!==null)
                elems.forEach(item=>item.classList.remove("markstable__selected-cell"))

            if (row===this.state.row&&column===this.state.column) {
                row=-1; column=-1}
            else {
                e.target.classList.add("markstable__selected-cell")
            }

            this.setState( {   row: row, column: column } )

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
        ISCONSOLE && console.log("Table_changeCell", value)

        let {userID, classID, classNumber : classNumberUserSetup, class_letter, langCode, school_id, subjects} = this.props.userSetup;
        let tid = Number(id.split('#')[4])
        let subj_key = `#${id.split('#')[2]}`
        let ondate = id.split('#')[3]
        let key = subj_key.replace("#","")+"#"+subj_key.replace("#","")+"#"+ondate
        let {timetable, timetableArr} = this.state

        if (this.props.timetableArr!==undefined) {
            timetableArr = this.props.timetableArr
            timetable = this.props.timetable
        }
        const subj = subjects.filter(item=>item.subj_key===subj_key)
        const obj = {id : tid, subj_key : subj_key, subj_name : subj.length?subj[0][getSubjFieldName(langCode)]:"", weekday : Number(ondate), position : value.toString().length<4?value:"", ondate : toYYYYMMDD(this.state.mainDate), class_id : classID, class_number : classNumber }
        if ((value.toString().length<4?value:null)!==null) {
            ISCONSOLE && console.log('Добавляем')
            timetable.set(key, value.toString().length < 4 ? obj : null)
            timetableArr = [...timetableArr, obj]
        }
        else {
            ISCONSOLE && console.log('Стираем')
            timetable.delete(key)
            timetableArr = timetableArr.filter(item=>item.subj_key!==subj_key&&item.position!==value.toString().length<4?value:"")
        }
        this.setState({timetable, timetableArr})
        ISCONSOLE && console.log("changeCell", timetable, timetableArr)

        // `id`, `class_id`, `class_number`, `school_id`, `user_id`, `subj_id`, `subj_key`, `subj_name_ua`, `subj_name_ru`, `subj_name_en`, `subj_name_gb`,
        // `weekday`, `position`, `room_id`, `room`, `teacher_id`, `teacher_name`, `dateFrom`, `dateTo`, `authorized_at`, `created_at`, `updated_at`
        // const defClass = this.props.curClass!==undefined&&this.props.curClass!==null?this.props.curClass+this.props.curLetter:curClass+classLetter
        const classNumber = this.props.curClass!==undefined&&this.props.curClass!==null?this.props.curClass:this.props.userSetup.curClass
        const classLetter = this.props.curLetter!==undefined&&this.props.curLetter!==null?this.props.curLetter:class_letter

        ISCONSOLE && console.log("UPDATE", classNumber, classNumberUserSetup, class_letter, classLetter)
        const json = `{ "user_id":${userID},
                        "class_id":${classNumber===classNumberUserSetup&&class_letter===classLetter?classID:null},
                        "class_number":${classNumber},
                        "class_letter":"${classLetter}",
                        "school_id":${school_id},
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
        ISCONSOLE && console.log("Table_changeCell", cell, value, id, data, JSON.stringify(data))
        // this.props.onclick(this.state.row, this.state.column, value)

        const elems = document.querySelectorAll(".markstable__selected-cell")
        if (elems!==null)
            elems.forEach(item=>item.classList.remove("markstable__selected-cell"))

        if (userID > 0) {
            // instanceAxios().post(MARKS_URL + '/add', JSON.stringify(data))
            axios2('post', `${API_URL}timetable/add${tid?'/'+tid:''}`, JSON.stringify(data))
                .then(response => {
                    ISCONSOLE && console.log('UPDATE_TIMETABLE', response.data)
                    // dispatch({type: 'UPDATE_STUDENTS_REMOTE', payload: response.data})
                })
                .catch(response => {
                    ISCONSOLE && console.log("UPDATE_TIMETABLE_ERROR", response);
                    // dispatch({type: 'UPDATE_STUDENTS_FAILED', payload: response.data})
                })
        }
    }

    getMarkBlank=(cellID)=>{
        // alert(cellID)
        return(<MarkBlank kind={4} onclickA={this.changeCell} parent={cellID}/>)
    }
    getTimetableHash=key=>{
        let {timetable} = this.state
        if (this.props.timetable!==undefined) {
            timetable = this.props.timetable
        }
        return timetable.has(key)?timetable.get(key):null
    }

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
        let {timetableArr} = this.state
        if (this.props.timetableArr!==undefined) {
            timetableArr = this.props.timetableArr
         }
        const arr = timetableArr.filter(item=>item.weekday===day).sort((a,b)=> {
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
                    <td className="timetable__subj_name-col">{item.subj_name}</td>
                    <td>{}</td>
                    <td>{}</td>
                    <td>{}</td>
                </tr>)}
                    else {
                    retArr.push(<tr key={key+'.1'}>
                        <td>{item.position.split('-')[0]}</td>
                        <td className="timetable__subj_name-col">{item.subj_name}</td>
                        <td>{}</td>
                        <td>{}</td>
                        <td>{}</td>
                    </tr>)
                    retArr.push(<tr key={key+'.2'}>
                    <td>{item.position.split('-')[1]}</td>
                    <td className="timetable__subj_name-col">{item.subj_name}</td>
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
    unDoneTimeTable=(classNumber, classLetter)=>{
        const {school_id} = this.props.userSetup
        if (school_id)
        axios2('get',`${API_URL}timetable/undone/${school_id}/${classNumber}/${classLetter}/${toYYYYMMDD(this.state.mainDate)}`)
            .then(res=>{
                // ToDO : Очистить тайм-тэйбл локально
                this.fillTimetable()
                this.forceUpdate()
                    })
            .catch(err=>{})
    }
    render() {
        const {classList} = this.state

        let head = []
            , cell = []
            , rows = [];

        let {subjects_list, langCode, curClass, class_letter : classLetter, token} = this.props.userSetup

        if (this.props.subjectList!==undefined&&this.props.subjectList.length)
            subjects_list = this.props.subjectList.filter(item=>item.subj_key!=="#xxxxxx")
        else
            subjects_list = subjects_list.filter(item=>item.subj_key!=="#xxxxxx")

        const mapDays = new Map()
        for (let i = 0; i < arrOfWeekDaysLocal.length; i++){
            mapDays.set(i, arrOfWeekDaysLocal[i])
        }
        const defClass = this.props.curClass!==undefined&&this.props.curClass!==null?this.props.curClass+this.props.curLetter:curClass+classLetter

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
                            const mark = this.getTimetableHash(`${subjects_list[i].subj_key.replace('#', '')}#${subjects_list[i].subj_key.replace('#', '')}#${idx - 2}`);
                            cellID = `${i}#${idx}#${subjects_list[i].subj_key.replace("#", '')}#${idx - 2}#${!(mark===null)?mark.id:0}`
                            cell.push(<td key={cellID} id={cellID} onClick={this.onClick} className={mark===null?"tableBody":"tableBody timeTableSelected"}>
                                {(mark!==null)?mark.position:null}
                                {i === (this.state.row) && idx === this.state.column ? this.getMarkBlank(cellID) : ""}
                            </td>)
                            break;
                    }
                }
                rows.push(<tr key={i} id={rowID}>{cell}</tr>)
            }

        return (
                <div>
                    <div style={{display : "flex", justifyContent : "flex-start", alignItems : "center", marginBottom : "5px"}}>
                        <div style={{display : "flex", alignItems : "center"}}>
                            <div className="h4" style={{marginRight : 5}}>Расписание для {
                                <select name="classes" disabled={true} value={defClass} onClick={this.onClassClick}>
                                    {classList.length && this.renderClasses(defClass)}
                                </select>}
                             </div>
                            <div style={{marginRight : 10}}>{`  ${"на:"}  `}</div>
                            <DatePicker
                                // showMonthYearDropdown
                                // isClearable
                                fixedHeight
                                dateFormat="dd/MM/yyyy"
                                withPortal
                                locale="ru"
                                selected={new Date(this.state.mainDate)}
                                onChange={date => this.handleDate('start', null, date)}
                                customInput={<input style={{
                                    width: "90px",
                                    textAlign: "center",
                                    backgroundColor: "#7DA8E6",
                                    color: "#fff", fontSize: "0.9em"
                                }}/>}
                            />
                        </div>
                        <div onClick={()=>this.unDoneTimeTable(this.props.curClass!==undefined&&this.props.curClass!==null?this.props.curClass:curClass, this.props.curClass!==undefined&&this.props.curClass!==null?this.props.curLetter:classLetter)} className="lockTimetable-btn">
                            {`Нажмите, чтобы сделать неактивным текущее расписание (все изменения будут создаваться в новом) для ${defClass} на ${(new Date(this.state.mainDate)).toLocaleDateString()} [Прежнее будет недоступно после ${(new Date(this.state.mainDate)).toLocaleDateString()}]`}
                        </div>
                    </div>
                    <div className={"timetableMain"}>
                        <div style={{width : "40%", marginRight: "10px"}}>
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