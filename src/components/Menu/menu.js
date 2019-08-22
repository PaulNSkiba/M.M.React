/**
 * Created by Paul on 26.01.2019.
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../containers/App.css'
import { connect } from 'react-redux'
import {mapStateToProps} from '../../js/helpers'

class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMobile : window.screen.width < 400,
        }
    }
    render() {
        // console.log("menuRender", this.props.userSetup)
        let {langLibrary} = this.props.userSetup
        return (
            <div className="menuBlock">
                <div className="menuItems">
                    {this.props.withtomain&&<div className="menuItem"><Link to="/">{`${langLibrary.mainSite.toString().concat(' |')}`}</Link></div>}
                    {this.props.isadmin>0&&this.props.userid>0&&<div className="menuItem"><Link to="/admin">{`${langLibrary.adminSite.concat('\u205F|')}`}</Link></div>}
                    {this.props.isadmin>0&&this.props.userid>0&&<div className="menuItem"><Link to="/adminteacher">{`${langLibrary.adminSiteClass.replace(' ', '\u205F').concat('\u205F|')}`}</Link></div>}
                    <div className="menuItemHw"><Link to="/hw">{`${langLibrary.homework}`}</Link></div>
                    {this.props.isadmin === 1?<div className="mym-menuitem-workflow"><Link to="/workflow">{`${'|\u205F'.concat(langLibrary.project)}`}</Link></div>:null}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Menu)
