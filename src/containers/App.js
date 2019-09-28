import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios';
import ClassList from '../components/ClassList/classlist'
import RSlider from '../components/RangeSlider/rslider'
import SubjectList from '../components/SubjectList/subjectlist'
import TitleBlock from '../components/TitleBlock/titleblock'
import MarkBlank from '../components/MarkBlank/markblank'
import Checkbox from '../components/CheckBox/checkbox'
import RadioGroup from '../components/RadioGroup/radiogroup'
import Table from '../components/MarksTable/markstable'
import StudentTable from '../components/StudentTable/studenttable'
import Chart from "react-google-charts";
import EmailList from '../components/EmailList/emaillist'
import HomeWorkSection from '../components/AdminHomeWorkSection/homeworksection'
import { Link } from 'react-router-dom';
import MobileMenu from '../components/MobileMenu/mobilemenu'
import Charts from '../components/Charts/charts'
import { userLoggedIn, userLoggedInByToken, userLoggedOut } from '../actions/userAuthActions'
import Chat from '../components/Chat/chat'
import 'react-chat-widget/lib/styles.css';
import {Pusher} from 'pusher-js'
import { AUTH_URL, API_URL, EXCEL_URL, UPDATESETUP_URL, SUBJECTS_GET_URL, STUDENTS_GET_URL, MARKS_STATS_URL,
        arrLangs, defLang}        from '../config/config'
import {numberToLang, msgTimeOut, instanceAxios, mapStateToProps, getLangLibrary,
        toYYYYMMDD, getLangByCountry, waitCursorBlock, getDefLangLibrary} from '../js/helpers'

import LoginBlock from '../components/LoginBlock/loginblock'
import LoginBlockLight from '../components/LoginBlockLight/loginblocklight'
import Menu from '../components/Menu/menu'
import ChatBtn from "../img/chat-btn.svg"
import AndroidBtn from "../img/android-icon-small.png"
import './App.css';
import { withCookies } from 'react-cookie';
import { store } from '../store/configureStore'
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import Logo from '../img/LogoMyMsmall.png'

