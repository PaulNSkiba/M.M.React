/**
 * Created by Paul on 26.01.2019.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux'
import LoginBlockLight from '../LoginBlockLight/loginblocklight'
import Menu from '../Menu/menu'
import { userLoggedOut } from '../../actions/userAuthActions'
import UniversalTable from '../UniversalTable/universaltable'
import {withRouter} from 'react-router-dom'
import '../../containers/App.css'
import './adminpageteacher.css'
import '../Menu/menu.css'
import { Link } from 'react-router-dom';
import MobileMenu from '../MobileMenu/mobilemenu'
import { instanceAxios, mapStateToProps, getLangByCountry, waitCursorBlock } from '../../js/helpers'
import { arrLangs, defLang, STUDENTS_GET_URL } from '../../config/config'
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import { MARKS_URL } from '../../config/config'
import Logo from '../../img/LogoMyMsmall.png'
import SchoolListBlock from '../SchoolListBlock/schoollistblock'

class AdminPageTeacher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowArray : this.props.userSetup.students,
            isMobile : this.props.userSetup.isMobile,
            stats : [],
            curStudent : 0,
            showList : false,
        }
        this.headArray = [
            {name: "№ п/п", width : "5%"} ,
            {name: "Ник", width : "150px"},
            {name: "Имя", width : "300px"},
            {name: "Email", width : "200px"},
            {name: "Скрыть", width : "30px"},
            {name: "Реальный без Email", width : "30px"},
            {name: "Оценок", width : "30px"},
            {name: "Другой студент...", width : "100px"},
            {name: "Привязать", width : "50px"},
            {name: "Примечание", width : "100%"},
        ]
        this.head = this.createTableHead([
            {name: "Предмет", width : "10%"} ,
            {name: "Автор", width : "10%"},
            {name: "Дата", width : "5%"},
            {name: "Начало", width : "5%"},
            {name: "Конец", width : "5%"},
            {name: "С даты", width : "5%"},
            {name: "По дату", width : "5%"},
            {name: "Оценок", width : "5%"},
        ])
        this.renderStudents=this.renderStudents.bind(this)
    }
    createTableHead=(head)=>(
        <tr id="row-1" key={"r0"}>{head.map((val, index)=><th style={{width:`${val.width}`}} key={index}>{val.name}</th>)}</tr>
    )
    // className={this.columnClassName(index)}
    columnClassName=key=> {
        return "colstat-" + key;
    }
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
        console.log("loginBlock", loading, userID)
        return <div className="logBtnsBlock">
            <div>
                {!loading&&!userID?
                    <button className={userID?"loginbtn":showLoginLight?"loginbtn mym-login-logged":"loginbtn"} onClick={this.userLogin.bind(this)}><div className="mym-app-button-with-arrow">{langLibrary.entry}<div className="mym-app-arrow-down">{!this.state.showLoginLight?'\u25BC':'\u25B2'}</div></div></button>:null}

                {showLoginLight?
                    <LoginBlockLight onLogin={this.props.onUserLogging} langLibrary={langLibrary} firehide={this.fireLoginLight.bind(this)}/>:null
                }
            </div>
            <div>
                {userID>0?<button className="logoutbtn" onClick={this.userLogout.bind(this)}><div className="mym-app-button-name">{userName}</div><div className="mym-app-button-exit">{langLibrary.exit}</div></button>:null}
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
                // this.props.onStopLoading()
            })
            .catch(response => {
                console.log(response.data);
                // this.props.onStopLoading()
            })
        return <table>{rows}</table>
    }

    classNameOfTD=(email, verified)=> {
        return email ? (verified ? "left-text verified" : "left-text verification") : "left-text"
    }
    createTableRows(rowsArr, onInputChange, withInput, row, column, classNameOfTD, checkedMap) {
        // let {row, column} = this.state
        console.log("createTableRows", row, column)
        let cell = [],
            rows = [];
        if (rowsArr) {
        for (let i = 0; i < rowsArr.length; i++) {
            cell = []
            cell.push(<th style={{"width" : "5%"}} key={"r" + (i + 1) + "c1"}>{i + 1}</th>)
            cell.push(<td className="left-text" style={{"paddingLeft": "5px", "paddingRight": "5px"}}
                          id={(i + 1) + "#2#" + rowsArr[i].id} key={"r" + (i + 1) + "c2"}
                          onClick={this.onClick}>{rowsArr[i].student_nick} {(row === (i + 1) && column === 2 && withInput) ?
                <input type="text" id={(i + 1) + "#2#" + rowsArr[i].id} className="inputEditor"
                       onChange={e=>this.onInputChange(e.target.value, rowsArr[i].id)} onKeyPress={this.onInputKeyPress}
                       defaultValue={rowsArr[i].student_nick}/> : ""}</td>) //this.isActive(i, 2, rowsArr[i].student_nick)
            cell.push(<td className="left-text" style={{"paddingLeft": "5px", "paddingRight": "5px"}}
                          id={(i + 1) + "#3#" + rowsArr[i].id} key={"r" + (i + 1) + "c3"}
                          onClick={this.onClick}>{rowsArr[i].student_name} {(row === (i + 1) && column === 3 && withInput) ?
                <input type="text" id={(i + 1) + "#3#" + rowsArr[i].id} className="inputEditor"
                       onChange={e=>this.onInputChange(e.target.value, rowsArr[i].id)}
                       onKeyPress={this.onInputKeyPress}
                       onBlur={this.onBlur}
                       defaultValue={rowsArr[i].student_name}/> : ""}</td>)
            cell.push(<td
                className={classNameOfTD(!(rowsArr[i].email === null), !(rowsArr[i].email_verified_at === null))}
                style={{"paddingLeft": "5px", "paddingRight": "5px", "fontSize": "0.8em"}}
                id={(i + 1) + "#4#" + rowsArr[i].id} key={"r" + (i + 1) + "c4"}
                onBlur={this.onBlur}
                onClick={this.onClick}>{rowsArr[i].email}{(row === (i + 1) && column === 4 && withInput) ?
                <input type="text" id={(i + 1) + "#4#" + rowsArr[i].id} className="inputEditor"
                       onChange={e=>this.onInputChange(e.target.value, rowsArr[i].id)}
                       onKeyPress={this.onInputKeyPress}
                       onBlur={this.onBlur}
                       defaultValue={rowsArr[i].email}/>
                : null}
            </td>)
            // Галочка скрыть студента из списка
            cell.push(<td className="center-text" id={(i + 1) + "#6#" + rowsArr[i].id} key={"r" + (i + 1) + "c6"}>
                <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#6_1#" + rowsArr[i].id}
                       checked={checkedMap.has((i + 1) + "#6_1#" + rowsArr[i].id)}/>
            </td>)
            // Реальный без Email
            cell.push(<td className="center-text" id={(i + 1) + "#7#" + rowsArr[i].id} key={"r" + (i + 1) + "c7"}>
                <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#7_1#" + rowsArr[i].id}
                       checked={checkedMap.has((i + 1) + "#7_1#" + rowsArr[i].id)}/>
            </td>)
            // Оценок
            cell.push(<td className="center-text" id={(i + 1) + "#8#" + rowsArr[i].id} key={"r" + (i + 1) + "c8"}>
                {rowsArr[i].marks_count}
            </td>)
            // Выбрать
            cell.push(<td className="center-text" id={(i + 1) + "#9#" + rowsArr[i].id} key={"r" + (i + 1) + "c9"}>
                <select name="students" defaultValue={-1} onClick={this.onSelectStudent}>
                    <option key={"key"} value={'-1#-1'}>
                        { ""}
                    </option>
                    {
                        rowsArr.map((value, key)=>{
                        // console.log("students", value)
                        if (value.id!==rowsArr[i].id&&value.email!==null&&value.email.length)
                            return      <option key={key} value={rowsArr[i].id+'#'+value.id}>
                                            { value.student_name + `[${value.student_nick}]` }
                                        </option>})}
                </select>
            </td>)
            // Привязать данные к пользователю
            cell.push(<td className="center-text" id={(i + 1) + "#10#" + rowsArr[i].id} key={"r" + (i + 1) + "c10"}>
                <button key={"btn"+rowsArr[i].id} onClick={this.onResetStudent}>Привязать</button>
            </td>)
            // Примечание
            cell.push(<td className="left-text"
                          style={{"paddingLeft": "5px", "paddingRight": "5px", "fontSize": "0.8em"}}
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

    renderStudents=(myID)=>
        this.state.rowsArr.map((value, key)=>{
        if (value.id!==myID&&value.email.length)
        return    <option key={key} value={value.id}>
                { value.student_name }
            </option>})

    onResetStudent(studentFrom, studentTo) {

    }
    onSelectStudent=(e, id)=>{
        if (this.props.userSetup.isadmin=1) {

            this.setState({curStudent: id})
            const student_from = e.target.value.split("#")[0], student_to = e.target.value.split("#")[1]

            console.log("onStudentClick", e.target.value, student_from, student_to, STUDENTS_GET_URL + `/change/${student_from}/${student_to}`)
            // return
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
    render() {
        let {userID, userName, isadmin, loading, showLoginLight, langLibrary} = this.props.userSetup;
        let {isMobile} = this.state
        console.log("RENDER_TEACHER")
        const objBlank = {}
        return (
            <div className="AdminPage">
                <div className="navbar" style={userID===0?{"justifyContent":  "flex-end"}:{"justifyContent":  "space-between"}}>
                    <div className="navBlock">
                        <div className="navBlock">
                            <div style={{"display": "flex", "justifyContent" : "space-between", "alignItems" : "center"}}>
                                <Link to="/"><img src={Logo} alt={"My.Marks"}/></Link>
                                <div className="myTitle"><h3><Link to="/">{langLibrary.siteName}</Link></h3></div>
                            </div>
                        </div>
                    </div>
                    <div className="navBlockEx">
                        {isMobile?
                            <MobileMenu userID={userID} userName={userName} isadmin={isadmin} withtomain={this.props.withtomain} userLogin={this.userLogin.bind(this)} userLogout={this.userLogout.bind(this)}/>:
                            userID>0 && <Menu className="menuTop" userid={userID} isadmin={isadmin}/>
                        }
                        {/*{(window.location.href.slice(-3)==="/r3"&&userID===0)?*/}
                        {/*this.fireUserV3Login(window.location.href):""}*/}
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
                            <div>Учительская страница: {userName}</div>
                            <div className={"addToSchool"} onClick={()=>{this.setState({showList:!this.state.showList})}}>Присоединиться к учебному заведению</div>
                        </div>
                    </div>
                    {this.state.showList?<SchoolListBlock/>:null}
                </div>
                <div className={"mym-adminpageteacher-tableblock"}>
                    <UniversalTable head={this.headArray} rows={this.state.rowArray} createTableRows={this.createTableRows} classNameOfTD={this.classNameOfTD}
                                    btncaption={"+ Новый студент (в разработке)"}
                                    onstudentclick={this.onSelectStudent}
                                    selectedstudent={this.state.curStudent}
                                    objblank={objBlank} initrows={()=>{return this.props.userSetup.students}} kind={"students"}/>
                </div>
                <div className="mym-adminpageteacher-tableblock">
                    <div className="h4">Статистика</div>
                    <table>
                        <thead>
                        {this.head}
                        </thead>
                        <tbody>
                        {this.state.stats.map((item, i)=>(
                            <tr key={"tr"+i}>
                                <td>{item.subj_name_ua}</td>
                                <td>{item.name}</td>
                                <td>{item.ondate}</td>
                                <td>{(new Date(item.create_min)).toLocaleTimeString()}</td>
                                <td>{(new Date(item.create_max)).toLocaleTimeString()}</td>
                                <td>{(new Date(item.min_date)).toLocaleDateString()}</td>
                                <td>{(new Date(item.max_date)).toLocaleDateString()}</td>
                                <td>{item.mark_cnt}</td>
                            </tr>))}
                        </tbody>
                    </table>
                </div>
             </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return ({
        onInitState: () => dispatch([]),
        onUserLoggingOut  : token => dispatch(userLoggedOut(token)),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminPageTeacher))