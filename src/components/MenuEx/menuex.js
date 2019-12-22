/**
 * Created by Paul on 26.01.2019.
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../containers/App.css'
import { connect } from 'react-redux'
import {mapStateToProps, getLangLibrary, getDefLangLibrary} from '../../js/helpers'
import '../../css/colors.css'
import './menuex.css'
// import {defLang} from '../../config/config'


class MenuEx extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMobile : window.screen.width < 400,
            showAdmin : false,
            showStudying : false,
            showPTs : false,
        }
        // this.langLibrary = this.props.userSetup.langLibrary
    }
    render() {

        const {isadmin, userID, langLibrary : lngLib, curMenuItem} = this.props.userSetup
        const {showAdmin, showStudying, showPTs} = this.state
        let langLibrary = {}
        if (Object.keys(lngLib).length) {
            langLibrary = lngLib
            // console.log("MENU_FROM_REDUX", true, this.props.userSetup.langLibrary)
        }
        else {
            langLibrary = getDefLangLibrary()
        }
        // console.log("MenuBlock", lngLib, this.props.userSetup)
        return (
            <div className="menuBlock">
                {Object.keys(langLibrary).length?
                    <div className="menuItems">
                        {this.props.withtomain?<div className={`menuItemEx ${this.props.userSetup.menuItem==="main"?"activeItem":""}`}><Link onClick={()=>this.props.onReduxUpdate("MENU_CLICK", "main")} to="/">{`${langLibrary.mainSite.toString().concat(' |')}`}</Link></div>:null}
                        {(((isadmin&1)===1||(isadmin&2)===2||(isadmin&64)===64)&&userID>0)?
                            <div style={{position : "relative"}}>
                                <div className={`menuItemEx ${curMenuItem&&curMenuItem.id===1?"activeItemEx2":""} ${this.state.showAdmin?"activeItemEx":""}` } onClick={()=>{this.setState({showAdmin:!this.state.showAdmin, showStudying : false, showPTs : false})}}>
                                    <div className="menuItemHint">{curMenuItem&&curMenuItem.id===1?curMenuItem.label.replace(langLibrary.adminSite, ""):""}</div>
                                    {`${langLibrary.adminSite}`}
                                    <div className="mym-app-arrow-down-ex">{!showAdmin ? '\u25BC' : '\u25B2'}</div>
                                </div>
                                {showAdmin?<div className="menuItemExDropDown">
                                    {(isadmin&1)===1?<div className={"menuSubItem"}><Link onClick={()=>{
                                        this.setState({showAdmin:!this.state.showAdmin});
                                        this.props.onReduxUpdate("MENU_ITEM", {id : 1, label : langLibrary.project});
                                        this.props.onReduxUpdate("MENU_CLICK", "workflow")}} to="/workflow">{langLibrary.project.toString()}</Link></div>:null}
                                    {((isadmin&1)===1&&userID>0)?<div className={"menuSubItem"}><Link onClick={()=>{
                                        this.setState({showAdmin:!this.state.showAdmin});
                                        this.props.onReduxUpdate("MENU_ITEM", {id : 1, label : langLibrary.adminSiteCommon});
                                        this.props.onReduxUpdate("MENU_CLICK", "admin")}} to="/admin">{`${langLibrary.adminSiteCommon.toString()}`}</Link></div>:null}
                                    {((isadmin&1)===1||(isadmin&2)===2)&&this.props.userid>0?<div className={"menuSubItem"}><Link onClick={()=>{
                                        this.setState({showAdmin:!this.state.showAdmin});
                                        this.props.onReduxUpdate("MENU_ITEM", {id : 1, label : langLibrary.adminSiteClass});
                                        this.props.onReduxUpdate("MENU_CLICK", "adminteacher")}} to="/adminteacher">{`${langLibrary.adminSiteClass}`}</Link></div>:null}
                                    {((isadmin&1)===1||(isadmin&64)===64)&&this.props.userid>0?<div className={"menuSubItem"}><Link onClick={()=>{
                                        this.setState({showAdmin:!this.state.showAdmin});
                                        this.props.onReduxUpdate("MENU_ITEM", {id : 1, label : langLibrary.adminSchool});
                                        this.props.onReduxUpdate("MENU_CLICK", "adminschool")}} to="/adminschool">{`${langLibrary.adminSchool}`}</Link></div>:null}
                                </div>:null}
                            </div>
                            :null}
                        <div style={{position : "relative"}}>
                            <div className={`menuItemEx ${curMenuItem&&curMenuItem.id===2?"activeItemEx2":""} ${this.state.showStudying?"activeItemEx":""}` } onClick={()=>{this.setState({showStudying:!this.state.showStudying, showAdmin : false, showPTs : false})}}>
                                <div className="menuItemHint">{curMenuItem&&curMenuItem.id===2?curMenuItem.label.replace(langLibrary.adminSite, ""):""}</div>
                                {`${langLibrary.studyingMenu}`}
                                <div className="mym-app-arrow-down-ex">{!showStudying ? '\u25BC' : '\u25B2'}</div>
                            </div>
                            {showStudying?<div className="menuItemExDropDown">
                                <div className={"menuSubItem"}><Link onClick={()=>{
                                    this.setState({showStudying:!this.state.showStudying});
                                    this.props.onReduxUpdate("MENU_ITEM", {id : 2, label : langLibrary.studying});
                                    this.props.onReduxUpdate("MENU_CLICK", "video")}} to="/video">{`${langLibrary.studying}`}</Link></div>
                                <div className={"menuSubItem"}><Link onClick={()=>{
                                    this.setState({showStudying:!this.state.showStudying});
                                    this.props.onReduxUpdate("MENU_ITEM", {id : 2, label : langLibrary.homework});
                                    this.props.onReduxUpdate("MENU_CLICK", "homework")}} to="/hw">{`${langLibrary.homework}`}</Link></div>
                            </div>:null}
                        </div>
                        {(((isadmin&1)===1||(isadmin&8)===8)&&userID>0)?
                            <div style={{position : "relative"}}>
                                <div className={`menuItemEx ${curMenuItem&&curMenuItem.id===3?"activeItemEx2":""} ${this.state.showPTs?"activeItemEx":""}` } onClick={()=>{this.setState({showPTs:!this.state.showPTs, showStudying : false, showAdmin : false})}}>
                                    <div className="menuItemHint">{curMenuItem&&curMenuItem.id===3?curMenuItem.label.replace(langLibrary.adminSite, ""):""}</div>
                                    {`${langLibrary.PTassociation}`}
                                    <div className="mym-app-arrow-down-ex">{!showPTs ? '\u25BC' : '\u25B2'}</div>
                                </div>
                                {showPTs?<div className="menuItemExDropDown">
                                    {((isadmin&1)===1)||((isadmin&8)===8)?<div className={"menuSubItem"}><Link onClick={()=>{
                                        this.setState({showPTs:!this.state.showPTs});
                                        this.props.onReduxUpdate("MENU_ITEM", {id : 3, label : langLibrary.budgetMenuItem});
                                        this.props.onReduxUpdate("MENU_CLICK", "budget")}} to="/budget">{langLibrary.budgetMenuItem}</Link></div>:null}
                                </div>:null}
                            </div>
                            :null}
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
export default connect(mapStateToProps, mapDispatchToProps)(MenuEx)
