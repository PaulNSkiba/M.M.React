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
import { arrLangs, defLang } from '../../config/config'
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';

class AdminPageTeacher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowArray : this.props.userSetup.students,
            isMobile : this.props.userSetup.isMobile,
        }
        this.headArray = [
            {name: "№ п/п", width : "5%"} ,
            {name: "Ник", width : "150px"},
            {name: "Имя", width : "300px"},
            {name: "Email", width : "200px"},
            {name: "Скрыть", width : "30px"},
            {name: "Реальный без Email", width : "30px"},
            {name: "Примечание", width : "100%"},
        ]
        // this.onClick = this.onClick.bind(this)
        // this.onBlur = this.onBlur.bind(this)
        // this.changeState = this.changeState.bind(this)
    }
    btnLoginClassName=()=>(
        this.props.userSetup.userID > 0?"loginbtn loggedbtn":"loginbtn"
    )

    userLogin=()=>{

    }
    userLogout=()=>{
        this.props.history.push('/')
        this.props.onUserLoggingOut(this.props.userSetup.token)
    }
    userEdit=()=>{

    }
    langBlock=()=>{
        return <ReactFlagsSelect
            defaultCountry={localStorage.getItem("langCode")?localStorage.getItem("langCode"):defLang}
            placeholder={getLangByCountry(localStorage.getItem("langCode"))}
            showSelectedLabel={false}
            searchPlaceholder={this.props.userSetup.langLibrary?this.props.userSetup.langLibrary.lang:defLang}
            countries={arrLangs}
            onSelect={this.onSelectLang}
            selectedSize={14}
            optionsSize={12}
        />
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
    render() {
        let {userID, userName, isadmin, loading, showLoginLight, langLibrary} = this.props.userSetup;
        let {isMobile} = this.state
        const objBlank = {}
        return (
            <div className="AdminPage">
                <div className="navbar" style={userID===0?{"justifyContent":  "flex-end"}:{"justifyContent":  "space-between"}}>
                    <div className="navBlock">
                        <div className="navBlockEx">
                            <div className="myTitle"><h3><Link to="/">{langLibrary.siteName}</Link></h3></div>
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
                </div>
                <div className="navbar-shadow"></div>

                <div className="descrAndAnnounce">
                    <div className="descrAndAnnounceNotMobile">
                        <div className="mym-adminpageteacher-description">
                            {/*This's Teacher's admin page of User: {this.props.user.name}*/}
                            Учительская страница: {userName}
                        </div>
                    </div>
                </div>
                <div className={"mym-adminpageteacher-tableblock"}>
                    <UniversalTable head={this.headArray} rows={this.state.rowArray} createTableRows={this.createTableRows} classNameOfTD={this.classNameOfTD}
                                    btncaption={"+ Новый студент (в разработке)"}
                                    objblank={objBlank} initrows={()=>{return this.props.userSetup.students}} kind={"students"}/>
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