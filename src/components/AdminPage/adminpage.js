/**
 * Created by Paul on 26.01.2019.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux'
import LoginBlockLight from '../LoginBlockLight/loginblocklight'
import Menu from '../Menu/menu'
import { userLoggedOut } from '../../actions/userAuthActions'
import AdminPageAdmin from '../AdminPageAdmin/adminpageadmin'
import {withRouter} from 'react-router-dom'
import { Link } from 'react-router-dom';
import '../../containers/App.css'
import MobileMenu from '../MobileMenu/mobilemenu'
import {mapStateToProps, getLangLibrary, getLangByCountry} from '../../js/helpers'
import {defLang, arrLangs} from '../../config/config'
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import Logo from '../../img/LogoMyMsmall.png'

class AdminPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMobile : this.props.userSetup.isMobile,//window.screen.width < 400,
        }
        this.onSelectLang = this.onSelectLang.bind(this)
}
    componentWillMount(){
        this.props.onStartLoading()
    }
    componentDidMount(){

    }
    // btnLoginClassName=()=>(
    //     this.props.userSetup.userID > 0?"loginbtn loggedbtn":"loginbtn"
    // )
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
    onSelectLang=async countryCode=>{
        this.props.onReduxUpdate("LANG_LIBRARY", getLangLibrary(countryCode))
        localStorage.setItem("langCode", countryCode)
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
        // console.log("loginBlock", loading, userID)
        return <div className="logBtnsBlock">
            <div>
                {!loading&&!userID?
                    <button className={userID?"loginbtn":showLoginLight?"loginbtn mym-login-logged":"loginbtn"} onClick={this.userLogin.bind(this)}><div className="mym-app-button-with-arrow">{langLibrary.entry}<div className="mym-app-arrow-down">{!this.state.showLoginLight?'\u25BC':'\u25B2'}</div></div></button>:null}

                {showLoginLight?
                    <LoginBlockLight onLogin={this.props.onUserLogging} langLibrary={langLibrary} firehide={this.fireLoginLight.bind(this)}/>:null
                }
            </div>
            <div>
                {userID>0?<button className="logoutbtn" onClick={this.userLogout.bind(this)}><div className={userName.length>10?"mym-app-button-name-small":"mym-app-button-name"}>{userName}</div><div className="mym-app-button-exit">{langLibrary.exit}</div></button>:null}
            </div>
            {this.langBlock()}
        </div>
    }
    // waitCursorBlock=()=>{
    //     return  <div className="lds-ring">
    //         <div></div>
    //         <div></div>
    //         <div></div>
    //         <div></div>
    //     </div>
    // }
    render() {
        let {userID, userName, isadmin, loading, showLoginLight, langLibrary} = this.props.userSetup;
        let {isMobile} = this.state
        // console.log("adminpage", loading, showLoginLight)
        // return (<div>test</div>)
        return (
        <div className="AdminPage">
            {loading?this.waitCursorBlock:null}
            {/*{ (window.location.href.slice(-3)==="/hw")?this.props.history.push('/hw'):null}*/}
            {/*{ (window.location.href.slice(-6)==="/admin")?this.props.history.push('/admin'):null}*/}
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
            {/*<div className="description">*/}
                {/*This is AdminPage of User: {this.props.user.name}*/}
            {/*</div>*/}
            {this.props.userSetup.userID>0&&<AdminPageAdmin />}
        </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return ({
        onUserLoggingOut  : token => dispatch(userLoggedOut(token)),
        onStopLoading : ()=> dispatch({type: 'APP_LOADED'}),
        onStartLoading : ()=> dispatch({type: 'APP_LOADING'}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminPage))