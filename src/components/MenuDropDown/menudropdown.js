/**
 * Created by Paul on 16.12.2019.
 */
import React, { Component } from 'react';
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {
    addDay,
    arrOfWeekDays,
    dateDiff,
    toYYYYMMDD,
    instanceAxios,
    mapStateToProps,
    getLangByCountry,
    getSubjFieldName
} from '../../js/helpers'
// import './menudropdown.css'

class MenuDropDown extends Component {

    render() {

        return (
            <div className="menu-wrap">
                {/*<span class="decor"></span>*/}
                <div className="menu-nav">
                    <ul className="menu-primary">
                        <li>
                            <a href="">Dog</a>
                            <ul className="sub">
                                <li><a href="">Bulldog</a></li>
                                <li><a href="">Mastiff</a></li>
                                <li><a href="">Labrador</a></li>
                                <li><a href="">Mutt</a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="">Cat</a>
                            <ul className="sub">
                                <li><a href="">Tabby</a></li>
                                <li><a href="">Black Cat</a></li>
                                <li><a href="">Wrinkly Cat</a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="">Bird</a>
                            <ul className="sub">
                                <li><a href="">Humming Bird</a></li>
                                <li><a href="">Hawk</a></li>
                                <li><a href="">Crow</a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="">Horse</a>
                            <ul className="sub">
                                <li><a href="">Brown Horse</a></li>
                                <li><a href="">Race Horse</a></li>
                                <li><a href="">Tall Horse</a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="">Burger</a>
                            <ul className="sub">
                                <li><a href="">Cheesy</a></li>
                                <li><a href="">More Ketchup</a></li>
                                <li><a href="">Some Mustard</a></li>
                                <li><a href="">Extra Butter</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return ({
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MenuDropDown))