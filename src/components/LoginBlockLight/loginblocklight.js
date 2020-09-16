/**
 * Created by Paul on 22.01.2019.
 */
import React, { Component } from 'react';
import axios from 'axios';
import '../../css/colors.css'
import './loginblocklight.css'
import FacebookLogin from 'react-facebook-login';
import {GoogleLogin} from 'react-google-login';
import {mapStateToProps, instanceAxios} from '../../js/helpers'
import {appIdFB, API_URL, ISCONSOLE} from '../../config/config'
import { connect } from 'react-redux'

class LoginBlockLight extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _email: "",
            withCode : false,
            codeChecked : false,
        }
        this.userLogin = this.userLogin.bind(this)
        this.userCancel = this.userCancel.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    onSubmit=e=>{
        e.preventDefault()
        // console.log("SUBMIT!!!")
        // this.userLogin()
    }
    userLogin = async (email, pwd, provider, provider_id)=> {
        // console.log("LoginBlockLight.userLogin", this.inputEmail.value, this.inputPwd.value)
        let code = ''
        if (provider===undefined) {
            email = this.inputEmail.value
            pwd = this.inputPwd.value
            code = this.inputSMS!==undefined?this.inputSMS.value:''
        }
        const json = `{
            "email" : "${email}",
            "password" : "${pwd}"
        }`

        let {token} = ''//store.getState().user
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        }
        //console.log("userLogin", JSON.parse(JSON.stringify(json)))
        // Disable SMS-checking
        if (true || code.length===4){
            this.props.onLogin(email, pwd, provider, provider_id, this.props.langLibrary, code)
            // ToDO: Для отправки SMS будем ждать ввода кода
            this.props.firehide(true)
        }
        else {
            await instanceAxios().post(`${API_URL}logincheck`, JSON.parse(JSON.stringify(json)))
                .then(res => {
                    // console.log("CHECK_PHONE:res", res)
                    // Hide phone checking
                    if (res.data.phone) {
                        this.setState({withCode: true})
                        this.inputSMS.focus()
                    }
                    else {
                        this.props.onLogin(email, pwd, provider, provider_id, this.props.langLibrary)
                        // ToDO: Для отправки SMS будем ждать ввода кода
                        this.props.firehide(true)
                        // console.log("userLogin", email, pwd, provider, provider_id)
                    }
                })
                .catch(err => {
                    console.log("CHECK_PHONE:err", err)
                })
        }
        // this.props.hidesteps();
    }
    // checkLogin=async()=>{
    //     await axios('post', `${API_URL}`)
    // }
    userCancel=()=> {
        // console.log(this.inputEmail.value, this.inputPwd.value)
        // this.props.onclick(this.inputEmail.value, this.inputPwd.value)
        this.props.firehide(true)
    }
    componentDidMount() {
        this.inputEmail.focus();
    }
    // userLogout() {
    //
    // }
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
        this.userLogin(res.email, '', 'facebook', res.id)
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
            this.userLogin(res.w3.U3, '', 'google', res.w3.Eea)
        }
    }

    render(){
        const {isMobile, isadmin, phone} = this.props.userSetup
        const {_email, codeChecked, withCode} = this.state
        const withPhone = withCode//(_email==="test@gmail.com"?true:false)
        // const withCode = withPhone
        // console.log("RenderLogin", _email, withPhone)
        // isadmin===1||phone!==null
            return (
                <div className={withPhone?(isMobile?"loginBlockLightMobileWithPhone":"loginBlockLightWithPhone"):(isMobile?"loginBlockLightMobile":"loginBlockLight")}>
                    <form  onSubmit={this.onSubmit}>
                        <label style={{fontSize : ".8em", fontWeight : 600}}>Email</label><input style={{width: "95%"}} type="email" ref={input=>{this.inputEmail=input}} onChange={(e)=>this.setState({_email : e.target.value})}/>
                        <label style={{fontSize : ".8em", fontWeight : 600}}>Пароль</label><input style={{width: "95%"}} type="password" ref={input=>{this.inputPwd=input}}/>
                        {withPhone?
                            <div>
                                <label style={{fontSize : ".8em", fontWeight : 600}}>SMS-код</label>
                                <input style={{width: "95%"}} type="text" ref={input=>{this.inputSMS=input}}/>
                            </div>
                                :null}

                        <div className="loginButtons">
                            <button className="my-login-btn" type="submit" onClick={this.userLogin}>{withCode&&(!codeChecked)?"Войти":"Войти"}</button>
                            <button  className="my-login-btn" onClick={this.userCancel}>Отмена</button>
                        </div>
                    </form>
                    <div className="socialBtns">
                        <FacebookLogin
                            appId={appIdFB}
                            // autoLoad={true}
                            fields="name,email,picture"
                            onClick={this.componentClicked}
                            callback={this.responseFacebook}
                             render={renderProps => (
                                 <button className="my-facebook-button-class" onClick={renderProps.onClick}>
                                     <img height={"30px"} src={this.state.fbFoto} alt={this.state.fbName}/>
                                     {"Facebook"}
                                 </button>)}
                            cssClass={"my-facebook-button-class"}
                            // icon="fa-facebook"
                            // textButton={""}
                            textButton={"Facebook"}
                        />
                        <GoogleLogin
                            buttonText={"Google"}
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            // autoLoad={true}
                            cookiePolicy={'single_host_origin'}
                            render={renderProps => (
                                 <button className="my-google-button-class"
                                         onClick={renderProps.onClick}
                                         disabled={renderProps.disabled}>{"Google"}</button>
                             )}
                            className="my-google-button-class"
                            // icon={true}
                            clientId="1032512893062-e4p8pp7923eogdfh38d2ltf03ub4calu.apps.googleusercontent.com"
                        />
                    </div>
                </div>
            )

    }
}
export default connect(mapStateToProps)(LoginBlockLight)