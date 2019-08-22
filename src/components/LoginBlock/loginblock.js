/**
 * Created by Paul on 22.01.2019.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux'
import './loginblock.css'
import {numberToLang, msgTimeOut, instanceAxios, mapStateToProps} from '../../js/helpers'
import { FACEBOOK_URL, CREATEUSER_URL, UPDATESETUP_URL, SUBJECTS_GET_URL, UPDATECLASS_URL, STUDENTS_ADD_URL, instanceLocator, testToken, chatUserName } from '../../config/config'
import emailPropType from 'email-prop-type';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import FacebookLogin from 'react-facebook-login';
import {GoogleLogin} from 'react-google-login';
import '../../containers/App.css'

class LoginBlock extends Component {

    constructor(props){
        super(props);
        this.state = (
            {
                newUser : 0,
                newEmail : "",
                newProviderReg : "",
                Error : "",
                fbName : !(localStorage.getItem("fbLogin")===null)?JSON.parse(localStorage.getItem("fbLogin")).fbName:'',
                fbMail : !(localStorage.getItem("fbLogin")===null)?JSON.parse(localStorage.getItem("fbLogin")).fbMail:'',
                fbFoto : !(localStorage.getItem("fbLogin")===null)?JSON.parse(localStorage.getItem("fbLogin")).fbFoto:'',
                fbId : !(localStorage.getItem("fbLogin")===null)?JSON.parse(localStorage.getItem("fbLogin")).fbId:0,
                fbLoggedIn : !(localStorage.getItem("fbLogin")===null),
                gmName : !(localStorage.getItem("gmLogin")===null)?JSON.parse(localStorage.getItem("gmLogin")).gmName:'',
                gmMail : !(localStorage.getItem("gmLogin")===null)?JSON.parse(localStorage.getItem("gmLogin")).gmMail:'',
                gmFoto : !(localStorage.getItem("gmLogin")===null)?JSON.parse(localStorage.getItem("gmLogin")).gmFoto:'',
                gmId : !(localStorage.getItem("gmLogin")===null)?JSON.parse(localStorage.getItem("gmLogin")).gmId:0,
                gmLoggedIn : !(localStorage.getItem("gmLogin")===null),
                currentUser : {},
                roomId : '',
            }
                        )
    }
    responseFacebook = (res) => {
        console.log("resFacebook", res);
        let obj = {}, user={};
        this.setState({
            fbName : res.name,
            fbMail : res.email,
            fbFoto : res.picture.data.url,
            fbId : res.id,
            fbLoggedIn : true,
        })
        obj.fbName = res.name
        obj.fbMail = res.email
        obj.fbFoto = res.picture.data.url
        obj.fbId = res.id
        localStorage.setItem("fbLogin", JSON.stringify(obj))
        user.name = res.name
        user.email = res.email
        user.foto = res.picture.data.url
        user.provider_id = res.id
        this.createUser('facebook',user)
    }
    componentClicked = ()=>{
        console.log("componentClicked")
    }
    responseGoogle = (res)=>{
        // console.log("RENDER_GOOGLE")
        console.log("resGoogle", res);
        if (res.hasOwnProperty('error')) {
            this.googleLogout()
        }
        else {
            let obj = {}, user={};
            this.setState({
                gmName: res.w3.ig,
                gmMail: res.w3.U3,
                gmFoto: res.w3.Paa,
                gmId: res.w3.Eea
            })
            // Eea: "113641938008833602814"
            // Paa: "https://lh4.googleusercontent.com/-kKBOeouO6_g/AAAAAAAAAAI/AAAAAAAAAPk/0qi7STpQzb4/s96-c/photo.jpg"
            // U3: "paul.n.skiba@gmail.com"
            // ig: "Paul Skiba"
            obj.gmName = res.w3.ig
            obj.gmMail = res.w3.U3
            obj.gmFoto = res.w3.Paa
            obj.gmId = res.w3.Eea
            localStorage.setItem("gmLogin", JSON.stringify(obj))
            user.name = res.w3.ig
            user.email = res.w3.U3
            user.foto = res.w3.Paa
            user.provider_id = res.w3.Eea
            this.createUser('google',user)
        }
     }
    createUser(userType, user){
        this.props.onStartLoading()

        console.log('createUser', userType, user, this.inputEmail.value.toString().split("@")[0], this.inputEmail.value, this.inputPwd.value)
        let header = {
            headers: {
                "Content-Type": "application/json",
            }
        }
        let name = '', email = '', password = '', provider_id = '';
        switch (userType) {
            case 'facebook':
                name = user.name
                email = user.email
                password = ''
                provider_id = user.provider_id
                break;
            case 'google':
                name = user.name
                email = user.email
                password = ''
                provider_id = user.provider_id
                break;
            default:
                name = this.inputEmail.value.toString().split("@")[0].charAt(0).toUpperCase() + this.inputEmail.value.toString().split("@")[0].slice(1)
                email = this.inputEmail.value
                password = this.inputPwd.value
                userType = ''
                provider_id = null
                break;
        }
        const data = {
            "name": name,
            "email": email,
            "password": password,
            "student_cnt" : this.props.pupilcount,
            'provider' : userType,
            'provider_id' : provider_id,
            'city_name' : localStorage.getItem('myCity'),
            'country_code' : localStorage.getItem('myCountryCode'),
            'country' : localStorage.getItem('myCountry')
             };

        console.log('CREATEUSER_URL', JSON.stringify(data), data, CREATEUSER_URL)
        // return

        document.body.style.cursor = 'progress';
        instanceAxios().post(CREATEUSER_URL, JSON.stringify(data), header)
            .then(response => {
                if (!(response.data.message==="Error")) {
                    console.log("CREATEUSER_URL", response.data, this.props.usersetup, response.data.user.id);
                    // Для вывода сообщения о проверке почты
                    if (!userType.length)
                        this.setState({newUser: response.data.user.id, newEmail: email})
                    else
                        this.setState({newProviderReg: userType.toString().toUpperCase()})

                    this.setSetup(this.props.usersetup, response.data.user.id, response.data.user.class_id);
                    // ToDo: Здесь сохраним комнату в Чате и пропишем пользователю
                    const chatManager = new ChatManager({
                        instanceLocator: instanceLocator,
                        userId: chatUserName,
                        tokenProvider: new TokenProvider({url: testToken})
                    })
                    chatManager
                        .connect()
                        .then(currentUser => {
                            this.setState({currentUser})
                            let newRoomName = 'room'+response.data.user.id
                            console.log('newRoomName', newRoomName)
                            return currentUser.createRoom({name : newRoomName})
                        })
                        .then(room=>{
                            this.props.onReduxUpdate("UPDATE_CHATROOMID", room.id)
                            instanceAxios().get(UPDATECLASS_URL + response.data.user.class_id + '/chatroom_id/'+room.id, '', header)
                                .then(resp=>console.log('UPDATE_CHATROOMID', resp))
                                .catch(resp=>console.log('UPDATE_CHATROOMID_ERROR', resp))
                        })
                }
                else {
                    console.log("CREATEUSER_URL_FAILED", Object.values(JSON.parse(JSON.stringify(response.data)).errortext)[0][0]); // , JSON.parse(response.data.errortext)
                    this.setState({
                        Error : Object.values(JSON.parse(JSON.stringify(response.data)).errortext)[0][0]
                    })
                    window.setTimeout(() => {
                        this.setState({
                            Error: ""
                        });
                    }, msgTimeOut);
                }
                document.body.style.cursor = 'default';
            })
            .catch (response => {
                console.log("CREATEUSER_URL_FAILED", response);
                this.props.onStopLoading()
                document.body.style.cursor = 'default';
            })
    };

    setSetup = async (usersetup, userID, classID)=>{
//        console.log("setSetup", usersetup);
//         this.changeState("curClass",usersetup.curClass, userID);
        let {classNumber, subjects_list, pupilCount, currentYear, selectedSubj, selectedSubjects, markBlank, titlekind, currentPeriodDateCount, direction, withoutholidays} = this.props.userSetup;
        // let res = true;
        //
        let data = {}
        data.class_id = classID
        data.class_number=classNumber
        data.year_name= currentYear
        data.titlekind = titlekind
        data.perioddayscount=currentPeriodDateCount
        data.direction=direction
        data.withoutholidays=withoutholidays
        data.subjects_count=subjects_list.length.toString()+'/'+ (selectedSubjects[0]===""?0:selectedSubjects.length).toString()
        data.selected_subject = typeof selectedSubj === "object"? selectedSubj.subj_key+','+selectedSubj.subj_name_ua+','+selectedSubj.id.toString():null
        data.selected_marker = markBlank.pk
        data.markblank_alias = markBlank.alias.toString().replace(/[/]/g, '\\/')
        data.markblank_id = markBlank.id
        data.subjects_list = subjects_list.map(value=>value.subj_key).join(',')
        data.selected_subjects = selectedSubjects.map(value=>value.subj_key).join(',')
        data.pupil_count = pupilCount
        // data = JSON.stringify(data)
        // res = await this.changeState("class_id",classID, userID,classID);
        // classID = usersetup.classID;
        await this.changeState("groupUpdate",data, userID, classID)
        await this.changeState("students",usersetup.pupilCount, userID, classID)
        this.props.onStopLoading()
    }

    changeState(name, value, userID, classID) {
        // let {curClass} = this.state
        let json, data, arr=[];
        let {students : studs, subjects_list, selectedSubjects} = this.props.usersetup;
        console.log("changeState", name, value, userID)
        switch (name) {
            // case 'userId' : { this.setState({ userID : userID }); break;}
            case "class_id" :
                json = `{"class_id":${value}}`; break;
            // case 'curClass' :
            //     json = `{"class_number":${value}}`; break;
            case 'classNumber' :
                json = `{"class_number":${value}}`; break;
            case 'pupilCount' :
                // if (value > pupilCount) {
                    //Заполним массив студентов (id, name, nick, rowno, class_id, user_id)
                    // let arr = [];
                    for (let i = 0; i < value; i++) {
                        // console.log("studs[i]", studs[i]); //JSON.parse(studs[i])
                        if (!(studs[i]) || ((typeof studs[i] === "object") && !(studs[i].hasOwnProperty('id'))))
                            arr.push({"id": 0, "student_name" : "", "student_nick" : numberToLang(i+1, ' ', 'rus'), "rowno" : i, "class_id": classID, "user_id" : userID});
                        else
                            arr.push({"id": studs[i].id, "student_name" : studs[i].student_name, "student_nick" : studs[i].student_nick, "rowno" : studs[i].rowno, "class_id": classID, "user_id" : userID})
                    }
                    json = `{"students":${JSON.stringify(arr)}}`;
                    data = JSON.parse(json);
                    console.log("PupilCountArr", arr, data);
                    this.props.onSetSetup(data, userID, classID)
                // }
                json = `{"pupil_count":${value}}`; break;
            case 'students' :
                // let arr = [];
                for (let i = 0; i < value; i++) {
                    // console.log("studs[i]", studs[i]); //JSON.parse(studs[i])
                    if (!(studs[i]) || ((typeof studs[i] === "object") && !(studs[i].hasOwnProperty('id'))))
                        arr.push({"id": 0, "student_name" : "", "student_nick" : numberToLang(i+1, ' ', 'rus'), "rowno" : i, "class_id": classID, "user_id" : userID});
                    else
                        arr.push({"id": studs[i].id, "student_name" : studs[i].student_name, "student_nick" : studs[i].student_nick, "rowno" : studs[i].rowno, "class_id": classID, "user_id" : userID})
                }
                json = `{"students":${JSON.stringify(arr)}}`;
                data = JSON.parse(json);
                console.log("PupilCountArr", arr, data);
                this.props.onSetSetup(data, userID, classID)
                return;
            case 'currentYear' :
                // this.setState({
                //     currentYear: value,
                //     curYearDone : value?1:0
                // });
                json = `{"year_name":"${value.toString().replace(/[/]/g, '\\/')}"}`;
                // value&&this.props.onSetSetup(data, userID, curClass);
                break;
            case "selectedSubj" :
                console.log("selectedSubj", value);
                if (typeof value === "object") {
                    // let key1 = JSON.stringify(`"subj_key":"${value.subj_key}"`)
                    // let key2 = JSON.stringify(`"subj_name_ua":"${value.subj_name_ua}"`)
                    json = `{"selected_subject":"${value.subj_key},${value.subj_name_ua}"}`
                    // console.log(json, JSON.stringify(json))
                }
                else
                json = `{"selected_subject":"${value}"}`; break;
            case "subjCount" :
                console.log("selectedSubjsArray", selectedSubjects);
                json = `{"subjects_count":"${subjects_list.length+'/'+ selectedSubjects[0]===""?0:selectedSubjects.length}"}`; break;
            case "selectedSubjects" : // Количество выбранных для отслеживания оценок
                json = `{"selected_subjects":[${value.map(val=>`{"subj_key":"${val.subj_key}","subj_name_ua":"${val.subj_name_ua}"}`)}]}`;
                data = JSON.parse(json);
                console.log("selected_subjects", value, json);
                this.props.onSetSetup(data, userID, classID);
                json = `{"subjects_count":"${subjects_list.length +'/'+ value.length}"}`; break;
            case "markBlank" :
                let   alias = "", pk = 0; //id = value;
                if (typeof value === "object") {
                    alias = value.alias;
                    pk = value.pk;
                    value = value.id;
                }
                else
                switch (value) {
                    case "markblank_twelve" : alias = "Двенадцатибальная"; pk = 1; break;
                    case "markblank_five" : alias = "Пятибальная"; pk = 2; break;
                    case "markblank_letters" : alias = "A-E/F"; pk = 3; break;
                    default: break;
                }
                let key1, key2, key3;
                json = `{"markblank_id":"${value}"}`; data = JSON.parse(json); key1 = data;
                // this.props.onSetSetup(data, this.props.userSetup.userID, this.props.userSetup.curClass)
                json = `{"markblank_alias":"${alias.toString().replace(/[/]/g, '\\/')}"}`; data = JSON.parse(json); key2 = data
                // this.props.onSetSetup(data, this.props.userSetup.userID, this.props.userSetup.curClass)
                json = `{"selected_marker":${pk}}`; data = JSON.parse(json); key3 = data;
                // this.props.onSetSetup(data, this.props.userSetup.userID, this.props.userSetup.curClass)
                json = `{"markblank":[${JSON.stringify(key1)},${JSON.stringify(key2)},${JSON.stringify(key3)}]}`; break;
            case "listnames" :
                json = `{"titlekind":"${value}"}`; break;
            case "rangedays" :
                console.log("rangedays", value)
                json = `{"perioddayscount":${value}}`; break;
            case "rangedirection" :
                console.log("DATA", data);
                json = `{"direction":"${value}"}`; break;
            case "withoutholidays" :
                document.body.style.cursor = 'default';
                json = `{"withoutholidays":${value}}`; break;
            case 'groupUpdate' :
                document.body.style.cursor = 'default';
                json = JSON.stringify(value);
                break;
            default:
                break;
        }
        if (json) {
            data = JSON.parse(json);
            console.log(name, data);
            this.props.onSetSetup(data, userID, classID);
        }
    }

    // oAuth2Create() {
    //     const data = {
    //         // name: 'ClientName',
    //         // redirect: BASE_URL,
    //         "username": "test@gmail.com",
    //         "password": "test1",
    //         "grant_type": "password",
    //         "client_id": 2,
    //         "client_secret": "Z7ccv17TD6jf03E6MUTpFBXVl9NuLfzBKRqf8AFK",
    //         "scope": "*"
    //     };

        // axios.post(TOKEN_URL, data)
        //     .then(response => {
        //         console.log(response.data);
        //     })
        //     .catch (response => {
        //         console.log(response);
        //         // Список ошибок в отклике...
        //     })};
    componentWIllMount=()=>{
        this.responseFacebook();
        this.responseGoogle();
        // console.log("RENDER")
    }
    componetDidMount() {
        this.inputEmail.propTypes = {
            emailAddress: emailPropType.isRequired, // can also specify emailPropType if it is not required
        };
    }
    hidePopup(){
        console.log("hidePopup")
        this.setState({
            Error : ""
        })
    }
    loginByFB=()=>{
        document.body.style.cursor = 'progress';
        let header = {
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE, OPTIONS',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }
        instanceAxios().get(FACEBOOK_URL, {}, header)
            .then(response => {
                if (!(response.data.message==="Error")) {
                    console.log("CREATEUSER_URL", response);
                    // this.setState({newUser: response.data.user.id, newEmail: this.inputEmail.value})
                    // this.setSetup(this.props.usersetup, response.data.user.id, response.data.user.class_id);
                }
                else {
                    console.log("CREATEUSER_URL_FAILED", Object.values(JSON.parse(JSON.stringify(response.data)).errortext)[0][0]); // , JSON.parse(response.data.errortext)
                    this.setState({
                        Error : Object.values(JSON.parse(JSON.stringify(response.data)).errortext)[0][0]
                    })
                    window.setTimeout(() => {
                        this.setState({
                            Error: ""
                        });
                    }, msgTimeOut);
                }
                document.body.style.cursor = 'default';
            })
            .catch (response => {
                console.log("CREATEUSER_URL_FAILED", response);
                document.body.style.cursor = 'default';
            })
    }
    googleLogout=()=>{
        // Eea: "113641938008833602814"
        // Paa: "https://lh4.googleusercontent.com/-kKBOeouO6_g/AAAAAAAAAAI/AAAAAAAAAPk/0qi7STpQzb4/s96-c/photo.jpg"
        // U3: "paul.n.skiba@gmail.com"
        // ig: "Paul Skiba"
        console.log("googleLogout")
        let obj = {}
        obj.gmName = ''
        obj.gmMail = ""
        obj.gmFoto = ""
        obj.gmId = 0
        localStorage.setItem("gmLogin", JSON.stringify(obj))
        this.setState({
            gmName : '',
            gmMail : '',
            gmFoto : '',
            gmId : 0
        })
    }
    render() {

        return (
        <div className="loginSection">
            <div className="loginSubSection">
                {/*<div className="loginBlockHeader"><div><b>Зарегистрироваться самостоятельно</b></div><div><b>...или с помощью:</b></div></div>*/}
                {/*<div>*/}
                    <div className="inputBlockTop">
                        <div><b>Зарегистрироваться самостоятельно</b></div>
                        <div className="inputBlockTop2">
                            <div className="inputBlock">
                                <div><label>Email</label><input type="email" ref={input=>{this.inputEmail=input}}></input></div>
                                <div><label>Пароль</label><input type="password" placeholder="свой пароль" ref={input=>{this.inputPwd=input}}></input></div>
                            </div>
                            <div className="inputBlock">
                                <button className={"btn-login-save"}onClick={this.createUser.bind(this)}>Сохранить</button>
                                <div><input type="password" placeholder="проверка пароля" ref={input=>{this.inputPwdCheck=input}}></input></div>
                            </div>
                            <div className={this.state.Error.length?"popup3 show3":"popup3"} onClick={this.hidePopup.bind(this)}>
                                {this.state.Error.length?<span className="popuptext3" id="myPopup">{this.state.Error}</span>:""}
                            </div>
                        </div>
                    </div>
                    <div className="newUserHint">
                        {this.state.newUser?<div>Для начала работы проверьте письмо по адресу <b>{this.state.newEmail}</b>,
                            чтобы подтвердить электронный адрес</div>:""}
                        {this.state.newProviderReg.length?<div>Вы успешно зарегистрированы через <b>{this.state.newProviderReg}</b></div>:""}
                    </div>
                    <div className="inputBlockBtns">
                        <div><b>...или с помощью:</b></div>
                            <FacebookLogin
                                appId="2330660220490285"
                                // autoLoad={true}
                                fields="name,email,picture"
                                onClick={this.componentClicked}
                                callback={this.responseFacebook}
                                 render={renderProps => (
                                     <button className="my-facebook-button-class" onClick={renderProps.onClick}>
                                         <img height={"30px"} src={this.state.fbFoto} alt={this.state.fbName}/>
                                         {this.state.fbLoggedIn?"Facebook: " + this.state.fbName:"Facebook"}
                                     </button>)}
                                cssClass={"my-facebook-button-class"}
                                // icon="fa-facebook"
                                textButton={this.state.fbLoggedIn?"Facebook: " + this.state.fbName:"Facebook"}
                            />
                            <GoogleLogin
                                buttonText={this.state.gmName.length?this.state.gmName:"Google"}
                                onSuccess={this.responseGoogle}
                                onFailure={this.responseGoogle}
                                // autoLoad={true}
                                cookiePolicy={'single_host_origin'}
                                render={renderProps => (
                                     <button className="my-google-button-class"
                                             onClick={renderProps.onClick}
                                             disabled={renderProps.disabled}>{this.state.gmName.length?"Google: " + this.state.gmName:"Google"}</button>
                                  )}
                                className="my-google-button-class"
                                cssClass={"my-google-button-class"}
                                icon={false}
                                clientId="1032512893062-e4p8pp7923eogdfh38d2ltf03ub4calu.apps.googleusercontent.com"
                            />
                    </div>
                    {/*/!*<a href="{{ url('/auth/google') }}" class="btn btn-google"><i class="fa fa-google"></i> Google</a>*!/*/}
                    {/*<div><button>Google(Gmail)</button></div>*/}
                    {/*<a href="{{ url('/auth/facebook') }}" class="btn btn-facebook">Facebook</a>*/}
                    {/*<div className="btn-social" onClick={this.loginByFB.bind(this)}><img height="30px" src={fbBtn} alt={""}/></div>*/}

                    {/*<div><a href={FACEBOOK_URL}><img height="30px" src={googleBtn} alt={""}/></a></div>*/}
                    {/*<div><a href={FACEBOOK_URL}><img height="30px" src={linkedinBtn} alt={""}/></a></div>*/}

                    {/*<FacebookLogin/>*/}
                {/*</div>*/}
            </div>
            <div>
                <b>После регистрации появится возможность:</b>
                    <ol type="1">
                        <li>разослать приглашения для родителей и учеников класса</li>
                        <li>установить для учеников нужные имена или ники</li>
                        <li>следить за динамикой успеваемости</li>
                        <li>экспортировать и импортировать оценки из файла Excel</li>
                        <li>просматривать диаграммы успеваемости</li>
                        <li>отсылать родителям письма с оценками</li>
                        <li>использовать чат для обмена домашним заданием</li>
                    </ol>
            </div>
        </div>
    )
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onSetSetup: (data, userID, curClass) => {
            const asyncSetSetup = (data, userID, curClass) =>{
                return dispatch => {
                    console.log("asyncSetSetup - userID", userID)
                    // let responsedata = []
                    // dispatch({type: 'UPDATE_SETUP_LOCALLY', payload: data})
                    if (Object.keys(data)[0]==="class_number") {
                        let postdata = JSON.parse(`{"subjects_list":"${Object.values(data)[0]}"}`);
                        instanceAxios().get(SUBJECTS_GET_URL+'/'+Object.values(data)[0], postdata)
                            .then(response => {
                                // let responsedata = response.data;
                                // dispatch({type: 'UPDATE_SETUP_LOCALLY_SUBJLIST', payload: response.data})
                                let arr = response.data.map(value=>value.subj_key);

                                let postdata = `{"subjects_list":"${arr}"}`;

                                userID&&instanceAxios().post(UPDATESETUP_URL + '/' + userID, postdata)
                                    .then(response=>{
                                        console.log('UPDATE_SETUP_SUCCESSFULLY_subjects_list', response.data, userID);
                                    })
                                    .catch(response => {
                                        console.log('UPDATE_SETUP_FAILED_subjects_list', response);
                                    })
                                // let json = `{"subjects_count":"${response.data.length+"/0"}"}`;
                                // let postjson = JSON.parse(json);
                                // dispatch({type: 'UPDATE_SETUP_LOCALLY', payload: postjson});
                            })
                            .catch(response => {
                                console.log(response);
                                // dispatch({type: 'UPDATE_SETUP_FAILED', payload: response.data})
                                // Список ошибок в отклике...
                            })
                    }
                    if (userID) {
                        if (Object.keys(data)[0]==="selected_subjects") {
                            console.log("SELECTED_SUBJECTS", data, Object.values(data)[0], Object.values(data)[0].map(val=>val.subj_key), Object.values(data)[0].map(val=>val.subj_key).join())
                            let json = `{"selected_subjects":"${Object.values(data)[0].map(val=>val.subj_key).join()}"}`;
                            data = JSON.parse(json);
                        }
                        if (Object.keys(data)[0]==="students") {
                            // console.log("STUDENTS_GET_URL", userID, curClass, data, JSON.stringify(data))
                            instanceAxios().post(STUDENTS_ADD_URL + '/' + userID + '/class/' + curClass, JSON.stringify(data))
                                .then(response => {
                                    console.log('UPDATE_STUDENTS_REMOTE', response.data)
                                    // dispatch({type: 'UPDATE_STUDENTS_REMOTE', payload: response.data})
                                })
                                .catch(response => {
                                    console.log(response);
                                    // dispatch({type: 'UPDATE_STUDENTS_FAILED', payload: response.data})
                                })
                        }
                        else {
                            console.log("UPDATESETUP_URL", UPDATESETUP_URL + '/' + userID, data)
                            instanceAxios().post(UPDATESETUP_URL + '/' + userID, data)
                                .then(response => {
                                    // dispatch({type: 'UPDATE_SETUP_REMOTE', payload: response.data})
                                })
                                .catch(response => {
                                    console.log(response);
                                    // dispatch({type: 'UPDATE_SETUP_FAILED', payload: response.data})
                                })
                        }
                    }
                }
            }
            dispatch(asyncSetSetup(data, userID, curClass))
        },
        onStopLoading : ()=> dispatch({type: 'APP_LOADED'}),
        onStartLoading : ()=> dispatch({type: 'APP_LOADING'}),
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
    })
}
// export default LoginBlock
export default connect(mapStateToProps, mapDispatchToProps)(LoginBlock)


