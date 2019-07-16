/**
 * Created by Paul on 26.01.2019.
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../containers/App.css'


class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMobile : window.screen.width < 400,
        }
    }
    render() {
        // console.log("isadmin", this.props.isadmin)
        return (
            <div className="menuBlock">
                <div className="menuItems">
                    {this.props.withtomain&&<div className="menuItem"><Link to="/">Головна |</Link></div>}
                    {this.props.isadmin>0&&this.props.userid>0&&<div className="menuItem"><Link to="/admin">Адмінка |</Link></div>}
                    {this.props.isadmin>0&&this.props.userid>0&&<div className="menuItem"><Link to="/adminteacher">Адмінка Класу |</Link></div>}
                    <div className="menuItemHw"><Link to="/hw">Домашка</Link></div>
                </div>
            </div>
        );
    }
}

export default Menu;