/**
 * Created by Paul on 26.01.2019.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux'
import LoginBlockLight from '../LoginBlockLight/loginblocklight'
import Menu from '../Menu/menu'
import MenuEx from '../MenuEx/menuex'
import { userLoggedOut } from '../../actions/userAuthActions'
import UniversalTable from '../UniversalTable/universaltable'
import {withRouter} from 'react-router-dom'
import '../../containers/App.css'
import './adminpageteacher.css'
import '../Menu/menu.css'
import { Link } from 'react-router-dom';
import MobileMenu from '../MobileMenu/mobilemenu'
import { instanceAxios, mapStateToProps, getLangByCountry, getSubjFieldName } from '../../js/helpers'
import { arrLangs, defLang, STUDENTS_GET_URL } from '../../config/config'
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import { MARKS_URL } from '../../config/config'
import Logo from '../../img/LogoMyMsmall.png'
import SchoolListBlock from '../SchoolListBlock/schoollistblock'
import Timetable from '../Timetable/timetable'
import Tabs from 'react-responsive-tabs';
import 'react-responsive-tabs/styles.css';

class AdminPageTeacher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowArray : this.props.userSetup.students,
            isMobile : this.props.userSetup.isMobile,
            stats : [],
            curStudent : 0,
            studentTo : 0,
            showList : false,
        }
        this.headArray = [
            {name: "№ п/п", width : "30px"} ,
            {name: "Ник", width : "100px"},
            {name: "Имя", width : "150px"},
            {name: "Email", width : "200px"},
            {name: "Скрыть", width : "25px", isvert: true},
            {name: "Реал без email", width : "40px"},
            {name: "Оценок", width : "40px", isvert: true},
            {name: "Переброс оценок на другого", width : "80px"},
            {name: "Заменить", width : "25px", isvert: true},
            {name: "Админ", width : "25px", isvert: true},
            {name: "Учитель", width : "25px", isvert: true},
            {name: "Ученик", width : "25px", isvert: true},
            {name: "Родком", width : "25px", isvert: true},
            {name: "Подп-ка", width : "25px", isvert: true},
            {name: "Перевод", width : "25px", isvert: true},
            {name: "Адм-ция", width : "25px", isvert: true},
            {name: "Партнер", width : "25px", isvert: true},
            {name: "Примечание", width : "150px"},
        ]
        this.headStat = [
            {name: "Предмет", width : "150px"} ,
            {name: "Автор", width : "150px"},
            {name: "Дата заполнения", width : "100px"},
            {name: "Начало", width : "100px"},
            {name: "Конец", width : "100px"},
            {name: "Оценки с даты ", width : "100px"},
            {name: "Оценки по дату", width : "100px"},
            {name: "Оценок", width : "40px"},
        ]
        this.renderStudents=this.renderStudents.bind(this)
        this.onResetStudent=this.onResetStudent.bind(this)
        this.tabs = [{ name: 'Список учеников', memo: 'Список учеников', id : 0 },
            { name: 'Расписание', memo: 'Расписание', id : 1 },
            { name: 'Статистика', memo: 'Статистика', id : 2 },
            { name: `Школа${this.props.userSetup.school_id?"":"[присоединиться]"}`, memo: 'Школа', id : 3 },
            { name: 'Карточка класса', memo: 'Карточка класса', id : 4 }
        ];
    }

    // Админ
    // 1
    // Учитель
    // 2
    // Студент/Ученик
    // 4
    // Родком
    // 8
    // Подписчик на рассылку
    // 16
    // Переводчик
    // 32
    // Администрация
    // 64
    // Партнер
    // 128

    createTableHead=(head)=>(
        <tr id="row-1" key={"r0"}>{head.map((val, index)=><th style={{width:`${val.width}`}} key={index}>{val.name}</th>)}</tr>
    )
    // className={this.columnClassName(index)}
    // columnClassName=key=> {
    //     return "colstat-" + key;
    // }
    btnLoginClassName=()=>(
        this.props.userSetup.userID > 0?"loginbtn loggedbtn":"loginbtn"
    )
    componentDidMount(){
        (async()=>{
           await this.getStats()
        })()
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
            .then(response => {
                this.setState({
                    stats: response.data,
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
    // onResetStudent=()=>{
    //
    // }
    createTableRows(rowsArr, onInputChange, withInput, row, column, classNameOfTD, checkedMap, updateIDfrom, updateIDto) {
        const {isadmin} = this.props.userSetup
        // console.log("createStudentTableRows", rowsArr)
        let cell = [], rows = [], checked = false
        if (rowsArr) {
        for (let i = 0; i < rowsArr.length; i++) {
            cell = []
            cell.push(<th style={{paddingLeft: "2px", paddingRight: "2px", minWidth : "30px", maxWidth : "30px", width : "30px", fontSize : "0.8em", backgroundColor : rowsArr[i].inList===1?"rgba(64, 155, 230, 0.25)":"fff"}} key={"r" + (i + 1) + "c1"}>{i + 1}</th>)
            cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", minWidth : "100px", maxWidth : "100px", width : "100px", fontSize : "0.8em"}}
                          id={(i + 1) + "#2#" + rowsArr[i].id} key={"r" + (i + 1) + "c2"}
                          onClick={this.onClick}>{rowsArr[i].student_nick} {(row === (i + 1) && column === 2 && withInput) ?
                <input type="text" id={(i + 1) + "#2#" + rowsArr[i].id} className="inputEditor"
                       onChange={e=>this.onInputChange(e.target.value, rowsArr[i].id)} onKeyPress={this.onInputKeyPress}
                       defaultValue={rowsArr[i].student_nick}/> : ""}</td>) //this.isActive(i, 2, rowsArr[i].student_nick)
            cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", minWidth : "150px", maxWidth : "150px", width : "150px", fontSize : "0.8em"}}
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
                style={{paddingLeft: "2px", paddingRight: "2px", minWidth : "200px", maxWidth : "200px", width : "200px", "fontSize": "0.8em"}}
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
            cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", minWidth : "25px", maxWidth : "25px", width : "25px", fontSize: "0.8em", textAlign : "center"}} id={(i + 1) + "#6#" + rowsArr[i].id} key={"r" + (i + 1) + "c6"}>
                <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#6_1#" + rowsArr[i].id}
                       checked={checkedMap.has((i + 1) + "#6_1#" + rowsArr[i].id)}/>
            </td>)
            // Реальный без Email
            cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", minWidth : "40px", maxWidth : "40px", width : "40px", fontSize: "0.8em", textAlign : "center"}} id={(i + 1) + "#7#" + rowsArr[i].id} key={"r" + (i + 1) + "c7"}>
                <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#7_1#" + rowsArr[i].id}
                       checked={checkedMap.has((i + 1) + "#7_1#" + rowsArr[i].id)}/>
            </td>)
            // Оценок
            cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", minWidth : "40px", maxWidth : "40px", width : "40px", fontSize: "0.8em", textAlign : "center"}} id={(i + 1) + "#8#" + rowsArr[i].id} key={"r" + (i + 1) + "c8"}>
                {rowsArr[i].marks_count}
            </td>)
            // Другой студент
            cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", minWidth : "80px", maxWidth : "80px", width : "80px", "fontSize": "0.8em", textAlign : "center"}} id={(i + 1) + "#9#" + rowsArr[i].id} key={"r" + (i + 1) + "c9"}>
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
            cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", minWidth : "25px", maxWidth : "25px", width : "25px", fontSize: "0.8em", textAlign : "center"}}  id={(i + 1) + "#10#" + rowsArr[i].id} key={"r" + (i + 1) + "c10.1"}>
                {/*<input type="button" onChange={this.changeStudent} id={(i + 1) + "#11#" + rowsArr[i].id}*/}
                       {/*disabled="disabled" checked={checkedMap.has((i + 1) + "#11#" + rowsArr[i].id)}/>*/}
                {Number(updateIDfrom)===Number(rowsArr[i].id)?<div className={"changeStudentButton"} key={"btn"+rowsArr[i].id} onClick={()=>this.onResetStudent(updateIDfrom, updateIDto)}>{">>"}</div>:null}
            </td>)
            // Админ
            checked = checkedMap.has((i + 1) + "#11#" + rowsArr[i].id)&&((checkedMap.get((i + 1) + "#11#" + rowsArr[i].id)&1) === 1)
            cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", minWidth : "25px", maxWidth : "25px", width : "25px", fontSize: "0.8em", textAlign : "center"}}  id={(i + 1) + "#11#" + rowsArr[i].id} key={"r" + (i + 1) + "c10"}>
                <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#11#" + rowsArr[i].id}
                       disabled="disabled"
                       checked={checked}/>
                {/*<button key={"btn"+rowsArr[i].id} onClick={this.onResetStudent}>Привязать</button>*/}
            </td>)
            // Учитель
            checked = checkedMap.has((i + 1) + "#12#" + rowsArr[i].id)&&((checkedMap.get((i + 1) + "#12#" + rowsArr[i].id)&2) === 2)
            cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", minWidth : "25px", maxWidth : "25px", width : "25px", fontSize: "0.8em", textAlign : "center"}}  id={(i + 1) + "#12#" + rowsArr[i].id} key={"r" + (i + 1) + "c11"}>
                <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#12#" + rowsArr[i].id}
                       disabled={isadmin!==1}
                       checked={checked}/>
            </td>)
            // Ученик
            checked = checkedMap.has((i + 1) + "#13#" + rowsArr[i].id)&&((checkedMap.get((i + 1) + "#13#" + rowsArr[i].id)&4) === 4)
            cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", minWidth : "25px", maxWidth : "25px", width : "25px", fontSize: "0.8em", textAlign : "center"}}  id={(i + 1) + "#13#" + rowsArr[i].id} key={"r" + (i + 1) + "c12"}>
                <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#13#" + rowsArr[i].id}
                       checked={checked}/>
            </td>)
            // Родком
            checked = checkedMap.has((i + 1) + "#14#" + rowsArr[i].id)&&((checkedMap.get((i + 1) + "#14#" + rowsArr[i].id)&8) === 8)
            cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", minWidth : "25px", maxWidth : "25px", width : "25px", fontSize: "0.8em", textAlign : "center"}}  id={(i + 1) + "#14#" + rowsArr[i].id} key={"r" + (i + 1) + "c13"}>
                <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#14#" + rowsArr[i].id}
                       checked={checked}/>
            </td>)
            // Подписка
            checked = checkedMap.has((i + 1) + "#15#" + rowsArr[i].id)&&((checkedMap.get((i + 1) + "#15#" + rowsArr[i].id)&16) === 16)
            cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", minWidth : "25px", maxWidth : "25px", width : "25px", fontSize: "0.8em", textAlign : "center"}}  id={(i + 1) + "#15#" + rowsArr[i].id} key={"r" + (i + 1) + "c14"}>
                <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#15#" + rowsArr[i].id}
                       checked={checked}/>
            </td>)
            // Перевод
            checked = checkedMap.has((i + 1) + "#16#" + rowsArr[i].id)&&((checkedMap.get((i + 1) + "#16#" + rowsArr[i].id)&32) === 32)
            cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", minWidth : "25px", maxWidth : "25px", width : "25px", fontSize: "0.8em", textAlign : "center"}}  id={(i + 1) + "#16#" + rowsArr[i].id} key={"r" + (i + 1) + "c15"}>
                <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#16#" + rowsArr[i].id}
                       checked={checked}/>
            </td>)
            // Админ-ция
            checked = checkedMap.has((i + 1) + "#17#" + rowsArr[i].id)&&((checkedMap.get((i + 1) + "#17#" + rowsArr[i].id)&64) === 64)
            cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", minWidth : "25px", maxWidth : "25px", width : "25px", fontSize: "0.8em", textAlign : "center"}}  id={(i + 1) + "#17#" + rowsArr[i].id} key={"r" + (i + 1) + "c16"}>
                <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#17#" + rowsArr[i].id}
                       checked={checked}/>
            </td>)
            // Партнер
            checked = checkedMap.has((i + 1) + "#18#" + rowsArr[i].id)&&((checkedMap.get((i + 1) + "#18#" + rowsArr[i].id)&128) === 128)
            cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", minWidth : "25px", maxWidth : "25px", width : "25px", fontSize: "0.8em", textAlign : "center"}}  id={(i + 1) + "#18#" + rowsArr[i].id} key={"r" + (i + 1) + "c17"}>
                <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#18#" + rowsArr[i].id}
                       checked={checked}/>
            </td>)
            // Примечание
            cell.push(<td className="left-text"
                          style={{width : "150px", paddingLeft: "2px", minWidth : "150px", maxWidth : "150px", paddingRight: "2px", fontSize: "0.8em", textAlign : "center"}}
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
                cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", minWidth : "150px", maxWidth : "150px", width : "150px", fontSize : "0.8em"}}
                              id={(i + 1) + "#2#" + rowsArr[i].id}
                              key={"r" + (i + 1) + "c2"}>
                                {rowsArr[i][getSubjFieldName(langCode)]}
                        </td>)
                cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", minWidth : "150px", maxWidth : "150px", width : "150px", fontSize : "0.8em"}}
                              id={(i + 1) + "#3#" + rowsArr[i].id}
                              key={"r" + (i + 1) + "c3"}>
                                {rowsArr[i].name}
                        </td>)
                cell.push(<td
                              style={{backgroundColor : isNewDate?"rgba(64, 155, 230, 0.25)":"#fff", fontWeight : isNewDate?"800":"200", paddingLeft: "2px", paddingRight: "2px", textAlign: isNewDate?"center":"right", minWidth : "100px", maxWidth : "100px", width : "100px", fontSize: "0.8em"}}
                              id={(i + 1) + "#4#" + rowsArr[i].id}
                              key={"r" + (i + 1) + "c4"}>
                                {`${rowsArr[i].ondate}  `}
                        </td>)
                cell.push(<td
                                style={{paddingLeft: "2px", paddingRight: "2px", textAlign: "center", minWidth : "100px", maxWidth : "100px", width : "100px", "fontSize": "0.8em"}}
                                id={(i + 1) + "#5#" + rowsArr[i].id}
                                key={"r" + (i + 1) + "c5"}>
                                {(new Date(rowsArr[i].create_min)).toLocaleTimeString()}
                </td>)
                cell.push(<td
                                style={{paddingLeft: "2px", paddingRight: "2px", textAlign: "center", minWidth : "100px", maxWidth : "100px", width : "100px", "fontSize": "0.8em"}}
                                id={(i + 1) + "#6#" + rowsArr[i].id}
                                key={"r" + (i + 1) + "c6"}>
                                {(new Date(rowsArr[i].create_max)).toLocaleTimeString()}
                </td>)
                cell.push(<td
                                style={{paddingLeft: "2px", paddingRight: "2px", textAlign: "center", minWidth : "100px", maxWidth : "100px", width : "100px", "fontSize": "0.8em"}}
                                id={(i + 1) + "#7#" + rowsArr[i].id}
                                key={"r" + (i + 1) + "c7"}>
                    {(new Date(rowsArr[i].min_date)).toLocaleDateString()}
                </td>)
                cell.push(<td
                                style={{paddingLeft: "2px", paddingRight: "2px", textAlign: "center", minWidth : "100px", maxWidth : "100px", width : "100px", "fontSize": "0.8em"}}
                                id={(i + 1) + "#8#" + rowsArr[i].id}
                                key={"r" + (i + 1) + "c8"}>
                    {(new Date(rowsArr[i].max_date)).toLocaleDateString()}
                </td>)
                cell.push(<td
                    style={{paddingLeft: "2px", paddingRight: "2px", textAlign: "right", minWidth : "40px", maxWidth : "40px", width : "40px", fontSize: "0.8em"}}
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
    getTabs=()=>{
        let {userID, userName, isadmin, langLibrary, classID, classNumber, school_name, class_letter, school_id} = this.props.userSetup;
        let {isMobile} = this.state
        // console.log("RENDER_TEACHER", this.state.curStudent)
        const objBlank = {
            class_id: classID,
            class_number: classNumber,
            datein: null,
            email: null,
            id: 0,
            inList: 1,
            isRealName: null,
            isadmin: null,
            isout: 0,
            marks_count: null,
            memo: null,
            photo: null,
            rowno: null,
            school_id: null,
            student_name: "<Заполните имя>",
            student_nick: "<Заполните ник>",
            subuser_id: null,
            user_id: userID,
            uniqid : localStorage.getItem("langCode") ? localStorage.getItem("langCode") : defLang,
        }
        return this.tabs.map((item, key) => ({
            title: item.name,
            getContent: () => {
                switch (item.id) {
                    case 0 :
                        return                 <div className={"mym-adminpageteacher-tableblock"}>
                            <UniversalTable head={this.headArray}
                                            rows={this.state.rowArray}
                                            createTableRows={this.createTableRows}
                                            classNameOfTD={this.classNameOfTD}
                                            btncaption={"+ Новый студент"}
                                            onstudentclick={this.onSelectStudent}
                                            selectedstudent={this.state.curStudent}
                                            objblank={objBlank}
                                            initrows={()=>{return this.props.userSetup.students}}
                                            kind={"students"}
                                            updatestudentfrom={this.state.curStudent}
                                            updatestudentto={this.state.studentTo}
                                            studentTo={this.state.studentTo}
                                            onresetstudent={this.onResetStudent}
                            />
                        </div>
                    case 1 :
                        return (<div className="mym-adminpageteacher-tableblock">
                            <Timetable/>
                        </div>)
                    case 2 :
                        return                 <div className="mym-adminpageteacher-tableblock">
                            {/*<div className="h4">Статистика</div>*/}
                            <UniversalTable head={this.headStat}
                                            rows={this.state.stats}
                                            createTableRows={this.createStatTableRows}
                                            classNameOfTD={this.classNameOfTD}
                                            btncaption={""}
                                            onstudentclick={null}
                                            selectedstudent={null}
                                            objblank={null}
                                            initrows={()=>{return this.state.stats}}
                                            kind={""}/>
                        </div>
                    case 3 :
                        return <SchoolListBlock/>
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
    render() {
        let {userID, userName, isadmin, langLibrary, classID, classNumber, school_name, class_letter, school_id} = this.props.userSetup;
        let {isMobile} = this.state
        // console.log("RENDER_TEACHER", this.state.curStudent)
        const objBlank = {
            class_id: classID,
            class_number: classNumber,
            datein: null,
            email: null,
            id: 0,
            inList: 1,
            isRealName: null,
            isadmin: null,
            isout: 0,
            marks_count: null,
            memo: null,
            photo: null,
            rowno: null,
            school_id: null,
            student_name: "<Заполните имя>",
            student_nick: "<Заполните ник>",
            subuser_id: null,
            user_id: userID,
            uniqid : localStorage.getItem("langCode") ? localStorage.getItem("langCode") : defLang,
        }
            // console.log("RENDER:adminteacher", this.props.userSetup)
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
                            {/*<div>Учительская страница: {userName}</div>*/}
                            {school_id?<div style={{margin : "10px", fontWeight: 700, fontSize : ".8em", color : "#4472C4"}}>{`${school_name.charAt(0).toUpperCase()}${school_name.slice(1)} [${classNumber}"${class_letter}"]`}</div>:null}
                            {/*{school_id?*/}
                                    {/*<div className={"addToSchool"} onClick={()=>{this.setState({showList:!this.state.showList})}}>*/}
                                        {/*Детали*/}
                                    {/*</div>*/}

                                {/*:   <div className={"addToSchool"} onClick={()=>{this.setState({showList:!this.state.showList})}}>*/}
                                        {/*Присоединиться к учебному заведению*/}
                                    {/*</div>}*/}
                        </div>
                    </div>
                    {/*{this.state.showList?<SchoolListBlock/>:null}*/}
                </div>

                <div style={{marginTop : "10px"}}>
                    <Tabs items={this.getTabs()} />
                </div>

                {/*<div className={"mym-adminpageteacher-tableblock"}>*/}
                    {/*<UniversalTable head={this.headArray}*/}
                                    {/*rows={this.state.rowArray}*/}
                                    {/*createTableRows={this.createTableRows}*/}
                                    {/*classNameOfTD={this.classNameOfTD}*/}
                                    {/*btncaption={"+ Новый студент"}*/}
                                    {/*onstudentclick={this.onSelectStudent}*/}
                                    {/*selectedstudent={this.state.curStudent}*/}
                                    {/*objblank={objBlank}*/}
                                    {/*initrows={()=>{return this.props.userSetup.students}}*/}
                                    {/*kind={"students"}*/}
                                    {/*updatestudentfrom={this.state.curStudent}*/}
                                    {/*updatestudentto={this.state.studentTo}*/}
                                    {/*studentTo={this.state.studentTo}*/}
                                    {/*onresetstudent={this.onResetStudent}*/}
                    {/*/>*/}
                {/*</div>*/}
                {/*<div className="mym-adminpageteacher-tableblock">*/}
                    {/*<Timetable/>*/}
                {/*</div>*/}
                {/*<div className="mym-adminpageteacher-tableblock">*/}
                    {/*<div className="h4">Статистика</div>*/}
                    {/*<UniversalTable head={this.headStat}*/}
                                    {/*rows={this.state.stats}*/}
                                    {/*createTableRows={this.createStatTableRows}*/}
                                    {/*classNameOfTD={this.classNameOfTD}*/}
                                    {/*btncaption={""}*/}
                                    {/*onstudentclick={null}*/}
                                    {/*selectedstudent={null}*/}
                                    {/*objblank={null}*/}
                                    {/*initrows={()=>{return this.state.stats}}*/}
                                    {/*kind={""}/>*/}
                {/*</div>*/}
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
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminPageTeacher))