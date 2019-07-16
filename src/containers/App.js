import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
// import ReactCountryFlag from "react-country-flag";
import axios from 'axios';
// import ReactLoading from 'react-loading';
// import { ClipLoader } from 'react-spinners';

import ClassList from '../components/ClassList/classlist'
import RSlider from '../components/RangeSlider/rslider'
import SubjectList from '../components/SubjectList/subjectlist'
import TitleBlock from '../components/TitleBlock/titleblock'
import MarkBlank from '../components/MarkBlank/markblank'
import {numberToLang, msgTimeOut} from '../components/helpers'
import Checkbox from '../components/CheckBox/checkbox'
import RadioGroup from '../components/RadioGroup/radiogroup'
import Table from '../components/MarksTable/markstable'
import StudentTable from '../components/StudentTable/studenttable'
import Chart from "react-google-charts";
import EmailList from '../components/EmailList/emaillist'
import HomeWorkSection from '../components/HomeWorkSection/homeworksection'
import { Link } from 'react-router-dom';
import MobileMenu from '../components/MobileMenu/mobilemenu'
import Charts from '../components/Charts/charts'
import { initState } from '../actions/userSetupActions'
import { userLoggedIn, userLoggedInByToken, userLoggedOut } from '../actions/userAuthActions'

// import { Widget, addResponseMessage } from 'react-chat-widget';
// import { ThemeProvider } from '@livechat/ui-kit'
import Chat from '../components/Chat/chat'

import 'react-chat-widget/lib/styles.css';
// import { Input, Button } from 'react-chat-elements'

import { API_URL, AUTH_URL, EXCEL_URL, UPDATESETUP_URL, SUBJECTS_GET_URL, STUDENTS_GET_URL, MARKS_STATS_URL, instanceAxios } from '../config/URLs'
import LoginBlock from '../components/LoginBlock/loginblock'
// import {CSSTransitionGroup, CSSTransition, TransitionGroup } from 'react-transition-group/CSSTransitionGroup';

// import AddSubject from '../components/AddSubject/addsubject'
import LoginBlockLight from '../components/LoginBlockLight/loginblocklight'
import Menu from '../components/Menu/menu'

