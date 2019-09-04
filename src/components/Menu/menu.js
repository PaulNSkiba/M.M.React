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
    // componentDidMount(){
    //     // this.langLibrary = this.initLangLibrary(this.props.userSetup.langLibrary)
    // }
    initLangLibrary=(langLibrary, setRedux)=>{
        if ((!langLibrary)||langLibrary===undefined||langLibrary==="undefined"||JSON.stringify(langLibrary)===JSON.stringify({})) {
            langLibrary = getLangLibrary(localStorage.getItem("langCode")?localStorage.getItem("langCode"):defLang)
        }
        return langLibrary
    }
    render() {
        console.log("menuRender", this.props.userSetup.langLibrary)

        const langLibrary = Object.keys(this.props.userSetup.langLibrary).length === 0?getDefLangLibrary():this.props.userSetup.langLibrary//this.initLangLibrary(this.props.userSetup.langLibrary)
        return (
            <div className="menuBlock">
                <div className="menuItems">
                    {this.props.withtomain&&<div className="menuItem"><Link to="/">{`${langLibrary.mainSite.toString().concat(' |')}`}</Link></div>}
                    {this.props.isadmin>0&&this.props.userid>0&&<div className="menuItem"><Link to="/admin">{`${langLibrary.adminSite.toString().concat('\u205F|')}`}</Link></div>}
                    {this.props.isadmin>0&&this.props.userid>0&&<div className="menuItem"><Link to="/adminteacher">{`${langLibrary.adminSiteClass.toString().replace(' ', '\u205F').concat('\u205F|')}`}</Link></div>}
                    <div className="menuItemHw"><Link to="/hw">{`${langLibrary.homework}`}</Link></div>
                    {this.props.isadmin === 1?<div className="mym-menuitem-workflow"><Link to="/workflow">{`${'|\u205F'.concat(langLibrary.project.toString())}`}</Link></div>:null}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Menu)
