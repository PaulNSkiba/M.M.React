/**
 * Created by Paul on 23.04.2019.
 */
import React, { Component } from 'react';
import './mobilemenu.css'
// import { UPDATESETUP_URL, SUBJECTS_GET_URL, instanceAxios } from '../../config/URLs'
// import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { slide as MobMenu } from 'react-burger-menu'

export default class MobileMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuOpen : false,
        }
    }
    // This keeps your state in sync with the opening/closing of the menu
    // via the default means, e.g. clicking the X, pressing the ESC key etc.
    handleStateChange (state) {
        this.setState({menuOpen: state.isOpen})
    }

    // This can be used to close the menu, e.g. when a user clicks a menu item
    closeMenu () {
        this.setState({menuOpen: false})
    }

    // This can be used to toggle the menu, e.g. when using a custom icon
    // Tip: You probably want to hide either/both default icons if using a custom icon
    // See https://github.com/negomi/react-burger-menu#custom-icons
    toggleMenu () {
        this.setState({menuOpen: !this.state.menuOpen})
    }
    render() {
        // name={this.props.name}
        let {userID, userName, isadmin, withtomain} = this.props
        // console.log("this.props.list", this.props.list)
        return(
            <MobMenu className="bm-menu-my" width={ '75%' } isOpen={this.state.menuOpen} onStateChange={(state) => this.handleStateChange(state)}>
                {userID&&<a>{userName}</a>}
                {!userID&&<a onClick={ () => {this.closeMenu(); this.props.userLogin()} } className="menu-item--small">Вход</a>}
                {withtomain&&<Link to="/" id="home" className="menu-item">Головна</Link>}
                {isadmin&&userID&&<Link to="/admin" id="admin" className="menu-item">Адмінка</Link>}
                {isadmin&&userID&&<Link to="/adminteacher" id="adminteacher" className="menu-item">Адмінка класу</Link>}
                {userID&&<Link to="/hw" id="homework" className="menu-item">Домашка</Link>}
                {userID&&<a onClick={ () => {this.closeMenu(); this.props.userLogout()}  } className="menu-item--small">Выход</a>}
            </MobMenu>
        )
    }
}