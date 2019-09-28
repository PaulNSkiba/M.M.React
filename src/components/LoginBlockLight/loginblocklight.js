/**
 * Created by Paul on 22.01.2019.
 */
import React, { Component } from 'react';
import '../../css/colors.css'
import './loginblocklight.css'
import FacebookLogin from 'react-facebook-login';
import {GoogleLogin} from 'react-google-login';
import {mapStateToProps, getLangLibrary, getDefLangLibrary} from '../../js/helpers'
import {appIdFB} from '../../config/config'
import { connect } from 'react-redux'

class LoginBlockLight extends Component {

    userLogin = async (email, pwd, provider, provider_id)=> {
        // console.log("LoginBlockLight.userLogin", this.inputEmail.value, this.inputPwd.value)
        if (provider===undefined) {
            email = this.inputEmail.value
            pwd = this.inputPwd.value
        }
        await this.props.onLogin(email, pwd, provider, provider_id, this.props.langLibrary)
        await this.props.firehide(true)
        console.log("userLogin", email, pwd, provider, provider_id)
        // this.props.hidesteps();
    }
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
            return (
                <div className={this.props.userSetup.isMobile?"loginBlockLightMobile":"loginBlockLight"}>
                    <form>
                        <label>Email</label><input style={{width: "95%"}} type="email" ref={input=>{this.inputEmail=input}}></input>
                        <label>Пароль</label><input style={{width: "95%"}} type="password" ref={input=>{this.inputPwd=input}}></input>
                        <div className="loginButtons">
                            <button type="submit" onClick={this.userLogin.bind(this)}>Войти</button><button onClick={this.userCancel.bind(this)}>Отмена</button>
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