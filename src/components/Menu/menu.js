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

        let langLibrary = getDefLangLibrary()
        if (Object.keys(this.props.userSetup.langLibrary).length) {
            langLibrary = this.props.userSetup.langLibrary
            // console.log("MENU_FROM_REDUX", true, this.props.userSetup.langLibrary)
        }
        // else
        //     console.log("MENU_FROM_REDUX", false, this.props.userSetup.langLibrary)

        // console.log("menuRender",
        //             this.props.userSetup.langLibrary,
        //             Object.keys(this.props.userSetup.langLibrary).length,
        //             this.props.langlibrary, langLibrary)

        // if (this.props.langlibrary) langLibrary = this.props.langlibrary


        return (
            <div className="menuBlock">
                {Object.keys(langLibrary).length?
                <div className="menuItems">
                    {this.props.withtomain&&<div className="menuItem"><Link to="/">{`${langLibrary.mainSite.toString().concat(' |')}`}</Link></div>}
                    {this.props.isadmin>0&&this.props.userid>0&&<div className="menuItem"><Link to="/admin">{`${langLibrary.adminSite.toString().concat('\u205F|')}`}</Link></div>}
                    {this.props.isadmin>0&&this.props.userid>0&&<div className="menuItem"><Link to="/adminteacher">{`${langLibrary.adminSiteClass.toString().replace(' ', '\u205F').concat('\u205F|')}`}</Link></div>}
                    <div className="menuItemHw"><Link to="/hw">{`${langLibrary.homework}`}</Link></div>
                    {this.props.isadmin === 1?<div className="mym-menuitem-workflow"><Link to="/workflow">{`${'|\u205F'.concat(langLibrary.project.toString())}`}</Link></div>:null}
                </div>:null}
            </div>
        );
    }
}

export default connect(mapStateToProps)(Menu)
