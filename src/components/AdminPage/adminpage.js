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

class AdminPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMobile : window.screen.width < 400,
        }
        }
    btnLoginClassName=()=>(
        this.props.userSetup.userID > 0?"loginbtn loggedbtn":"loginbtn"
    )
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
        this.props.onUserLoggingOut(this.props.userSetup.token)
    }
    render() {
        let {userID, userName, isadmin} = this.props.userSetup;
        return (
        <div className="AdminPage">
            <div className="navbar">
                <div className="myTitle"><h3><Link to="/">Мои оценки</Link></h3></div>

                {this.state.isMobile?
                    <MobileMenu userID={userID} userName={userName} isadmin={isadmin} withtomain={true} userLogin={this.userLogin.bind(this)} userLogout={this.userLogout.bind(this)}/>:
                    userID && <Menu userid={this.props.user.id} withtomain={true} isadmin={this.props.userSetup.isadmin}/>
                }

                {this.state.isMobile?<div>
                    {this.state.showLoginLight||(window.location.href.slice(-2)==="/r"&&userID===0)?
                        <LoginBlockLight onclick={this.props.onUserLogging} firehide={this.fireLoginLight.bind(this)}/>:""}

                    <div className={this.props.user.loginmsg.length?"popup show":"popup"} onClick={this.props.onClearErrorMsg}>
                        {this.props.user.loginmsg.length?<span className="popuptext" id="myPopup">{this.props.user.loginmsg}</span>:""}
                    </div>
                </div>:""}

                {!this.state.isMobile?<div className="logBtnsBlock">
                    {console.log("this.props.userSetup", this.props.userSetup)}
                    <div >
                        {this.props.userSetup.userID===0?
                            <button className={this.btnLoginClassName()}
                                    onClick={this.userLogin.bind(this)}>Вход
                            </button>:
                            <button className={this.btnLoginClassName()}
                                    onClick={this.userEdit.bind(this)}>
                                {this.props.userSetup.userName}
                            </button>}
                        {this.state.showLoginLight?<LoginBlockLight onclick={this.props.onUserLogging} firehide={this.fireLoginLight.bind(this)}/>:""}
                    </div>
                    <div>
                        {this.props.userSetup.userID>0&&
                        <button className="logoutbtn" onClick={this.userLogout.bind(this)}>Выйти</button>}
                    </div>
                </div>:""}
            </div>
            <div className="navbar-shadow"></div>
            <div className="description">
                This is AdminPage of User: {this.props.user.name}
            </div>
            {this.props.userSetup.userID>0&&<AdminPageAdmin />}
        </div>
        )
    }
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
    return ({
        onInitState: () => dispatch([]),
        onUserLoggingOut  : token => dispatch(userLoggedOut(token)),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminPage))