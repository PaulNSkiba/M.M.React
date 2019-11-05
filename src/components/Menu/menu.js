/**
 * Created by Paul on 26.01.2019.
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../containers/App.css'
import { connect } from 'react-redux'
import {mapStateToProps, getLangLibrary, getDefLangLibrary} from '../../js/helpers'
import {defLang} from '../../config/config'
import '../../css/colors.css'

class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMobile : window.screen.width < 400,
        }
        // this.langLibrary = this.props.userSetup.langLibrary
    }
    render() {


        const {isadmin, userID} = this.props.userSetup
        console.log("MENU_FROM_REDUX", isadmin, Number(isadmin)&8, (isadmin&8)===8)
        let langLibrary = {}
        if (Object.keys(this.props.userSetup.langLibrary).length) {
            langLibrary = this.props.userSetup.langLibrary
            // console.log("MENU_FROM_REDUX", true, this.props.userSetup.langLibrary)
        }
        else {
            langLibrary = getDefLangLibrary()
        }

        return (
            <div className="menuBlock">
                {Object.keys(langLibrary).length?
                <div className="menuItems">
                    {this.props.withtomain?<div className={`menuItem ${this.props.userSetup.menuItem==="main"?"activeItem":""}`}><Link onClick={()=>this.props.onReduxUpdate("MENU_CLICK", "main")} to="/">{`${langLibrary.mainSite.toString().concat(' |')}`}</Link></div>:null}
                    {((isadmin&1)===1&&userID>0)?<div className={`menuItem ${this.props.userSetup.menuItem==="admin"?"activeItem":""}`}><Link onClick={()=>this.props.onReduxUpdate("MENU_CLICK", "admin")} to="/admin">{`${langLibrary.adminSite.toString().concat('\u205F|')}`}</Link></div>:null}
                    {((isadmin&1)===1||(isadmin&2)===2)&&this.props.userid>0?<div className={`menuItem ${this.props.userSetup.menuItem==="adminteacher"?"activeItem":""}`}><Link onClick={()=>this.props.onReduxUpdate("MENU_CLICK", "adminteacher")} to="/adminteacher">{`${langLibrary.adminSiteClass.toString().replace(' ', '\u205F').concat('\u205F|')}`}</Link></div>:null}
                    <div className={`menuItemHw ${this.props.userSetup.menuItem==="homework"?"activeItem":""}`}><Link onClick={()=>this.props.onReduxUpdate("MENU_CLICK", "homework")} to="/hw">{`${langLibrary.homework}/${langLibrary.studying}`}</Link></div>
                    {((isadmin&1)===1)||((isadmin&8)===8)?<div className={`menuItem ${this.props.userSetup.menuItem==="budget"?"activeItem":""}`}><Link onClick={()=>this.props.onReduxUpdate("MENU_CLICK", "budget")} to="/budget">{`${'|\u205F'.concat("Бюджет")}`}</Link></div>:null}
                    {(isadmin&1)===1?<div className={`mym-menuitem-workflow ${this.props.userSetup.menuItem==="workflow"?"activeItem":""}`}><Link onClick={()=>this.props.onReduxUpdate("MENU_CLICK", "workflow")} to="/workflow">{`${'|\u205F'.concat(langLibrary.project.toString())}`}</Link></div>:null}
                </div>:null}
            </div>
        );
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
        onStopLoading : ()=> dispatch({type: 'APP_LOADED'}),
        onStartLoading : ()=> dispatch({type: 'APP_LOADING'}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(Menu)
