/**
 * Created by Paul on 07.04.2019.
 */
import React, { Component } from 'react'
import {AddDay, arrOfWeekDays, dateDiff, toYYYYMMDD, instanceAxios, mapStateToProps, getLangByCountry} from '../../js/helpers'
import Menu from '../Menu/menu'
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom'
import { userLoggedInByToken, userLoggedOut } from '../../actions/userAuthActions'
import { Link } from 'react-router-dom';
import MobileMenu from '../MobileMenu/mobilemenu'
import LoginBlockLight from '../LoginBlockLight/loginblocklight'
import edit_icon from '../../img/Edit-512s.png'
import { HOMEWORK_ADD_URL, defLang, arrLangs } from '../../config/config'
import '../../containers/App.css'
import './homeworksection.css'
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import Logo from '../../img/LogoMyMsmall.png'
import ReactPlayer from 'react-player'

let btns = ['§','Стр.','-','№','Упр.','Зад.','Кнсп.']
let btnsNumb = [1,2,3,4,5,6,7,8,9,0]

class HomeWorkSection extends Component {
    constructor(props){
        super(props);
        this.state = {
            now : new Date(),
            curDate: AddDay(new Date(), 1),
            sideListLeft : true,
            selectedSubjects : this.props.userSetup.selectedSubjects,
            curSubjKey : "",
            curSubjIndex : 0,
            userId : this.props.userSetup.userID,
            homeWorkArray : this.props.userSetup.homework,
            isMobile : window.screen.width < 400,
            // homeWorkArray : [
            //     {id: 4, subj_key: "#biolog", subj_name_ua: "Біологія", homework: "вивчити параграф # 41, хто не вивчив", ondate: new Date("2019-04-09"), author: "Петренко", instime : "16:10", userId: 7},
            //     {id: 6, subj_key: "#geogph", subj_name_ua: "Географія", homework: "п.32,33", ondate: new Date("2019-04-09"), author: "Иваненко", instime : "16:11", userId: 6},
            //     {id: 10, subj_key: "#forltr", subj_name_ua: "Зар. література", homework: "укр лит стих про щуку", ondate: new Date("2019-04-09"), author: "Симоненко", instime : "16:12", userId: 5},
            //     {id: 12, subj_key: "#inform", subj_name_ua: "Інформатика", homework: "написать что-то на Питоне", ondate: new Date("2019-04-09"), author: "Кравчук", instime : "16:13", userId: 7},
            //     {id: 13, subj_key: "#htrold", subj_name_ua: "Історія ст. світу", homework: "конспект пар.43 таблиця", ondate: new Date("2019-04-09"), author: "Порошенко", instime : "16:14", userId: 7},
            //     {id: 15, subj_key: "#mathem", subj_name_ua: "Математика", homework: "Геом. 1-3пар. # 65.68.70.74.78.", ondate: new Date("2019-04-09"), author: "Кучма", instime : "16:15", userId: 7},
            //     {id: 14, subj_key: "#biolog", subj_name_ua: "Біологія", homework: "вивчити параграф # 41, хто не вивчив", ondate: new Date("2019-04-10"), author: "Петренко", instime : "16:10", userId: 7},
            //     {id: 16, subj_key: "#geogph", subj_name_ua: "Географія", homework: "п.32,33", ondate: new Date("2019-04-13"), author: "Иваненко", instime : "16:11", userId: 7},
            //     {id: 20, subj_key: "#forltr", subj_name_ua: "Зар. література", homework: "укр лит стих про щуку", ondate: new Date("2019-04-10"), author: "Симоненко", instime : "16:12", userId: 6},
            //     {id: 22, subj_key: "#inform", subj_name_ua: "Інформатика", homework: "написать что-то на Питоне", ondate: new Date("2019-04-11"), author: "Кравчук", instime : "16:13", userId: 7},
            //     {id: 23, subj_key: "#htrold", subj_name_ua: "Історія ст. світу", homework: "конспект пар.43 таблиця", ondate: new Date("2019-04-12"), author: "Порошенко", instime : "16:14", userId: 7},
            //     {id: 25, subj_key: "#mathem", subj_name_ua: "Математика", homework: "Геом. 1-3пар. # 65.68.70.74.78.", ondate: new Date("2019-04-10"), author: "Кучма", instime : "16:15", userId: 6},
            //     {id: 34, subj_key: "#biolog", subj_name_ua: "Біологія", homework: "вивчити параграф # 41, хто не вивчив", ondate: new Date("2019-04-09"), author: "Петренко", instime : "16:10", userId: 7},
            //     {id: 36, subj_key: "#geogph", subj_name_ua: "Географія", homework: "п.32,33", ondate: new Date("2019-04-10"), author: "Иваненко", instime : "16:11", userId: 6},
            //     {id: 30, subj_key: "#forltr", subj_name_ua: "Зар. література", homework: "укр лит стих про щуку", ondate: new Date("2019-04-11"), author: "Симоненко", instime : "16:12", userId: 6},
            //     {id: 32, subj_key: "#inform", subj_name_ua: "Інформатика", homework: "написать что-то на Питоне", ondate: new Date("2019-04-12"), author: "Кравчук", instime : "16:13", userId: 6},
            //     {id: 33, subj_key: "#htrold", subj_name_ua: "Історія ст. світу", homework: "конспект пар.43 таблиця", ondate: new Date("2019-04-14"), author: "Порошенко", instime : "16:14", userId: 6},
            //     {id: 35, subj_key: "#mathem", subj_name_ua: "Математика", homework: "Геом. 1-3пар. # 65.68.70.74.78.", ondate: new Date("2019-04-14"), author: "Кучма", instime : "16:15", userId: 7},
            //     {id: 44, subj_key: "#biolog", subj_name_ua: "Біологія", homework: "вивчити параграф # 41, хто не вивчив", ondate: new Date("2019-04-15"), author: "Петренко", instime : "16:10", userId: 7},
            //     {id: 46, subj_key: "#geogph", subj_name_ua: "Географія", homework: "п.32,33", ondate: new Date("2019-04-15"), author: "Иваненко", instime : "16:11", userId: 7},
            //     {id: 40, subj_key: "#forltr", subj_name_ua: "Зар. література", homework: "укр лит стих про щуку", ondate: new Date("2019-04-12"), author: "Симоненко", instime : "16:12", userId: 6},
            //     {id: 42, subj_key: "#inform", subj_name_ua: "Інформатика", homework: "написать что-то на Питоне", ondate: new Date("2019-04-12"), author: "Кравчук", instime : "16:13", userId: 6},
            //     {id: 43, subj_key: "#htrold", subj_name_ua: "Історія ст. світу", homework: "конспект пар.43 таблиця", ondate: new Date("2019-04-12"), author: "Порошенко", instime : "16:14", userId: 7},
            //     {id: 45, subj_key: "#mathem", subj_name_ua: "Математика", homework: "Геом. 1-3пар. # 65.68.70.74.78.", ondate: new Date("2019-04-12"), author: "Кучма", instime : "16:15", userId: 7}
            //     ],
            actualHomeWorkList : [],
            showInfo : false,
            selectedRow : 0,
            showId : 0,
            showMsg : "",
            editId : 0,

        }
    }
    componentDidMount(){
        if (!(window.localStorage.getItem("myMarks.data") === null)) {
            // let ls = JSON.parse(window.localStorage.getItem("myMarks.data"))
            // this.props.onUserLoggingByToken(ls.email, ls.token, null)
            // this.setState({homeWorkArray : this.props.userSetup.homework})
        }
        this.setState({actualHomeWorkList : this.getHomeWorkListForDate(new Date()) })

    }
    dateString=()=>{
        let datediff = dateDiff(this.state.now, this.state.curDate)+2;
        let daysArr = ["Позавчера","Вчера","Сегодня","Завтра","Послезавтра"]
        Date.prototype.getWeek = function() {
            var onejan = new Date(this.getFullYear(),0,1);
            return Math.ceil((((this - onejan) / 86400000) + onejan.getDay())/7);
        }
        // console.log(datediff);
        if (datediff>=0&&datediff<5)
           return "на " + daysArr[datediff].toUpperCase();
        else {
            if ((this.state.curDate.getWeek() - this.state.now.getWeek())>=0)
            {
                if (this.state.now.getWeek() === this.state.curDate.getWeek()) {
                    return "на " + arrOfWeekDays[this.state.curDate.getDay()] + ' эта неделя'
                }
                else {
                    if ((this.state.now.getWeek() + 1) === this.state.curDate.getWeek()) {
                        return "на " + arrOfWeekDays[this.state.curDate.getDay()] + ' след. неделя'
                    }
                    else {
                        return "на " + arrOfWeekDays[this.state.curDate.getDay()] + '  +' + (this.state.curDate.getWeek() - this.state.now.getWeek()) +'нед.'
                    }
                }
            }
            else {
                return "на " + arrOfWeekDays[this.state.curDate.getDay()] + '  ' + (this.state.curDate.getWeek() - this.state.now.getWeek()) +'нед.'
            }
        }
        // return ""
        // return "След. Вторник"
    }
    getDate=(prm)=>(
        // prm ?('0'+this.state.curDate.getDate()).toString().slice(-2)+"."+('0'+(this.state.curDate.getMonth() + 1)).toString().slice(-2) +"."+this.state.curDate.getFullYear().toString().slice(-2):'['+arrOfWeekDays[this.state.curDate.getDay()]+']'
        prm?this.state.curDate.toLocaleDateString():'['+arrOfWeekDays[this.state.curDate.getDay()]+']'
    )
    changeMinusDay=()=>{
        this.setState({
            curDate : AddDay(this.state.curDate, -1),
            actualHomeWorkList : this.getHomeWorkListForDate(AddDay(this.state.curDate, -1))
        })
        console.log("this.props.userSetup.homework", this.props.userSetup.homework)
    }
    changePlusDay=()=>{
        this.setState({
            curDate : AddDay(this.state.curDate, 1),
            actualHomeWorkList : this.getHomeWorkListForDate(AddDay(this.state.curDate, 1))
        })
        console.log("this.props.userSetup.homework", this.props.userSetup.homework)
    }
    getHomeWorkListForDate=(onDate)=>{
        let arr = []
        arr = this.props.userSetup.homework.filter((item, i)=>(new Date(onDate).toLocaleDateString()=== new Date(item.ondate).toLocaleDateString()))
        // console.log("getHomeWorkListForDate", arr, new Date(onDate).toLocaleDateString())
        return arr;
    }
    subjListClassName=()=>(
        this.state.sideListLeft?'leftSideSubjList':'rightSideSubjList'
    )
    changeCurrentSection(e){
        this.setState({sideListLeft:e.target.id==="leftSide"})
    }
    changePlusSubj=()=>{
        let {curSubjIndex : i} = this.state
        let {selectedSubjects} = this.props.userSetup
        this.setState({curSubjIndex:((i+1)<selectedSubjects.length?++i:0)})
        // console.log("i:", i, "length:", selectedSubjects.length)
    }
    changeMinusSubj=()=>{
        let {curSubjIndex : i} = this.state
        let {selectedSubjects} = this.props.userSetup
        this.setState({curSubjIndex:((i-1)>0?--i:selectedSubjects.length-1)})
        // console.log("i:", i, "length:", selectedSubjects.length)
    }
    getCurSubj=()=>{
        let {selectedSubjects} = this.props.userSetup
        return selectedSubjects.length?(this.state.curSubjIndex+1)+'.'+selectedSubjects[this.state.curSubjIndex].subj_name_ua:"";
       }
       // getMaxIdFromHomeWorkArray=()=>{
       //
       // }
       addHomeWork=()=>{
           let {selectedSubjects, classID, userName, userID, studentId} = this.props.userSetup
            // alert(this.homeWorkTxt.value)
           // if (this.state.editId===0) {
               let {homework : homeWorkArray} = this.props.userSetup //this.state;
               let id = homeWorkArray.reduce((max, current)=>(current.id > max?current.id:max), 0) + 1;
               let subj_key = selectedSubjects[this.state.curSubjIndex].subj_key//"#biolog"
               let subj_name_ua = selectedSubjects[this.state.curSubjIndex].subj_name_ua
               let ondate = this.state.curDate//new Date("2019-04-09");
               let author = userName
               let instime = new Date() //"16:10"
               instime = ('0'+instime.getHours()).slice(-2) + ':' + ('0'+instime.getMinutes()).slice(-2)
               let json = `{"id":${id}, "subj_key":"${subj_key}", "subj_name_ua": "${subj_name_ua}", "homework": "${this.homeWorkTxt.value}", "ondate": "${ondate}", "author": "${author}", "instime" : "${instime}"}`;

               json = JSON.parse(json);
               json = `{"subj_key":"${subj_key}", "subj_name_ua": "${subj_name_ua}", "homework": "${this.homeWorkTxt.value}", "ondate": "${toYYYYMMDD(ondate)}", "user_id": "${userID}", "student_id":"${studentId}"}`;
               // homeWorkArray.push(json)
               // console.log("homeWorkArray", homeWorkArray);
               // this.props.onHomeWorkChanged(homeWorkArray)
               // json = JSON.parse(json);
               instanceAxios().post(HOMEWORK_ADD_URL + '/' + classID + '/hw/' + this.state.editId, json)
                   .then(response => {
                       console.log(response.data)
                       this.props.onHomeWorkChanged(response.data)
                       // this.setState({
                       //     emails : response.data//response.data.map((item, i) => (<div className="itemInEmailList" key={item.id}>{item.email}<button id={item.id} onClick={this.deleteItemInList.bind(this)}>-</button></div>))
                       // })
                       // dispatch({type: 'UPDATE_SETUP_REMOTE', payload: response.data})
                       // this.props.onInitState(response.data.subjects_list, response.data.subjects_count);
                   })
                   .catch(response => {
                       console.log(response);
                   })

               // this.setState({homeWorkArray, sideListLeft:true, actualHomeWorkList : this.getHomeWorkListForDate(this.state.curDate)});

               // console.log(homeWorkArray, json);
           // }
           // else {
               this.setState({sideListLeft: true, editId : 0})
           // }
       }
       classNameOfRowSelected=(selected)=>(
           selected?"factSubjRow selectedRow":" factSubjRow"
       )
       editRow=(e)=>{
            console.log('editRow', e.target.id)
       }
// {this.classNameOfRowSelected(item.id===this.state.showId)}

