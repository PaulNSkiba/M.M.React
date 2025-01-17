/**
 * Created by Paul on 16.12.2019.
 */
/**
 * Created by Paul on 26.01.2019.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux'
import LoginBlockLight from '../LoginBlockLight/loginblocklight'
import MenuEx from '../MenuEx/menuex'
import { userLoggedOut } from '../../actions/userAuthActions'
import UniversalTable from '../UniversalTable/universaltable'
import {withRouter} from 'react-router-dom'
import '../../containers/App.css'
import './adminpageschool.css'
import '../Menu/menu.css'
import { Link } from 'react-router-dom';
import MobileMenu from '../MobileMenu/mobilemenu'
import { instanceAxios, mapStateToProps, getLangByCountry, getSubjFieldName,
        classLetters, axios2, getNearestSeptFirst, toYYYYMMDD, dateFromYYYYMMDD } from '../../js/helpers'
import { arrLangs, defLang, STUDENTS_GET_URL, API_URL } from '../../config/config'
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import { MARKS_URL } from '../../config/config'
import Logo from '../../img/LogoMyMsmall.png'
import SchoolListBlock from '../SchoolListBlock/schoollistblock'
import Timetable from '../Timetable/timetable'
import Tabs from 'react-responsive-tabs';
import 'react-responsive-tabs/styles.css';
import '../AdminPageTeacher/adminpageteacher.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NoticeTable from '../NoticeTable/noticetable'

const tabs = [{ name: 'Статистика', memo: 'Статистика', id : 0 },
    { name: 'Расписание', memo: 'Расписание', id : 1 },
    { name: 'Объявления', memo: 'Объявления', id : 2 },
    { name: 'Чат', memo: 'Чат', id : 3 },
    { name: 'Карточка школы', memo: 'Карточка школы', id : 4 }
];
// const schoolClasses = [ {number: 6, letter : "Б", users : 21, students : 21},
//                         {number: 7, letter : "Г", users : 40, students : 30}
//                         ]

class AdminPageSchool extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowArray : this.props.userSetup.students,
            isMobile : this.props.userSetup.isMobile,
            stats : [],
            curStudent : 0,
            studentTo : 0,
            showList : false,
            selectedColumn : null,
            statData : [],
            mpClasses : new Map(),
            mpSubjects : new Map(),
            curYear : "2020",
            dBase : getNearestSeptFirst(),
            dStart : getNearestSeptFirst(),
            dEnd : new Date(),
            curFigure : null,
            curLetter : null,
            curClassID : null,
            curSubjectList : [],
            timetable : new Map(),
            timetableArr : [],
            mainDate : dateFromYYYYMMDD(`${(new Date()).getFullYear()}${(new Date()).getMonth()>=7?"09":"01"}01`),
        }
        // this.headArray = [
        //     {name: "№ п/п", width : "30px"} ,
        //     {name: "Ник", width : "120px"},
        //     {name: "Имя", width : "200px"},
        //     {name: "Email", width : "250px"},
        //     {name: "Скрыть", width : "25px", isvert: true},
        //     {name: "Реал без email", width : "40px"},
        //     {name: "Оценок", width : "40px", isvert: true},
        //     {name: "Переброс оценок на другого", width : "80px"},
        //     {name: "Замена", width : "25px", isvert: true},
        //     {name: "Админ", width : "25px", isvert: true},
        //     {name: "Учитель", width : "25px", isvert: true},
        //     {name: "Ученик", width : "25px", isvert: true},
        //     {name: "Родком", width : "25px", isvert: true},
        //     {name: "Подп-ка", width : "25px", isvert: true},
        //     {name: "Перевод", width : "25px", isvert: true},
        //     {name: "Адм-ция", width : "25px", isvert: true},
        //     {name: "Партнер", width : "25px", isvert: true},
        //     {name: "Примечание", width : "200px"},
        // ]
        // this.headStat = [
        //     {name: "Предмет", width : "150px"} ,
        //     {name: "Автор", width : "150px"},
        //     {name: "Дата заполнения", width : "100px"},
        //     {name: "Начало", width : "100px"},
        //     {name: "Конец", width : "100px"},
        //     {name: "Оценки с даты ", width : "100px"},
        //     {name: "Оценки по дату", width : "100px"},
        //     {name: "Оценок", width : "40px"},
        // ]
        // this.head = this.createTableHead([
        //     {name: "Предмет", width : "10%"} ,
        //     {name: "Автор", width : "10%"},
        //     {name: "Дата", width : "5%"},
        //     {name: "Начало", width : "5%"},
        //     {name: "Конец", width : "5%"},
        //     {name: "С даты", width : "5%"},
        //     {name: "По дату", width : "5%"},
        //     {name: "Оценок", width : "5%"},
        // ])
        this.renderStudents=this.renderStudents.bind(this)
        this.onResetStudent=this.onResetStudent.bind(this)
        this.getStatData = this.getStatData.bind(this)
    }
    // Админ : 1
    // Учитель : 2
    // Студент/Ученик : 4
    // Родком : 8
    // Подписчик на рассылку : 16
    // Переводчик : 32
    // Администрация : 64
    // Партнер : 128

    createTableHead=(head)=>(
        <tr id="row-1" key={"r0"}>{head.map((val, index)=><th style={{width:`${val.width}`}} key={index}>{val.name}</th>)}</tr>
    )
    btnLoginClassName=()=>(
        this.props.userSetup.userID > 0?"loginbtn loggedbtn":"loginbtn"
    )
    componentDidMount(){
        (async()=>{
            await this.getStats()
            const   base = (new Date(this.state.dBase)),
                    start = (new Date(this.state.dStart)),
                    end = (new Date(this.state.dEnd))
            await this.getStatData(base, start, end)
        })()
    }
    getStatData=(dBase, dStart, dEnd)=>{
        const {school_id} = this.props.userSetup
        const   base = toYYYYMMDD(new Date(dBase)),
                start = toYYYYMMDD(new Date(dStart)),
                end = toYYYYMMDD(new Date(dEnd))
        axios2('get',`${API_URL}school/stat/${school_id}/${base}/${start}/${end}`)
            .then(res => {
                // console.log("SCHOOL_STAT", res)
                let mpClasses = new Map();
                res.data.forEach((item)=>mpClasses.set(item.id, item.class_number + item.class_letter))
                let mpSubjects = new Map();
                res.data.forEach((item)=>mpSubjects.set(item.subj_id, item.subj_name_ua))
                this.setState({
                    statData: res.data,
                    mpClasses,
                    mpSubjects,
                })
            })
            .catch(res => {
                console.log(res.data);
            })
    }
    userLogin=()=>{

    }
    userLogout=()=>{
        this.props.history.push('/')
        this.props.onUserLoggingOut(this.props.userSetup.token, this.props.userSetup.langLibrary)
    }
    userEdit=()=>{

    }
    langBlock=()=>{
        return <div style={{"width" : "80px"}}><ReactFlagsSelect
            defaultCountry={localStorage.getItem("langCode")?localStorage.getItem("langCode"):defLang}
            placeholder={getLangByCountry(localStorage.getItem("langCode"))}
            showSelectedLabel={false}
            searchPlaceholder={this.props.userSetup.langLibrary?this.props.userSetup.langLibrary.lang:defLang}
            countries={arrLangs}
            onSelect={this.onSelectLang}
            selectedSize={14}
            optionsSize={12}/>
        </div>
    }
    loginBlock=(userID, userName, langLibrary)=>{
        let {loading} = this.props.userSetup
        let {showLoginLight} = this.state
        // console.log("loginBlock", loading, userID)
        return <div className="logBtnsBlock">
            <div>
                {!loading&&!userID?
                    <button className={userID?"loginbtn":showLoginLight?"loginbtn mym-login-logged":"loginbtn"} onClick={this.userLogin.bind(this)}><div className="mym-app-button-with-arrow">{langLibrary.entry}<div className="mym-app-arrow-down">{!this.state.showLoginLight?'\u25BC':'\u25B2'}</div></div></button>:null}

                {showLoginLight?
                    <LoginBlockLight onLogin={this.props.onUserLogging} langLibrary={langLibrary} firehide={this.fireLoginLight.bind(this)}/>:null
                }
            </div>
            <div>
                {userID>0?<button className="logoutbtn" onClick={this.userLogout.bind(this)}><div className={userName.length>10?"mym-app-button-name-small":"mym-app-button-name"}>{userName}</div><div className="mym-app-button-exit">{langLibrary.exit}</div></button>:null}
            </div>
            {this.langBlock()}
        </div>
    }
    getStats=()=>{
        const {classID} = this.props.userSetup
        let rows = ''
        // console.log('query', MARKS_URL + '/statsteacher/' + classID)
        instanceAxios().get(MARKS_URL + '/statsteacher/' + classID)
            .then(res => {

                this.setState({
                    stats: res.data,
                })
            })
            .catch(response => {
                console.log(response.data);
            })
        return <table>{rows}</table>
    }

    classNameOfTD=(email, verified)=> {
        return email ? (verified ? "left-text verified flexTD" : "left-text verification flexTD") : "left-text flexTD"
    }
    createTableRows(rowsArr, onInputChange, withInput, row, column, classNameOfTD, checkedMap, updateIDfrom, updateIDto) {
        // let {row, column} = this.state
        console.log("createStudentTableRows", rowsArr, updateIDfrom, updateIDto)
        let cell = [],
            rows = [];
        if (rowsArr) {
            for (let i = 0; i < rowsArr.length; i++) {
                cell = []
                cell.push(<th style={{paddingLeft: "2px", paddingRight: "2px", width : "30px", fontSize : "0.8em", backgroundColor : rowsArr[i].inList===1?"rgba(64, 155, 230, 0.25)":"fff"}} key={"r" + (i + 1) + "c1"}>{i + 1}</th>)
                cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", width : "120px", fontSize : "0.8em"}}
                              id={(i + 1) + "#2#" + rowsArr[i].id} key={"r" + (i + 1) + "c2"}
                              onClick={this.onClick}>{rowsArr[i].student_nick} {(row === (i + 1) && column === 2 && withInput) ?
                    <input type="text" id={(i + 1) + "#2#" + rowsArr[i].id} className="inputEditor"
                           onChange={e=>this.onInputChange(e.target.value, rowsArr[i].id)} onKeyPress={this.onInputKeyPress}
                           defaultValue={rowsArr[i].student_nick}/> : ""}</td>) //this.isActive(i, 2, rowsArr[i].student_nick)
                cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", width : "200px", fontSize : "0.8em"}}
                              id={(i + 1) + "#3#" + rowsArr[i].id} key={"r" + (i + 1) + "c3"}
                              onClick={this.onClick}>{rowsArr[i].student_name} {(row === (i + 1) && column === 3 && withInput) ?
                    <input type="text" id={(i + 1) + "#3#" + rowsArr[i].id} className="inputEditor"
                           onChange={e=>this.onInputChange(e.target.value, rowsArr[i].id)}
                           onKeyPress={this.onInputKeyPress}
                           onBlur={this.onBlur}
                           defaultValue={rowsArr[i].student_name}/> :
                    null}</td>)
                cell.push(<td
                    className={classNameOfTD(!(rowsArr[i].email === null), !(rowsArr[i].email_verified_at === null))}
                    style={{paddingLeft: "2px", paddingRight: "2px", width : "250px", "fontSize": "0.8em"}}
                    id={(i + 1) + "#4#" + rowsArr[i].id} key={"r" + (i + 1) + "c4"}
                    onBlur={this.onBlur}
                    onClick={this.onClick}>{rowsArr[i].email}{(row === (i + 1) && column === 4 && withInput) ?
                    <input type="text" id={(i + 1) + "#4#" + rowsArr[i].id} className="inputEditor"
                           onChange={e=>this.onInputChange(e.target.value, rowsArr[i].id)}
                           onKeyPress={this.onInputKeyPress}
                           onBlur={this.onBlur}
                           defaultValue={rowsArr[i].email}/>
                    : false&&rowsArr[i].subuser_id===null&&rowsArr[i].email!==null&&rowsArr[i].email.length?<div className={"addUserButton"} onClick={()=>this.onUserCreate(this.props.userSetup.classID, rowsArr[i].id, rowsArr[i].email, rowsArr[i].student_name===null?rowsArr[i].student_nick:rowsArr[i].student_name)}>+Новый Логин</div>:null}
                </td>)
                // Галочка скрыть студента из списка
                cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", width : "25px", fontSize: "0.8em", textAlign : "center"}} id={(i + 1) + "#6#" + rowsArr[i].id} key={"r" + (i + 1) + "c6"}>
                    <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#6_1#" + rowsArr[i].id}
                           checked={checkedMap.has((i + 1) + "#6_1#" + rowsArr[i].id)}/>
                </td>)
                // Реальный без Email
                cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", width : "40px", fontSize: "0.8em", textAlign : "center"}} id={(i + 1) + "#7#" + rowsArr[i].id} key={"r" + (i + 1) + "c7"}>
                    <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#7_1#" + rowsArr[i].id}
                           checked={checkedMap.has((i + 1) + "#7_1#" + rowsArr[i].id)}/>
                </td>)
                // Оценок
                cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", width : "40px", fontSize: "0.8em", textAlign : "center"}} id={(i + 1) + "#8#" + rowsArr[i].id} key={"r" + (i + 1) + "c8"}>
                    {rowsArr[i].marks_count}
                </td>)
                // Другой студент
                cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", width : "80px", "fontSize": "0.8em", textAlign : "center"}} id={(i + 1) + "#9#" + rowsArr[i].id} key={"r" + (i + 1) + "c9"}>
                    <select name="students" style={{width : "80px"}} defaultValue={-1} onClick={this.onSelectStudent}>
                        <option key={"key"} value={'-1#-1'}>
                            {""}
                        </option>
                        {
                            rowsArr.map((value, key)=>{
                                if (value.id!==rowsArr[i].id&&value.email!==null&&value.email.length)
                                    return      <option key={key} value={rowsArr[i].id+'#'+value.id}>
                                        { value.student_name + `[${value.student_nick}]` }
                                    </option>})
                        }
                    </select>
                </td>)
                // Замена
                cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", width : "25px", fontSize: "0.8em", textAlign : "center"}}  id={(i + 1) + "#10#" + rowsArr[i].id} key={"r" + (i + 1) + "c10.1"}>
                    {/*<input type="button" onChange={this.changeStudent} id={(i + 1) + "#11#" + rowsArr[i].id}*/}
                    {/*disabled="disabled" checked={checkedMap.has((i + 1) + "#11#" + rowsArr[i].id)}/>*/}
                    {Number(updateIDfrom)===Number(rowsArr[i].id)?<div className={"changeStudentButton"} key={"btn"+rowsArr[i].id} onClick={()=>this.onResetStudent(updateIDfrom, updateIDto)}>{">>"}</div>:null}
                </td>)
                // Админ
                cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", width : "25px", fontSize: "0.8em", textAlign : "center"}}  id={(i + 1) + "#11#" + rowsArr[i].id} key={"r" + (i + 1) + "c10"}>
                    <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#11#" + rowsArr[i].id}
                           disabled="disabled" checked={checkedMap.has((i + 1) + "#11#" + rowsArr[i].id)}/>
                    {/*<button key={"btn"+rowsArr[i].id} onClick={this.onResetStudent}>Привязать</button>*/}
                </td>)
                // Учитель
                cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", width : "25px", fontSize: "0.8em", textAlign : "center"}}  id={(i + 1) + "#12#" + rowsArr[i].id} key={"r" + (i + 1) + "c11"}>
                    <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#12#" + rowsArr[i].id}
                           disabled="disabled" checked={checkedMap.has((i + 1) + "#12#" + rowsArr[i].id)}/>
                </td>)
                // Ученик
                cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", width : "25px", fontSize: "0.8em", textAlign : "center"}}  id={(i + 1) + "#13#" + rowsArr[i].id} key={"r" + (i + 1) + "c12"}>
                    <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#13#" + rowsArr[i].id}
                           disabled="disabled" checked={checkedMap.has((i + 1) + "#13#" + rowsArr[i].id)}/>
                </td>)
                // Родком
                cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", width : "25px", fontSize: "0.8em", textAlign : "center"}}  id={(i + 1) + "#14#" + rowsArr[i].id} key={"r" + (i + 1) + "c13"}>
                    <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#14#" + rowsArr[i].id}
                           disabled="disabled" checked={checkedMap.has((i + 1) + "#14#" + rowsArr[i].id)}/>
                </td>)
                // Подписка
                cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", width : "25px", fontSize: "0.8em", textAlign : "center"}}  id={(i + 1) + "#15#" + rowsArr[i].id} key={"r" + (i + 1) + "c14"}>
                    <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#15#" + rowsArr[i].id}
                           disabled="disabled" checked={checkedMap.has((i + 1) + "#15#" + rowsArr[i].id)}/>
                </td>)
                // Перевод
                cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", width : "25px", fontSize: "0.8em", textAlign : "center"}}  id={(i + 1) + "#16#" + rowsArr[i].id} key={"r" + (i + 1) + "c15"}>
                    <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#16#" + rowsArr[i].id}
                           disabled="disabled" checked={checkedMap.has((i + 1) + "#16#" + rowsArr[i].id)}/>
                </td>)
                // Админ-ция
                cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", width : "25px", fontSize: "0.8em", textAlign : "center"}}  id={(i + 1) + "#17#" + rowsArr[i].id} key={"r" + (i + 1) + "c16"}>
                    <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#17#" + rowsArr[i].id}
                           disabled="disabled" checked={checkedMap.has((i + 1) + "#17#" + rowsArr[i].id)}/>
                </td>)
                // Партнер
                cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", width : "25px", fontSize: "0.8em", textAlign : "center"}}  id={(i + 1) + "#18#" + rowsArr[i].id} key={"r" + (i + 1) + "c17"}>
                    <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#18#" + rowsArr[i].id}
                           disabled="disabled" checked={checkedMap.has((i + 1) + "#18#" + rowsArr[i].id)}/>
                </td>)
                // Примечание
                cell.push(<td className="left-text"
                              style={{width : "200px", paddingLeft: "2px", paddingRight: "2px", fontSize: "0.8em", textAlign : "center"}}
                              id={(i + 1) + "#5#" + rowsArr[i].id} key={"r" + (i + 1) + "c5"}
                              onClick={this.onClick}>{rowsArr[i].memo}{(row === (i + 1) && column === 5 && withInput) ?
                    <input type="text" id={(i + 1) + "#5#" + rowsArr[i].id} className="inputEditor"
                           onChange={e=>this.onInputChange(e.target.value, rowsArr[i].id)} onKeyPress={this.onInputKeyPress}
                           defaultValue={rowsArr[i].memo}/> : ""}</td>)
                rows.push(<tr key={i}>{cell}</tr>)
            }
        }
        return rows;
    }

    createStatTableRows(rowsArr, onInputChange, withInput, row, column, classNameOfTD, checkedMap) {
        // console.log("createStatTableRows", row, column, rowsArr)
        const {langCode} = this.props.userSetup

        let cell = [],
            rows = [],
            mp = new Map(),
            isNewDate = false
        if (rowsArr) {
            for (let i = 0; i < rowsArr.length; i++) {
                cell = []
                isNewDate = !mp.has(rowsArr[i].ondate)
                mp.set(rowsArr[i].ondate, true)
                cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", width : "150px", fontSize : "0.8em"}}
                              id={(i + 1) + "#2#" + rowsArr[i].id}
                              key={"r" + (i + 1) + "c2"}>
                    {rowsArr[i][getSubjFieldName(langCode)]}
                </td>)
                cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", width : "150px", fontSize : "0.8em"}}
                              id={(i + 1) + "#3#" + rowsArr[i].id}
                              key={"r" + (i + 1) + "c3"}>
                    {rowsArr[i].name}
                </td>)
                cell.push(<td
                    style={{backgroundColor : isNewDate?"rgba(64, 155, 230, 0.25)":"#fff", fontWeight : isNewDate?"800":"200", paddingLeft: "2px", paddingRight: "2px", textAlign: isNewDate?"center":"right", width : "100px", fontSize: "0.8em"}}
                    id={(i + 1) + "#4#" + rowsArr[i].id}
                    key={"r" + (i + 1) + "c4"}>
                    {`${rowsArr[i].ondate}  `}
                </td>)
                cell.push(<td
                    style={{paddingLeft: "2px", paddingRight: "2px", textAlign: "center", width : "100px", "fontSize": "0.8em"}}
                    id={(i + 1) + "#5#" + rowsArr[i].id}
                    key={"r" + (i + 1) + "c5"}>
                    {(new Date(rowsArr[i].create_min)).toLocaleTimeString()}
                </td>)
                cell.push(<td
                    style={{paddingLeft: "2px", paddingRight: "2px", textAlign: "center", width : "100px", "fontSize": "0.8em"}}
                    id={(i + 1) + "#6#" + rowsArr[i].id}
                    key={"r" + (i + 1) + "c6"}>
                    {(new Date(rowsArr[i].create_max)).toLocaleTimeString()}
                </td>)
                cell.push(<td
                    style={{paddingLeft: "2px", paddingRight: "2px", textAlign: "center", width : "100px", "fontSize": "0.8em"}}
                    id={(i + 1) + "#7#" + rowsArr[i].id}
                    key={"r" + (i + 1) + "c7"}>
                    {(new Date(rowsArr[i].min_date)).toLocaleDateString()}
                </td>)
                cell.push(<td
                    style={{paddingLeft: "2px", paddingRight: "2px", textAlign: "center", width : "100px", "fontSize": "0.8em"}}
                    id={(i + 1) + "#8#" + rowsArr[i].id}
                    key={"r" + (i + 1) + "c8"}>
                    {(new Date(rowsArr[i].max_date)).toLocaleDateString()}
                </td>)
                cell.push(<td
                    style={{paddingLeft: "2px", paddingRight: "2px", textAlign: "right", width : "40px", fontSize: "0.8em"}}
                    id={(i + 1) + "#9#" + rowsArr[i].id}
                    key={"r" + (i + 1) + "c9"}>
                    {rowsArr[i].mark_cnt}
                </td>)
                rows.push(<tr key={i}>{cell}</tr>)
            }
        }
        return rows;
    }
    renderStudents=(myID)=>
        this.state.rowsArr.map((value, key)=>{
            if (value.id!==myID&&value.email.length)
                return    <option key={key} value={value.id}>
                    { value.student_name }
                </option>})

    onResetStudent(studentFrom, studentTo) {
        this.setState({curStudent : -1, studentTo : -1})
        console.log("onResetStudent", studentFrom, studentTo)
        // return
        if (Number(studentFrom)>0&&Number(studentTo)>0) {
            instanceAxios().get(STUDENTS_GET_URL + `/change/${studentFrom}/${studentTo}`)
                .then(response => {
                    console.log("onChangeStudent", response.data)
                    // this.props.onStopLoading()
                })
                .catch(response => {
                    console.log("onChangeStudent:Error", response.data);
                    // this.props.onStopLoading()
                })
            this.forceUpdate()
        }

    }
    onSelectStudent=(e, id)=>{
        const {isadmin} = this.props.userSetup
        if (isadmin===1  || isadmin===2) {

            const student_from = e.target.value.split("#")[0], student_to = e.target.value.split("#")[1]
            this.setState({curStudent: Number(student_from), studentTo : student_to})
            console.log("onStudentClick", id, e.target.value, student_from, student_to, STUDENTS_GET_URL + `/change/${student_from}/${student_to}`)
            this.forceUpdate()
            return
            if (Number(student_from)>0&&Number(student_to)>0) {
                instanceAxios().get(STUDENTS_GET_URL + `/change/${student_from}/${student_to}`)
                    .then(response => {
                        console.log(response.data)
                        // this.props.onStopLoading()
                    })
                    .catch(response => {
                        console.log(response.data);
                        // this.props.onStopLoading()
                    })

                this.forceUpdate()
            }

        }
    }
    selectCols=col=>{
        this.setState({selectedColumn : this.state.selectedColumn===col?null:col})
    }
    getClassBlockHeader=()=>{
        let cell = []
        cell.push(<th key={"th0.0"}><div className={`pageschool-headerbutton ${this.state.selectedColumn===0?"activeCol":""}`} onClick={()=>this.selectCols(0)}>Буква / Класс</div></th>)
        for (let j = 1; j < 12; j++){
            cell.push(<th key={"th"+j}><div className={`pageschool-headerbutton ${this.state.selectedColumn===0 ||this.state.selectedColumn===j?"activeCol":""}`} onClick={()=>this.selectCols(j)}>{j}</div></th>)
        }
        return <tr>{cell}</tr>
    }
    onClassClick=(curFigure, curLetter, curClassID)=>{
        const {curLetter : L, curFigure : F} = this.state
        if (F===curFigure&&L===curLetter){
            curFigure=curLetter=null
        }
        this.getSubjectsList(curFigure===null?-1:curFigure)
        this.fillTimetable(curFigure, curLetter)
        this.setState({curFigure, curLetter, curClassID})
        console.log("onClassClick", curFigure, curLetter)
    }
    getSubjectsList=async classNumber=>{
        await axios2('get', `${API_URL}subjects/${classNumber}`)
            .then(res=>{
                // console.log("subjects_list", res)
                this.setState({curSubjectList : res.data})
            })
            .catch(err=>console.log("getSubjectsList"))
    }
    fillTimetable=(curFigure, curLetter)=>{
        const {langCode, school_id} = this.props.userSetup
        // const {curFigure, curLetter} = this.state
        // console.log("fillTimetable", this.state)
        // console.log("TIME", encodeURI(`${API_URL}timetable/getbyschool/${school_id}/${curFigure}/${curLetter}/${toYYYYMMDD(this.state.mainDate)}`))

        //axios2('get', `${API_URL}timetable/getex/${classID}/${toYYYYMMDD(this.state.mainDate)}`)
        axios2('get', encodeURI(`${API_URL}timetable/getbyschool/${school_id}/${curFigure}/${curLetter}/${toYYYYMMDD(this.state.mainDate)}`))
            .then(res=>{
                // let markKey = subj_key.replace("#","")+"#"+subj_key.replace("#","")+"#"+ondate
                // let {timetable} = this.state
                let timetable = new Map()
                res.data = res.data.filter(item=>item!==null)
                res.data.forEach(item=>{
                    let key = `${item.subj_key.replace("#","")}#${item.subj_key.replace("#","")}#${item.weekday}`
                    timetable.set(key, item)
                })
                res.data = res.data.map(item=>{item.subj_name=item[getSubjFieldName(langCode)]; return item})
                this.setState({timetable, timetableArr : res.data})
            })
            .catch(res=>{
                console.log("fillTimetable:error")
            })
    }
    getClassBlock=()=>{
        const {schoolclasses : schoolClasses} = this.props.userSetup
        const {curLetter, curFigure} = this.state
        // console.log("curState", curLetter, curFigure, schoolClasses)
        let rows = [], cell
           for (let i = 0; i < classLetters.length; i++){
               cell = []
               for (let j = 0; j < 12; j++){
                   switch (j) {
                       case 0 :
                           cell.push(<td key={"td"+i+'.'+j}><div  className={`pageschool-classbutton`}>{classLetters[i]}</div></td>)
                           break;
                       default :
                           let curClass = schoolClasses.filter(item=>item.letter===classLetters[i]&&item.number===j).length?schoolClasses.filter(item=>item.letter===classLetters[i]&&item.number===j)[0]:{class_id : -1}
                           cell.push(<td key={"td"+i+'.'+j}>
                               <div onClick={()=>this.onClassClick(j, classLetters[i], curClass.class_id)} className={`pageschool-classbutton ${curFigure===j&&curLetter===classLetters[i]?" selectedClass ": ""} ${schoolClasses.filter(item=>item.letter===classLetters[i]&&item.number===j).length?` enabled ${this.state.selectedColumn===0 ||this.state.selectedColumn===j?"activeCol":""}`:" disabled"}`}>
                                   <div className={`pageschool-classbutton-leftcorner ${this.state.selectedColumn===0 ||this.state.selectedColumn===j?"activeCol":''}`}>{curClass.class_id>=0?(curClass.students?curClass.students:null):null}</div>
                                   <div className={`pageschool-classbutton-rightcorner ${this.state.selectedColumn===0 ||this.state.selectedColumn===j?"activeCol":''}`}>{curClass.class_id>=0?(curClass.users?curClass.users:null):null}</div>
                                   <div className={`pageschool-classbutton-letfcorner-bottom ${this.state.selectedColumn===0 ||this.state.selectedColumn===j?"activeCol":''}`}>{curClass.class_id>=0?(curClass.timetable?'расп':null):null}</div>
                                   {`${j}${classLetters[i]}`}
                               </div>
                           </td>)
                           break;
                   }
                }
           rows.push(<tr key={"tr"+i}>{cell}</tr>)
       }
       return rows
    }
    handleYear = async year => {
        // const arr = await this.prepPaymentsHeaderAndRowArray(this.state.planIns, year)
        // console.log("changeYear", year, arr)
        this.setState({curYear: year})
    }
    handleDate = (type, date) => {
        const {dBase, dStart, dEnd} = this.state
        if (type==='start') {
            this.setState({dStart: date})
            this.getStatData(dBase, date, dEnd);
        }
        else {
            this.setState({dEnd: date})
            this.getStatData(dBase, dStart, date);
        }
    };
    getTabs=()=>{
        const {curLetter, curFigure, timetable, timetableArr, curSubjectList} = this.state
        const yearArr = (() => {
            let arr = [];
            const curYear = (new Date()).getFullYear()
            for (let i = 0; i < 25; i++) {
                arr.push(curYear - 10 + i)
            }
            return arr
        })()
        return tabs.map((item, key) => ({
            title: item.name,
            getContent: () => {
                switch (item.id) {
                    case 0 :
                        return <div>
                                <div style={{marginBottom : "10px", display: "flex", width : "400px", paddingRight : "40px", justifyContent : "space-around"}}>
                                    <div>
                                        <select name="days" onClick={(e) => this.handleYear(e.target.value)}
                                                defaultValue={this.state.curYear}>
                                            {yearArr.map((item, key) => {
                                                return <option key={key}>
                                                    {item}
                                                </option>
                                            })}
                                        </select>
                                    </div>
                                    <div>
                                        <DatePicker
                                            // showMonthYearDropdown
                                            // isClearable
                                            fixedHeight
                                            dateFormat="dd/MM/yyyy"
                                            withPortal
                                            locale="ru"
                                            scrollableYearDropdown
                                            showYearDropdown
                                            selected={this.state.dStart === null?getNearestSeptFirst():this.state.dStart}
                                            onChange={date => this.handleDate('start', date)}
                                            customInput={<input style={{
                                                width: "80px",
                                                textAlign: "left",
                                                backgroundColor: "#7DA8E6",
                                                color: "#fff", fontSize: "0.9em"
                                            }}/>}
                                        />
                                    </div>
                                    <div>
                                        <DatePicker
                                            // showMonthYearDropdown
                                            // isClearable
                                            fixedHeight
                                            dateFormat="dd/MM/yyyy"
                                            withPortal
                                            locale="ru"
                                            scrollableYearDropdown
                                            showYearDropdown
                                            selected={this.state.dEnd === null?new Date():this.state.dEnd}
                                            onChange={date => this.handleDate('end', date)}
                                            customInput={<input style={{
                                                width: "80px",
                                                textAlign: "left",
                                                backgroundColor: "#7DA8E6",
                                                color: "#fff", fontSize: "0.9em"
                                            }}/>}
                                        />
                                    </div>
                                </div>
                                {this.getStatTable()}
                                </div>
                            case 1 :
                        return (<div className="mym-adminpageteacher-tableblock">
                            <Timetable curClass={curFigure}
                                       curLetter={curLetter}
                                       subjectList={curSubjectList}
                                       timetable={timetable}
                                       timetableArr={timetableArr}
                            />
                        </div>)
                    case 2 :
                                return (
                                    <div className="mym-adminpageteacher-tableblock">
                                        <NoticeTable
                                            selectedColumn={this.state.selectedColumn}
                                            curFigure={this.state.curFigure}
                                            curLetter={this.state.curLetter}
                                            curClass={this.state.curClassID}
                                        />
                                    </div>
                        )
                     default :
                        break;
                }
                },
            /* Optional parameters */
            key: key,
            tabClassName: 'tab',
            panelClassName: 'panel',
        }));
    }
    getStatTable=()=>{
        // const {mpClasses} = this.state
        // console.log("mpClasses", mpClasses)
        // return <div style={{margin: "auto", width: "100%", height : "400px", overflowX : "scroll"}}>
        //     <div id="header" style={{display : "flex", position : "relative"}}>
        //         <div style={{width : "120px", minWidth : "120px", maxWidth : "120px",
        //             height : "90px", minHeight : "90px", maxHeight : "90px", border : ".5px", borderStyle : "solid", borderColor : "#6d6d6d"}}>
        //             <table style={{width : "120px", minWidth : "120px", maxWidth : "120px",
        //                 height : "90px", minHeight : "90px", maxHeight : "90px", overflow : "hidden", border : 0}}>
        //                 <th rowSpan={3} style={{width : "120px", minWidth : "120px", maxWidth : "120px",
        //                     height : "90px", minHeight : "90px", maxHeight : "90px", border : 0}}>Предметы</th>
        //             </table>
        //         </div>
        //         <div style={{width : "100%", minWidth : "100%", maxWidth : "100%", boxSizing : "content-box"}}>
        //             <table style={{overflowX : "scroll"}}>
        //                 <thead>
        //                 {Array.from(mpClasses.values()).map((item,key)=>{
        //                     return <th key={"th"+key} style={{width : "430px"}}>
        //                         <tr style={{height : "30px", minHeight : "30px", maxHeight : "30px"}}>
        //                             <td key={"th0"+key} colSpan={9}>{item}</td>
        //                         </tr>
        //                         <tr style={{height : "30px", minHeight : "30px", maxHeight : "30px"}}>
        //                             <td key={"th1"+key} colSpan={3} style={{width : "150px"}}>{"Ср. оценка"}</td>
        //                             <td key={"th2"+key} colSpan={3} style={{width : "150px"}}>{"Кол-во оценок"}</td>
        //                             <td key={"th3"+key} colSpan={2} style={{width : "130px"}}>{"Дата"}</td>
        //                         </tr>
        //                         <tr style={{height : "30px", minHeight : "30px", maxHeight : "30px"}}>
        //                             <td style={{width : "50px"}}>{"Нач"}</td>
        //                             <td style={{width : "50px"}}>{"За период"}</td>
        //                             <td style={{width : "50px"}}>{"Кон"}</td>
        //                             <td style={{width : "50px"}}>{"Нач"}</td>
        //                             <td style={{width : "50px"}}>{"За период"}</td>
        //                             <td style={{width : "50px"}}>{"Кон"}</td>
        //                             <td style={{width : "80px"}}>{"Ввода"}</td>
        //                             <td style={{width : "50px"}}>{"Назад"}</td>
        //                         </tr>
        //                     </th>
        //                 })}
        //                 </thead>
        //             </table>
        //         </div>
        //     </div>
        // </div>

        return <div style={{margin: "auto", width: "100%", height : "400px"}}>
            <div style={{position: "relative", overflow: "hidden"}}>
                <table style={{height : "400px"}}>
                    <thead>
                        {this.getStatBlockHeader()}
                    </thead>
                    <tbody>
                        {this.getStatBlock()}
                    </tbody>
                </table>
            </div>
        </div>
    }
    getStatBlockHeader=()=>{
        // "id": 42,
        //     "class_number": 7,
        //     "class_letter": "Г",
        //     "subj_name_ua": "Хімія",
        //     "subj_id": 27,
        //     "avg_start": 7.11,
        //     "avg_in": 7.69,
        //     "avg_end": 7.49,
        //     "avg_start_cnt": "188",
        //     "avg_in_cnt": "366",
        //     "avg_end_cnt": "554",
        //     "mark_date": "2019-11-22",
        //     "daydiff": -62

        const {mpClasses, selectedColumn} = this.state

        // ToDo : Сделаем таблицу для левой колонки и шапки. Первая ячейка будет зафиксирована как отдельная таблица?
        return <tr style={{ color : "#565656", backgroundColor: "#D3D3D3", height : "90px", minHeight : "90px", maxHeight : "90px", position : "sticky", top : "0px"}}>
            <th style={{color : "#fff", backgroundColor: "#565656", width : "120px", position : "sticky", minWidth: "120px", maxWidth: "120px", left: "0px", zIndex : "2"}}>Предмет</th>

            {Array.from(mpClasses.values()).filter(itemLetter=>selectedColumn===null?true:selectedColumn===0?true:Number(itemLetter.length===2?itemLetter[0]:itemLetter[0]+itemLetter[1])===selectedColumn).map((item,key)=>{

                return <th key={"th"+key} style={{width : "430px"}}>
                    <tr style={{height : "30px", minHeight : "30px", maxHeight : "30px"}}>
                        <td key={"th0"+key} colSpan={9}>{item}</td>
                    </tr>
                    <tr style={{height : "30px", minHeight : "30px", maxHeight : "30px"}}>
                        <td key={"th1"+key} colSpan={3} style={{width : "150px"}}>{"Ср. оценка"}</td>
                        <td key={"th2"+key} colSpan={3} style={{width : "150px"}}>{"Кол-во оценок"}</td>
                        <td key={"th3"+key} colSpan={2} style={{width : "130px"}}>{"Дата"}</td>
                    </tr>
                    <tr style={{height : "30px", minHeight : "30px", maxHeight : "30px"}}>
                        <td style={{width : "50px"}}>{"Нач"}</td>
                        <td style={{width : "50px"}}>{"За период"}</td>
                        <td style={{width : "50px"}}>{"Кон"}</td>
                        <td style={{width : "50px"}}>{"Нач"}</td>
                        <td style={{width : "50px"}}>{"За период"}</td>
                        <td style={{width : "50px"}}>{"Кон"}</td>
                        <td style={{width : "80px"}}>{"Ввода"}</td>
                        <td style={{width : "50px"}}>{"Назад"}</td>
                    </tr>
                </th>
            })}
        </tr>
        // </thead>

    }
    getStatBlock=()=>{
        let {statData} = this.state
        // "id": 42,
        //     "class_number": 7,
        //     "class_letter": "Г",
        //     "subj_name_ua": "Хімія",
        //     "subj_id": 27,
        //     "avg_start": 7.11,
        //     "avg_in": 7.69,
        //     "avg_end": 7.49,
        //     "avg_start_cnt": "188",
        //     "avg_in_cnt": "366",
        //     "avg_end_cnt": "554",
        //     "mark_date": "2019-11-22",
        //     "daydiff": -62

         const {mpClasses, mpSubjects, selectedColumn} = this.state
         const subjects = Array.from(mpSubjects.keys())
         const classes = Array.from(mpClasses.keys()).filter(itemLetter=>selectedColumn===null?true:selectedColumn===0?true:Number(mpClasses.get(itemLetter).length===2?mpClasses.get(itemLetter)[0]:mpClasses.get(itemLetter)[0]+mpClasses.get(itemLetter)[1])===selectedColumn)
         const statDataFiltered = statData.filter(item=>classes.filter(itemClass=>itemClass===item.id).length)
         const subjectsFiltered = subjects.filter(itemSubj=>statDataFiltered.filter(item=>item.subj_id===itemSubj).length)

        // console.log("subjects2", subjects, statData)
                return subjectsFiltered.map((itemSubj,keySubj)=> {
                    return <tr key={"trsubj"+keySubj} style={{position : "relative"}}>
                        <th className={"pageschool-stickycol"} style={{color : "#fff", backgroundColor: "#565656", zIndex : "2"}}>{mpSubjects.get(itemSubj)}</th>
                        {Array.from(mpClasses.keys()).filter(itemLetter=>selectedColumn===null?true:selectedColumn===0?true:Number(mpClasses.get(itemLetter).length===2?mpClasses.get(itemLetter)[0]:mpClasses.get(itemLetter)[0]+mpClasses.get(itemLetter)[1])===selectedColumn).map((itemClass, keyClass)=>{
                            // console.log("ARRAY", statData, itemClass, itemSubj)
                            let arr = statData.filter(item=>item.subj_id===itemSubj&&item.id===itemClass)
                            let ret = []
                            if (arr.length) {
                                let i = 0
                                ret.push(<td style={{width: i !== 6 ? "50px" : "80px", height: "30px",
                                    minWidth: i !== 6 ? "50px" : "80px",
                                    maxWidth: i !== 6 ? "50px" : "80px"}}>{arr[0].avg_start}</td>)
                                 i = 1
                                ret.push(<td style={{width: i !== 6 ? "50px" : "80px", height: "30px",
                                    minWidth: i !== 6 ? "50px" : "80px",
                                    maxWidth: i !== 6 ? "50px" : "80px"}}>{arr[0].avg_in}</td>)
                                 i = 2
                                ret.push(<td style={{width: i !== 6 ? "50px" : "80px", height: "30px",
                                    minWidth: i !== 6 ? "50px" : "80px",
                                    maxWidth: i !== 6 ? "50px" : "80px",
                                    backgroundColor : arr[0].avg_start===null?"#fff":arr[0].avg_start===arr[0].avg_end?"#fff":Number(arr[0].avg_start) > Number(arr[0].avg_end)?"#FF8594":"#C6EFCE"}}>{arr[0].avg_end}</td>)
                                 i = 3
                                ret.push(<td style={{width: i !== 6 ? "50px" : "80px", height: "30px",
                                    minWidth: i !== 6 ? "50px" : "80px",
                                    maxWidth: i !== 6 ? "50px" : "80px"}}>{arr[0].avg_start_cnt}</td>)
                                 i = 4
                                ret.push(<td style={{width: i !== 6 ? "50px" : "80px", height: "30px",
                                    minWidth: i !== 6 ? "50px" : "80px",
                                    maxWidth: i !== 6 ? "50px" : "80px"}}>{arr[0].avg_in_cnt}</td>)
                                 i = 5
                                ret.push(<td style={{width: i !== 6 ? "50px" : "80px", height: "30px",
                                    minWidth: i !== 6 ? "50px" : "80px",
                                    maxWidth: i !== 6 ? "50px" : "80px"}}>{arr[0].avg_end_cnt}</td>)
                                 i = 6
                                ret.push(<td style={{width: i !== 6 ? "50px" : "80px", height: "30px",
                                    minWidth: i !== 6 ? "50px" : "80px",
                                    maxWidth: i !== 6 ? "50px" : "80px"}}>{new Date(arr[0].mark_date).toLocaleDateString()}</td>)
                                 i = 7
                                ret.push(<td style={{width: i !== 6 ? "50px" : "80px", height: "30px",
                                    minWidth: i !== 6 ? "50px" : "80px",
                                    maxWidth: i !== 6 ? "50px" : "80px"}}>{Math.abs(arr[0].daydiff)}</td>)

                                 //     "avg_start_cnt": "188",
                                //     "avg_in_cnt": "366",
                                //     "avg_end_cnt": "554",
                                //     "mark_date": "2019-11-22",
                                //     "daydiff": -62
                            }
                            else {
                                for (let i = 0; i < 8; i++) {
                                    ret.push(<td style={{
                                        width: i !== 6 ? "50px" : "80px",
                                        height: "30px",
                                        minWidth: i !== 6 ? "50px" : "80px",
                                        maxWidth: i !== 6 ? "50px" : "80px"
                                    }}></td>)
                                }
                            }
                            return <th><tr style={{width : "430px"}}>{ret}</tr></th>
                        })
                        }
                    </tr>
                })
        // })
    }
    render() {
        let {userID, userName, isadmin, langLibrary, school_id, school_name} = this.props.userSetup;
        let {isMobile} = this.state
        console.log("RENDER_SCHOOL", this.props.userSetup)

        return (
            <div className="AdminPage">
                <div className="navbar" style={userID===0?{"justifyContent":  "flex-end"}:{"justifyContent":  "space-between"}}>
                    <div className="navBlock">
                        <div className="navBlock">
                            <div style={{"display": "flex", "justifyContent" : "space-between", "alignItems" : "center"}}>
                                <Link
                                    onClick={()=>{
                                        this.props.onReduxUpdate("MENU_ITEM", {id : 0, label : ''});
                                        this.props.onReduxUpdate("MENU_CLICK", "")
                                    }}
                                    to="/"><img src={Logo} alt={"My.Marks"}/></Link>
                                <div className="myTitle"><h3><Link
                                    onClick={()=>{
                                        this.props.onReduxUpdate("MENU_ITEM", {id : 0, label : ''});
                                        this.props.onReduxUpdate("MENU_CLICK", "")
                                    }}
                                    to="/">{langLibrary.siteName}</Link></h3></div>
                            </div>
                        </div>
                    </div>
                    <div className="navBlockEx">
                        {isMobile?
                            <MobileMenu userID={userID} userName={userName} isadmin={isadmin} withtomain={this.props.withtomain} userLogin={this.userLogin.bind(this)} userLogout={this.userLogout.bind(this)}/>:
                            userID>0 && <MenuEx className="menuTop" userid={userID} isadmin={isadmin}/>
                        }
                        {isMobile?<div>
                            {this.state.showLoginLight||(window.location.href.slice(-2)==="/r"&&userID===0)?
                                <LoginBlockLight onLogin={this.props.onUserLogging} firehide={this.fireLoginLight.bind(this)}/>:""}

                            <div className={this.props.user.loginmsg.length?"popup show":"popup"} onClick={this.props.onClearErrorMsg}>
                                {this.props.user.loginmsg.length?<span className="popuptext" id="myPopup">{this.props.user.loginmsg}</span>:""}
                            </div>
                        </div>:""}
                        {!isMobile?this.loginBlock(userID, userName, langLibrary):null}
                    </div>
                </div>
                <div className="navbar-shadow"></div>

                <div className="descrAndAnnounce">
                    <div className="descrAndAnnounceNotMobile">
                        <div className="mym-adminpageteacher-description">
                            {/*<div>Общешкольная страница: {userName}</div>*/}
                            {school_id?<div style={{margin : "10px", fontWeight: 700, fontSize : ".8em", color : "#4472C4"}}>{`${school_name.charAt(0).toUpperCase()}${school_name.slice(1)}`}</div>:null}
                        </div>
                    </div>
                    <div style={{marginTop : "10px", marginLeft : "2%", marginRight : "2%", position : "relative"}}>
                        <table id="simple-board">
                            <thead className="tablehead">
                                {this.getClassBlockHeader()}
                            </thead>
                            <tbody>
                                {this.getClassBlock()}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div style={{marginTop : "20px"}}>
                    <Tabs items={this.getTabs()} />
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return ({
        onInitState: () => dispatch([]),
        onReduxUpdate: (key, payload) => dispatch({type: key, payload: payload}),
        onUserLoggingOut  : token => dispatch(userLoggedOut(token)),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminPageSchool))