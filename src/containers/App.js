import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import axios from 'axios';
import ClassList from '../components/ClassList/classlist'
import RSlider from '../components/RangeSlider/rslider'
import SubjectList from '../components/SubjectList/subjectlist'
import TitleBlock from '../components/TitleBlock/titleblock'
import MarkBlank from '../components/MarkBlank/markblank'
import Checkbox from '../components/CheckBox/checkbox'
import RadioGroup from '../components/RadioGroup/radiogroup'
import MarksTable from '../components/MarksTable/markstable'
import StudentTable from '../components/StudentTable/studenttable'
import Chart from "react-google-charts";
import EmailList from '../components/EmailList/emaillist'
import HomeWorkSection from '../components/AdminHomeWorkSection/homeworksection'
import {Link} from 'react-router-dom';
import MobileMenu from '../components/MobileMenu/mobilemenu'
import Charts from '../components/Charts/charts'
import {userLoggedIn, userLoggedInByToken, userLoggedOut} from '../actions/userAuthActions'
import Chat from '../components/Chat/chat'
import 'react-chat-widget/lib/styles.css';
import {Pusher} from 'pusher-js'
import {
    AUTH_URL, API_URL, EXCEL_URL, UPDATESETUP_URL, SUBJECTS_GET_URL, STUDENTS_GET_URL, MARKS_STATS_URL,
    arrLangs, defLang, ISDEBUG, ISCONSOLE, webVersion }        from '../config/config'
import {
    numberToLang, msgTimeOut, instanceAxios, mapStateToProps, getLangLibrary,
    getLangByCountry, getDefLangLibrary, getSubjFieldName
} from '../js/helpers'
import LoginBlock from '../components/LoginBlock/loginblock'
import LoginBlockLight from '../components/LoginBlockLight/loginblocklight'
import Menu from '../components/Menu/menu'
import MenuEx from '../components/MenuEx/menuex'
import ChatBtn from "../img/chat-btn.svg"
import AndroidBtn from "../img/android-icon-small.png"
import './App.css';
import {withCookies} from 'react-cookie';
import {store} from '../store/configureStore'
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import Logo from '../img/LogoMyMsmall.png'
import GooglePlayLogo from '../img/GooglePlayLogo.png'
import AppStoreLogo from '../img/AppStoreLogo.png'
import FBLogo from '../img/facebook.png'
import TwitterLogo from '../img/twitter.png'
import InstaLogo from '../img/instagram.png'
import GPlusLogo from '../img/google.png'
import VideoIcon from '../img/videoicon.png'

