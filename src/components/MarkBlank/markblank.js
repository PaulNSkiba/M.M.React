/**
 * Created by Paul on 09.01.2019.
 */
/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux'
import '../../css/colors.css';
import './markblank.css'
import {mapStateToProps, getLangLibrary, getDefLangLibrary} from '../../js/helpers'

const classNames = (selected, withborder) =>
    selected?"dropdown-main-0 selected " + (withborder?" withborder ":""):"dropdown-main-0 " + (withborder?" withborder ":"")

class MarkBlank extends Component {

    onClick(e) {
        // console.log("onClick", e.target)
        // if (!(e.target.nodeName==="A"))
        if (this.props.onclick)
        this.props.onclick("markBlank", e.target.id) // , e.target.innerHTML, e.target.nodeName
    }
    onClickA(e) {
        // console.log("A", e.target.innerHTML)
        console.log("MarkBlank", e.target, e.target.id, e.target.innerHTML, this.props.parent)
        this.props.onclickA(e.target.id, e.target.innerHTML, this.props.parent)
        e.preventDefault()
    }
    render() {
        // console.log("subjects",subjects, subjects())
        const {selected, nohover, kind, withborder} = this.props;
        const {langLibrary} = this.props.userSetup

            switch (kind) {
                case 1 :
                return (

                    <div id="markblank_twelve" className={classNames(selected, withborder)} onClick={this.onClick.bind(this)}>
                        <div id="leftrect"></div>
                        <ul className={nohover?"nohover ul12":"ul12"}>
                            <div className="dropdown-content3">
                                <ul className="marks12">
                                    <li><a onClick={this.onClickA.bind(this)}>10</a></li>
                                    <li><a onClick={this.onClickA.bind(this)}>11</a></li>
                                    <li><a onClick={this.onClickA.bind(this)}>12</a></li>
                                </ul>
                            </div>
                            <div className="dropdown-content3">
                                <ul className="marks9">
                                    <li><a onClick={this.onClickA.bind(this)}>7</a></li>
                                    <li><a onClick={this.onClickA.bind(this)}>8</a></li>
                                    <li><a onClick={this.onClickA.bind(this)}>9</a></li>
                                </ul>
                            </div>
                            <div className="dropdown-content3">
                                <ul className="marks6">
                                    <li><a onClick={this.onClickA.bind(this)}>4</a></li>
                                    <li><a onClick={this.onClickA.bind(this)}>5</a></li>
                                    <li><a onClick={this.onClickA.bind(this)}>6</a></li>
                                </ul>
                            </div>
                            <div className="dropdown-content3">
                                <ul className="marks3">
                                    <li><a onClick={this.onClickA.bind(this)}>1</a></li>
                                    <li><a onClick={this.onClickA.bind(this)}>2</a></li>
                                    <li><a onClick={this.onClickA.bind(this)}>3</a></li>
                                </ul>
                            </div>
                            <div className="dropdown-content0">
                                <ul className="marks0">
                                    <li><a onClick={this.onClickA.bind(this)}>{langLibrary.toErase}</a></li>
                                </ul>
                            </div>
                        </ul>
                    </div>
                )
                break;
                case 2 :
                    return (
                        <div id="markblank_five" className={classNames(selected, withborder)} onClick={this.onClick.bind(this)}>
                            <div id="leftrect"></div>
                            <ul className={nohover?"nohover ul5":"ul5"}>
                                <div className="dropdown-content3">
                                    <ul className="marks12 fivemarks">
                                        <li onClick={this.onClickA.bind(this)}><a>5</a></li>
                                    </ul>
                                </div>
                                <div className="dropdown-content3">
                                    <ul className="marks9 fivemarks">
                                        <li><a onClick={this.onClickA.bind(this)}>4</a></li>
                                    </ul>
                                </div>
                                <div className="dropdown-content3">
                                    <ul className="marks6 fivemarks">
                                        <li><a onClick={this.onClickA.bind(this)}>3</a></li>
                                    </ul>
                                </div>
                                <div className="dropdown-content3">
                                    <ul className="marks3 fivemarks">
                                        <li><a onClick={this.onClickA.bind(this)}>2</a></li>
                                    </ul>
                                </div>
                                <div className="dropdown-content3">
                                    <ul className="marks3 fivemarks">
                                        <li><a onClick={this.onClickA.bind(this)}>1</a></li>
                                    </ul>
                                </div>
                                <div className="dropdown-content0">
                                    <ul className="marks0">
                                        <li><a onClick={this.onClickA.bind(this)}>{langLibrary.toErase}</a></li>
                                    </ul>
                                </div>
                            </ul>
                        </div>
                    )
                    break;
                case 3 :
                    return (
                        <div id="markblank_letters" className={classNames(selected, withborder)} onClick={this.onClick.bind(this)}>
                            <div id="leftrect"></div>
                            <ul className={nohover?"nohover ulAF":"ulAF"}>
                                <div className="dropdown-content3">
                                    <ul className="marks12 fiveletters">
                                        <li><a onClick={this.onClickA.bind(this)}>A</a></li>
                                    </ul>
                                </div>
                                <div className="dropdown-content3">
                                    <ul className="marks9 fiveletters">
                                        <li><a onClick={this.onClickA.bind(this)}>B</a></li>
                                    </ul>
                                </div>
                                <div className="dropdown-content3">
                                    <ul className="marks6 fiveletters">
                                        <li><a onClick={this.onClickA.bind(this)}>C</a></li>
                                    </ul>
                                </div>
                                <div className="dropdown-content3">
                                    <ul className="marks3 fiveletters">
                                        <li><a onClick={this.onClickA.bind(this)}>D</a></li>
                                    </ul>
                                </div>
                                <div className="dropdown-content3">
                                    <ul className="marks3 fiveletters">
                                        <li><a onClick={this.onClickA.bind(this)}>E/F</a></li>
                                    </ul>
                                </div>
                                <div className="dropdown-content0">
                                    <ul className="marks0">
                                        <li><a onClick={this.onClickA.bind(this)}>{langLibrary.toErase}</a></li>
                                    </ul>
                                </div>
                            </ul>
                        </div>
                    )
                break;
                case 4 :
                    return (
                        <div id="markblank_twelve" className={classNames(selected, withborder)} onClick={this.onClick.bind(this)}>
                            <div id="leftrect"></div>
                            <ul className={nohover?"nohover uTT":"uTT"}>
                                <div className="dropdown-content0">
                                    <ul className="marksHeader">
                                        <li>{"№ урока п/п"}</li>
                                    </ul>
                                </div>
                                <div className="dropdown-content3-line">
                                    <ul className="timetable0">
                                        <li><a onClick={this.onClickA.bind(this)}>1</a></li>
                                        <li><a onClick={this.onClickA.bind(this)}>2</a></li>
                                        <li><a onClick={this.onClickA.bind(this)}>3</a></li>
                                        <li><a onClick={this.onClickA.bind(this)}>1-2</a></li>
                                        <li><a onClick={this.onClickA.bind(this)}>2-3</a></li>
                                        <li><a onClick={this.onClickA.bind(this)}>3-4</a></li>
                                    </ul>
                                </div>
                                <div className="dropdown-content3-line">
                                    <ul className="timetable1">
                                        <li><a onClick={this.onClickA.bind(this)}>4</a></li>
                                        <li><a onClick={this.onClickA.bind(this)}>5</a></li>
                                        <li><a onClick={this.onClickA.bind(this)}>6</a></li>
                                        <li><a onClick={this.onClickA.bind(this)}>4-5</a></li>
                                        <li><a onClick={this.onClickA.bind(this)}>5-6</a></li>
                                        <li><a onClick={this.onClickA.bind(this)}>6-7</a></li>
                                    </ul>
                                </div>
                                <div className="dropdown-content3-line">
                                    <ul className="timetable1">
                                        <li><a onClick={this.onClickA.bind(this)}>7</a></li>
                                        <li><a onClick={this.onClickA.bind(this)}>8</a></li>
                                        <li><a onClick={this.onClickA.bind(this)}>9</a></li>
                                        <li><a onClick={this.onClickA.bind(this)}>7-8</a></li>
                                        <li><a onClick={this.onClickA.bind(this)}>8-9</a></li>
                                        <li><a onClick={this.onClickA.bind(this)}>9-10</a></li>
                                    </ul>
                                </div>
                                {/*<div className="dropdown-content3">*/}
                                    {/*<ul className="marks3">*/}
                                        {/*<li><a onClick={this.onClickA.bind(this)}>10</a></li>*/}
                                        {/*<li><a onClick={this.onClickA.bind(this)}>11</a></li>*/}
                                        {/*<li><a onClick={this.onClickA.bind(this)}>12</a></li>*/}
                                    {/*</ul>*/}
                                {/*</div>*/}
                                <div className="dropdown-content0">
                                    <ul className="marks0">
                                        <li><a onClick={this.onClickA.bind(this)}>{langLibrary.toErase}</a></li>
                                    </ul>
                                </div>
                            </ul>
                        </div>
                    )
                    break;
                default :
                    return null
            }
    }
}

export default connect(mapStateToProps)(MarkBlank)

/* eslint-disable */