       getHomeWorkList=(onDate)=>{
           // return this.state.actualHomeWorkList.map((item, i)=>(
           //                      <div className={this.classNameOfRowSelected(Number(item.id)===Number(this.state.showId))} key={i} id={item.id} onClick={this.hideInfo.bind(this)}>
           //                          <div className="subjName">{item.subj_name_ua}</div>
           //                          <div className="subjHomeWork" id={item.id}>{item.homework}</div>
           //                          {this.state.userId===item.userId&&<div className="imgEdit" ><img id={'img'+item.id} src={true?edit_icon:edit_icon} alt={"Редактировать"} onClick={this.editRow.bind.this}/></div>}
           //                      </div>))
           let arr = this.getHomeWorkListForDate(onDate)
           return arr.map((item, i)=>(
               <div className={this.classNameOfRowSelected(Number(item.id)===Number(this.state.showId))} key={i} id={item.id} onClick={this.hideInfo.bind(this)}>
                   <div className="subjName">{item.subj_name_ua}</div>
                   <div className="subjHomeWork" id={item.id}>{item.homework}</div>
                   {this.props.userSetup.userID===item.user_id&&<div className="imgEdit" ><img id={'img'+item.id} src={true?edit_icon:edit_icon} alt={"Редактировать"} onClick={this.editRow.bind.this}/></div>}
               </div>));
       }
       getHomeWorkByID=(id)=>(
           this.props.userSetup.homework.filter((item, i)=>(item.id === id))[0]
       )
       hideInfo=(e)=>{
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
                    let curHomeWork = this.getHomeWorkByID(Number(e.target.id.toString().replace('img','')))
                    this.setState({sideListLeft:false, editId:curHomeWork.id})
                    console.log("IMG", e.target.id.toString().replace('img',''), curHomeWork.id)
                    break;
                    // this.homeWorkTxt.focus()
                default:
                    break
            }
            // console.log('hideInfo', this.state, e.target.id, e.target.nodeName)
        }
        getShowMsgByID=(id)=> {
            let arr =  this.props.userSetup.homework.filter((item, i) => (Number(item.id) === Number(id)))
            return arr.length?arr[0]:[]
        }
        btnClick=(e)=>{
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
                    e.target.id.indexOf("keyn")===0?
                        this.homeWorkTxt.value = this.homeWorkTxt.value + btnsNumb[e.target.id.toString().replace('keyn', '')]
                        :
                        e.target.id.indexOf("key")===0?
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
            "showLoginLight" : !this.state.showLoginLight
        })
    }
    userEdit(){

    }
    fireLoginLight(hide) {
        this.setState({
            "showLoginLight" : !hide
        })
    }
    userLogout() {
        this.props.history.push('/')
        this.props.onUserLoggingOut(this.props.userSetup.token, this.props.userSetup.langLibrary)
    }
    btnLoginClassName=()=>(
        this.props.userSetup.userID > 0?"loginbtn loggedbtn":"loginbtn"
    )
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
    waitCursorBlock=()=>{
        return  <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    }
    render(){
        // console.log("RENDER",this.state.curSubjIndex)
        // console.log('classID', this.props.userSetup);
        // let {userID, userName, isadmin} = this.props.userSetup;
        let {userID, userName, isadmin, loading, showLoginLight, langLibrary} = this.props.userSetup;
        let {isMobile} = this.state
        return (
            <div style={{marginLeft : "5%", marginRight : "5%"}}>
                {!this.props.hasOwnProperty("withouthead")?
                    <div>
                        <div className="navbar" style={userID===0?{"justifyContent":  "flex-end"}:{"justifyContent":  "space-between"}}>
                            <div className="navBlock">
                                <div style={{"display": "flex", "justifyContent" : "space-between", "alignItems" : "center"}}>
                                    <Link to="/"><img src={Logo} alt={"My.Marks"}/></Link>
                                    <div className="myTitle"><h3><Link to="/">{langLibrary.siteName}</Link></h3></div>
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
                        {this.props.hasOwnProperty("withoutshadow")?"":<div className="navbar-shadow"></div>}
                    </div>
                    :null}

              <div className="homeWorkSectionMain">
                <div className="homeWorkSection">
                    <div className = "homeWorkSectionHeader">
                        <div className="hwSectionLeft">Домашка:</div><div className="hwSectionRight">{this.dateString()}</div>
                    </div>
                    <div className = "homeWorkSectionSelDate">
                        <div className="buttonPlusDay" onClick={this.changeMinusDay.bind(this)}> {'<<<'} </div>
                        <div className="hwDate">{this.getDate(true)}</div><div className="weekDay">{this.getDate(false)}</div>
                        <div className="buttonPlusDay" onClick={this.changePlusDay.bind(this)}> {'>>>'} </div>
                    </div>
                    <div className="listOfHomeWork">
                        <div className = {this.state.sideListLeft?"homeWorkCurrentSectionHeaderL":"homeWorkCurrentSectionHeaderR"}>
                            <div id="leftSide" className="hwCurrentSectionLeft" onClick={this.changeCurrentSection.bind(this)}>Что задали</div>
                            <div id="rightSide" className="hwCurrentSectionRight" onClick={this.changeCurrentSection.bind(this)}>Добавить</div>
                        </div>
                        <div className={this.subjListClassName()}>
                            {this.state.sideListLeft?
                                <div className="factSubjRows">
                                    {!this.getHomeWorkListForDate(this.state.curDate).length?<div className="buttonMinusFaked"></div>:""}
                                    {this.getHomeWorkList(this.state.curDate)}
                                </div>
                                :<div>

                                    <div  className = "homeWorkSectionSelSubj">
                                        <div className="buttonPlusSubj" onClick={this.changeMinusSubj.bind(this)}> {'<<<'} </div>
                                        <div className="subjNameTitle">{this.state.editId?this.getHomeWorkByID(this.state.editId).subj_name_ua:this.getCurSubj()}</div>
                                        <div className="buttonPlusSubj" onClick={this.changePlusSubj.bind(this)}> {'>>>'} </div>
                                    </div>
                                    <textarea className="mainInput" ref={input=>{this.homeWorkTxt=input}} defaultValue={this.state.editId>0?this.getHomeWorkByID(this.state.editId).homework:""}/>
                                    {/*{this.homeWorkTxt.focus()}*/}
                                    <div className="buttonsSection">
                                        {/*<div className="symbButton" onClick={this.btnClick.bind(this)}>§</div>*/}
                                        {btns.map((item, i)=>(<div className="symbButton" key={'keyn'+i} id={'key'+i} onClick={this.btnClick.bind(this)}>{item}</div>))}
                                    </div>
                                    <div className="buttonsSection">
                                        {btnsNumb.map((item, i)=>(<div className="symbButton" key={'keyn'+i} id={'keyn'+i} onClick={this.btnClick.bind(this)}>{item}</div>))}
                                    </div>
                                    <div className="buttonsSection">
                                        <div className="btnComa" id="btncoma" onClick={this.btnClick.bind(this)}>,</div><div className="btnSpace" id="btnspace" onClick={this.btnClick.bind(this)}>ПРОБЕЛ</div><div className="btnBackSpace" id="btnbackspace" onClick={this.btnClick.bind(this)}>←</div>
                                    </div>
                                    <div className="buttonsSection">
                                        <div className="addHomeWorkBtn" onClick={this.addHomeWork.bind(this)}>{this.state.editId>0?"ИЗМЕНИТЬ":`СОХРАНИТЬ ${!this.props.userSetup.userID?'НЕЛЬЗЯ,Т.К. НУЖНО ВОЙТИ':''}`}</div>
                                    </div>
                            </div>}

                        </div>
                     </div>
                </div>

            </div>

                {!this.props.hasOwnProperty("withouthead")?
                    <div>
                        <div style={{marginBottom : "70px"}}>
                            <h3 style={{color : "#2F75B5"}}>1. Создание нового класса:</h3>
                            <ReactPlayer url='https://mymarks.info/download/1.Class-register.mp4' controls/>
                        </div>
                        <div style={{marginBottom : "70px"}}>
                            <h3 style={{color : "#2F75B5"}}>2. Добавление ученика к созданному классу:</h3>
                            <ReactPlayer url='https://mymarks.info/download/1.Student-Register.mp4' controls/>
                        </div>
                        <div style={{marginBottom : "70px"}}>
                            <h3 style={{color : "#2F75B5"}}>3. Обучение работе с Android-приложением:</h3>
                            <ReactPlayer url='https://mymarks.info/download/1.Android-Studing.mp4' controls/>
                        </div>
                    </div>
                    :null}

                {/*{console.log("this.state.showMsg", this.state.showMsg)}*/}
          {this.state.sideListLeft&&this.state.showInfo&&<div className="hwInfo" onClick={this.hideInfo.bind(this)}> Создан:  {this.state.showMsg.name + ' в ' + (new Date(this.state.showMsg.updated_at)).toLocaleDateString() + ' ' + ('0'+(new Date(this.state.showMsg.updated_at)).getHours()).slice(-2) + ':' + ('0'+(new Date(this.state.showMsg.updated_at)).getMinutes()).slice(-2)}</div>}
        </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return ({
        onInitState: () => dispatch([]),
        onUserLoggingByToken : (email, token, kind)=>{
            const asyncLoggedInByToken = (email, token, kind) =>{
                return dispatch => {
                    dispatch(userLoggedInByToken(email, token, kind))
                }}
            dispatch(asyncLoggedInByToken(email, token, kind))
        },
        onHomeWorkChanged : (arr)=>{
            console.log("onHomeWorkChanged")
            dispatch({type: 'UPDATE_HOMEWORK', payload: arr})
        },
        onUserLoggingOut  : token => dispatch(userLoggedOut(token)),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HomeWorkSection))