// import ReactPlayer from 'react-player'
// import GooglePlay from '../img/GooglePlay2.png'
// import GoogleAppleLogo from '../img/GoogleAppleLogo.png'
// import Chart from "react-google-charts/dist/ReactGoogleCharts.d";
// import {CSSTransitionGroup, CSSTransition, TransitionGroup } from 'react-transition-group/CSSTransitionGroup';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            shotsteplist: true,
            classNumber: 0,
            steps: {
                step1: true, step2: true, step3: true, step4: true, step5: true,
                step6: true, step7: true, step8: true, step9: true, step10: true, step11: true
            },
            marks: new Map(),
            showLoginLight: false,
            fireShowLoginLight: false,
            studSubj: new Map(),
            myCity: localStorage.getItem("myCity") === null ? '' : localStorage.getItem("myCity"),
            myCountry: localStorage.getItem("myCountry") === null ? '' : localStorage.getItem("myCountry"),
            myCountryCode: localStorage.getItem("myCountryCode") === null ? '' : localStorage.getItem("myCountryCode"),
            isMobile: window.innerWidth < 400 || (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)),
            stats: localStorage.getItem("markStats") === null ? {} : JSON.parse(localStorage.getItem("markStats")),
            isJournalClicked: false,
            stepsLeft: 7,
            displayChat: false,
            displayNewChat: false,
            chatMessages: [],
            newChatMessages: 0,
            newHomeworkMessages: 0,
            langLibrary: {},

        }
        this.classCount = []
        this.userGot = false
        this.loading = true
        // this.getChatMessages = this.getChatMessages.bind(this)
        this.updateMessages = this.updateMessages.bind(this)
        this.newChatMessage = this.newChatMessage.bind(this)
        this.userLogout = this.userLogout.bind(this)
        this.onSelectLang = this.onSelectLang.bind(this)
        this.langBlock = this.langBlock.bind(this)
        this.loginBlock = this.loginBlock.bind(this)
        // this.initLangLibrary = this.initLangLibrary.bind(this)
        this.clickClassButton = this.clickClassButton.bind(this)
        this.changeState = this.changeState.bind(this)
    }

    componentWillMount() {
        // console.log("componentWillMount1", this.props.userSetup, window.localStorage.getItem("myMarks.data"), this.props.userSetup.langLibrary)

        (async () => {
            console.log(webVersion)
            this.getSessionID();
            await this.getGeo2();
            await this.getClasses();
            await this.getStats();
            await this.getLangAsync(localStorage.getItem("langCode")&&arrLangs.includes(localStorage.getItem("langCode")) ? localStorage.getItem("langCode") : defLang)
            this.loading = false
        })();
    }
    componentWillUnmount() {
    }
    getClasses = async () => {
        let lang = localStorage.getItem("myCountryCode") ? localStorage.getItem("myCountryCode") : defLang
        let {token} = store.getState().user
        const headers = {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        }

        switch (lang.toString().toUpperCase()) {
            case 'UA' :
                lang = 'UA'
                break
            case 'EN' :
                lang = 'EN'
                break
            case 'GB' :
                lang = 'EN'
                break
            case 'DE' :
                lang = 'DE'
                break
            default :
                lang = 'EN'
                break
        }
        console.log('LANG ',lang)
        await axios.post(API_URL + ('subjects/bycountry3' + (lang ? ('/' + lang) : '')), null, headers)
            .then(res => {
                this.classCount = res.data
                // console.log('GET_CLASSES', res)
            })
            .catch(res => {

            })
    }

    async componentDidMount() {

        this.props.onStartLoading()
        let {langLibrary} = this.props.userSetup

        if (!langLibrary&&(localStorage.getItem("langLibrary")))
            langLibrary = localStorage.getItem("langLibrary")

         if (!(window.localStorage.getItem("myMarks.data") === null) && !(window.localStorage.getItem("userSetup"))) { //  && window.localStorage.getItem("userSetupDate") === toYYYYMMDD(new Date())
             ISCONSOLE && console.log("PART1", langLibrary)
            let localstorage = JSON.parse(window.localStorage.getItem("myMarks.data"))
            let {token} = localstorage
            this.props.onReduxUpdate("UPDATE_TOKEN", token)
            this.props.onUserLoggingByToken(null, token, null, langLibrary);
        }
        else if (window.localStorage.getItem("userSetup")) { // && window.localStorage.getItem("userSetupDate") === toYYYYMMDD(new Date())
             ISCONSOLE && console.log("PART: LangLibrary", langLibrary)
             let localstorage = JSON.parse(window.localStorage.getItem("userSetup"))
             let {token} = localstorage
             this.props.onReduxUpdate("UPDATE_TOKEN", token)
             this.props.onUserLoggingByToken(null, token, null, langLibrary);
         }
        else {
            // console.log("PART3", langLibrary)
        }
        this.props.onReduxUpdate("IS_MOBILE", this.state.isMobile)
        this.props.onChangeStepsQty(this.isSaveEnabled())

        this.props.onStopLoading()
        document.body.style.cursor = 'default';
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log("shouldComponentUpdate", this.state.langLibrary, Object.keys(this.state.langLibrary).length, this.props.userSetup.langLibrary, nextProps.userSetup.langLibrary)
        // console.log("shouldComponentUpdate", this.loading, this.props.userSetup.langLibrary)
        const {chatSessionID, langLibrary : lngLib} = this.props.userSetup

        if (this.loading)
            return false

        let langLibrary = {}
        if (Object.keys(lngLib).length) {
            langLibrary = lngLib
        }
        else {
            langLibrary = getDefLangLibrary()
        }

         if ((chatSessionID !== nextProps.userSetup.chatSessionID)) {
            // console.log("shouldComponentUpdate2")
            return false
        }
        // return this.props.userSetup.chatSessionID !== nextProps.userSetup.chatSessionID
        else if (!Object.keys(langLibrary).length) {
            // console.log("shouldComponentUpdate3")
            return false
        }
        else {
            return true
        }
    }
    getLangAsync = async (lang) => {
        if (
            !lang
        ) {
            lang = localStorage.getItem("langCode") ? localStorage.getItem("langCode") : defLang
        }
        let langObj = {}
        // console.log("getLangLibrary:start", lang)
        let {token} = store.getState().userSetup

        this.props.onReduxUpdate("LANG_CODE", lang)

        const headers = {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        }
        switch (lang) {
            case "UA" : break;
            case "DE" : lang = "GB"; break;
            case "FR" : lang = "GB"; break;
            case "IT" : lang = "GB"; break;
            case "PL" : lang = "PL"; break;
            case "PT" : lang = "GB"; break;
            case "RU" : lang = "RU"; break;
            case "ES" : lang = "ES"; break;
            default : lang = "GB"; break;
        }
        await axios.get(AUTH_URL + ('/api/langs/get' + (lang ? ('/' + lang) : '')), null, headers)
            .then(res => {

                    res.data.forEach(item => langObj[item.alias] = item.word)
                    // console.log("langDone", langObj)
                    this.props.onReduxUpdate("LANG_LIBRARY", langObj)
                    this.props.onStopLoading()
                    this.loading = false
                    this.setState({langLibrary: langObj});
                    // console.log("langDone2", langObj)
                }
            )
            .catch(res => {
                console.log("ERROR_LANG", res)
            })
        document.body.style.cursor = 'default';
        // console.log("getLangLibrary:stop")
    }

    onSelectLang = async countryCode => {
        this.props.onStartLoading()
        this.getLangAsync(countryCode)//getLangLibrary(localStorage.getItem("langCode")?localStorage.getItem("langCode"):defLang)

        this.props.onReduxUpdate("LANG_LIBRARY", this.state.langLibrary)
        this.props.onReduxUpdate("LANG_CODE", countryCode)

        localStorage.setItem("langCode", countryCode)
        localStorage.setItem("langLibrary", JSON.stringify(this.state.langLibrary))
        // this.props.onStopLoading()
        // console.log(countryCode)
    }
    /*
     * Обновляем перечень сообщений
     * */
    newChatMessage = isHomeWork => {
        // console.log("newChatMessage", this.state.displayChat, this.state.newChatMessages)
        const newChatMessages = (this.state.newChatMessages) + 1
        const newHomeworkMessages = (this.state.newHomeworkMessages) + 1
        if (!this.state.displayChat) {
            this.setState({newChatMessages})
            if (isHomeWork)
                this.setState({newHomeworkMessages})
        }
    }
    updateMessages = (stateValue) => {
        this.setState({chatMessages: [...this.state.chatMessages, stateValue]})
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

    getSessionID() {
        let session_id = ''
        let header = {
            headers: {
                'Content-Type': 'x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
            }
        }
        axios.get(API_URL + 'session', [], header)
            .then(response => {
                session_id = response.data.session_id
                this.props.onReduxUpdate('CHAT_SESSION_ID', session_id)
                localStorage.setItem('chatSessionID', session_id)
                // console.log("session", session_id);
            })
            .catch(response => {
            })
        return session_id
    }

    isSaveEnabled = () => {
        let donesteps = 0, planSteps = 7
        let {
            pupilCount, subjCount, currentPeriodDateCount, markBlank,
            classNumber, selectedSubj
        } = this.props.userSetup;
        donesteps = (!(classNumber === 0) ? 1 : 0) + (!(Number(pupilCount) === 0) ? 1 : 0) + (!(subjCount.slice(-2) === "/0") ? 1 : 0) + ((selectedSubj.id > 0) ? 1 : 0) + (!(markBlank.alias === "") ? 1 : 0) + (currentPeriodDateCount > 0 ? 1 : 0) + (this.state.isJournalClicked ? 1 : 0)
        return planSteps - donesteps
    }
    orderTitles = (item) => {
        for (let i = 1; i < 8; i++) {
            if (true) {//(!(i===item)){
                let b = document.getElementById('btn-' + i)
                console.log('b', b, b.offsetLeft)
                // let top = b.getBoundingClientRect().top
                // let left = b.getBoundingClientRect().left
                let t = document.getElementById('title-' + i)
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
                t.style.width = '40px';
            }
        }
    }

    getGeo2 = () => {

        if (!(localStorage.getItem("statsDate") === (new Date().toLocaleDateString())) || !(localStorage.getItem("langCode") === localStorage.getItem("myCountryCode"))) {
            axios.get(`${API_URL}getgeo`)
                .then(response => {
                           // console.log("getGeo2", response.data);
                           if (!(response.data.city === localStorage.getItem("city"))) {
                                const {city, country, iso_code} = response.data
                                // countryCode = iso_code
                                this.setState(
                                    {
                                        myCity: city,
                                        myCountry: country,
                                        myCountryCode: iso_code,
                                    }
                                )
                                localStorage.setItem("myCity", city)
                                localStorage.setItem("myCountry", country)
                                localStorage.setItem("myCountryCode", iso_code)

                               if (!localStorage.getItem("langCode")) {
                                   localStorage.setItem("langCode", arrLangs.includes(iso_code) ? iso_code : defLang)
                                   this.props.onReduxUpdate("LANG_CODE", arrLangs.includes(iso_code) ? iso_code : defLang)
                               }
                                // localStorage.getItem("langCode") ? localStorage.getItem("langCode") : defLang


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
                            // localStorage.setItem("myCountryCode", "UA")
                            // localStorage.setItem("langCode", defLang)
                        })
        }
        else {
            // console.log("getGEO", this.state.myCountryCode, this.state.myCountryCode===undefined, this.state.myCountryCode==="undefined")
            if ((!this.state.myCountryCode) || this.state.myCountryCode === "undefined") {
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
                if (!localStorage.getItem("langCode")) {
                    localStorage.setItem("langCode", defLang)
                    this.props.onReduxUpdate("LANG_CODE", defLang)
                }
            }
        }

    }
    getGeo = () => {
        let countryCode = "UA"
        // console.log("getGEO")
        // instanceAxios().get("http://ip-api.com/json", [])
        // axios.get("http://ip-api.com/json")

        console.log("getGeo", localStorage.getItem("langCode"))

        if (!(localStorage.getItem("statsDate") === (new Date().toLocaleDateString()))) {
            // axios.get("https://ipapi.co/json/")
            /*
             {
             "ip": "159.224.177.71",
             "hostname": "71.177.224.159.triolan.net",
             "city": "Kyiv",
             "region": "Kyiv City",
             "country": "UA",
             "loc": "50.4547,30.5238",
             "org": "AS13188 CONTENT DELIVERY NETWORK LTD",
             "postal": "03027",
             "timezone": "Europe/Kiev",
             "readme": "https://ipinfo.io/missingauth"
             }
             */
            axios.get("https://ipinfo.io/json")
                .then(response => {
                    console.log("getGeo", response.data);
                    if (!(response.data.city === localStorage.getItem("city"))) {
                        countryCode = response.data.country
                        this.setState(
                            {
                                myCity: response.data.city,
                                myCountry: response.data.country,
                                myCountryCode: response.data.country,
                            }
                        )
                        localStorage.setItem("myCity", response.data.city)
                        localStorage.setItem("myCountry", response.data.country)
                        localStorage.setItem("myCountryCode", response.data.country)
                        if (!localStorage.getItem("langCode")) {
                            localStorage.setItem("langCode", arrLangs.includes(response.data.country) ? response.data.country : defLang)
                            this.props.onReduxUpdate("LANG_CODE", arrLangs.includes(response.data.country_code) ? response.data.country_code : defLang)
                        }
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
                    if (!localStorage.getItem("langCode")) {
                        localStorage.setItem("langCode", defLang)
                        this.props.onReduxUpdate("LANG_CODE", defLang)
                    }
                })
        }
        else {
            // console.log("getGEO", this.state.myCountryCode, this.state.myCountryCode===undefined, this.state.myCountryCode==="undefined")
            if ((!this.state.myCountryCode) || this.state.myCountryCode === "undefined") {
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
    getStats = () => {
        // console.log('query', MARKS_STATS_URL+'/0')
        let header = {
            headers: {
                'Content-Type': "application/json",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            }
        }
        if (!(localStorage.getItem("statsDate") === (new Date().toLocaleDateString()))) {
            instanceAxios().get(MARKS_STATS_URL + '/0', [], header)
                .then(response => {
                    if (!(response.data.stats2[0] === localStorage.getItem("markStats")))
                        this.setState({
                            stats: response.data.stats2[0],
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
        const classNumber = Number(event.target.id.toString().replace("btn-class-", ""));
        let {classNumber: classNumberOriginal} = this.props.userSetup;
        const lang = localStorage.getItem("myCountryCode") ? localStorage.getItem("myCountryCode") : defLang
        if (classNumber !== classNumberOriginal) {
            let json = `{"class_number":${classNumber}, "country_name" : "${lang.toString().toLowerCase()}"}`;
            let data = JSON.parse(json);
            this.props.onSetSetup(data, this.props.userSetup);
        }
    }

    changeState(name, value) {
        let json, data;
        let {pupilCount, students: studs, userID, subjects_list, selectedSubjects, classID, langLibrary} = this.props.userSetup;
        const lang = localStorage.getItem("myCountryCode") ? localStorage.getItem("myCountryCode") : defLang

        switch (name) {
            case 'classNumber' :
                json = `{"class_number":${value}, "country_name" : "${lang.toString().toLowerCase()}"}`;
                break;
            case 'pupilCount' :
                // console.log("pupilCount", value, pupilCount)
                if (value > pupilCount) {
                    //Заполним массив студентов (id, name, nick, rowno, class_id, user_id)
                    let arr = [];
                    for (let i = 0; i < value; i++) {
                        // console.log("studs[i]", studs[i]); //JSON.parse(studs[i])
                        if (!(studs[i]) || ((typeof studs[i] === "object") && !(studs[i].hasOwnProperty('id'))))
                            arr.push({
                                "id": -i,
                                "student_name": "",
                                "student_nick": numberToLang(i + 1, ' ', 'rus'),
                                "rowno": i,
                                "class_id": classID,
                                "user_id": userID,
                                "email": ''
                            });
                        else
                            arr.push({
                                "id": studs[i].id,
                                "student_name": studs[i].student_name,
                                "student_nick": studs[i].student_nick,
                                "rowno": studs[i].rowno,
                                "class_id": classID,
                                "user_id": userID,
                                "email": studs[i].email
                            })
                    }
                    json = `{"students":${JSON.stringify(arr)}}`;
                    data = JSON.parse(json);
                    console.log("PupilCountArr", arr, data);
                    this.props.onSetSetup(data, this.props.userSetup) // curClass
                }
                json = `{"pupil_count":${value}}`;
                break;
            case 'currentYear' :
                json = `{"year_name":"${value.toString().replace(/[/]/g, '\\/')}"}`;
                break;
            case "selectedSubj" :
                ISCONSOLE && console.log("selectedSubj", value, subjects_list.filter(val => (val.subj_key === value[0])), subjects_list, value[0]);

                value.push(subjects_list.filter(val => (val.subj_key === value[0]))[0].id)
                // console.log("SELECTED_SUBJ", this.props.userSetup.subjects_list.filter(val=>(val.subj_key===value[0])), value);
                json = `{"selected_subject":"${value}"}`;
                this.props.onReduxUpdate('UPDATE_SELECTED_SUBJ', subjects_list.filter(val => (val.subj_key === value[0]))[0])
                break;
            case "subjCount" :
                // console.log("selectedSubjsArray", selectedSubjects);
                json = `{"subjects_count":"${selectedSubjects[0] === "" ? 0 : selectedSubjects.length}/${subjects_list.length}"}`;
                break;
            case "selectedSubjects" : // Выбранные предметы
                // json = `{"selected_subjects":[${value.map(val => `{"subj_key":"${val.subj_key}","${getSubjFieldName(langCode)}":"${val[getSubjFieldName(langCode)]}"}`)}]}`;
                json = `{"selected_subjects":[${value.map(val => `{"subj_key":"${val.subj_key}"
                                                                    ,"${"subj_name_ua"}":"${val["subj_name_ua"]}"
                                                                    ,"${"subj_name_ru"}":"${val["subj_name_ru"]}"
                                                                    ,"${"subj_name_en"}":"${val["subj_name_en"]}"
                                                                    ,"${"subj_name_gb"}":"${val["subj_name_gb"]}"
                                                                    ,"${"subj_name_de"}":"${val["subj_name_de"]}"
                                                                    ,"${"subj_name_fr"}":"${val["subj_name_fr"]}"
                                                                    ,"${"subj_name_it"}":"${val["subj_name_it"]}"
                                                                    ,"${"subj_name_pl"}":"${val["subj_name_pl"]}"
                                                                    ,"${"subj_name_pt"}":"${val["subj_name_pt"]}"
                                                                    ,"${"subj_name_es"}":"${val["subj_name_es"]}"
                                                                    }`)}
                                                                    ]}`;
                data = JSON.parse(json);
                console.log("selected_subjects", value, json);
                this.props.onSetSetup(data, this.props.userSetup);
                json = `{"subjects_count":"${value.length}/${subjects_list.length}"}`;
                break;
            case "markBlank" :
                let alias = "", pk = 0; //id = value;
                switch (value) {
                    case "markblank_twelve" :
                        alias = `${langLibrary.markName12}`;
                        pk = 1;
                        break;
                    case "markblank_five" :
                        alias = `${langLibrary.markName5}`;
                        pk = 2;
                        break;
                    case "markblank_letters" :
                        alias = `${langLibrary.markNameAD}`;
                        pk = 3;
                        break;
                    default:
                        break;
                }
                let key1, key2, key3;
                json = `{"markblank_id":"${value}"}`;
                data = JSON.parse(json);
                key1 = data;

                json = `{"markblank_alias":"${alias.toString().replace(/[/]/g, '\\/')}"}`;
                data = JSON.parse(json);
                key2 = data

                json = `{"selected_marker":${pk}}`;
                data = JSON.parse(json);
                key3 = data;

                json = `{"markblank":[${JSON.stringify(key1)},${JSON.stringify(key2)},${JSON.stringify(key3)}]}`;
                break;
            case "listnames" :
                json = `{"titlekind":"${value}"}`;
                break;
            case "rangedays" :
                json = `{"perioddayscount":${value}}`;
                break;
            case "rangedirection" :
                // console.log("DATA", data);
                json = `{"direction":"${value}"}`;
                break;
            case "withoutholidays" :
                json = `{"withoutholidays":${value}}`;
                break;
            default:
                break;
        }
        data = JSON.parse(json);
        this.props.onSetSetup(data, this.props.userSetup); //curClass
    }

    refreshSteps(steps, keyValue) {
        for (let key in steps) {
            if (!(key === keyValue))
                steps[key] = true;
        }
        // console.log('refreshSteps', keyValue)
        if (keyValue === (!this.isShortList() ? 'step8' : 'step7')) {
            this.setState({isJournalClicked: true})
        }

        this.props.onChangeStepsQty(this.isSaveEnabled())
        return steps
    }

    stepClick(event) {
        // console.log("stepClick", this.props.user.logging, event.target)
        this.props.user.logging && this.props.onStopLogging()
        let {steps} = this.state

        switch (Number(event.target.id.toString().replace('title-', ''))) {
            case 1 :
                if (this.props.user.logging)
                    steps.step1 = false
                else
                    steps.step1 = !steps.step1;
                steps = this.refreshSteps(steps, "step1");
                break;
            case 2 :
                steps.step2 = !steps.step2;
                steps = this.refreshSteps(steps, "step2");
                break;
            case 3 :
                steps.step3 = !steps.step3;
                steps = this.refreshSteps(steps, "step3");
                break;
            case 4 :
                steps.step4 = !steps.step4;
                steps = this.refreshSteps(steps, "step4");
                break;
            case 5 :
                steps.step5 = !steps.step5;
                steps = this.refreshSteps(steps, "step5");
                break;
            case 6 :
                steps.step6 = !steps.step6;
                steps = this.refreshSteps(steps, "step6");
                break;
            case 7 :
                steps.step7 = !steps.step7;
                steps = this.refreshSteps(steps, "step7");
                break;
            case 8 :
                steps.step8 = !steps.step8;
                steps = this.refreshSteps(steps, "step8");
                break;
            case 9 :
                steps.step9 = !steps.step9;
                steps = this.refreshSteps(steps, "step9");
                break;
            case 10 :
                steps.step10 = !steps.step10;
                steps = this.refreshSteps(steps, "step10");
                break;
            case 11 :
                steps.step11 = !steps.step11;
                steps = this.refreshSteps(steps, "step11");
                break;
            default:
                break;
        }
        this.setState({steps})
        // this.orderTitles(0);
    }

    changeCell(row, column, value) {
        // console.log("App", row, column, value, this.state.marks)
        let marks = this.state.marks;
        marks.set("r" + row + "c" + column, value.toString().length < 4 ? value : "")
        this.setState({
            marks: marks
        })
    }

    // showClassName(clsName, isFade){
    //     return !isFade?(clsName +" fadeout"): clsName
    // }
    userEdit() {
    }

    userRegister() {
    }

    fireLoginLight(hide) {
        this.setState({"showLoginLight": !hide})
        ISCONSOLE && console.log("fireLoginLight")
        // if (hide) this.props.onStopLoading()
        this.props.history.push('/');
        if (this.props.user.loginmsg.length > 0) {
            this.clearError()
        }
    }

    hideSteps = () => (
        this.setState({
            steps: {
                step1: true, step2: true, step3: true, step4: true, step5: true,
                step6: true, step7: true, step8: true, step9: true, step10: true, step11: true
            }
        }))

    onStudSubjChanged(key, name) {
        let map = new Map()
        const {subjects_list: subjlist, langCode} = this.props.userSetup
        map.clear()
        // console.log("onStudSubjChanged", key, subjlist, name)
        if (subjlist.filter(value => (value.subj_key === key)).length)
            name = subjlist.filter(value => (value.subj_key === key))[0][getSubjFieldName(langCode)]
        else {
            name = subjlist[0][getSubjFieldName(langCode)]
            key = subjlist[0].subj_key
        }

        map.set(key, name)
        this.props.onStudentChartSubject(map)
    }

    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    isShortList = () => {
        return this.state.shotsteplist
    }

    getExcelFile() {
        document.body.style.cursor = 'progress';

        instanceAxios().get(EXCEL_URL + '/' + this.props.userSetup.classID + '/20190320', {})
            .then(response => {
                // console.log("CREATEUSER_URL", response.data, this.props.usersetup, response.data.user.id);
                // this.setState({newUser : response.data.user.id, newEmail : this.inputEmail.value})
                // this.setSetup(this.props.usersetup, response.data.user.id, response.data.user.class_id);
                document.body.style.cursor = 'default';
            })
            .catch(response => {
                // console.log(response);
                document.body.style.cursor = 'default';
            })
        // https://sch-journal.dev/api/excel/1/20190401
    }

    clearError() {
        // console.log("clearError",this.props.user.loginmsg.length, this.props.user.loginmsg)
        this.props.user.loginmsg.length && setTimeout(this.props.onClearErrorMsg(), msgTimeOut)
    }

    prepDataForChart(arr) {
        const {avgclassmarks, langCode} = this.props.userSetup
        let mpSubjs = new Map(), mpDates = new Map(), arrDates = [], arrSubjs = [],
            arrDateMarks = [], arrDateMarksLittle = [], retArr = [], arrRow = [], columns = []
        avgclassmarks.forEach(item => mpSubjs.set(item.subj_key, item[getSubjFieldName(langCode)]));
        avgclassmarks.forEach(item => mpDates.set(new Date(item.mark_date).toLocaleDateString(), item.mark_date));

        arrDates = Array.from(mpDates.values()).sort();
        for (let i = 0; i < arrDates.length; i++) {
            arrDates[i] = (new Date(arrDates[i])).toLocaleDateString()
        }
        arrSubjs = Array.from(mpSubjs.keys()).sort();
        let obj = {}
        obj.type = 'string';
        obj.label = 'Дата'
        columns.push(obj)
        for (let i = 0; i < arrSubjs.length; i++) {
            let obj = {}
            obj.type = 'number';
            obj.label = mpSubjs.get(arrSubjs[i])
            // console.log(arrSubjs[i], mpSubjs.get(arrSubjs[i]), obj)
            columns.push(obj)
        }
        for (let i = 0; i < arrDates.length; i++) {
            arrRow = []
            arrDateMarks = this.props.userSetup.avgclassmarks.filter(item => (new Date(item.mark_date)).toLocaleDateString() === arrDates[i])
            // console.log("arrDateMarks", arrDateMarks, arrSubjs)
            arrRow.push(arrDates[i])
            for (let j = 0; j < arrSubjs.length; j++) {
                arrDateMarksLittle = arrDateMarks.filter(item => item.subj_key === arrSubjs[j])
                // if (arrDateMarksLittle.length)
                //     console.log("MRKS", arrDateMarksLittle)
                arrRow.push(arrDateMarksLittle.length ? arrDateMarksLittle[0].avgmark : null);
            }
            retArr.push(arrRow)
            //    console.log(arrDates[i], arrDateMarks);
        }
        return [retArr, columns];
    }

    fireUserV3Login = url => {
        let arr = url.toString().split('/r3/')[1].replace('/r3', '').trim()
        let namelen = Number(arr.substring(0, 6)) - 42
        let name = arr.slice(-namelen)
        let pwd = arr.substring(6).replace(arr.slice(-namelen), '')
        const {myCountryCode} = this.state
        console.log('URL', url, namelen, arr.slice(-namelen), arr.substring(6).replace(arr.slice(-namelen), ''))
        // console.log(name, pwd)
        this.props.onUserLogging(name, pwd, null, null, getLangLibrary(myCountryCode ? myCountryCode : defLang));
        this.props.history.push('/');
    }

    userLogin() {
        // console.log("onUserLogin")
        this.setState({"showLoginLight": !this.state.showLoginLight})
    }

    userLogout() {
        ISCONSOLE && console.log('userLOGOUT', this.props.userSetup.langLibrary)
        // const {myCountryCode} = this.state
        window.localStorage.removeItem("myMarks.data");
        window.localStorage.removeItem("userSetup")
        window.localStorage.removeItem("userSetupDate")
        this.hideSteps();
        this.props.onUserLoggingOut(this.props.userSetup.token, this.props.userSetup.langLibrary)
    }

    langBlock = () => {
        return <div style={{"width": "80px", "top" : "25px"}}>
            <ReactFlagsSelect
                defaultCountry={localStorage.getItem("langCode") ? localStorage.getItem("langCode") : defLang}
                placeholder={getLangByCountry(this.state.myCountryCode)}
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
        // console.log("loginBlock", loading, userID)
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
                {/*{console.log("loginBlock", this.props.user, this.props.user.loginmsg)}*/}
                {/*<div>{this.props.user.loginmsg}</div>*/}
                <div className={this.props.user.loginmsg!==undefined&&this.props.user.loginmsg.length?"popup show":"popup"}
                     onClick={this.props.onClearErrorMsg}>
                    {this.props.user.loginmsg.length ?
                        <span className="popuptext" id="myPopup">{this.props.user.loginmsg}</span> : ""}
                </div>
            </div>
            <div>
                {userID > 0 ? <button className="logoutbtn" onClick={this.userLogout}>
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
    markBlankAlias = (pk, langLibrary) => {
        switch (pk) {
            case 1 :
                return langLibrary.markName12
            case 2 :
                return langLibrary.markName5
            case 3 :
                return langLibrary.markNameAD
            default :
                return langLibrary.markNameAD
        }
    }

    render() {

        let {
            userID, userName, pupilCount, currentYear, subjCount, currentPeriodDateCount, markBlank,
            direction, titlekind, withoutholidays, classNumber, selectedSubjects, selectedSubj,
            subjects_list, studentID, studentName, classID, isadmin, loading, stats3 } = this.props.userSetup;


        // console.log("LANGLIBRARY_AFTER", this.props.userSetup.langLibrary)
        let langLibrary = {}//getLangLibrary()
        if (this.props.userSetup.langLibrary) {
            if (Object.keys(this.props.userSetup.langLibrary).length) {
                langLibrary = this.props.userSetup.langLibrary
            }
            else {
                langLibrary = getDefLangLibrary()
            }
        }
        let {isMobile} = this.state;
        let {step1, step2, step3, step4, step5, step6, step7, step8, step9, step10, step11} = this.state.steps;

        const options = {
            title: "Общеклассная динамика успеваемости по предметам",
            curveType: "function",
            interpolateNulls: true,
            legend: {position: "bottom"},
            chartArea: {left: 35, top: 30, width: "100%", height: "80%"},
            // pointsVisible: true,
        };
        let data = this.prepDataForChart([])

        // console.log("APP_RENDER", loading, langLibrary, this.loading)
        // return <div></div>
        // *************************
        // Если идёт загрузка
        // *************************
//        console.log("RENDER:APP", loading, this.loading)

        if (false&&(loading || loading === -1 || this.loading))
            return (
                <div className="App">
                    {loading ? this.waitCursorBlock() : null}
                </div>)

        if (false&&(loading || loading === -1))
            return (
                <div className="App">
                    {loading ? this.waitCursorBlock() : null}
                    <div className="navbar">
                        <div className="navBlock">
                            <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center"}}>
                                <Link to="/"><img src={Logo} alt={"My.Marks"}/></Link>
                                <div className="myTitle"><h3><Link to="/">{langLibrary.siteName}</Link></h3></div>
                            </div>
                        </div>
                        <div className="navBlockEx">
                            {userID?<Menu className="menuTop"
                                          userid={userID}
                                          isadmin={isadmin}
                                          withtomain={true}
                                          langlibrary={langLibrary}/> : null}
                            {this.loginBlock(userID, userName, langLibrary)}
                        </div>
                    </div>
                    <div className="navbar-shadow"/>
                </div>);


        // console.log("this.props.USERSETUP: ", this.props.userSetup);
        // return (<div>111</div>)

        let descrFirst = `${langLibrary.introBegin} ${this.isShortList() ? "7" : "10"} ${langLibrary.introEnd}:`

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
                    {loading ? this.waitCursorBlock() : null}
                    {/*<CSSTransitionGroup {...transitionOptions}>*/}
                    <div className="navbar">
                        <div className="navBlock">
                            <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center"}}>
                                <Link to="/"><img src={Logo} alt={"My.Marks"}/></Link>
                                <div className="myTitle"><h3><Link to="/">{langLibrary.siteName}</Link></h3></div>
                            </div>
                        </div>
                        <div className="navBlockEx">
                            {userID || true ? <MenuEx className="menuTop"
                                                      userid={userID}
                                                      isadmin={isadmin}
                                                      langlibrary={langLibrary}/> : null}
                            {this.loginBlock(userID, userName, langLibrary)}
                        </div>
                    </div>
                    <div className="navbar-shadow"></div>

                    {(userID > 0 && !this.props.user.verified) ?
                        <div className="descrAndAnnounce">
                            <div className="description">Для начала работы проверьте письмо по адресу
                                <b>{this.props.user.email}</b>, чтобы подтвердить электронный адрес
                            </div>
                        </div>
                        : null}

                    { (window.location.href.slice(-3) === "/hw") ? this.props.history.push('/hw') : null}
                    { (window.location.href.slice(-6) === "/admin") ? this.props.history.push('/admin') : null}

                    {/*</CSSTransitionGroup>*/}
                </div>)

        // *************************
        // Если основной блок
        // *************************
        return (
            <div className="App">
                {loading ? this.waitCursorBlock() : null}
                { (window.location.href.slice(-3) === "/hw") ? this.props.history.push('/hw') : null}
                { (window.location.href.slice(-6) === "/admin") ? this.props.history.push('/admin') : null}
                {/*<CSSTransitionGroup {...transitionOptions}>*/}
                {/*<TransitionGroup>*/}
                {/*<TransitionGroup>*/}
                {/*<div key={"test-22"}>Test</div>*/}
                {/*</TransitionGroup>*/}
                <div className="navbar">
                    <div className="navBlock">
                        <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center"}}>
                            <Link to="/"><img src={Logo} alt={"My.Marks"}/></Link>
                            <div className="myTitle"><h3><Link to="/">{langLibrary.siteName}</Link></h3></div>
                        </div>
                    </div>
                    <div className="navBlockEx">
                        {isMobile ? <MobileMenu userID={userID}
                                                userName={userName}
                                                isadmin={isadmin}
                                                withtomain={this.props.withtomain}
                                                userLogin={this.userLogin.bind(this)}
                                                userLogout={this.userLogout}
                                                langlibrary={langLibrary}/> :
                            userID || true? <MenuEx className="menuTop"
                                                     userid={userID}
                                                     isadmin={isadmin}
                                                     langlibrary={langLibrary}/> : null}
                        {(window.location.href.slice(-3) === "/r3" && userID === 0) ?
                            this.fireUserV3Login(window.location.href) : ""}
                        {isMobile ? <div>
                            {this.state.showLoginLight || (window.location.href.slice(-2) === "/r" && userID === 0) ?
                                <LoginBlockLight onLogin={this.props.onUserLogging} langLibrary={langLibrary}
                                                 firehide={this.fireLoginLight.bind(this)}/> : null}

                            <div className={this.props.user.loginmsg.length ? "popup show" : "popup"}
                                 onClick={this.props.onClearErrorMsg}>
                                {this.props.user.loginmsg.length ?
                                    <span className="popuptext" id="myPopup">{this.props.user.loginmsg}</span> : ""}
                            </div>
                        </div> : ""}
                        {!isMobile ? this.loginBlock(userID, userName, langLibrary) : null}
                    </div>
                </div>
                <div className="navbar-shadow"></div>
                {isMobile ?
                    <div className="descrAndAnnounce">
                        {classID ? <span className="addRef">{langLibrary.refNewStudentBegin}
                            <a className="infoMsg" href={AUTH_URL + "/student/add/" + this.props.userSetup.addUserToken}
                               target="_blank" rel="noopener noreferrer"> {langLibrary.refNewStudentEnd}</a></span>
                            : null
                        }
                        {userID ? <div className={"downloadAdnroid"}>
                            <div>
                                <img style={{left: "30px"}} height={"20px"} src={AndroidBtn} alt=""/></div>
                            <div>
                                <span style={{color: "#707070"}}> Скачать </span>
                                <a className="infoMsgAndroid" href={API_URL + "android"} target="_blank"
                                   rel="noopener noreferrer">
                                    Android-приложение</a>
                            </div>
                        </div> : null}
                        {   studentID === 0 && userID === 0 ?
                            <div style={{display: "flex", width: "100%"}}>
                                <div style={isMobile ? {width: "70%", paddingLeft: "5%"} : {width: "90%"}}
                                     className="description-main"><span>{descrFirst}</span></div>
                                <div style={isMobile ? {
                                    width: "30%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-end"
                                } : {
                                    width: "10%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-end"
                                }}>
                                    <div><a href="https://play.google.com/store/apps/details?id=com.mymv2"
                                            target="_blank" rel="noopener noreferrer"><img src={GooglePlayLogo} style={{
                                        height: "30px",
                                        marginTop: "6px"
                                    }} title="Google" alt="Google&&Apple"/></a></div>
                                    <div><a href="https://apps.apple.com/us/app/my-marks/id1488084527?l=uk&ls=1"
                                            target="_blank" rel="noopener noreferrer"><img src={AppStoreLogo}
                                                                                           style={{height: "30px"}}
                                                                                           title="Apple"
                                                                                           alt="Google&&Apple"/></a>
                                    </div>
                                </div>
                            </div> :
                            studentName ? <div className="descrHeader">
                                <div className="studentName">
                                    <b>{studentName}</b>
                                </div>
                                {stats3!==undefined?
                                    <div className="lastRecords">
                                        {"Последние оценки [" + (new Date(stats3.max)).toLocaleDateString() + ' ' + (new Date(stats3.max)).toLocaleTimeString() + ']: Всего:' + stats3.cnt}
                                    </div> : null}
                            </div> : null}
                        {studentID ?
                            <div className="app-homeWorkSection">
                                <HomeWorkSection withoutshadow={true} withouthead={true}/>
                            </div>
                            : null}
                    </div>
                    : <div className="descrAndAnnounce">
                        {classID ? <span className="addRef">{`${langLibrary.refNewStudentBegin} `}
                            <a className="infoMsg" href={AUTH_URL + "/student/add/" + this.props.userSetup.addUserToken}
                               target="_blank" rel="noopener noreferrer">{` ${langLibrary.refNewStudentEnd}`}</a></span>
                            : ""
                        }
                        <div className="descrAndAnnounceNotMobileMainPage">
                            {studentID ?
                                <div className="app-homeWorkSection">
                                    <HomeWorkSection withoutshadow={true} withouthead={true}/>
                                </div>
                                : null
                            }
                            {   studentID === 0 && userID === 0 ?
                                <div style={{display: "flex", width: "100%"}}>
                                    <div style={{width: "90%"}} className="description-main"><span>{descrFirst}</span>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        width: "10%",
                                        justifyContent: "flex-end"
                                    }}>
                                        <div><a href="https://play.google.com/store/apps/details?id=com.mymv2"
                                                target="_blank" rel="noopener noreferrer"><img src={GooglePlayLogo}
                                                                                               style={{
                                                                                                   height: "30px",
                                                                                                   marginTop: "6px"
                                                                                               }} title="Google"
                                                                                               alt="Google&&Apple"/></a>
                                        </div>
                                        <div><a href="https://apps.apple.com/us/app/my-marks/id1488084527?l=uk&ls=1"
                                                target="_blank" rel="noopener noreferrer"><img src={AppStoreLogo}
                                                                                               style={{height: "30px"}}
                                                                                               title="Apple"
                                                                                               alt="Google&&Apple"/></a>
                                        </div>
                                    </div>
                                </div> :
                                studentName ?
                                    <div className="descrHeaderNotMobile">
                                        <div className={"downloadAdnroid"}>
                                            <a className="infoMsgAndroid" href={API_URL + "android"} target="_blank"
                                               rel="noopener noreferrer">
                                                {"Android-приложение   "}
                                                {/*<img style={{left : "30px"}} height={"20px"} src={AndroidBtn} alt=""/>*/}
                                            </a>
                                            <a href="https://play.google.com/store/apps/details?id=com.mymv2"
                                               target="_blank" rel="noopener noreferrer"><img src={GooglePlayLogo}
                                                                                              style={{
                                                                                                  width: "103",
                                                                                                  height: "34px",
                                                                                                  marginTop: "3px"
                                                                                              }} title="Google Play"
                                                                                              alt="Google Play"/></a>
                                        </div>
                                        <div className={"downloadIphone"}>
                                            <a className="" href={""} target="_blank" rel="noopener noreferrer">
                                                {"iPhone-приложение   "}
                                                {/*<img style={{left : "30px"}} height={"20px"} src={AndroidBtn} alt=""/>*/}
                                            </a>
                                            <a href="https://apps.apple.com/us/app/my-marks/id1488084527?l=uk&ls=1"
                                               target="_blank" rel="noopener noreferrer"><img src={AppStoreLogo}
                                                                                              style={{
                                                                                                  width: "103",
                                                                                                  height: "34px",
                                                                                                  marginTop: "3px"
                                                                                              }} title="Google Play"
                                                                                              alt="Google Play"/></a>
                                        </div>
                                        <div className="studentName">
                                            <b>{studentName}</b>
                                        </div>
                                        {stats3!==undefined?
                                            <div className="lastRecords">
                                                {"Последние оценки [" + (new Date(stats3.max)).toLocaleDateString() + ' ' + (new Date(stats3.max)).toLocaleTimeString() + ']: Всего:' + stats3.cnt}
                                            </div> : ''}
                                    </div> : null}
                            {/*</div>*/}
                        </div>

                    </div>}
                    <div style={{   overflow: "auto", marginBottom: "20px" }}>
                        {   studentID === 0 ?
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
                                <TitleBlock
                                    title={!isMobile ? `${langLibrary.step} ${1}${langLibrary.step1Descr}` : `${1}${langLibrary.step1DescrMob}`}
                                    caption={classNumber === 0 ? "" : classNumber + "й"}
                                    done={!(Number(classNumber) === 0)}
                                    onclick={this.stepClick.bind(this)} step={1}
                                    hide={this.props.user.logging ? true : step1}
                                    myCity={this.state.myCity}
                                    myCountryCode={this.state.myCountryCode}
                                    ismobile={isMobile}
                                    isH5={false}
                                />
                                {/*</CSSTransition>*/}
                            </div>
                            : ""}

                        {!step1 && !this.props.user.logging && studentID === 0 ?
                            <div className="block-1">
                                <ClassList classtype="primary-school school" classcount={this.classCount}
                                           click={this.clickClassButton} classnumber={classNumber}
                                           classlabel={`${langLibrary.schoolPrimary} `} buttons={[1, 2, 3, 4]}/>
                                <ClassList classtype="secondary-school school" classcount={this.classCount}
                                           click={this.clickClassButton} classnumber={classNumber}
                                           classlabel={`${langLibrary.schoolMain} `} buttons={[5, 6, 7, 8, 9]}/>
                                <ClassList classtype="high-school school" classcount={this.classCount}
                                           click={this.clickClassButton} classnumber={classNumber}
                                           classlabel={`${langLibrary.schoolHigh} `} buttons={[10, 11]}/>
                            </div>
                            : ""}

                        {   studentID === 0 ?
                            <div>
                                <TitleBlock
                                    title={!isMobile ? `${langLibrary.step} ${2}${langLibrary.step2Descr}` : `${2}${langLibrary.step2DescrMob}`}
                                    caption={pupilCount === 0 ? "" : pupilCount}
                                    done={!(Number(pupilCount) === 0)} onclick={this.stepClick.bind(this)} step={2}
                                    hide={step2}
                                    ismobile={isMobile}
                                    isH5={false}/>
                            </div>
                            : ""
                        }

                        {!step2 && studentID === 0 ?
                            <div className={!step2 ? ("block-2 fadeout") : "block-2"}>
                                <RSlider id="rslider1" statename="pupilCount" onclick={this.changeState.bind(this)}
                                         values={!isMobile ? [10, 15, 20, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 40] : [0, 10, 15, 20, 25, 30, 35, 40]}
                                         set={[pupilCount]} range={false}/>
                            </div>
                            : ""}


                        { !this.isShortList() && studentID === 0 ?
                            <div>
                                <TitleBlock
                                    title={!isMobile ? `${langLibrary.step} ${3}${langLibrary.step3Descr}` : `${3}${langLibrary.step3DescrMob}`}
                                    caption={currentYear === 0 ? "" : currentYear}
                                    done={!(currentYear === "")} onclick={this.stepClick.bind(this)} step={3}
                                    hide={step3}
                                    ismobile={isMobile}
                                    isH5={false}/>
                            </div>
                            : ""
                        }
                        {!this.isShortList() && !step3 && studentID === 0 ?
                            <RSlider id="rslider2" statename="currentYear" onclick={this.changeState.bind(this)}
                                     values={['', '2017/18', '2018/19', '2019/20']} set={[currentYear]} range={false}/>
                            : ""}

                        <div>
                            <TitleBlock
                                title={!isMobile ? `${langLibrary.step} ${!this.isShortList() ? 4 : 3}${langLibrary.step3Descr}` : `${!this.isShortList() ? 4 : 3}${langLibrary.step3DescrMob}`}
                                caption={subjCount === "0/0" ? "" : subjCount}
                                done={!(subjCount === "0/0")}
                                onclick={this.stepClick.bind(this)}
                                step={!this.isShortList() ? 4 : 3}
                                hide={!this.isShortList() ? step4 : step3}
                                ismobile={isMobile}
                                isH5={false}/>
                        </div>

                        {!(!this.isShortList() ? step4 : step3) ?
                            subjects_list.length > 0 ? <SubjectList classnumber={classNumber}
                                                                    changestate={this.changeState.bind(this)}
                                                                    step={4}
                                                                    selectedsubjects={selectedSubjects}
                                                                    selectedsubject={selectedSubj}
                                                                    isnewmech={true}
                                                                    subjects_list={subjects_list}
                                                                    studentid={studentID}
                            />
                                : <div className="descrAndAnnounce"><span
                                className="infoMsg">{`${langLibrary.toChoosClassHelp}`}</span></div>
                            : ""}

                        {studentID === 0 ?
                            <div>
                                <TitleBlock
                                    title={!isMobile ? `${langLibrary.step} ${!this.isShortList() ? 5 : 4}${langLibrary.step4Descr}` : `${!this.isShortList() ? 5 : 4}${langLibrary.step4DescrMob}`}
                                    caption={!isMobile ? selectedSubj["subj_name_ua"] : (selectedSubj.id > 0 ? selectedSubj["subj_name_ua"] : "")}
                                    done={selectedSubj.id}
                                    onclick={this.stepClick.bind(this)}
                                    step={!this.isShortList() ? 5 : 4}
                                    hide={!this.isShortList() ? step5 : step4}
                                    ismobile={isMobile}
                                    isH5={isMobile}/>
                            </div>
                            : ""}
                        {!(!this.isShortList() ? step5 : step4) && studentID === 0 ?
                            selectedSubjects.length > 0 ? <SubjectList classnumber={classNumber}
                                                                       changestate={this.changeState.bind(this)}
                                                                       step={5}
                                                                       selectedsubjects={selectedSubjects}
                                                                       selectedSubj={selectedSubj}
                                                                       isnewmech={true}/>
                                : <div className="descrAndAnnounce"><span
                                className="infoMsg">{`${langLibrary.toChooseSubjectHelp}`}</span></div>
                            : ""}
                        {studentID === 0 ?
                            <div>
                                <TitleBlock
                                    title={!isMobile ? `${langLibrary.step} ${!this.isShortList() ? 6 : 5}${langLibrary.step5Descr}` : `${!this.isShortList() ? 6 : 5}${langLibrary.step5DescrMob}`}
                                    caption={!isMobile ? this.markBlankAlias(markBlank.pk, langLibrary) : (markBlank.alias.length ? langLibrary.yes : "")}
                                    done={!(markBlank.alias === "")}
                                    onclick={this.stepClick.bind(this)}
                                    step={!this.isShortList() ? 6 : 5}
                                    hide={!this.isShortList() ? step6 : step5}
                                    ismobile={isMobile}
                                    isH5={false}/>
                            </div>
                            : ""
                        }
                        {!(!this.isShortList() ? step6 : step5) && studentID === 0 ?
                            <div className="markBlanks">
                                <div id="markblank-1"><MarkBlank kind={1} withborder={true} nohover={true}
                                                                 onclick={this.changeState.bind(this)}
                                                                 selected={markBlank.id === "markblank_twelve"}/></div>
                                <div id="markblank-2"><MarkBlank kind={2} withborder={true} nohover={true}
                                                                 onclick={this.changeState.bind(this)}
                                                                 selected={markBlank.id === "markblank_five"}/></div>
                                <div id="markblank-3"><MarkBlank kind={3} withborder={true} nohover={true}
                                                                 onclick={this.changeState.bind(this)}
                                                                 selected={markBlank.id === "markblank_letters"}/></div>
                            </div>
                            : ""}

                        <div>
                            <TitleBlock
                                title={!isMobile ? `${langLibrary.step} ${!this.isShortList() ? 7 : 6}${langLibrary.step6Descr}` : `${!this.isShortList() ? 7 : 6}${langLibrary.step6DescrMob}`}
                                done={currentPeriodDateCount > 0}
                                caption={!isMobile ? (currentPeriodDateCount.toString() + `${langLibrary.daysAcronim},`).concat(withoutholidays ? `${langLibrary.withOutHolidays},` : "", titlekind === "NICK" ? `+${langLibrary.wordNick}` : (titlekind === "EMAIL" ? "+EMAIL" : `+${langLibrary.wordName}`)) : langLibrary.yes}
                                onclick={this.stepClick.bind(this)} step={!this.isShortList() ? 7 : 6}
                                hide={!this.isShortList() ? step7 : step6}
                                ismobile={isMobile}
                                isH5={false}/>
                        </div>
                        {!(!this.isShortList() ? step7 : step6) ?
                            <div className="additionalSection">
                                <div><RadioGroup onclick={this.changeState.bind(this)} title={langLibrary.addSettings1}
                                                 name={"rangedays"} defelem={currentPeriodDateCount}
                                                 values={[{id: 5, alias: 5}, {id: 10, alias: 10}, {id: 14, alias: 14}, {
                                                     id: 20,
                                                     alias: 20
                                                 }]} addinput={true}/></div>
                                {studentID === 0 ?
                                    <div><RadioGroup onclick={this.changeState.bind(this)} title={langLibrary.addSettings2}
                                                     name={"listnames"} defelem={titlekind}
                                                     values={[{id: "NAME", alias: `${langLibrary.wordName}`}, {
                                                         id: "NICK",
                                                         alias: `${langLibrary.wordNick}`
                                                     }, {id: "EMAIL", alias: "EMAIL"}]}/></div> : ""}
                                {studentID === 0 ?
                                    <div><RadioGroup onclick={this.changeState.bind(this)} title={langLibrary.addSettins3}
                                                     name={"rangedirection"} defelem={direction} values={[{
                                        id: "UPDOWN",
                                        alias: `${langLibrary.directionUpDown}`
                                    }, {id: "LEFTRIGHT", alias: `${langLibrary.directionLeftRight}`}]}/></div> : ""}
                                <div><Checkbox onclick={this.changeState.bind(this)} bold={true} name={"withoutholidays"}
                                               defelem={withoutholidays} label={` ${langLibrary.addSettings4}`}/></div>
                                {studentID > 0 && <EmailList studentId={studentID} studentName={studentName} userID={userID}/>}
                            </div>
                            : ""}
                        {studentID === 0 ?
                            <div>
                                <TitleBlock
                                    title={!isMobile ? `${langLibrary.step} ${!this.isShortList() ? 8 : 7}${langLibrary.step7Descr}` : `${!this.isShortList() ? 8 : 7}${langLibrary.step7DescrMob}`}
                                    done={this.state.isJournalClicked}
                                    caption={this.state.stats.hasOwnProperty('diff') && this.state.stats.tomark} //+ dateDiff((new Date(this.state.stats.dd)), (new Date()))+'дн. назад '
                                    isMarkSpeed={true}
                                    onclick={this.stepClick.bind(this)} step={!this.isShortList() ? 8 : 7}
                                    hide={!this.isShortList() ? step8 : step7}
                                    ismobile={isMobile}
                                    isH5={false}/>
                            </div>
                            : ""}
                        {!(!this.isShortList() ? step8 : step7) || studentID > 0 ?
                            <div className="tableSection">
                                {studentID === 0 ?
                                    <MarksTable onclick={this.changeCell.bind(this)}
                                                markblank={markBlank.pk}
                                                dayscount={currentPeriodDateCount}
                                                marks={this.state.marks}
                                                size={pupilCount}
                                                direction={direction}
                                                withoutholidays={withoutholidays}
                                                titlekind={titlekind}
                                                changestate={this.changeState.bind(this)}
                                    /> :
                                    <StudentTable onclick={this.changeCell.bind(this)}
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
                            : ""}
                        {studentID === 0 && isadmin ?
                            <div>
                                <TitleBlock
                                    title={!isMobile ? `${langLibrary.step} ${!this.isShortList() ? 9 : 8}${langLibrary.step8Descr}` : `${!this.isShortList() ? 9 : 8}${langLibrary.step8DescrMob}`}
                                    done={false}
                                    onclick={this.stepClick.bind(this)} step={!this.isShortList() ? 9 : 8}
                                    hide={!this.isShortList() ? step9 : step8}
                                    ismobile={isMobile}
                                    isH5={false}/>
                            </div>
                            : ""}
                        {!(!this.isShortList() ? step9 : step8) && studentID === 0 ?
                            <div className="additionalSection">
                                <button>
                                    <a className="infoMsg" href={EXCEL_URL + "/" + this.props.userSetup.classID + '/20190401'}
                                       target="_blank" rel="noopener noreferrer">
                                        {"Получить файл для ввода оценок"}
                                    </a>
                                </button>
                                {false?<div>
                                            <button>Импорт оценок</button>
                                            <button>Импорт справочника учеников</button>
                                        </div>:null}

                            </div>
                            : ""}

                        {studentID === 0 && isadmin ?
                            <div>
                                <TitleBlock
                                    title={!isMobile ? `${langLibrary.step} ${!this.isShortList() ? 10 : 9}${langLibrary.step9Descr}` : `${!this.isShortList() ? 10 : 9}${langLibrary.step9DescrMob}`}
                                    done={false} onclick={this.stepClick.bind(this)}
                                    step={!this.isShortList() ? 10 : 9}
                                    hide={!this.isShortList() ? step10 : step9}
                                    ismobile={isMobile}
                                    isH5={false}/>
                            </div>
                            : ""}
                        {(!(!this.isShortList() ? step10 : step9) || studentID > 0) && this.props.userSetup.marks.length ?
                            <div className="additionalSection">
                                <Charts studSubj={this.state.studSubj}/>
                            </div>
                            : ""}
                        {((!(!this.isShortList() ? step10 : step9) && classID > 0) || studentID > 0) ?
                            <div className="additionalSection">
                                {this.props.userSetup.avgclassmarks.length ?
                                    <Chart
                                        chartType="LineChart"
                                        width="100%"
                                        height="400px"
                                        columns={data[1]}
                                        rows={data[0]}
                                        options={options}
                                    /> : ""}
                            </div>
                            : ""}

                        {userID === 0 ?
                            <div>
                                <TitleBlock title={!isMobile ? langLibrary.step10Descr : langLibrary.step10DescrMob}
                                            isyellow={true} done={false} onclick={this.stepClick.bind(this)}
                                            isgrey={this.props.userSetup.stepsLeft}
                                            caption={this.props.userSetup.stepsLeft ? (`${langLibrary.leftStepBegin} ` + (this.props.userSetup.stepsLeft).toString() + (this.props.userSetup.stepsLeft === 1 ? ` ${langLibrary.leftStepsEnd}` : (this.props.userSetup.stepsLeft < 5) ? ` ${langLibrary.leftStepsEnd}` : ` ${langLibrary.leftStepsEnd}`)) : ""}
                                            step={!this.isShortList() ? 11 : 10}
                                            hide={!this.isShortList() ? step11 : step10}
                                            ismobile={isMobile}
                                            isH5={false}/>
                            </div> : ""}
                        {!(!this.isShortList() ? step11 : step10) && userID === 0 && !(this.props.userSetup.stepsLeft) ?
                            <div>
                                <LoginBlock pupilcount={pupilCount} usersetup={this.props.userSetup}
                                            changestate={this.changeState} /*onsetup={this.props.onSetSetup}*//>
                            </div> : ""}

                </div>
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
                {!isMobile ? <div className="app__social-buttons">
                    <div className="app__vertical-text" style={{position : "absolute", right : "-3px", top : "5px", height : "100%", fontSize : ".9em"}}>communication & feedback</div>
                    <div className="app__social-button">
                        <a href="https://fb.me/My.Marks.info"
                           target="_blank" rel="noopener noreferrer"><img src={FBLogo}
                                                                          style={{height: "30px"}}
                                                                          title="Facebook"
                                                                          alt="Facebook"/></a>
                    </div>
                    <div className="app__social-button">
                        <img src={TwitterLogo}
                             style={{height: "30px", opacity : .3}}
                             title="Twitter"
                             alt="Twitter"/>
                    </div>
                    <div className="app__social-button">
                        <img src={GPlusLogo}
                             style={{height: "30px", opacity : .3}}
                             title="Twitter"
                             alt="Twitter"/>
                    </div>
                    <div className="app__social-button">
                        <img src={InstaLogo}
                             style={{height: "30px", opacity : .3}}
                             title="Twitter"
                             alt="Twitter"/>
                    </div>
                </div>:
                    <div className="app__social-buttons-mobile">
                        <div className="app__social-button">
                            <a href="https://fb.me/My.Marks.info"
                               target="_blank" rel="noopener noreferrer"><img src={FBLogo}
                                                                              style={{height: "30px"}}
                                                                              title="Facebook"
                                                                              alt="Facebook"/></a>
                        </div>
                        <div className="app__social-button">
                            <img src={TwitterLogo}
                                 style={{height: "30px", opacity : .3}}
                                 title="Twitter"
                                 alt="Twitter"/>
                        </div>
                        <div className="app__social-button">
                            <img src={GPlusLogo}
                                 style={{height: "30px", opacity : .3}}
                                 title="Twitter"
                                 alt="Twitter"/>
                        </div>
                        <div className="app__social-button">
                            <img src={InstaLogo}
                                 style={{height: "30px", opacity : .3}}
                                 title="Twitter"
                                 alt="Twitter"/>
                        </div>
                    </div>}
                {/*{!this.state.displayChat?*/}
                {userID&&isadmin?
                    <div className={"btn-chat"} onClick={() => {
                    this.setState({displayChat: !this.state.displayChat})
                }}><img height={"40px"} src={ChatBtn} alt=""/>
                    {this.state.newChatMessages ?
                        <div className="mym-new-chat-messages-count">{this.state.newChatMessages}</div> : null}
                    {this.state.newHomeworkMessages ?
                        <div className="mym-new-chat-messages-hw-count">{this.state.newHomeworkMessages}</div> : null}
                    </div>:null}
                {/*:""} */}

                <div className={"btn-chat-new"} onClick={() => {this.setState({displayNewChat: !this.state.displayNewChat})}}>
                    <img height={"40px"} src={ChatBtn} alt=""/>
                    {this.state.newChatMessages ?
                        <div className="mym-new-chat-messages-count">{this.state.newChatMessages}</div> : null}
                    {this.state.newHomeworkMessages ?
                        <div className="mym-new-chat-messages-hw-count">{this.state.newHomeworkMessages}</div> : null}
                </div>
                {isMobile?<div className="btn-videocam">
                              <Link to="/video"><img src={VideoIcon} alt={"VideoStuding"}/></Link>
                            </div>
                :null}


                <Chat
                    isnew={false} updatemessage={this.updateMessages}
                    session_id={this.props.userSetup.chatSessionID} homeworkarray={this.props.userSetup.homework}
                    chatroomID={this.props.userSetup.classObj.chatroom_id}
                    messages={this.state.chatMessages}
                    subjs={selectedSubjects} btnclose={() => {
                    this.setState({displayChat: !this.state.displayChat})
                }}
                    display={this.state.displayChat} newmessage={this.newChatMessage}/>


                <Chat
                    isnew={true} updatemessage={this.updateMessages}
                    session_id={this.props.userSetup.chatSessionID} homeworkarray={this.props.userSetup.homework}
                    chatroomID={this.props.userSetup.classObj.chatroom_id}
                    messages={this.state.chatMessages}
                    subjs={selectedSubjects} btnclose={() => {
                    this.setState({displayNewChat: !this.state.displayNewChat})
                }}
                    display={this.state.displayNewChat} newmessage={this.newChatMessage}/>


            </div>


        );


        // console.log("step1", this.state.steps.step1)
    }

}

const mapDispatchToProps = dispatch => {
    return ({
        // onInitState : () => dispatch(initState),
        onSetSetup: (data, userSetup) => {
            const asyncSetSetup = (data, userSetup) => {
                return dispatch => {
                    // console.log('UPDATE_SETUP_LOCALLY', data, Object.keys(data)[0], Object.values(data)[0])
                    dispatch({type: 'UPDATE_SETUP_LOCALLY', payload: data})
                    if (Object.keys(data)[0] === "class_number") {
                        document.body.style.cursor = 'progress';

                        ISCONSOLE && console.log("CLASS_NUMBER2", SUBJECTS_GET_URL + '/' + Object.values(data)[0] + '/' + Object.values(data)[1])

                        instanceAxios().get(SUBJECTS_GET_URL + '/' + Object.values(data)[0] + '/' + Object.values(data)[1])
                            .then(response => {
                                // let responsedata = response.data;
                                ISCONSOLE && console.log("CLASS_NUMBER", response.data)
                                dispatch({type: 'UPDATE_SETUP_LOCALLY_SUBJLIST', payload: response.data})
                                dispatch({type: 'UPDATE_SETUP_LOCALLY_SELECTEDSUBJECTS', payload: response.data})
                                dispatch({type: 'UPDATE_SETUP_LOCALLY_SELECTEDSUBJECT', payload: response.data[0]})

                                let arr = response.data.map(value => value.subj_key);
                                let postdata = `{"subjects_list":"${arr}", {"selected_subjects":"${arr}"}`;
                                if (userSetup.userID) {
                                    instanceAxios().post(UPDATESETUP_URL + '/' + userSetup.userID, postdata)
                                        .then(response => {
                                            ISCONSOLE && console.log('UPDATE_SETUP_SUCCESSFULLY_subjects_list', response.data, userSetup.userID);
                                        })
                                        .catch(response => {
                                            console.log('UPDATE_SETUP_FAILED_subjects_list', response);
                                            // dispatch({type: 'UPDATE_SETUP_FAILED', payload: response.data})
                                        })
                                }
                                // console.log("userSetup.isadmin", userSetup.isadmin)
                                // ToDO: Проставим перечень предметов + для всех студентов (будем делать это на стороне сервера)
                                // ToDO: Выберем все предметы + для всех студентов (будем делать это на стороне сервера)
                                // ToDO: Предметом укажем первый + для всех студентов (будем делать это на стороне сервера)

                                if (userSetup.userID && userSetup.isadmin > 0)
                                    instanceAxios().get(API_URL + 'class/' + userSetup.classID + '/' + Object.keys(data)[0] + '/' + Object.values(data)[0])
                                        .then(response => {
                                            console.log("GROUP_UPDATE", response.data)
                                        })
                                        .catch(response => {
                                            console.log("GROUP_UPDATE_ERROR", response.data)
                                        })
                                ISCONSOLE && console.log("subjects_count", response.data)
                                let json = `{"subjects_count":"${response.data.length + "/" + response.data.length}"}`;
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
                        if (Object.keys(data)[0] === "selected_subjects") {
                            // console.log("SELECTED_SUBJECTS", data, Object.values(data)[0], Object.values(data)[0].map(val=>val.subj_key), Object.values(data)[0].map(val=>val.subj_key).join())
                            // console.log(data)
                            let json = `{"selected_subjects":"${Object.values(data)[0].map(val => val.subj_key).join()}"}`;
                            data = JSON.parse(json);
                            // return
                        }
                        if (Object.keys(data)[0] === "students") {
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
        onUserLogging: (name, pwd, provider, provider_id, langLibrary, code) => {
            dispatch({type: 'APP_LOADING'})
            ISCONSOLE && console.log("OnUserLogging")
            const asyncLoggedIn = (name, pwd, provider, provider_id, langLibrary, code) => {
                return dispatch => {
                    dispatch(userLoggedIn(name, pwd, provider, provider_id, langLibrary, code))
                }
            }
            dispatch(asyncLoggedIn(name, pwd, provider, provider_id, langLibrary, code))
        },
        onUserLoggingByToken: async (email, token, kind, langLibrary) => {
            const asyncLoggedInByToken = (email, token, kind, langLibrary) => {
                return async dispatch => {
                    dispatch(userLoggedInByToken(email, token, kind, langLibrary))
                }
            }
            dispatch(asyncLoggedInByToken(email, token, kind, langLibrary))
        },
        onUserLoggingOut: (token, langLibrary) => {
            return dispatch(userLoggedOut(token, langLibrary))
        },
        onClearErrorMsg: () => {
            dispatch({type: 'USER_MSG_CLEAR', payload: []})
        },
        onReduxUpdate: (key, payload) => dispatch({type: key, payload: payload}),
        onStudentChartSubject: value => {
            return dispatch({type: 'UPDATE_STUDENT_CHART_SUBJECT', payload: value})
        },
        onStopLogging: () => dispatch({type: 'USER_LOGGEDIN_DONE', payload: []}),
        onStopLoading: () => dispatch({type: 'APP_LOADED'}),
        onStartLoading: () => dispatch({type: 'APP_LOADING'}),
        onChangeStepsQty: (steps) => dispatch({type: 'ENABLE_SAVE_STEPS', payload: steps})
    })
}
// в наш компонент App, с помощью connect(mapStateToProps)
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withCookies(App)))

