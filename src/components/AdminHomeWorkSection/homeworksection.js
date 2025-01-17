/**
 * Created by Paul on 07.04.2019.
 */
import React, {Component} from 'react'
import {
    addDay,
    arrOfWeekDays,
    dateDiff,
    toYYYYMMDD,
    instanceAxios,
    mapStateToProps,
    getLangByCountry,
    getSubjFieldName
} from '../../js/helpers'
// import Menu from '../Menu/menu'
import MenuEx from '../MenuEx/menuex'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {userLoggedInByToken, userLoggedOut} from '../../actions/userAuthActions'
import {Link} from 'react-router-dom';
import MobileMenu from '../MobileMenu/mobilemenu'
import LoginBlockLight from '../LoginBlockLight/loginblocklight'
import edit_icon from '../../img/Edit-512s.png'
import {HOMEWORK_ADD_URL, defLang, arrLangs} from '../../config/config'
import '../../containers/App.css'
import './homeworksection.css'
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import Logo from '../../img/LogoMyMsmall.png'
// import ReactPlayer from 'react-player'

let btns = ['§', 'Стр.', '-', '№', 'Упр.', 'Зад.', 'Кнсп.']
let btnsNumb = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

class HomeWorkSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            now: new Date(),
            curDate: addDay(new Date(), 1),
            sideListLeft: true,
            selectedSubjects: this.props.userSetup.selectedSubjects,
            curSubjKey: "",
            curSubjIndex: 0,
            userId: this.props.userSetup.userID,
            homeWorkArray: this.props.userSetup.homework,
            isMobile: window.screen.width < 400,
            actualHomeWorkList: [],
            showInfo: false,
            selectedRow: 0,
            showId: 0,
            showMsg: "",
            editId: 0,

        }
    }

    componentDidMount() {
        if (!(window.localStorage.getItem("myMarks.data") === null)) {
            // let ls = JSON.parse(window.localStorage.getItem("myMarks.data"))
            // this.props.onUserLoggingByToken(ls.email, ls.token, null)
            // this.setState({homeWorkArray : this.props.userSetup.homework})
        }
        this.setState({actualHomeWorkList: this.getHomeWorkListForDate(new Date())})

    }

    dateString = () => {
        let datediff = dateDiff(this.state.now, this.state.curDate) + 2;
        let daysArr = ["Позавчера", "Вчера", "Сегодня", "Завтра", "Послезавтра"]
        Date.prototype.getWeek = function () {
            var onejan = new Date(this.getFullYear(), 0, 1);
            return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()) / 7);
        }
        // console.log(datediff);
        if (datediff >= 0 && datediff < 5)
            return "на " + daysArr[datediff].toUpperCase();
        else {
            if ((this.state.curDate.getWeek() - this.state.now.getWeek()) >= 0) {
                if (this.state.now.getWeek() === this.state.curDate.getWeek()) {
                    return "на " + arrOfWeekDays[this.state.curDate.getDay()] + ' эта неделя'
                }
                else {
                    if ((this.state.now.getWeek() + 1) === this.state.curDate.getWeek()) {
                        return "на " + arrOfWeekDays[this.state.curDate.getDay()] + ' след. неделя'
                    }
                    else {
                        return "на " + arrOfWeekDays[this.state.curDate.getDay()] + '  +' + (this.state.curDate.getWeek() - this.state.now.getWeek()) + 'нед.'
                    }
                }
            }
            else {
                return "на " + arrOfWeekDays[this.state.curDate.getDay()] + '  ' + (this.state.curDate.getWeek() - this.state.now.getWeek()) + 'нед.'
            }
        }
        // return ""
        // return "След. Вторник"
    }
    getDate = (prm) => (
        // prm ?('0'+this.state.curDate.getDate()).toString().slice(-2)+"."+('0'+(this.state.curDate.getMonth() + 1)).toString().slice(-2) +"."+this.state.curDate.getFullYear().toString().slice(-2):'['+arrOfWeekDays[this.state.curDate.getDay()]+']'
        prm ? this.state.curDate.toLocaleDateString() : '[' + arrOfWeekDays[this.state.curDate.getDay()] + ']'
    )
    changeMinusDay = () => {
        this.setState({
            curDate: addDay(this.state.curDate, -1),
            actualHomeWorkList: this.getHomeWorkListForDate(addDay(this.state.curDate, -1))
        })
        console.log("this.props.userSetup.homework", this.props.userSetup.homework)
    }
    changePlusDay = () => {
        this.setState({
            curDate: addDay(this.state.curDate, 1),
            actualHomeWorkList: this.getHomeWorkListForDate(addDay(this.state.curDate, 1))
        })
        console.log("this.props.userSetup.homework", this.props.userSetup.homework)
    }
    getHomeWorkListForDate = (onDate) => {
        let arr = []
        arr = this.props.userSetup.homework.filter((item, i) => (new Date(onDate).toLocaleDateString() === new Date(item.ondate).toLocaleDateString()))
        // console.log("getHomeWorkListForDate", arr, new Date(onDate).toLocaleDateString())
        return arr;
    }
    subjListClassName = () => (
        this.state.sideListLeft ? 'leftSideSubjList' : 'rightSideSubjList'
    )

    changeCurrentSection(e) {
        this.setState({sideListLeft: e.target.id === "leftSide"})
    }

    changePlusSubj = () => {
        let {curSubjIndex: i} = this.state
        let {selectedSubjects} = this.props.userSetup
        this.setState({curSubjIndex: ((i + 1) < selectedSubjects.length ? ++i : 0)})
        // console.log("i:", i, "length:", selectedSubjects.length)
    }
    changeMinusSubj = () => {
        let {curSubjIndex: i} = this.state
        let {selectedSubjects} = this.props.userSetup
        this.setState({curSubjIndex: ((i - 1) > 0 ? --i : selectedSubjects.length - 1)})
        // console.log("i:", i, "length:", selectedSubjects.length)
    }
    getCurSubj = () => {
        let {selectedSubjects, langCode} = this.props.userSetup
        return selectedSubjects.length ? (this.state.curSubjIndex + 1) + '.' + selectedSubjects[this.state.curSubjIndex][getSubjFieldName(langCode)] : "";
    }
    addHomeWork = () => {
        let {selectedSubjects, classID, userName, userID, studentID, langCode} = this.props.userSetup

        let {homework: homeWorkArray} = this.props.userSetup //this.state;
        let id = homeWorkArray.reduce((max, current) => (current.id > max ? current.id : max), 0) + 1;
        let subj_key = selectedSubjects[this.state.curSubjIndex].subj_key //"#biolog"
        let subj_name_ua = selectedSubjects[this.state.curSubjIndex][getSubjFieldName(langCode)]
        let ondate = this.state.curDate//new Date("2019-04-09");
        let author = userName
        let instime = new Date() //"16:10"
        instime = ('0' + instime.getHours()).slice(-2) + ':' + ('0' + instime.getMinutes()).slice(-2)
        let json = `{"id":${id}, "subj_key":"${subj_key}", "${getSubjFieldName(langCode)}": "${subj_name_ua}", "homework": "${this.homeWorkTxt.value}", "ondate": "${ondate}", "author": "${author}", "instime" : "${instime}"}`;

        json = JSON.parse(json);
        json = `{"subj_key":"${subj_key}", "${getSubjFieldName(langCode)}": "${subj_name_ua}", "homework": "${this.homeWorkTxt.value}", "ondate": "${toYYYYMMDD(ondate)}", "user_id": "${userID}", "student_id":"${studentID}"}`;

        instanceAxios().post(HOMEWORK_ADD_URL + '/' + classID + '/hw/' + this.state.editId, json)
            .then(response => {
                console.log(response.data)
                this.props.onHomeWorkChanged(response.data)
            })
            .catch(response => {
                console.log(response);
            })

        // this.setState({homeWorkArray, sideListLeft:true, actualHomeWorkList : this.getHomeWorkListForDate(this.state.curDate)});

        // console.log(homeWorkArray, json);
        // }
        // else {
        this.setState({sideListLeft: true, editId: 0})
        // }
    }
    classNameOfRowSelected = (selected) => (
        selected ? "factSubjRow selectedRow" : " factSubjRow"
    )
    editRow = (e) => {
        console.log('editRow', e.target.id)
    }
    getHomeWorkList = (onDate) => {
        let arr = this.getHomeWorkListForDate(onDate)
        const {langCode} = this.props.userSetup
        return arr.map((item, i) => (
            <div className={this.classNameOfRowSelected(Number(item.id) === Number(this.state.showId))} key={i}
                 id={item.id} onClick={this.hideInfo.bind(this)}>
                <div className="subjName">{item[getSubjFieldName(langCode)]}</div>
                <div className="subjHomeWork" id={item.id}>{item.homework}</div>
                {this.props.userSetup.userID === item.user_id &&
                <div className="imgEdit"><img id={'img' + item.id} src={true ? edit_icon : edit_icon}
                                              alt={"Редактировать"} onClick={this.editRow.bind.this}/></div>}
            </div>));
    }
    getHomeWorkByID = (id) => (
        this.props.userSetup.homework.filter((item, i) => (item.id === id))[0]
    )
    hideInfo = (e) => {
        switch (e.target.nodeName) {
            case  "DIV" :
                this.setState({
                    showInfo: !(this.state.showInfo && e.target.id === this.state.showId),
                    showId: e.target.id,
                    showMsg: this.getShowMsgByID(e.target.id)

                })
                break;
            case "IMG" :
                console.log('hideInfo', this.state, e.target.id, e.target.nodeName)
                let curHomeWork = this.getHomeWorkByID(Number(e.target.id.toString().replace('img', '')))
                this.setState({sideListLeft: false, editId: curHomeWork.id})
                console.log("IMG", e.target.id.toString().replace('img', ''), curHomeWork.id)
                break;
            // this.homeWorkTxt.focus()
            default:
                break
        }
        // console.log('hideInfo', this.state, e.target.id, e.target.nodeName)
    }
    getShowMsgByID = (id) => {
        let arr = this.props.userSetup.homework.filter((item, i) => (Number(item.id) === Number(id)))
        return arr.length ? arr[0] : []
    }
    btnClick = (e) => {
        console.log(e.target.id)
        switch (e.target.id) {
            case "btnspace" :
                this.homeWorkTxt.value = this.homeWorkTxt.value + " ";
                break;
            case "btncoma" :
                this.homeWorkTxt.value = this.homeWorkTxt.value + ", ";
                break;
            case "btnbackspace" :
                this.homeWorkTxt.value = this.homeWorkTxt.value.slice(0, -1)
                break;
            default :
                e.target.id.indexOf("keyn") === 0 ?
                    this.homeWorkTxt.value = this.homeWorkTxt.value + btnsNumb[e.target.id.toString().replace('keyn', '')]
                    :
                    e.target.id.indexOf("key") === 0 ?
                        this.homeWorkTxt.value = this.homeWorkTxt.value + btns[e.target.id.toString().replace('key', '')]
                        :
                        this.homeWorkTxt.value = this.homeWorkTxt.value + e.target.id;
                break;
        }
        this.homeWorkTxt.focus()
    }

    userLogin() {
        console.log("this.state.showLoginLight", !this.state.showLoginLight)
        this.setState({
            "showLoginLight": !this.state.showLoginLight
        })
    }

    userEdit() {

    }

    fireLoginLight(hide) {
        this.setState({
            "showLoginLight": !hide
        })
    }

    userLogout() {
        this.props.history.push('/')
        this.props.onUserLoggingOut(this.props.userSetup.token, this.props.userSetup.langLibrary)
    }

    btnLoginClassName = () => (
        this.props.userSetup.userID > 0 ? "loginbtn loggedbtn" : "loginbtn"
    )
    langBlock = () => {
        return <div style={{"width": "80px"}}><ReactFlagsSelect
            defaultCountry={localStorage.getItem("langCode") ? localStorage.getItem("langCode") : defLang}
            placeholder={getLangByCountry(localStorage.getItem("langCode"))}
            showSelectedLabel={false}
            searchPlaceholder={this.props.userSetup.langLibrary ? this.props.userSetup.langLibrary.lang : defLang}
            countries={arrLangs}
            onSelect={this.onSelectLang}
            selectedSize={14}
            optionsSize={12}/>
        </div>
    }
    loginBlock = (userID, userName, langLibrary) => {
        let {loading} = this.props.userSetup
        let {showLoginLight} = this.state
        console.log("loginBlock", loading, userID)
        return <div className="logBtnsBlock">
            <div>
                {!loading && !userID ?
                    <button className={userID ? "loginbtn" : showLoginLight ? "loginbtn mym-login-logged" : "loginbtn"}
                            onClick={this.userLogin.bind(this)}>
                        <div className="mym-app-button-with-arrow">{langLibrary.entry}
                            <div className="mym-app-arrow-down">{!this.state.showLoginLight ? '\u25BC' : '\u25B2'}</div>
                        </div>
                    </button> : null}

                {showLoginLight ?
                    <LoginBlockLight onLogin={this.props.onUserLogging} langLibrary={langLibrary}
                                     firehide={this.fireLoginLight.bind(this)}/> : null
                }
            </div>
            <div>
                {userID > 0 ? <button className="logoutbtn" onClick={this.userLogout.bind(this)}>
                    <div
                        className={userName.length > 10 ? "mym-app-button-name-small" : "mym-app-button-name"}>{userName}</div>
                    <div className="mym-app-button-exit">{langLibrary.exit}</div>
                </button> : null}
            </div>
            {this.langBlock()}
        </div>
    }
    waitCursorBlock = () => {
        return <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    }

    render() {
        // console.log("RENDER",this.state.curSubjIndex)
        // console.log('classID', this.props.userSetup);
        // let {userID, userName, isadmin} = this.props.userSetup;
        let {userID, userName, isadmin, loading, showLoginLight, langLibrary, langCode} = this.props.userSetup;
        let {isMobile} = this.state
        return (
            <div style={{marginLeft: "5%", marginRight: "5%"}}>
                {!this.props.hasOwnProperty("withouthead") ?
                    <div>
                        <div className="navbar"
                             style={userID === 0 ? {"justifyContent": "flex-end"} : {"justifyContent": "space-between"}}>
                            <div className="navBlock">
                                <div style={{
                                    "display": "flex",
                                    "justifyContent": "space-between",
                                    "alignItems": "center"
                                }}>
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
                            <div className="navBlockEx">
                                {isMobile ?
                                    <MobileMenu userID={userID} userName={userName} isadmin={isadmin}
                                                withtomain={this.props.withtomain} userLogin={this.userLogin.bind(this)}
                                                userLogout={this.userLogout.bind(this)}/> :
                                    userID > 0 && <MenuEx className="menuTop" userid={userID} isadmin={isadmin}/>
                                }
                                {/*{(window.location.href.slice(-3)==="/r3"&&userID===0)?*/}
                                {/*this.fireUserV3Login(window.location.href):""}*/}
                                {isMobile ? <div>
                                    {this.state.showLoginLight || (window.location.href.slice(-2) === "/r" && userID === 0) ?
                                        <LoginBlockLight onLogin={this.props.onUserLogging}
                                                         firehide={this.fireLoginLight.bind(this)}/> : ""}

                                    <div className={this.props.user.loginmsg.length ? "popup show" : "popup"}
                                         onClick={this.props.onClearErrorMsg}>
                                        {this.props.user.loginmsg.length ? <span className="popuptext"
                                                                                 id="myPopup">{this.props.user.loginmsg}</span> : ""}
                                    </div>
                                </div> : ""}
                                {!isMobile ? this.loginBlock(userID, userName, langLibrary) : null}
                            </div>
                        </div>
                        <div className="navbar-shadow"></div>
                        {this.props.hasOwnProperty("withoutshadow") ? "" : <div className="navbar-shadow"></div>}
                    </div>
                    : null}

                <div className="homeWorkSectionMain">
                    <div className="homeWorkSection">
                        <div className="homeWorkSectionHeader">
                            <div className="hwSectionLeft">Домашка:</div>
                            <div className="hwSectionRight">{this.dateString()}</div>
                        </div>
                        <div className="homeWorkSectionSelDate">
                            <div className="buttonPlusDay" onClick={this.changeMinusDay.bind(this)}> {'<<<'} </div>
                            <div className="hwDate">{this.getDate(true)}</div>
                            <div className="weekDay">{this.getDate(false)}</div>
                            <div className="buttonPlusDay" onClick={this.changePlusDay.bind(this)}> {'>>>'} </div>
                        </div>
                        <div className="listOfHomeWork">
                            <div
                                className={this.state.sideListLeft ? "homeWorkCurrentSectionHeaderL" : "homeWorkCurrentSectionHeaderR"}>
                                <div id="leftSide" className="hwCurrentSectionLeft"
                                     onClick={this.changeCurrentSection.bind(this)}>Что задали
                                </div>
                                <div id="rightSide" className="hwCurrentSectionRight"
                                     onClick={this.changeCurrentSection.bind(this)}>Добавить
                                </div>
                            </div>
                            <div className={this.subjListClassName()}>
                                {this.state.sideListLeft ?
                                    <div className="factSubjRows">
                                        {!this.getHomeWorkListForDate(this.state.curDate).length ?
                                            <div className="buttonMinusFaked"></div> : ""}
                                        {this.getHomeWorkList(this.state.curDate)}
                                    </div>
                                    : <div>

                                        <div className="homeWorkSectionSelSubj">
                                            <div className="buttonPlusSubj"
                                                 onClick={this.changeMinusSubj.bind(this)}> {'<<<'} </div>
                                            <div
                                                className="subjNameTitle">{this.state.editId ? this.getHomeWorkByID(this.state.editId)[getSubjFieldName(langCode)] : this.getCurSubj()}</div>
                                            <div className="buttonPlusSubj"
                                                 onClick={this.changePlusSubj.bind(this)}> {'>>>'} </div>
                                        </div>
                                        <textarea className="mainInput" ref={input => {
                                            this.homeWorkTxt = input
                                        }}
                                                  defaultValue={this.state.editId > 0 ? this.getHomeWorkByID(this.state.editId).homework : ""}/>
                                        {/*{this.homeWorkTxt.focus()}*/}
                                        <div className="buttonsSection">
                                            {/*<div className="symbButton" onClick={this.btnClick.bind(this)}>§</div>*/}
                                            {btns.map((item, i) => (
                                                <div className="symbButton" key={'keyn' + i} id={'key' + i}
                                                     onClick={this.btnClick.bind(this)}>{item}</div>))}
                                        </div>
                                        <div className="buttonsSection">
                                            {btnsNumb.map((item, i) => (
                                                <div className="symbButton" key={'keyn' + i} id={'keyn' + i}
                                                     onClick={this.btnClick.bind(this)}>{item}</div>))}
                                        </div>
                                        <div className="buttonsSection">
                                            <div className="btnComa" id="btncoma" onClick={this.btnClick.bind(this)}>,
                                            </div>
                                            <div className="btnSpace" id="btnspace" onClick={this.btnClick.bind(this)}>
                                                ПРОБЕЛ
                                            </div>
                                            <div className="btnBackSpace" id="btnbackspace"
                                                 onClick={this.btnClick.bind(this)}>←
                                            </div>
                                        </div>
                                        <div className="buttonsSection">
                                            <div className="addHomeWorkBtn"
                                                 onClick={this.addHomeWork.bind(this)}>{this.state.editId > 0 ? "ИЗМЕНИТЬ" : `СОХРАНИТЬ ${!this.props.userSetup.userID ? 'НЕЛЬЗЯ,Т.К. НУЖНО ВОЙТИ' : ''}`}</div>
                                        </div>
                                    </div>}

                            </div>
                        </div>
                    </div>

                </div>

                {/*{!this.props.hasOwnProperty("withouthead") ?*/}
                    {/*<div>*/}
                        {/*<div style={{marginBottom: "70px"}}>*/}
                            {/*<h3 style={{color: "#2F75B5"}}>1. Создание нового класса:</h3>*/}
                            {/*<ReactPlayer url='https://mymarks.info/download/1.Class-register.mp4' controls/>*/}
                        {/*</div>*/}
                        {/*<div style={{marginBottom: "70px"}}>*/}
                            {/*<h3 style={{color: "#2F75B5"}}>2. Добавление себя к созданному классу:</h3>*/}
                            {/*<ReactPlayer url='https://mymarks.info/download/1.Student-Register.mp4' controls/>*/}
                        {/*</div>*/}
                        {/*<div style={{marginBottom: "70px"}}>*/}
                            {/*<h3 style={{color: "#2F75B5"}}>3. Описание работы учителя:</h3>*/}
                            {/*<ReactPlayer url='https://mymarks.info/download/1.Teacher-Studying.mp4' controls/>*/}
                        {/*</div>*/}
                        {/*<div style={{marginBottom: "70px"}}>*/}
                            {/*<h3 style={{color: "#2F75B5"}}>4. Обучение работе с Android-приложением:</h3>*/}
                            {/*<ReactPlayer url='https://mymarks.info/download/1.Android-Studing.mp4' controls/>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*: null}*/}

                {/*{console.log("this.state.showMsg", this.state.showMsg)}*/}
                {this.state.sideListLeft && this.state.showInfo &&
                <div className="hwInfo" onClick={this.hideInfo.bind(this)}>
                    Создан: {this.state.showMsg.name + ' в ' + (new Date(this.state.showMsg.updated_at)).toLocaleDateString() + ' ' + ('0' + (new Date(this.state.showMsg.updated_at)).getHours()).slice(-2) + ':' + ('0' + (new Date(this.state.showMsg.updated_at)).getMinutes()).slice(-2)}</div>}
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return ({
        onUserLoggingByToken: (email, token, kind) => {
            const asyncLoggedInByToken = (email, token, kind) => {
                return dispatch => {
                    dispatch(userLoggedInByToken(email, token, kind))
                }
            }
            dispatch(asyncLoggedInByToken(email, token, kind))
        },
        onHomeWorkChanged: (arr) => {dispatch({type: 'UPDATE_HOMEWORK', payload: arr})},
        onReduxUpdate: (key, payload) => dispatch({type: key, payload: payload}),
        onUserLoggingOut: token => dispatch(userLoggedOut(token)),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HomeWorkSection))