// import Chart from "react-google-charts/dist/ReactGoogleCharts.d";
// import {CSSTransitionGroup, CSSTransition, TransitionGroup } from 'react-transition-group/CSSTransitionGroup';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
            isMobile : window.innerWidth < 400 || (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)),
            stats : localStorage.getItem("markStats")===null?{}:JSON.parse(localStorage.getItem("markStats")),
            isJournalClicked : false,
            stepsLeft : 7,
            displayChat : false,
            displayNewChat : false,
            chatMessages : [],
            newChatMessages : 0,
            newHomeworkMessages : 0,
            langLibrary : {}
        }
        this.userGot = false
        this.loading = true
        // this.getChatMessages = this.getChatMessages.bind(this)
        this.updateMessages = this.updateMessages.bind(this)
        this.newChatMessage = this.newChatMessage.bind(this)
        this.userLogout = this.userLogout.bind(this)
        this.onSelectLang = this.onSelectLang.bind(this)
        this.langBlock = this.langBlock.bind(this)
        this.loginBlock = this.loginBlock.bind(this)
        this.initLangLibrary = this.initLangLibrary.bind(this)
        this.clickClassButton = this.clickClassButton.bind(this)
    }

    componentWillUnmount() {
    }

    componentWillMount(){
        (async()=>{
            this.getSessionID();
            // await getLangLibrary(localStorage.getItem("langCode")?localStorage.getItem("langCode"):defLang)
            await this.getGeo();
            await this.getStats();
        })();
    }
    getAsync =  async (lang)=> {
        if(
        !lang
            ) {
        lang = localStorage.getItem("langCode") ? localStorage.getItem("langCode") : defLang
        }
        let langObj = {}
        // console.log("getLangLibrary:start")
        let {token} = store.getState().user

        const  headers = {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE, OPTIONS',
        }
        await axios.get(AUTH_URL + ('/api/langs/get' + (lang ? ('/' + lang) : '')), {}, headers)
            .then(res=> {
                    res.data.forEach(item => langObj[item.alias] = item.word)
                    this.setState({langLibray: langObj});
                    // console.log("getLangLibrary:end")
                    this.props.onReduxUpdate("LANG_LIBRARY", langObj)
                    this.props.onStopLoading()
                }
                )
     }
    componentDidMount(){
        this.props.onStartLoading()
        // console.log("start")
        let lb = this.getAsync(localStorage.getItem("langCode")?localStorage.getItem("langCode"):defLang)//getLangLibrary(localStorage.getItem("langCode")?localStorage.getItem("langCode"):defLang)
        // console.log("end");

        let {langLibrary} = this.state//this.props.userSetup

        // console.log("componentDidMount")

        if (!(window.localStorage.getItem("myMarks.data") === null)&&!(window.localStorage.getItem("userSetup")&&window.localStorage.getItem("userSetupDate")===toYYYYMMDD(new Date()))) {
            // console.log("componentDidMount.1", langLibrary)

            let localstorage = JSON.parse(window.localStorage.getItem("myMarks.data"))
            let {email, token, class_id : classID} = localstorage

            this.props.onUserLoggingByToken(email, token, null, langLibrary);
            // this.props.onStopLoading()
        }
        else if (window.localStorage.getItem("userSetup")&&window.localStorage.getItem("userSetupDate")===toYYYYMMDD(new Date())) {
            // console.log("USER_SETUP", JSON.parse(window.localStorage.getItem("userSetup")))
            // console.log("componentDidMount:langLibrary", langLibrary)
            // this.initLangLibrary(langLibrary, true)
           }
        else {
            // console.log("else")
            // this.initLangLibrary(langLibrary, true)
            // this.props.onStopLoading()
        }
        this.props.onReduxUpdate("IS_MOBILE", this.state.isMobile)
        this.props.onChangeStepsQty(this.isSaveEnabled())
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log("shouldComponentUpdate", this.props.userSetup.langLibrary, nextProps.userSetup.langLibrary)
        if ((this.props.userSetup.chatSessionID !== nextProps.userSetup.chatSessionID))
             return false
            // return this.props.userSetup.chatSessionID !== nextProps.userSetup.chatSessionID
        else
        // if ((!this.state.langLibrary)||(this.props.userSetup.langLibrary=={}))
        if (!this.state.langLibrary)
            return false
        else {
            // this.props.onStopLoading()
            return true
        }
    }

    initLangLibrary=(langLibrary, setRedux)=>{
        console.log("initLangLibrary", langLibrary)
        if ((!langLibrary)||langLibrary===undefined||langLibrary==="undefined"||JSON.stringify(langLibrary)===JSON.stringify({})) {
            // console.log("initLangLibrary.2", langLibrary, setRedux, this.state.myCountryCode)

            langLibrary = getLangLibrary(localStorage.getItem("langCode")?localStorage.getItem("langCode"):defLang)
            // console.log("initLangLibrary.3", langLibrary, setRedux, this.state.myCountryCode, this.props.userSetup)
            if (setRedux) this.props.onReduxUpdate("LANG_LIBRARY", langLibrary)

            // console.log("initLangLibrary.4", langLibrary, setRedux, this.state.myCountryCode, this.props.userSetup)
        }
        return langLibrary //getLangLibrary(localStorage.getItem("langCode")?localStorage.getItem("langCode"):defLang)
    }
    onSelectLang=async countryCode=>{
        this.props.onStartLoading()
        let lb = this.getAsync(countryCode)//getLangLibrary(localStorage.getItem("langCode")?localStorage.getItem("langCode"):defLang)

        this.props.onReduxUpdate("LANG_LIBRARY", this.state.langLibrary)
        localStorage.setItem("langCode", countryCode)
        localStorage.setItem("langLibrary", JSON.stringify(this.state.langLibrary))
        // console.log(countryCode)
    }
    /*
* Обновляем перечень сообщений
* */
    newChatMessage=isHomeWork=>{
        // console.log("newChatMessage", this.state.displayChat, this.state.newChatMessages)
        const newChatMessages = (this.state.newChatMessages) + 1
        const newHomeworkMessages = (this.state.newHomeworkMessages) + 1
        if (!this.state.displayChat)    {
            this.setState({newChatMessages})
            if (isHomeWork)
                this.setState({newHomeworkMessages})
        }
    }
    updateMessages = (stateValue) => {
        this.setState({chatMessages : [...this.state.chatMessages, stateValue]})
    }

    // getChatMessages=(classID, localState, reduxState)=>{
    //     console.log('getChatMessages', this.props.userSetup.classID, classID)
    //     instanceAxios().get(API_URL +`chat/get/${classID}`, [], null)
    //         .then(resp => {
    //             this.setState({localState : resp.data})
    //             this.props.onReduxUpdate(reduxState, resp.data)
    //             console.log('resp.data', resp, resp.data, resp.data.data)
    //         })
    //         .catch(error => {
    //             console.log('getChatMessagesError', error)
    //         })
    // }

    getSessionID(){
        let session_id = ''
        let header = {
            headers: {
                'Content-Type': 'x-www-form-urlencoded',
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' : 'GET',
            }
        }
        axios.get(API_URL +'session', [], header)
                .then(response=>{
                    session_id = response.data.session_id
                    this.props.onReduxUpdate('CHAT_SESSION_ID', session_id)
                    localStorage.setItem('chatSessionID', session_id)
                    // console.log("session", session_id);
            })
                .catch(response => {
            })
            return session_id
    }
    isSaveEnabled=()=>{
        let donesteps = 0, planSteps = 7
        let {pupilCount, subjCount, currentPeriodDateCount, markBlank,
            classNumber, selectedSubj} = this.props.userSetup;
            donesteps = (!(classNumber===0)?1:0) + (!(Number(pupilCount) === 0)?1:0) + (!(subjCount.slice(-2)==="/0")?1:0) +((selectedSubj.id>0)?1:0) +(!(markBlank.alias === "")?1:0)+(currentPeriodDateCount>0?1:0) + (this.state.isJournalClicked?1:0)
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
      let countryCode = "UA"
      // console.log("getGEO")
      // instanceAxios().get("http://ip-api.com/json", [])
      // axios.get("http://ip-api.com/json")
      if (!(localStorage.getItem("statsDate") === (new Date().toLocaleDateString()))) {
      axios.get("https://ipapi.co/json/")
          .then(response=>{
              console.log("getGeo", response.data);
              if (!(response.data.city===localStorage.getItem("city"))) {
                  countryCode = response.data.country
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
                  localStorage.setItem("langCode", arrLangs.includes(response.data.country)?response.data.country:defLang)

              }
          })
          .catch(response => {
              this.setState(
                  {
                      myCity: "Kyiv",
                      myCountry: "Ukraine",
                      myCountryCode: "UA",
                      // langCode: "UA"
                  }
              )
              localStorage.setItem("myCity", "Kyiv")
              localStorage.setItem("myCountry", "Ukraine")
              localStorage.setItem("myCountryCode", "UA")
              localStorage.setItem("langCode", defLang)
          })
      }
      else {
            // console.log("getGEO", this.state.myCountryCode, this.state.myCountryCode===undefined, this.state.myCountryCode==="undefined")
            if ((!this.state.myCountryCode)||this.state.myCountryCode==="undefined") {
                this.setState(
                    {
                        myCity: "Kyiv",
                        myCountry: "Ukraine",
                        myCountryCode: "UA",
                    }
                )
                localStorage.setItem("myCity", "Kyiv")
                localStorage.setItem("myCountry", "Ukraine")
                localStorage.setItem("myCountryCode", "UA")
                if (!localStorage.getItem("langCode")) localStorage.setItem("langCode", defLang)
            }
      }
      // console.log("onReduxUpdate", countryCode)
      this.props.onReduxUpdate("countryCode", countryCode)
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
    }
  clickClassButton(event) {
      const classNumber = Number(event.target.id.toString().replace("btn-class-",""));
      let {classNumber : classNumberOriginal} = this.props.userSetup;
      if (classNumber!==classNumberOriginal) {
          let json = `{"class_number":${classNumber}}`;
          let data = JSON.parse(json);
          this.props.onSetSetup(data, this.props.userSetup);
      }
    }

  changeState(name, value) {
      let json, data;
      let {pupilCount, students : studs, userID, subjects_list, selectedSubjects, classID, langLibrary} = this.props.userSetup;
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
                    this.props.onSetSetup(data, this.props.userSetup) // curClass
                }
                json = `{"pupil_count":${value}}`; break;
            case 'currentYear' :
                json = `{"year_name":"${value.toString().replace(/[/]/g, '\\/')}"}`; break;
              case "selectedSubj" :
                  console.log("selectedSubj", value,
                        subjects_list.filter(val=>(val.subj_key===value[0])),
                        subjects_list, value[0]
                  );
                  value.push(subjects_list.filter(val=>(val.subj_key===value[0]))[0].id)
                  // console.log("SELECTED_SUBJ", this.props.userSetup.subjects_list.filter(val=>(val.subj_key===value[0])), value);
                  json = `{"selected_subject":"${value}"}`; break;
              case "subjCount" :
                  // console.log("selectedSubjsArray", selectedSubjects);
                  json = `{"subjects_count":"${subjects_list.length+'/'+ selectedSubjects[0]===""?0:selectedSubjects.length}"}`; break;
              case "selectedSubjects" : // Количество выбранных для отслеживания оценок

                  json = `{"selected_subjects":[${value.map(val=>`{"subj_key":"${val.subj_key}","subj_name_ua":"${val.subj_name_ua}"}`)}]}`;
                  data = JSON.parse(json);
                  // console.log("selected_subjects", value, json);
                  this.props.onSetSetup(data, this.props.userSetup); // curClass
                  json = `{"subjects_count":"${subjects_list.length +'/'+ value.length}"}`; break;
              case "markBlank" :
                  let   alias = "", pk = 0; //id = value;
                  switch (value) {
                      case "markblank_twelve" : alias = `${langLibrary.markName12}`; pk = 1; break;
                      case "markblank_five" : alias = `${langLibrary.markName5}`; pk = 2; break;
                      case "markblank_letters" : alias = `${langLibrary.markNameAD}`; pk = 3; break;
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
      this.props.onSetSetup(data, this.props.userSetup); //curClass
   }

   refreshSteps(steps, keyValue) {
       for(let key in steps){
           if (!(key===keyValue))
               steps[key] = true;
       }
       // console.log('refreshSteps', keyValue)
       if (keyValue === (!this.isShortList()?'step8':'step7')) {
           this.setState({isJournalClicked : true})
       }

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
    // showClassName(clsName, isFade){
    //     return !isFade?(clsName +" fadeout"): clsName
    // }
    userEdit(){    }
    userRegister() {    }
    fireLoginLight(hide) { this.setState({ "showLoginLight" : !hide })
        console.log("fireLoginLight")
        // if (hide) this.props.onStopLoading()
        this.props.history.push('/');
        if (this.props.user.loginmsg.length>0) {this.clearError()}
    }
    // btnLoginClassName=()=>(
    //     this.props.userSetup.userID > 0?"loginbtn loggedbtn":"loginbtn"
    // )
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

        this.props.onStudentChartSubject(map)
    }
    sleep=(ms)=> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    isShortList=()=>{
        return this.state.shotsteplist
    }
    getExcelFile(){
        document.body.style.cursor = 'progress';

        instanceAxios().get(EXCEL_URL+'/'+this.props.userSetup.classID+'/20190320', {})
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
        return [retArr, columns];
    }
    fireUserV3Login=url=>{
        let arr = url.toString().split('/r3/')[1].replace('/r3','').trim()
        let namelen = Number(arr.substring(0, 6)) - 42
        let name = arr.slice(-namelen)
        let pwd = arr.substring(6).replace(arr.slice(-namelen), '')
        const {myCountryCode} = this.state
        console.log('URL', url, namelen, arr.slice(-namelen), arr.substring(6).replace(arr.slice(-namelen), ''))
        // console.log(name, pwd)
        this.props.onUserLogging(name, pwd, '', '', getLangLibrary(myCountryCode?myCountryCode:defLang));
        this.props.history.push('/');
    }
    userLogin() {
        // console.log("onUserLogin")
        this.setState({ "showLoginLight" : !this.state.showLoginLight })
    }
    userLogout() {
        // console.log('userLOGOUT')
        const {myCountryCode} = this.state
        window.localStorage.removeItem("myMarks.data");
        window.localStorage.removeItem("userSetup")
        window.localStorage.removeItem("userSetupDate")
        this.hideSteps();
        this.props.onUserLoggingOut(this.props.userSetup.token, getLangLibrary(myCountryCode?myCountryCode:defLang))
    }
    langBlock=()=>{
        return <div style={{"width" : "80px"}}>
            <ReactFlagsSelect
            defaultCountry={localStorage.getItem("langCode")?localStorage.getItem("langCode"):defLang}
            placeholder={getLangByCountry(this.state.myCountryCode)}
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
                {/*{console.log("loginBlock", this.props.user.loginmsg)}*/}
                {/*<div>{this.props.user.loginmsg}</div>*/}
                <div className={this.props.user.loginmsg.length?"popup show":"popup"} onClick={this.props.onClearErrorMsg}>
                    {this.props.user.loginmsg.length?<span className="popuptext" id="myPopup">{this.props.user.loginmsg}</span>:""}
                </div>
            </div>
            <div>
                {userID>0?<button className="logoutbtn" onClick={this.userLogout}><div className="mym-app-button-name">{userName}</div><div className="mym-app-button-exit">{langLibrary.exit}</div></button>:null}
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
    markBlankAlias=(pk, langLibrary)=>{
        switch(pk) {
            case 1 :
                return langLibrary.markName12
                break;
            case 2 :
                return langLibrary.markName5
                break;
            case 3 :
                return langLibrary.markNameAD
                break;
            default :
                return langLibrary.markNameAD
                break;
        }
    }
    render() {


        let {userID, userName, pupilCount, currentYear, subjCount, currentPeriodDateCount, markBlank,
            direction, titlekind, withoutholidays, classNumber, selectedSubjects, selectedSubj,
            subjects_list, studentId, studentName, classID, isadmin, loading} = this.props.userSetup;

        // console.log("LANGLIBRARY", langLibrary, this.state.myCountryCode)

        // let langLibrary = this.state.langLibrary
        // console.log("LANGLIBRARY_AFTER", this.props.userSetup.langLibrary)
        let langLibrary = getDefLangLibrary()
        if (this.props.userSetup.langLibrary) {
            if (Object.keys(this.props.userSetup.langLibrary).length) {
                langLibrary = this.props.userSetup.langLibrary
            }
        }
        let {isMobile} = this.state;
        let {step1,step2,step3,step4,step5,step6,step7,step8,step9,step10,step11} = this.state.steps;

        // console.log("clearError",this.props.user.loginmsg.length, this.props.user.loginmsg)

        const options = {
            title: "Общеклассная динамика успеваемости по предметам",
            curveType: "function",
            interpolateNulls: true,
            legend: { position: "bottom" },
            chartArea:{left:35,top:30,width:"100%",height:"80%"},
            // pointsVisible: true,
        };
        let data = this.prepDataForChart([])

        // console.log("APP_RENDER", loading, langLibrary, this.state.langLibrary)

        // *************************
        // Если идёт загрузка
        // *************************
        if (loading||loading===-1)
            return (
            <div className="App">
                {loading?this.waitCursorBlock():null}
                <div className="navbar">
                    <div className="navBlock">
                        <div style={{"display": "flex", "justifyContent" : "space-between", "alignItems" : "center"}}>
                            <Link to="/"><img src={Logo} alt={"My.Marks"}/></Link>
                            <div className="myTitle"><h3><Link to="/">{langLibrary.siteName}</Link></h3></div>
                        </div>
                    </div>
                    <div className="navBlockEx">
                        {userID?<Menu className="menuTop"
                                      userid={userID}
                                      isadmin={isadmin}
                                      withtomain={true}
                                      langlibrary={langLibrary}/>:null}
                        {this.loginBlock(userID, userName, getDefLangLibrary())}
                    </div>
                </div>
                <div className="navbar-shadow"></div>
            </div>);


        // console.log("this.props.USERSETUP: ", this.props.userSetup);
        // return (<div>111</div>)

        let descrFirst = `${langLibrary.introBegin} ${this.isShortList()?"7":"10"} ${langLibrary.introEnd}:`
        // this.props.history.push('/');

        // const transitionOptions = {
        //     transitionName : "moveButtons",
        //     transitionEnterTimeout: 500,
        //     transitionLeaveTimeout : 500
        // }

        // *************************
        // Если верификация
        // *************************
        if (this.props.user.id > 0 && !this.props.user.verified)
        return (
          <div className="App">
              {loading?this.waitCursorBlock():null}
              {/*<CSSTransitionGroup {...transitionOptions}>*/}
            <div className="navbar">
                <div className="navBlock">
                    <div style={{"display": "flex", "justifyContent" : "space-between", "alignItems" : "center"}}>
                        <Link to="/"><img src={Logo} alt={"My.Marks"}/></Link>
                        <div className="myTitle"><h3><Link to="/">{langLibrary.siteName}</Link></h3></div>
                    </div>
                </div>
                <div className="navBlockEx">
                    {userID?<Menu className="menuTop"
                                  userid={userID}
                                  isadmin={isadmin}
                                  withtomain={true}
                                  langlibrary={langLibrary}/>:null}
                    {this.loginBlock(userID, userName, langLibrary)}
                </div>
            </div>
            <div className="navbar-shadow"></div>

            {(userID>0&&!this.props.user.verified)?
            <div className="descrAndAnnounce"><div className="description">Для начала работы проверьте письмо по адресу <b>{this.props.user.email}</b>, чтобы подтвердить электронный адрес</div></div>
            :null}

            { (window.location.href.slice(-3)==="/hw")?this.props.history.push('/hw'):null}
            { (window.location.href.slice(-6)==="/admin")?this.props.history.push('/admin'):null}

            {/*</CSSTransitionGroup>*/}
        </div>)

        // *************************
        // Если основной блок
        // *************************
         return (
            <div className="App">
                {loading?this.waitCursorBlock():null}
                { (window.location.href.slice(-3)==="/hw")?this.props.history.push('/hw'):null}
                { (window.location.href.slice(-6)==="/admin")?this.props.history.push('/admin'):null}
                {/*<CSSTransitionGroup {...transitionOptions}>*/}
                {/*<TransitionGroup>*/}
                {/*<TransitionGroup>*/}
                    {/*<div key={"test-22"}>Test</div>*/}
                {/*</TransitionGroup>*/}
                <div className="navbar">
                    <div className="navBlock">
                        <div style={{"display": "flex", "justifyContent" : "space-between", "alignItems" : "center"}}>
                            <Link to="/"><img src={Logo} alt={"My.Marks"}/></Link>
                            <div className="myTitle"><h3><Link to="/">{langLibrary.siteName}</Link></h3></div>
                        </div>
                    </div>
                    <div className="navBlockEx">
                        {isMobile?<MobileMenu userID={userID}
                                              userName={userName}
                                              isadmin={isadmin}
                                              withtomain={this.props.withtomain}
                                              userLogin={this.userLogin.bind(this)}
                                              userLogout={this.userLogout}
                                              langlibrary={langLibrary}/>:
                            userID?<Menu className="menuTop"
                                         userid={userID}
                                         isadmin={isadmin}
                                         langlibrary={langLibrary}/>:null}
                        {(window.location.href.slice(-3)==="/r3"&&userID===0)?
                            this.fireUserV3Login(window.location.href):""}
                        {isMobile?<div>
                            {this.state.showLoginLight||(window.location.href.slice(-2)==="/r"&&userID===0)?
                                <LoginBlockLight onLogin={this.props.onUserLogging} langLibrary={langLibrary} firehide={this.fireLoginLight.bind(this)}/>:null}

                            <div className={this.props.user.loginmsg.length?"popup show":"popup"} onClick={this.props.onClearErrorMsg}>
                                {this.props.user.loginmsg.length?<span className="popuptext" id="myPopup">{this.props.user.loginmsg}</span>:""}
                            </div>
                        </div>:""}
                        {!isMobile?this.loginBlock(userID, userName, langLibrary):null}
                    </div>
                </div>
                <div className="navbar-shadow"></div>
                {isMobile?
                    <div className="descrAndAnnounce">
                        {classID?<span className="addRef">{langLibrary.refNewStudentBegin}
                                    <a className="infoMsg" href={AUTH_URL+"/student/add/"+this.props.userSetup.addUserToken} target="_blank" rel="noopener noreferrer"> {langLibrary.refNewStudentEnd}</a></span>
                            :null
                        }
                        {userID?<div className={"downloadAdnroid"}>
                            <div>
                                <img style={{left : "30px"}} height={"20px"} src={AndroidBtn} alt=""/></div>
                            <div>
                                <span style={{color: "#707070"}}> Скачать </span>
                                <a className="infoMsgAndroid" href={API_URL +"android"} target="_blank" rel="noopener noreferrer">
                                    Android-приложение</a>
                            </div>
                        </div>:null}
                        {   studentId === 0&&userID===0?
                            <div className="description-main"><span>{descrFirst}</span></div>:

                            studentName?<div className="descrHeader">
                                                <div className="studentName">
                                                    <b>{studentName}</b>
                                                </div>
                                {!(this.props.userSetup.stats3===undefined)?
                                                <div className="lastRecords">
                                                    {"Последние [" + (new Date(this.props.userSetup.stats3.max)).toLocaleDateString() + ' ' +  (new Date(this.props.userSetup.stats3.max)).toLocaleTimeString() + ']: Оценок:' + this.props.userSetup.stats3.cnt}
                                                </div>:null}
                                        </div>:null}
                        {studentId?
                            <div className="app-homeWorkSection">
                                <HomeWorkSection withoutshadow={true} withouthead={true}/>
                            </div>
                            :null}
                    </div>
                    :<div className="descrAndAnnounce">
                        {classID?<span className="addRef">{`${langLibrary.refNewStudentBegin} `}
                        <a className="infoMsg" href={AUTH_URL+"/student/add/"+this.props.userSetup.addUserToken} target="_blank" rel="noopener noreferrer">{` ${langLibrary.refNewStudentEnd}`}</a></span>
                            :""
                        }
                        <div className="descrAndAnnounceNotMobile">
                            {studentId?
                                <div className="app-homeWorkSection">
                                    <HomeWorkSection withoutshadow={true} withouthead={true}/>
                                </div>
                                :null
                            }
                            {/*<div className="descrAndAnnounceMobile">*/}
                            {   studentId === 0&&userID===0?<div className="description-main"><span>{descrFirst}</span></div>:
                                studentName?
                                    <div className="descrHeaderNotMobile">
                                        <div className={"downloadAdnroid"}>
                                            <div>
                                                <img style={{left : "30px"}} height={"20px"} src={AndroidBtn} alt=""/></div>
                                            <div>
                                                <span style={{color: "#707070"}}> Скачать </span>
                                                <a className="infoMsgAndroid" href={API_URL +"android"} target="_blank" rel="noopener noreferrer">
                                                Android-приложение</a>
                                            </div>
                                        </div>
                                        <div className="studentName">
                                            <b>{studentName}</b>
                                        </div>
                                        {!(this.props.userSetup.stats3===undefined)?
                                            <div className="lastRecords">
                                                {"Последние [" + (new Date(this.props.userSetup.stats3.max)).toLocaleDateString() + ' ' +  (new Date(this.props.userSetup.stats3.max)).toLocaleTimeString() + ']: Оценок:' + this.props.userSetup.stats3.cnt}
                                            </div>:''}
                                </div>:null}
                            {/*</div>*/}
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
                            <TitleBlock title={!isMobile?`${langLibrary.step} ${1}${langLibrary.step1Descr}`:`${1}${langLibrary.step1DescrMob}`}
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
                    <ClassList classtype="primary-school school" click={this.clickClassButton} classnumber={classNumber} classlabel={`${langLibrary.schoolPrimary} `} buttons={[1, 2, 3, 4]}/>
                    <ClassList classtype="secondary-school school" click={this.clickClassButton} classnumber={classNumber} classlabel={`${langLibrary.schoolMain} `} buttons={[5, 6, 7, 8, 9]}/>
                    <ClassList classtype="high-school school" click={this.clickClassButton} classnumber={classNumber} classlabel={`${langLibrary.schoolHigh} `} buttons={[10, 11]}/>
                    </div>
                    :""}

                {   studentId === 0 ?
                    <div>
                        <TitleBlock title={!isMobile?`${langLibrary.step} ${2}${langLibrary.step2Descr}`:`${2}${langLibrary.step2DescrMob}`} caption={pupilCount === 0 ? "" : pupilCount}
                                    done={!(Number(pupilCount) === 0)} onclick={this.stepClick.bind(this)} step={2}
                                    hide={step2}/>
                    </div>
                    :""
                }

                {!step2&&studentId === 0?
                    <div  className={!step2?("block-2 fadeout"): "block-2"}>
                        <RSlider id="rslider1" statename="pupilCount" onclick={this.changeState.bind(this)} values={!isMobile?[10,15,20,25,26,27,28,29,30,31,32,33,34,35,40]:[0,10,15,20,25,30,35,40]} set={[pupilCount]} range={false}/>
                    </div>
                :""}


                { !this.isShortList()&&studentId === 0 ?
                    <div>
                        <TitleBlock title={!isMobile?`${langLibrary.step} ${3}${langLibrary.step3Descr}`:`${3}${langLibrary.step3DescrMob}`} caption={currentYear === 0 ? "" : currentYear}
                                    done={!(currentYear === "")} onclick={this.stepClick.bind(this)} step={3}
                                    hide={step3}/>
                    </div>
                :""
                }
                {!this.isShortList()&& !step3 &&studentId === 0?
                    <RSlider id="rslider2" statename="currentYear" onclick={this.changeState.bind(this)} values={['', '2017/18', '2018/19', '2019/20']} set={[currentYear]} range={false}/>
                :""}

                <div>
                    <TitleBlock title={!isMobile?`${langLibrary.step} ${!this.isShortList()?4:3}${langLibrary.step3Descr}`:`${!this.isShortList()?4:3}${langLibrary.step3DescrMob}`} caption={subjCount==="0/0"?"":subjCount}
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
                        :<div className="descrAndAnnounce"><span className="infoMsg">{`${langLibrary.toChoosClassHelp}`}</span></div>
                :""}

                {studentId === 0?
                <div>
                    <TitleBlock title={!isMobile?`${langLibrary.step} ${!this.isShortList()?5:4}${langLibrary.step4Descr}`:`${!this.isShortList()?5:4}${langLibrary.step4DescrMob}`} caption={!isMobile?selectedSubj.subj_name_ua:(selectedSubj.id > 0?langLibrary.yes:"")}
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
                        :<div className="descrAndAnnounce"><span className="infoMsg">{`${langLibrary.toChooseSubjectHelp}`}</span></div>
                    :""}
                {studentId === 0 ?
                    <div>
                        <TitleBlock title={!isMobile?`${langLibrary.step} ${!this.isShortList()?6:5}${langLibrary.step5Descr}`:`${!this.isShortList()?6:5}${langLibrary.step5DescrMob}`}
                                    caption={!isMobile?this.markBlankAlias(markBlank.pk, langLibrary):(markBlank.alias.length?langLibrary.yes:"")}
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
                    <TitleBlock title={!isMobile?`${langLibrary.step} ${!this.isShortList()?7:6}${langLibrary.step6Descr}`:`${!this.isShortList()?7:6}${langLibrary.step6DescrMob}`}
                                        done={currentPeriodDateCount>0}
                                        caption={!isMobile?(currentPeriodDateCount.toString()+"дн,").concat(withoutholidays?"Б/вых-х,":"",titlekind==="NICK"?"+НИК":(titlekind==="EMAIL"?"+EMAIL":"+ИМЯ")):langLibrary.yes}
                                        onclick={this.stepClick.bind(this)} step={!this.isShortList()?7:6} hide={!this.isShortList()?step7:step6}/>
                </div>
                {!(!this.isShortList()?step7:step6)?
                    <div className="additionalSection">
                        <div><RadioGroup onclick={this.changeState.bind(this)} title={langLibrary.addSettings1} name={"rangedays"} defelem={currentPeriodDateCount} values={[{id:5, alias:5},{id:10, alias:10},{id:14, alias:14},{id:20, alias:20}]} addinput={true}/></div>
                        {studentId===0?<div><RadioGroup onclick={this.changeState.bind(this)} title={langLibrary.addSettings2} name={"listnames"} defelem={titlekind} values={[{id:"NAME", alias:`${langLibrary.wordName}`},{id:"NICK", alias:`${langLibrary.wordNick}`}, {id:"EMAIL", alias:"EMAIL"}]}/></div>:""}
                        {studentId===0?<div><RadioGroup onclick={this.changeState.bind(this)} title={langLibrary.addSettins3} name={"rangedirection"} defelem={direction} values={[{id:"UPDOWN", alias:`${langLibrary.directionUpDown}`},{id:"LEFTRIGHT", alias:`${langLibrary.directionLeftRight}`}]}/></div>:""}
                        <div><Checkbox onclick={this.changeState.bind(this)} bold={true} name={"withoutholidays"} defelem={withoutholidays} label={` ${langLibrary.addSettings4}`}/></div>
                        {studentId>0&&<EmailList studentID={studentId}  studentName={studentName}  userID={userID}/>}
                    </div>
                    :""}
                {studentId === 0?
                <div>
                    <TitleBlock title={!isMobile?`${langLibrary.step} ${!this.isShortList()?8:7}${langLibrary.step7Descr}`:`${!this.isShortList()?8:7}${langLibrary.step7DescrMob}`} done={this.state.isJournalClicked}
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
                {studentId === 0 && isadmin?
                <div>
                    <TitleBlock title={!isMobile?`${langLibrary.step} ${!this.isShortList()?9:8}${langLibrary.step8Descr}`:`${!this.isShortList()?9:8}${langLibrary.step8DescrMob}`} done={false}
                                onclick={this.stepClick.bind(this)} step={!this.isShortList()?9:8} hide={!this.isShortList()?step9:step8}/>
                </div>
                    :""}
                {!(!this.isShortList()?step9:step8)&&studentId === 0?
                    <div className="additionalSection">
                        <button>
                            <a className="infoMsg" href={EXCEL_URL+"/"+this.props.userSetup.classID+'/20190401'} target="_blank" rel="noopener noreferrer">
                            {"Получить файл для ввода оценок"}
                            </a>
                        </button>{/*onClick={this.getExcelFile.bind(this)}*/}
                        <button>Импорт оценок</button>
                        <button>Импорт справочника учеников</button>


                    </div>
                :""}

                {studentId === 0 && isadmin?
                <div>
                    <TitleBlock title={!isMobile?`${langLibrary.step} ${!this.isShortList()?10:9}${langLibrary.step9Descr}`:`${!this.isShortList()?10:9}${langLibrary.step9DescrMob}`} done={false} onclick={this.stepClick.bind(this)}
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
                    <TitleBlock title={!isMobile?langLibrary.step10Descr:langLibrary.step10DescrMob}
                                isyellow={true} done={false} onclick={this.stepClick.bind(this)}
                                isgrey={this.props.userSetup.stepsLeft}
                                caption={this.props.userSetup.stepsLeft?(`${langLibrary.leftStepBegin} ` + (this.props.userSetup.stepsLeft).toString() + (this.props.userSetup.stepsLeft===1?` ${langLibrary.leftStepsEnd}`:(this.props.userSetup.stepsLeft<5)?` ${langLibrary.leftStepsEnd}`:` ${langLibrary.leftStepsEnd}`)):""}
                                step={!this.isShortList()?11:10} hide={!this.isShortList()?step11:step10}/>
                </div>:""}
                {!(!this.isShortList()?step11:step10)&&userID===0&&!(this.props.userSetup.stepsLeft)?
                    <div>
                        <LoginBlock pupilcount = {pupilCount} usersetup={this.props.userSetup}
                                    changestate={this.changeState} /*onsetup={this.props.onSetSetup}*//>
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

                {/*{!this.state.displayChat?*/}
                {userID&&isadmin?
                <div className={"btn-chat"} onClick={()=>{this.setState({displayChat:!this.state.displayChat})}}><img height={"40px"} src={ChatBtn} alt=""/>
                    {this.state.newChatMessages?<div className="mym-new-chat-messages-count">{this.state.newChatMessages}</div>:null}
                    {this.state.newHomeworkMessages?<div className="mym-new-chat-messages-hw-count">{this.state.newHomeworkMessages}</div>:null}
                </div>:null}
                {/*:""} */}
                {/*{!this.state.displayNewChat?*/}
                <div className={"btn-chat-new"} onClick={()=>{this.setState({displayNewChat:!this.state.displayNewChat})}}><img height={"40px"} src={ChatBtn} alt=""/>
                    {this.state.newChatMessages?<div className="mym-new-chat-messages-count">{this.state.newChatMessages}</div>:null}
                    {this.state.newHomeworkMessages?<div className="mym-new-chat-messages-hw-count">{this.state.newHomeworkMessages}</div>:null}
                </div>
                {/*:""}*/}


                    <Chat
                          isnew = {false} updatemessage={this.updateMessages}
                          session_id={this.props.userSetup.chatSessionID} homeworkarray={this.props.userSetup.homework}
                          chatroomID={this.props.userSetup.classObj.chatroom_id}
                          messages={this.state.chatMessages}
                          subjs={selectedSubjects} btnclose={()=>{this.setState({displayChat:!this.state.displayChat})}}
                          display={this.state.displayChat} newmessage={this.newChatMessage}/>


                    <Chat
                          isnew = {true} updatemessage={this.updateMessages}
                          session_id={this.props.userSetup.chatSessionID} homeworkarray={this.props.userSetup.homework}
                          chatroomID={this.props.userSetup.classObj.chatroom_id}
                          messages={this.state.chatMessages}
                          subjs={selectedSubjects} btnclose={()=>{this.setState({displayNewChat:!this.state.displayNewChat})}}
                          display={this.state.displayNewChat} newmessage={this.newChatMessage}/>




            </div>


        );


        // console.log("step1", this.state.steps.step1)
  }
  // displayChat=()=>{
  //
  // }
}

const mapDispatchToProps = dispatch => {
    return ({
        // onInitState : () => dispatch(initState),
        onSetSetup: (data, userSetup) => {
            const asyncSetSetup = (data, userSetup) =>{
                 return dispatch => {
                    // console.log('UPDATE_SETUP_LOCALLY', data, Object.keys(data)[0], Object.values(data)[0])
                    dispatch({type: 'UPDATE_SETUP_LOCALLY', payload: data})
                    if (Object.keys(data)[0]==="class_number") {
                        document.body.style.cursor = 'progress';

                        instanceAxios().get(SUBJECTS_GET_URL + '/' + Object.values(data)[0])
                            .then(response => {
                                // let responsedata = response.data;
                                console.log("CLASS_NUMBER", response.data)
                                dispatch({type: 'UPDATE_SETUP_LOCALLY_SUBJLIST', payload: response.data})
                                dispatch({type: 'UPDATE_SETUP_LOCALLY_SELECTEDSUBJECTS', payload: response.data})
                                dispatch({type: 'UPDATE_SETUP_LOCALLY_SELECTEDSUBJECT', payload: response.data[0]})

                                let arr = response.data.map(value=>value.subj_key);
                                let postdata = `{"subjects_list":"${arr}", {"selected_subjects":"${arr}"}`;
                                if (userSetup.userID) {
                                    instanceAxios().post(UPDATESETUP_URL + '/' + userSetup.userID, postdata)
                                        .then(response=>{
                                            console.log('UPDATE_SETUP_SUCCESSFULLY_subjects_list', response.data, userSetup.userID);
                                        })
                                        .catch(response => {
                                            console.log('UPDATE_SETUP_FAILED_subjects_list', response);
                                            // dispatch({type: 'UPDATE_SETUP_FAILED', payload: response.data})
                                        })
                                }
                                console.log("userSetup.isadmin", userSetup.isadmin)
                                // ToDO: Проставим перечень предметов + для всех студентов (будем делать это на стороне сервера)
                                // ToDO: Выберем все предметы + для всех студентов (будем делать это на стороне сервера)
                                // ToDO: Предметом укажем первый + для всех студентов (будем делать это на стороне сервера)

                                if (userSetup.userID&&userSetup.isadmin > 0)
                                instanceAxios().get(API_URL + 'class/' + userSetup.classID + '/'+Object.keys(data)[0]+'/'+Object.values(data)[0])
                                    .then(response=>{
                                        console.log("GROUP_UPDATE")
                                     })
                                    .catch(response => {
                                        console.log("GROUP_UPDATE_ERROR")
                                    })

                                let json = `{"subjects_count":"${response.data.length+"/"+response.data.length}"}`;
                                dispatch({type: 'UPDATE_SETUP_LOCALLY', payload: JSON.parse(json)});
                                document.body.style.cursor = 'default';
                            })
                            .catch(response => {
                                // console.log(response);
                                dispatch({type: 'UPDATE_SETUP_FAILED', payload: response.data})
                                // Список ошибок в отклике...
                            })
                    }
                    if (userSetup.userID) {
                        if (Object.keys(data)[0]==="selected_subjects") {
                            // console.log("SELECTED_SUBJECTS", data, Object.values(data)[0], Object.values(data)[0].map(val=>val.subj_key), Object.values(data)[0].map(val=>val.subj_key).join())
                            // console.log(data)
                            let json = `{"selected_subjects":"${Object.values(data)[0].map(val=>val.subj_key).join()}"}`;
                            data = JSON.parse(json);
                            // return
                        }
                        if (Object.keys(data)[0]==="students") {
                            instanceAxios().post(STUDENTS_GET_URL + '/' + userSetup.userID + '/class/' + userSetup.classID, JSON.stringify(data))
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
                            instanceAxios().post(UPDATESETUP_URL + '/' + userSetup.userID, data)
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

            dispatch(asyncSetSetup(data, userSetup))
        },
        onUserLogging : (name, pwd, provider, provider_id, langLibrary) =>{
                dispatch({type: 'APP_LOADING'})
                console.log("OnUserLogging")
                const asyncLoggedIn = (name, pwd, provider, provider_id, langLibrary) =>{
                    return dispatch => {
                        dispatch(userLoggedIn(name, pwd, provider, provider_id, langLibrary))
                    }}
                dispatch(asyncLoggedIn(name, pwd, provider, provider_id, langLibrary))
                },
        onUserLoggingByToken :
            async (email, token, kind, langLibrary)=>{
                const asyncLoggedInByToken = (email, token, kind, langLibrary) => {
                    return async dispatch => {
                        dispatch(userLoggedInByToken(email, token, kind, langLibrary))
                    }
                }
            dispatch(asyncLoggedInByToken(email, token, kind, langLibrary))
        },
        onUserLoggingOut  : (token, langLibrary) => {
            return dispatch(userLoggedOut(token, langLibrary))
        },
        onClearErrorMsg : ()=>{
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