import ChatBtn from "../img/chat-btn.svg"
import './App.css';
import { withCookies, Cookies } from 'react-cookie';
// import Chart from "react-google-charts/dist/ReactGoogleCharts.d";


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // pupilCount: 0,
            // currentYear: '',
            // curYearDone: 0,
            shotsteplist : true,
            classNumber : 0,
            steps: {
                step1: true,step2: true,step3: true,step4: true,step5: true,
                step6: true,step7: true,step8: true,step9: true,step10: true,step11: true
            },
            marks : new Map(),
            showLoginLight : false,
            fireShowLoginLight : false,
            studSubj : new Map(),
            myCity : localStorage.getItem("myCity")===null?'':localStorage.getItem("myCity"),
            myCountry : localStorage.getItem("myCountry")===null?'':localStorage.getItem("myCountry"),
            myCountryCode : localStorage.getItem("myCountryCode")===null?'':localStorage.getItem("myCountryCode"),
            isMobile : window.screen.width < 400,
            stats : localStorage.getItem("markStats")===null?{}:JSON.parse(localStorage.getItem("markStats")),
            loading : true,
            isJournalClicked : false,
            stepsLeft : 7,
            displayChat : false,
            chatSessionID : '',
            //this.isSaveEnabled(),
            // chartColumns : {},
            // menuOpen : false,
        }
    }


    componentWillMount(){
        // console.log('start', this.state.loading, new Date())

        (async()=>{

            await this.getGeo();
            await this.getStats();
            // this.getGeo()
            // this.getStats()

        })();

        this.props.onChangeStepsQty(this.isSaveEnabled())
        this.getSessionID();

    }
    componentDidMount(){
        if (!(window.localStorage.getItem("myMarks.data") === null)) {
            let ls = JSON.parse(window.localStorage.getItem("myMarks.data"))
            this.props.onUserLoggingByToken(ls.email, ls.token, null);
        }
    }

    getSessionID(){
        let header = {
            headers: {
                'Content-Type': "application/json",
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE, OPTIONS',
            }
        }
        // if (!(localStorage.getItem("statsDate") === (new Date().toLocaleDateString()))) {
            instanceAxios().get(API_URL +'session', [], header)            .then(response=>{
                // console.log("session", response.data);
                    this.setState(
                        {
                            chatSessionID: response.data.session_id,
                        }
                    )
                    this.props.onReduxUpdate('CHAT_SESSION_ID', response.data.session_id)
                    localStorage.setItem('chatSessionID', response.data.session_id)
            })
            .catch(response => {
                // console.log("getGeoFailed", response.data);
            })
    }
    isSaveEnabled=()=>{
        let donesteps = 0, planSteps = 7
        let {pupilCount, subjCount, currentPeriodDateCount, markBlank,
            classNumber, selectedSubj} = this.props.userSetup;
        donesteps = (!(classNumber===0)?1:0) + (!(Number(pupilCount) === 0)?1:0) + (!(subjCount.slice(-2)==="/0")?1:0) +((selectedSubj.id>0)?1:0) +(!(markBlank.alias === "")?1:0)+(currentPeriodDateCount>0?1:0) + (this.state.isJournalClicked?1:0)
        // console.log("donesteps", donesteps)
        // console.log("isSaveEnabled", donesteps, classNumber, this.props.userSetup.classNumber)
        // this.setState({stepsLeft:planSteps - donesteps})
        return planSteps - donesteps
    }
    orderTitles =(item)=>{
        for (let i=1;i<8;i++){
            if (true) {//(!(i===item)){
                let b = document.getElementById('btn-'+i)
                console.log('b', b, b.offsetLeft)
                // let top = b.getBoundingClientRect().top
                // let left = b.getBoundingClientRect().left
                let t = document.getElementById('title-'+i)
                    // prnt = document.getElementById('titles')
                // console.log('top', t.style.top, top, left);

                let xT = b.offsetLeft,
                    yT = b.offsetTop,
                    xE = t.offsetLeft,
                    yE = t.offsetTop
                // set elements position to their position for smooth animation
                t.style.left = xE + 'px';
                t.style.top = yE + 'px';
                // set their position to the target position
                // the animation is a simple css transition
                t.style.left = xT + 'px';
                t.style.top = yT + 'px';

                t.style.position = "absolute"
                t.style.width='40px';
            }
        }
    }

  getGeo=()=>{
      // instanceAxios().get("http://ip-api.com/json", [])
      // axios.get("http://ip-api.com/json")
      if (!(localStorage.getItem("statsDate") === (new Date().toLocaleDateString()))) {
      axios.get("https://ipapi.co/json/")
          .then(response=>{
              // console.log("getGeo", response.data);
              if (!(response.data.city===localStorage.getItem("city"))) {
                  this.setState(
                      {
                          myCity: response.data.city,
                          myCountry: response.data.country_name,
                          myCountryCode: response.data.country,
                      }
                  )
                  localStorage.setItem("myCity", response.data.city)
                  localStorage.setItem("myCountry", response.data.country_name)
                  localStorage.setItem("myCountryCode", response.data.country)
              }
              // console.log("getGeo")
            // })
          })
          .catch(response => {
          // console.log("getGeoFailed", response.data);
          })
      }

  }
    getStats=()=>{
        // console.log('query', MARKS_STATS_URL+'/0')
        let header = {
            headers: {
                'Content-Type': "application/json",
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE, OPTIONS',
            }
        }
        if (!(localStorage.getItem("statsDate") === (new Date().toLocaleDateString()))) {
        instanceAxios().get(MARKS_STATS_URL+'/0', [], header)
            .then(response => {
                if ( !(response.data.stats2[0] === localStorage.getItem("markStats")))
                this.setState({
                    stats :response.data.stats2[0],
                })
                localStorage.setItem("markStats", JSON.stringify(response.data.stats2[0]))
                localStorage.setItem("statsDate", (new Date().toLocaleDateString()))
                // console.log("getStat");
            })
            .catch(response => {
                console.log(response.data);
                // Список ошибок в отклике...
            })
        }
        this.props.onStopLoading()
    }
  buttonClick(event) {
      const classNumber = Number(event.target.id.toString().replace("btn-class-",""));
      let {userID} = this.props.userSetup;
      let json = `{"class_number":${classNumber}}`;
      let data = JSON.parse(json);
      this.props.onSetSetup(data, userID, classNumber);
    }

  changeState(name, value) {
      let json, data;
      let {pupilCount, students : studs, userID, subjects_list, selectedSubjects, classID} = this.props.userSetup;
      switch (name) {
            case 'classNumber' :
               json = `{"class_number":${value}}`; break;
            case 'pupilCount' :
                // console.log("pupilCount", value, pupilCount)
                if (value > pupilCount) {
                    //Заполним массив студентов (id, name, nick, rowno, class_id, user_id)
                    let arr = [];
                    for (let i = 0; i < value; i++) {
                        // console.log("studs[i]", studs[i]); //JSON.parse(studs[i])
                        if (!(studs[i]) || ((typeof studs[i] === "object") && !(studs[i].hasOwnProperty('id'))))
                            arr.push({"id": -i, "student_name" : "", "student_nick" : numberToLang(i+1, ' ', 'rus'), "rowno" : i, "class_id": classID, "user_id" : userID, "email" : ''});
                        else
                            arr.push({"id": studs[i].id, "student_name" : studs[i].student_name, "student_nick" : studs[i].student_nick, "rowno" : studs[i].rowno, "class_id": classID, "user_id" : userID, "email" : studs[i].email})
                    }
                    json = `{"students":${JSON.stringify(arr)}}`;
                    data = JSON.parse(json);
                    console.log("PupilCountArr", arr, data);
                    this.props.onSetSetup(data, userID, classID) // curClass
                }
                json = `{"pupil_count":${value}}`; break;
            case 'currentYear' :
                json = `{"year_name":"${value.toString().replace(/[/]/g, '\\/')}"}`; break;
              case "selectedSubj" :
                  // console.log("selectedSubj", value);
                  value.push(this.props.userSetup.subjects_list.filter(val=>(val.subj_key===value[0]))[0].id)
                  // console.log("SELECTED_SUBJ", this.props.userSetup.subjects_list.filter(val=>(val.subj_key===value[0])), value);
                  json = `{"selected_subject":"${value}"}`; break;
              case "subjCount" :
                  // console.log("selectedSubjsArray", selectedSubjects);
                  json = `{"subjects_count":"${subjects_list.length+'/'+ selectedSubjects[0]===""?0:selectedSubjects.length}"}`; break;
              case "selectedSubjects" : // Количество выбранных для отслеживания оценок

                  json = `{"selected_subjects":[${value.map(val=>`{"subj_key":"${val.subj_key}","subj_name_ua":"${val.subj_name_ua}"}`)}]}`;
                  data = JSON.parse(json);
                  // console.log("selected_subjects", value, json);
                  this.props.onSetSetup(data, userID, classID); // curClass
                  json = `{"subjects_count":"${subjects_list.length +'/'+ value.length}"}`; break;
              case "markBlank" :
                  let   alias = "", pk = 0; //id = value;
                  switch (value) {
                      case "markblank_twelve" : alias = "Двенадцатибальная"; pk = 1; break;
                      case "markblank_five" : alias = "Пятибальная"; pk = 2; break;
                      case "markblank_letters" : alias = "A-E/F"; pk = 3; break;
                      default: break;
                  }
                  let key1, key2, key3;
                  json = `{"markblank_id":"${value}"}`; data = JSON.parse(json); key1 = data;

                  json = `{"markblank_alias":"${alias.toString().replace(/[/]/g, '\\/')}"}`; data = JSON.parse(json); key2 = data

                  json = `{"selected_marker":${pk}}`; data = JSON.parse(json); key3 = data;

                  json = `{"markblank":[${JSON.stringify(key1)},${JSON.stringify(key2)},${JSON.stringify(key3)}]}`; break;
              case "listnames" :
                  json = `{"titlekind":"${value}"}`; break;
              case "rangedays" :
                  json = `{"perioddayscount":${value}}`; break;
              case "rangedirection" :
                  // console.log("DATA", data);
                  json = `{"direction":"${value}"}`; break;
              case "withoutholidays" :
                  json = `{"withoutholidays":${value}}`; break;
            default:
                break;
        }
      data = JSON.parse(json);
      this.props.onSetSetup(data, userID, classID); //curClass
   }

   refreshSteps(steps, keyValue) {
       for(var key in steps){
           if (!(key===keyValue))
               steps[key] = true;
       }
       // console.log('refreshSteps', keyValue)
       if (keyValue === (!this.isShortList()?'step8':'step7')) {
           this.setState({isJournalClicked : true})
       }
       // this.isSaveEnabled()
       // console.log('refreshSteps', this.isSaveEnabled())
       this.props.onChangeStepsQty(this.isSaveEnabled())
       return steps
   }
   stepClick(event) {
       // console.log("stepClick", this.props.user.logging, event.target)
       this.props.user.logging&&this.props.onStopLogging()
       let {steps} = this.state

       switch (Number(event.target.id.toString().replace('title-',''))) {
           case 1 :
               if (this.props.user.logging)
                   steps.step1 = false
               else
                   steps.step1 = !steps.step1; steps = this.refreshSteps(steps, "step1"); break;
           case 2 : steps.step2 = !steps.step2; steps = this.refreshSteps(steps, "step2"); break;
           case 3 : steps.step3 = !steps.step3; steps = this.refreshSteps(steps, "step3"); break;
           case 4 : steps.step4 = !steps.step4; steps = this.refreshSteps(steps, "step4"); break;
           case 5 : steps.step5 = !steps.step5; steps = this.refreshSteps(steps, "step5"); break;
           case 6 : steps.step6 = !steps.step6; steps = this.refreshSteps(steps, "step6"); break;
           case 7 : steps.step7 = !steps.step7; steps = this.refreshSteps(steps, "step7"); break;
           case 8 : steps.step8 = !steps.step8; steps = this.refreshSteps(steps, "step8"); break;
           case 9 : steps.step9 = !steps.step9; steps = this.refreshSteps(steps, "step9"); break;
           case 10 : steps.step10 = !steps.step10; steps = this.refreshSteps(steps, "step10"); break;
           case 11 : steps.step11 = !steps.step11; steps = this.refreshSteps(steps, "step11"); break;
           default:
               break;
       }
       this.setState({steps})
       // this.orderTitles(0);
   }
   changeCell(row, column, value) {
        // console.log("App", row, column, value, this.state.marks)
        let marks = this.state.marks;
        marks.set("r"+row+"c"+column, value.toString().length<4?value:"")
        this.setState({
            marks : marks
        })
    }
    showClassName(clsName, isFade){
        return !isFade?(clsName +" fadeout"): clsName
    }
    userLogin() {
        this.setState({ "showLoginLight" : !this.state.showLoginLight })
    }
    userLogout() {
        console.log('userLOGOUT')
        this.hideSteps();
        this.props.onUserLoggingOut(this.props.userSetup.token)
    }
    userEdit(){    }
    userRegister() {    }
    fireLoginLight(hide) { this.setState({ "showLoginLight" : !hide })
        if (hide) this.props.onStopLoading()
        this.props.history.push('/');
        if (this.props.user.loginmsg.length>0) {this.clearError()}
    }
    btnLoginClassName=()=>(
        this.props.userSetup.userID > 0?"loginbtn loggedbtn":"loginbtn"
    )
    hideSteps=()=>(
    this.setState({
      steps: {  step1: true, step2: true, step3: true, step4: true, step5: true,
                step6: true, step7: true, step8: true, step9: true, step10: true, step11: true}
                  }))
    onStudSubjChanged(key, name){
        let map = new Map()
        let {subjects_list : subjlist} = this.props.userSetup
        map.clear()
        // console.log("onStudSubjChanged", key, subjlist, name)
        name = subjlist.filter(value=>(value.subj_key===key))[0].subj_name_ua

        map.set(key, name)

        // console.log("this.props.onStudentChartSubject!!!", key, name)
        this.props.onStudentChartSubject(map)
    }
    sleep=(ms)=> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    // getAdditionalData=()=> {
    //     return new Promise(resolve => {
    //             this.getGeo()
    //             this.getStats()
    //         }
    //
    //     )
    // }


    isShortList=()=>{
        return this.state.shotsteplist
    }
    getExcelFile(){
        document.body.style.cursor = 'progress';

        instanceAxios().get(EXCEL_URL+'/'+this.props.userSetup.classID+'/'+'20190320', {})
            .then(response => {
                // console.log("CREATEUSER_URL", response.data, this.props.usersetup, response.data.user.id);
                // this.setState({newUser : response.data.user.id, newEmail : this.inputEmail.value})
                // this.setSetup(this.props.usersetup, response.data.user.id, response.data.user.class_id);
                document.body.style.cursor = 'default';
            })
            .catch (response => {
                // console.log(response);
                document.body.style.cursor = 'default';
            })
        // https://sch-journal.dev/api/excel/1/20190401
    }
    clearError(){
        // console.log("clearError",this.props.user.loginmsg.length, this.props.user.loginmsg)
        this.props.user.loginmsg.length&&setTimeout(this.props.onClearErrorMsg(), msgTimeOut)
    }
    prepDataForChart(arr){
        let mpSubjs = new Map(), mpDates = new Map(), arrDates = [], arrSubjs = [],
                    arrDateMarks = [], arrDateMarksLittle = [], retArr = [], arrRow = [], columns = []
        this.props.userSetup.avgclassmarks.forEach(item=>mpSubjs.set(item.subj_key, item.subj_name_ua));
        this.props.userSetup.avgclassmarks.forEach(item=>mpDates.set(new Date(item.mark_date).toLocaleDateString(), item.mark_date));

        arrDates = Array.from(mpDates.values()).sort();
        for (let i = 0; i < arrDates.length; i++) {
            arrDates[i] = (new Date(arrDates[i])).toLocaleDateString()
        }
        arrSubjs = Array.from(mpSubjs.keys()).sort();
        let obj = {}
        obj.type = 'string';
        obj.label = 'Дата'
        columns.push(obj)
        for (let i = 0; i < arrSubjs.length; i++){
            let obj = {}
            obj.type = 'number';
            obj.label = mpSubjs.get(arrSubjs[i])
            // console.log(arrSubjs[i], mpSubjs.get(arrSubjs[i]), obj)
            columns.push(obj)
        }
        // this.setState({chartColumns:columns})
        //console.log("subjs",mpSubjs, mpDates);

        for (let i = 0; i < arrDates.length; i++) {
            arrRow = []
            arrDateMarks = this.props.userSetup.avgclassmarks.filter(item=>(new Date(item.mark_date)).toLocaleDateString()===arrDates[i])
            // console.log("arrDateMarks", arrDateMarks, arrSubjs)
            arrRow.push(arrDates[i])
            for (let j = 0; j < arrSubjs.length; j++){
                arrDateMarksLittle = arrDateMarks.filter(item=>item.subj_key===arrSubjs[j])
                // if (arrDateMarksLittle.length)
                //     console.log("MRKS", arrDateMarksLittle)
                arrRow.push(arrDateMarksLittle.length?arrDateMarksLittle[0].avgmark:null);
            }
            retArr.push(arrRow)
        //    console.log(arrDates[i], arrDateMarks);
        }
        // console.log("retArr", columns, retArr, arrSubjs, mpSubjs)
        // retArr.push([datestr,   arrMyMarks.length?Number(arrMyMarks[0].mark):null,
        //     arrBestMarks.length?Number(arrBestMarks[0].mark):null,
        //     arrAvgMarks.length?Number(arrAvgMarks[0].mark):null])
        return [retArr, columns];
    }
    fireUserV3Login=url=>{

        // let arr = (url.toString().split('/r3/')(1))
        // console.log('arr', arr)
        let arr = url.toString().split('/r3/')[1].replace('/r3','').trim()

        var namelen = Number(arr.substring(0, 6)) - 42
        console.log('URL', url, namelen, arr.slice(-namelen), arr.substring(6).replace(arr.slice(-namelen), ''))

        let name = arr.slice(-namelen)
        let pwd = arr.substring(6).replace(arr.slice(-namelen), '')

        // console.log(name, pwd)
        this.props.onUserLogging(name, pwd, '', '');
        this.props.history.push('/');
    }
    render() {

        let descrFirst = `Данное приложение поможет учителям и родителям вести дневник и следить за успеваемостью учеников. 
        Для этого нужно сделать всего лишь ${this.isShortList()?"7":"10"} маленьких шагов:`

        let {userSetup} = this.props;
        let {userID, userName, pupilCount, currentYear, subjCount, currentPeriodDateCount, markBlank,
            direction, titlekind, withoutholidays, classNumber, selectedSubjects, selectedSubj,
            subjects_list, studentId, studentName, classID, isadmin} = userSetup;
        let {isMobile} = this.state;
        let {step1,step2,step3,step4,step5,step6,step7,step8,step9,step10,step11} = this.state.steps;

        console.log("this.props.USERSETUP: ", userSetup);

        if (window.location.href.slice(-3)==="/hw")
            this.props.history.push('/hw');

        // const transitionOptions = {
        //     transitionName : "moveButtons",
        //     transitionEnterTimeout: 500,
        //     transitionLeaveTimeout : 500
        // }



        const { cookies } = this.props;
        // console.log('1P_JAR', this.props, cookies.get('Phpstorm-fff65093'))
        // console.log("LANGUAGE", navigator.language, navigator.systemLanguage, navigator.userLanguage)

        // const override = `{
        //     display: block;
        //     margin: 0 auto;
        //     border-color: red;
        // }`;

        const options = {
            title: "Общеклассная динамика успеваемости по предметам",
            curveType: "function",
            interpolateNulls: true,
            legend: { position: "bottom" },
            chartArea:{left:35,top:30,width:"100%",height:"80%"},
            // pointsVisible: true,
        };
        let data = this.prepDataForChart([])
        // data = this.prepDataForChart(Array.from(this.props.userSetup.studSubj.keys())[0])

        if (this.props.user.id > 0 && !this.props.user.verified)
        return (
          <div className="App">
              {this.props.userSetup.loading?
                  <div className="lds-ring">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                  </div>:""}

              {/*<CSSTransitionGroup {...transitionOptions}>*/}
            <div className="navbar" style={userID===0?{"justifyContent":  "flex-end"}:{"justifyContent":  "space-between"}}>

                {/*<MobilMenu className="bm-menu">*/}
                    {/*<a id="home" className="menu-item" href="/">Home</a>*/}
                    {/*<a id="about" className="menu-item" href="/about">About</a>*/}
                    {/*<a id="contact" className="menu-item" href="/contact">Contact</a>*/}
                    {/*<a onClick={ this.showSettings } className="menu-item--small" href="">Settings</a>*/}
                {/*</MobilMenu>*/}

                {userID&&<Menu className="menuTop" userid={userID} isadmin={isadmin} withtomain={true}/>}
                <div className="myTitle"><h3><Link to="/">Мои оценки</Link></h3></div>
                <div className="logBtnsBlock">
                    <div>
                        {userID===0?
                            <button className={this.btnLoginClassName()} onClick={this.userLogin.bind(this)}>Вход</button>:
                            <button className={this.btnLoginClassName()} onClick={this.userEdit.bind(this)}>{userName}</button>}
                        {this.state.showLoginLight?
                            <LoginBlockLight onLogin={this.props.onUserLogging} firehide={this.fireLoginLight.bind(this)}/>:''
                        }
                        {/*<div className={this.props.user.loginmsg.length?"popup show":"popup"} onClick={this.props.onClearErrorMsg}>*/}
                            {/*{this.props.user.loginmsg.length?<span className="popuptext" id="myPopup">{this.props.user.loginmsg}</span>:""}*/}
                        {/*</div>*/}
                    </div>
                    <div>
                        {userID>0&&<button className="logoutbtn" onClick={this.userLogout.bind(this)}>Выйти</button>}
                    </div>
                </div>

            </div>
            {/*<button className="logoutbtn" onClick={this.userRegister.bind(this)}>Регистрация</button>*/}
            <div className="navbar-shadow"></div>
            {(userID>0&&!this.props.user.verified)?
                <div className="descrAndAnnounce"><div className="description">Для начала работы проверьте письмо по адресу <b>{this.props.user.email}</b>, чтобы подтвердить электронный адрес</div></div>
                :""}
              {/*</CSSTransitionGroup>*/}
        </div>)
            // &&!(this.state.showLoginLight||(window.location.href.slice(-2)==="/r"&&userID===0))
         return (
            <div className="App">
                {/*<div className="loadCursor">*/}
                    {/*/!*<ReactLoading type={"spin"} color={"#52aee6"} height={'10%'} width={'10%'} />*!/*/}
                {/*</div>*/}
                {this.props.userSetup.loading?
                <div className="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>:""}
                    {/*<div className='sweet-loading'>*/}
                    {/*<ClipLoader*/}
                        {/*css={override}*/}
                        {/*sizeUnit={"px"}*/}
                        {/*size={150}*/}
                        {/*color={'#123abc'}*/}
                        {/*loading={this.state.loading}*/}
                    {/*/>*/}
                {/*</div>*/}
                {/*<CSSTransitionGroup {...transitionOptions}>*/}
                {/*<TransitionGroup>*/}
                {/*<TransitionGroup>*/}
                    {/*<div key={"test-22"}>Test</div>*/}
                {/*</TransitionGroup>*/}
                <div className="navbar" style={userID===0?{"justifyContent":  "flex-end"}:{"justifyContent":  "space-between"}}>
                    <div className="myTitle"><h3><Link to="/">Мои оценки</Link></h3></div>

                    {isMobile?
                        <MobileMenu userID={userID} userName={userName} isadmin={isadmin} withtomain={this.props.withtomain} userLogin={this.userLogin.bind(this)} userLogout={this.userLogout.bind(this)}/>:
                        userID>0 && <Menu className="menuTop" userid={userID} isadmin={isadmin}/>
                    }

                    {(window.location.href.slice(-3)==="/r3"&&userID===0)?
                        this.fireUserV3Login(window.location.href):""}

                    {isMobile?<div>

                        {this.state.showLoginLight||(window.location.href.slice(-2)==="/r"&&userID===0)?
                            <LoginBlockLight onLogin={this.props.onUserLogging} firehide={this.fireLoginLight.bind(this)}/>:""}

                        <div className={this.props.user.loginmsg.length?"popup show":"popup"} onClick={this.props.onClearErrorMsg}>
                            {this.props.user.loginmsg.length?<span className="popuptext" id="myPopup">{this.props.user.loginmsg}</span>:""}
                        </div>
                    </div>:""}


                    {!isMobile?<div className="logBtnsBlock">
                        <div>
                            {userID===0?
                                <button className={this.btnLoginClassName()} onClick={this.userLogin.bind(this)}>Вход</button>:
                                <button className={this.btnLoginClassName()} onClick={this.userEdit.bind(this)}>{userName}</button>}

                                {this.state.showLoginLight||(window.location.href.slice(-2)==="/r"&&userID===0)?
                                <LoginBlockLight onLogin={this.props.onUserLogging} firehide={this.fireLoginLight.bind(this)}/>:""}

                                <div className={this.props.user.loginmsg.length?"popup show":"popup"} onClick={this.props.onClearErrorMsg}>
                                {this.props.user.loginmsg.length?<span className="popuptext" id="myPopup">{this.props.user.loginmsg}</span>:""}
                                </div>
                        </div>
                        <div>
                            {userID>0&&<button className="logoutbtn" onClick={this.userLogout.bind(this)}>Выйти</button>}
                        </div>
                    </div>
                     :""}
                </div>

                <div className="navbar-shadow"></div>

                {isMobile?
                    <div className="descrAndAnnounce">
                        {classID?<span className="addRef">Cсылка для
                                    <a className="infoMsg" href={AUTH_URL+"/student/add/"+this.props.userSetup.addUserToken} target="_blank" rel="noopener noreferrer">{" добавления новых студентов "}</a></span>
                            :""
                        }
                        {   studentId === 0&&userID===0?<div className="description"><span>{descrFirst}</span></div>:
                            studentName?<div className="descrHeader">
                                                <div className="studentName">
                                                    <b>{studentName}</b>
                                                </div>
                                {!(this.props.userSetup.stats3===undefined)?
                                                <div className="lastRecords">
                                                    {"Последние [" + (new Date(this.props.userSetup.stats3.max)).toLocaleDateString() + ' ' +  (new Date(this.props.userSetup.stats3.max)).toLocaleTimeString() + ']: Оценок:' + this.props.userSetup.stats3.cnt}
                                                </div>:''}
                                        </div>:""}
                        {studentId?
                            <div className="app-homeWorkSection">
                                <HomeWorkSection withoutshadow={true} withouthead={true}/>
                            </div>
                            :""
                        }
                    </div>
                    :<div className="descrAndAnnounce">
                        {classID?<span className="addRef">Cсылка для
                        <a className="infoMsg" href={AUTH_URL+"/student/add/"+this.props.userSetup.addUserToken} target="_blank" rel="noopener noreferrer">{" добавления новых студентов "}</a></span>
                            :""
                        }
                        <div className="descrAndAnnounceNotMobile">
                                {studentId?
                                    <div className="app-homeWorkSection">
                                        <HomeWorkSection withoutshadow={true} withouthead={true}/>
                                    </div>
                                    :""
                                }
                            <div className="descrAndAnnounceMobile">
                            {   studentId === 0&&userID===0?<div className="description"><span>{descrFirst}</span></div>:
                                studentName?<div className="descrHeaderNotMobile">
                                    <div className="studentName">
                                        <b>{studentName}</b>
                                    </div>
                                    {!(this.props.userSetup.stats3===undefined)?
                                        <div className="lastRecords">
                                            {"Последние [" + (new Date(this.props.userSetup.stats3.max)).toLocaleDateString() + ' ' +  (new Date(this.props.userSetup.stats3.max)).toLocaleTimeString() + ']: Оценок:' + this.props.userSetup.stats3.cnt}
                                        </div>:''}
                                </div>:""}
                            </div>
                        </div>

                    </div>}
                    {   studentId === 0?
                        <div>
                            {/*<CSSTransition*/}
                                {/*key={"title-a-1"}*/}
                                {/*timeout={1000}*/}
                                 {/*classNames={*/}
                                     {/*{*/}
                                         {/*appear: 'title-appear',*/}
                                         {/*appearActive : 'title-appear-active',*/}
                                         {/*enter: 'title-enter',*/}
                                         {/*enterActive: 'title-enter-active',*/}
                                     {/*}*/}
                                 {/*}*/}
                                 {/*in={true}*/}
                            {/*>*/}
                            <TitleBlock title={!isMobile?`Шаг ${1}. Выберите класс:`:`${1}.Класс`}
                                        caption={classNumber === 0 ? "" : classNumber + "й"}
                                        done={!(Number(classNumber) === 0)}
                                        onclick={this.stepClick.bind(this)} step={1}
                                        hide={this.props.user.logging ? true : step1}
                                        myCity={this.state.myCity}
                                        myCountryCode={this.state.myCountryCode}
                            />
                            {/*</CSSTransition>*/}
                        </div>
                        :""}

                    {!step1&&!this.props.user.logging&&studentId === 0?
                    <div className="block-1">
                    <ClassList classtype="primary-school school" click={this.buttonClick.bind(this)} classnumber={classNumber} classlabel="Начальная школа" buttons={[1, 2, 3, 4]}/>
                    <ClassList classtype="secondary-school school" click={this.buttonClick.bind(this)} classnumber={classNumber} classlabel="Основная школа" buttons={[5, 6, 7, 8, 9]}/>
                    <ClassList classtype="high-school school" click={this.buttonClick.bind(this)} classnumber={classNumber} classlabel="Старшая школа" buttons={[10, 11]}/>
                    </div>
                    :""}

                {   studentId === 0 ?
                    <div>
                        <TitleBlock title={!isMobile?`Шаг ${2}. Количество учеников:`:`${2}.Ученики`} caption={pupilCount === 0 ? "" : pupilCount}
                                    done={!(Number(pupilCount) === 0)} onclick={this.stepClick.bind(this)} step={2}
                                    hide={step2}/>
                    </div>
                    :""
                }

                {!step2&&studentId === 0?
                    <div  className={this.showClassName("block-2", step2)}>
                        <RSlider id="rslider1" statename="pupilCount" onclick={this.changeState.bind(this)} values={!isMobile?[10,15,20,25,26,27,28,29,30,31,32,33,34,35,40]:[0,10,15,20,25,30,35,40]} set={[pupilCount]} range={false}/>
                    </div>
                :""}


                { !this.isShortList()&&studentId === 0 ?
                    <div>
                        <TitleBlock title={!isMobile?`Шаг ${3}. Учебный год:`:`${3}.Учебный год`} caption={currentYear === 0 ? "" : currentYear}
                                    done={!(currentYear === "")} onclick={this.stepClick.bind(this)} step={3}
                                    hide={step3}/>
                    </div>
                :""
                }
                {!this.isShortList()&& !step3 &&studentId === 0?
                    <RSlider id="rslider2" statename="currentYear" onclick={this.changeState.bind(this)} values={['', '2017/18', '2018/19', '2019/20']} set={[currentYear]} range={false}/>
                :""}

                <div>
                    <TitleBlock title={!isMobile?`Шаг ${!this.isShortList()?4:3}. Изучаемые предметы:`:`${!this.isShortList()?4:3}.Предметы`} caption={subjCount==="0/0"?"":subjCount}
                                done={!(subjCount==="0/0")} onclick={this.stepClick.bind(this)} step={!this.isShortList()?4:3} hide={!this.isShortList()?step4:step3}/>
                </div>

                {!(!this.isShortList()?step4:step3)?
                    subjects_list.length > 0?<SubjectList    classnumber={classNumber}
                                                             changestate={this.changeState.bind(this)}
                                                             step={4}
                                                             selectedsubjects={selectedSubjects}
                                                             selectedsubject={selectedSubj}
                                                             isnewmech={true}
                                                             subjects_list={subjects_list}
                                                             studentid ={studentId}
                    />
                        :<div className="descrAndAnnounce"><span className="infoMsg">Вначале нужно "Выбрать класс" для получения перечня предметов...</span></div>
                :""}

                {studentId === 0?
                <div>
                    <TitleBlock title={!isMobile?`Шаг ${!this.isShortList()?5:4}. Предмет для оценок:`:`${!this.isShortList()?5:4}.Выбранный`} caption={!isMobile?selectedSubj.subj_name_ua:(selectedSubj.id > 0?"Да":"")}
                                done={selectedSubj.id} onclick={this.stepClick.bind(this)} step={!this.isShortList()?5:4} hide={!this.isShortList()?step5:step4} />
                </div>
                    :""}
                {!(!this.isShortList()?step5:step4)&&studentId === 0?
                    selectedSubjects.length > 0?<SubjectList classnumber={classNumber}
                                                             changestate={this.changeState.bind(this)}
                                                             step={5}
                                                             selectedsubjects={selectedSubjects}
                                                             selectedSubj={selectedSubj}
                                                             isnewmech={true}/>
                        :<div className="descrAndAnnounce"><span className="infoMsg">Вначале нужно выбрать "Изучаемые предметы" для выбора конкретного...</span></div>
                    :""}
                {studentId === 0 ?
                    <div>
                        <TitleBlock title={!isMobile?`Шаг ${!this.isShortList()?6:5}. Маркер для оценок:`:`${!this.isShortList()?6:5}.Маркер оценок`} caption={!isMobile?markBlank.alias:(markBlank.alias.length?"Да":"")}
                                    done={!(markBlank.alias === "")} onclick={this.stepClick.bind(this)} step={!this.isShortList()?6:5}
                                    hide={!this.isShortList()?step6:step5}/>
                    </div>
                    :""
                }
                {!(!this.isShortList()?step6:step5)&&studentId === 0?
                    <div className="markBlanks">
                        <div id="markblank-1"><MarkBlank kind={1} withborder={true} nohover={true} onclick={this.changeState.bind(this)} selected={markBlank.id==="markblank_twelve"}/></div>
                        <div id="markblank-2"><MarkBlank kind={2} withborder={true} nohover={true} onclick={this.changeState.bind(this)} selected={markBlank.id==="markblank_five"}/></div>
                        <div id="markblank-3"><MarkBlank kind={3} withborder={true} nohover={true} onclick={this.changeState.bind(this)} selected={markBlank.id==="markblank_letters"}/></div>
                    </div>
                    :""}

                <div>
                    <TitleBlock title={!isMobile?`Шаг ${!this.isShortList()?7:6}. Дополнительные настройки:`:`${!this.isShortList()?7:6}.Настройки`}
                                        done={currentPeriodDateCount>0}
                                        caption={!isMobile?(currentPeriodDateCount.toString()+"дн,").concat(withoutholidays?"Б/вых-х,":"",titlekind==="NICK"?"+НИК":(titlekind==="EMAIL"?"+EMAIL":"+ИМЯ")):"Да"}
                                        onclick={this.stepClick.bind(this)} step={!this.isShortList()?7:6} hide={!this.isShortList()?step7:step6}/>
                </div>
                {!(!this.isShortList()?step7:step6)?
                    <div className="additionalSection">
                        <div><RadioGroup onclick={this.changeState.bind(this)} title="Зафиксировать выбираемый период в днях:" name={"rangedays"} defelem={currentPeriodDateCount} values={[{id:5, alias:5},{id:10, alias:10},{id:14, alias:14},{id:20, alias:20}]} addinput={true}/></div>
                        {studentId===0?<div><RadioGroup onclick={this.changeState.bind(this)} title="Выводить в столбце наименования учеников:" name={"listnames"} defelem={titlekind} values={[{id:"NAME", alias:"ИМЯ"},{id:"NICK", alias:"НИК"}, {id:"EMAIL", alias:"EMAIL"}]}/></div>:""}
                        {studentId===0?<div><RadioGroup onclick={this.changeState.bind(this)} title="Переходить автоматически на следующую позицию при вводе оценок:" name={"rangedirection"} defelem={direction} values={[{id:"UPDOWN", alias:"СВЕРХУ ВНИЗ"},{id:"LEFTRIGHT", alias:"СЛЕВА НАПРАВО"}]}/></div>:""}
                        <div><Checkbox onclick={this.changeState.bind(this)} bold={true} name={"withoutholidays"} defelem={withoutholidays} label=" В перечне дат для ввода оценок убрать выходные дни"/></div>
                        {studentId>0&&<EmailList studentID={studentId}  studentName={studentName}  userID={userID}/>}
                    </div>
                    :""}
                {studentId === 0?
                <div>
                    <TitleBlock title={!isMobile?`Шаг ${!this.isShortList()?8:7}. Журнал и установка оценок:`:`${!this.isShortList()?8:7}.Журнал`} done={this.state.isJournalClicked}
                                // caption={!isMobile?this.state.stats.hasOwnProperty('diff')&&'Лучшее время: ' +this.state.stats.tomark+' сек/оц-ку':this.state.stats.tomark+' ск/оц'} //+ dateDiff((new Date(this.state.stats.dd)), (new Date()))+'дн. назад '
                                // caption={!isMobile?this.state.stats.hasOwnProperty('diff')&&this.state.stats.tomark:this.state.stats.tomark+' ск/оц'} //+ dateDiff((new Date(this.state.stats.dd)), (new Date()))+'дн. назад '
                                caption={this.state.stats.hasOwnProperty('diff')&&this.state.stats.tomark} //+ dateDiff((new Date(this.state.stats.dd)), (new Date()))+'дн. назад '
                                isMarkSpeed={true}
                                onclick={this.stepClick.bind(this)} step={!this.isShortList()?8:7} hide={!this.isShortList()?step8:step7}/>
                </div>
                    :""}
                {!(!this.isShortList()?step8:step7)||studentId > 0?
                    <div className="tableSection">
                        {studentId === 0?
                            <Table  onclick={this.changeCell.bind(this)}
                                markblank={markBlank.pk}
                                dayscount={currentPeriodDateCount}
                                marks={this.state.marks}
                                size={pupilCount}
                                direction={direction}
                                withoutholidays={withoutholidays}
                                titlekind={titlekind}
                                changestate={this.changeState.bind(this)}
                        />:
                            <StudentTable  onclick={this.changeCell.bind(this)}
                                    markblank={markBlank.pk}
                                    dayscount={currentPeriodDateCount}
                                    marks={this.state.marks}
                                    size={pupilCount}
                                    direction={direction}
                                    withoutholidays={withoutholidays}
                                    titlekind={titlekind}
                                    changestate={this.changeState.bind(this)}
                                    onStudSubjChanged={this.onStudSubjChanged.bind(this)}
                            />}
                    </div>
                    :""}
                {studentId === 0 && this.props.userSetup.isadmin?
                <div>
                    <TitleBlock title={!isMobile?`Шаг ${!this.isShortList()?9:8}. Импорт/экспорт оценок в Excel:`:`${!this.isShortList()?9:8}.Excel-обмен`} done={false}
                                onclick={this.stepClick.bind(this)} step={!this.isShortList()?9:8} hide={!this.isShortList()?step9:step8}/>
                </div>
                    :""}
                {!(!this.isShortList()?step9:step8)&&studentId === 0?
                    <div className="additionalSection">
                        <button>
                            <a className="infoMsg" href={EXCEL_URL+"/"+this.props.userSetup.classID+'/'+'20190401'} target="_blank" rel="noopener noreferrer">
                            {"Получить файл для ввода оценок"}
                            </a>
                        </button>{/*onClick={this.getExcelFile.bind(this)}*/}
                        <button>Импорт оценок</button>
                        <button>Импорт справочника учеников</button>


                    </div>
                :""}

                {studentId === 0 && this.props.userSetup.isadmin?
                <div>
                    <TitleBlock title={!isMobile?`Шаг ${!this.isShortList()?10:9}. Диаграммы:`:`${!this.isShortList()?10:9}.Диаграммы`} done={false} onclick={this.stepClick.bind(this)}
                                step={!this.isShortList()?10:9} hide={!this.isShortList()?step10:step9}/>
                </div>
                    :""}
                {(!(!this.isShortList()?step10:step9)||studentId > 0)&&this.props.userSetup.marks.length?
                    <div className="additionalSection">
                        <Charts studSubj={this.state.studSubj}/>
                    </div>
                    :""}
                {((!(!this.isShortList()?step10:step9)&&classID > 0)||studentId > 0)?
                    <div className="additionalSection">
                        {this.props.userSetup.avgclassmarks.length?
                        <Chart
                            chartType="LineChart"
                            width="100%"
                            height="400px"
                            columns={data[1]}
                            rows={data[0]}
                            options={options}
                        />:""}
                    </div>
                    :""}

                {userID===0?
                <div>
                    <TitleBlock title={!isMobile?"Сохранить данные на будущее?":"Сохранить?"}
                                isyellow={true} done={false} onclick={this.stepClick.bind(this)}
                                isgrey={this.props.userSetup.stepsLeft}
                                caption={this.props.userSetup.stepsLeft?("осталось " + (this.props.userSetup.stepsLeft).toString() + (this.props.userSetup.stepsLeft===1?" шаг":(this.props.userSetup.stepsLeft<5)?" шага":" шагов")):""}
                                step={!this.isShortList()?11:10} hide={!this.isShortList()?step11:step10}/>
                </div>:""}
                {!(!this.isShortList()?step11:step10)&&userID===0&&!(this.props.userSetup.stepsLeft)?
                    <div>
                        <LoginBlock pupilcount = {pupilCount} usersetup={userSetup}
                                    changestate={this.changeState} onsetup={this.props.onSetSetup}/>
                    </div>:""}

                {/*{this.props.userSetup.isadmin?*/}
                    {/*<div>*/}
                        {/*<TitleBlock title={`Шаг ${!this.isShortList()?11:10}. Домашка:`} done={false}*/}
                                    {/*onclick={this.stepClick.bind(this)}*/}
                                    {/*step={!this.isShortList()?11:10}*/}
                                    {/*hide={!this.isShortList()?step11:step10}/>*/}
                    {/*</div>*/}
                    {/*:""}*/}
                {/*{!(!this.isShortList()?step11:step10)||studentId === 0?*/}
                            {/*<div className="homeWorkSectionMain">*/}
                                {/*<EmailList/>*/}
                                {/*<HomeWorkSection/>*/}
                            {/*</div>*/}
                    {/*:""}*/}
                {/*<Charts studSubj={this.state.studSubj}/>*/}
                {/*</CSSTransitionGroup>*/}
                {/*</TransitionGroup>>*/}

                {/*<Widget/>*/}

                {!this.state.displayChat?<div className={"btn-chat"} onClick={()=>{this.setState({displayChat:!this.state.displayChat})}}><img height={"40px"} src={ChatBtn} alt=""/></div>:""}

                {this.state.displayChat?
                    <Chat userID={userID} classID={classID} studentId={studentId} isservice={!classID} userName={userName}
                          session_id={this.props.userSetup.chatSessionID} homeworkarray={this.props.userSetup.homework} chatroomID={this.props.userSetup.classObj.chatroom_id}
                          subjs={selectedSubjects} btnclose={()=>{this.setState({displayChat:!this.state.displayChat})}}/>
                 :""}

            </div>


        );


        // console.log("step1", this.state.steps.step1)
  }
  // displayChat=()=>{
  //
  // }
}

// приклеиваем данные из store
const mapStateToProps = store => {
    // console.log(store) // посмотрим, что же у нас в store?
    return {
        user:       store.user,
        userSetup:  store.userSetup,
    }
}

const mapDispatchToProps = dispatch => {
    // console.log("mapDispatchToProps", this.props)
    // console.log("mapDispatchToProps", dispatch)
    // let {userSetup} = this.props
    return ({
        onInitState : () => dispatch(initState),
        onSetSetup: (data, userID, classNumber) => {
            // console.log("onSetSetup", data, userID)
            const asyncSetSetup = (data, userID, classNumber) =>{
                 return dispatch => {
                    let responsedata = []
                    // console.log('UPDATE_SETUP_LOCALLY', data, Object.keys(data)[0], Object.values(data)[0])
                    dispatch({type: 'UPDATE_SETUP_LOCALLY', payload: data})
                    if (Object.keys(data)[0]==="class_number") {
                        // dispatch({type: 'UPDATE_SETUP_LOCALLY', payload: data})
                        let postdata = JSON.parse(`{"subjects_list":"${Object.values(data)[0]}"}`);
                        document.body.style.cursor = 'progress';
                        instanceAxios().get(SUBJECTS_GET_URL+'/'+Object.values(data)[0], postdata)
                            .then(response => {
                                responsedata = response.data;
                                dispatch({type: 'UPDATE_SETUP_LOCALLY_SUBJLIST', payload: response.data})
                                let arr = response.data.map(value=>value.subj_key);//`{"subj_id": ${value.subj_id}}`
                                // console.log("RESPONSEDATA", responsedata, arr, Object.values(data)[0])
                                let postdata = `{"subjects_list":"${arr}"}`;
                                userID&&instanceAxios().post(UPDATESETUP_URL + '/' + userID, postdata)
                                    .then(response=>{
                                        // console.log('UPDATE_SETUP_SUCCESSFULLY_subjects_list', response.data, userID);
                                    })
                                    .catch(response => {
                                        // console.log('UPDATE_SETUP_FAILED_subjects_list', response);
                                        // dispatch({type: 'UPDATE_SETUP_FAILED', payload: response.data})
                                        // Список ошибок в отклике...
                                    })

                                let json = `{"subjects_count":"${response.data.length+"/0"}"}`;
                                let postjson = JSON.parse(json);
                                dispatch({type: 'UPDATE_SETUP_LOCALLY', payload: postjson});
                                document.body.style.cursor = 'default';
                            })
                            .catch(response => {
                                // console.log(response);
                                dispatch({type: 'UPDATE_SETUP_FAILED', payload: response.data})
                                // Список ошибок в отклике...
                            })
                    }
                    if (userID) {
                        if (Object.keys(data)[0]==="selected_subjects") {
                            // console.log("SELECTED_SUBJECTS", data, Object.values(data)[0], Object.values(data)[0].map(val=>val.subj_key), Object.values(data)[0].map(val=>val.subj_key).join())
                            // console.log(data)
                            let json = `{"selected_subjects":"${Object.values(data)[0].map(val=>val.subj_key).join()}"}`;
                            data = JSON.parse(json);
                            // return
                        }

                        if (Object.keys(data)[0]==="students") {
                            // console.log("STUDENTS_GET_URL", userID, data, JSON.stringify(data))
                            instanceAxios().post(STUDENTS_GET_URL + '/' + userID + '/class/' + classNumber, JSON.stringify(data))
                                .then(response => {
                                    // console.log('UPDATE_STUDENTS_REMOTE', response.data)
                                    dispatch({type: 'UPDATE_STUDENTS_REMOTE', payload: response.data})
                                })
                                .catch(response => {
                                    // console.log(response);
                                    dispatch({type: 'UPDATE_STUDENTS_FAILED', payload: response.data})
                                })
                        }
                        else {
                            // console.log("UPDATESETUP_URL", userID, data, JSON.stringify(data))
                            instanceAxios().post(UPDATESETUP_URL + '/' + userID, data)
                                .then(response => {
                                    // console.log(response, response.data, userID);
                                    dispatch({type: 'UPDATE_SETUP_REMOTE', payload: response.data})

                                })
                                .catch(response => {
                                    // console.log(response);
                                    dispatch({type: 'UPDATE_SETUP_FAILED', payload: response.data})
                                 })
                            // Проайпдейтим и список классов в настройках пользователя
                        }
                    }
                }
            }

            dispatch(asyncSetSetup(data, userID, classNumber))
        },
        onUserLogging : (name, pwd, provider, provider_id) =>{
            const asyncLoggedIn = (name, pwd, provider, provider_id) =>{
                return dispatch => {
                    dispatch(userLoggedIn(name, pwd, provider, provider_id))
                }}
                dispatch(asyncLoggedIn(name, pwd, provider, provider_id))
                },
        onUserLoggingByToken : (email, token, kind)=>{
            const asyncLoggedInByToken = (email, token, kind) =>{
                return dispatch => {
                    dispatch(userLoggedInByToken(email, token, kind))
                }}
            dispatch(asyncLoggedInByToken(email, token, kind))
        },
        onUserLoggingOut  : token => {
            // browserHistory.push('/');
            return dispatch(userLoggedOut(token))
        },
        onClearErrorMsg : ()=>{
            // console.log("onClearErrorMsg")
            dispatch({type: 'USER_MSG_CLEAR', payload: []})
        },
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
        onStudentChartSubject  : value => {
            return dispatch({type: 'UPDATE_STUDENT_CHART_SUBJECT', payload: value})
        },
        onStopLogging : ()=> dispatch({type: 'USER_LOGGEDIN_DONE', payload: []}),
        onStopLoading : ()=> dispatch({type: 'APP_LOADED'}),
        onStartLoading : ()=> dispatch({type: 'APP_LOADING'}),
        onChangeStepsQty : (steps)=>dispatch({type: 'ENABLE_SAVE_STEPS', payload : steps})
    })
}
// в наш компонент App, с помощью connect(mapStateToProps)
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withCookies(App)))

