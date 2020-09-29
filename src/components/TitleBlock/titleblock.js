/**
 * Created by Paul on 08.01.2019.
 */
import React, { Component } from 'react';
import './titleblock.css'
import arrow_down from '../../img/ARROW_DOWN.png'
import arrow_up from '../../img/ARROW_UP.png'
import ReactCountryFlag from "react-country-flag";
import { connect } from 'react-redux'
import {mapStateToProps, getDefLangLibrary} from '../../js/helpers'

class TitleBlock extends Component {
    classNames=(curclass, hide)=>{
        return (curclass?"block-0 done":"block-0") + (hide?"":" activeblock ") + (this.props.hasOwnProperty("isyellow")?" saveDiv":"") + (this.props.hasOwnProperty("isgrey")?(this.props.isgrey?" disabledSave":""):"")
    }
    // initLangLibrary=(langLibrary, setRedux)=>{
    //     if ((!langLibrary)||langLibrary===undefined||langLibrary==="undefined"||JSON.stringify(langLibrary)===JSON.stringify({})) {
    //         langLibrary = getLangLibrary(localStorage.getItem("langCode")?localStorage.getItem("langCode"):defLang)
    //     }
    //     return langLibrary
    // }
    render() {
        const {done, title, step, onclick, hide, caption, isH5} = this.props;
        const {langLibrary : langLib} = this.props.userSetup
        // const langLibrary = this.props.userSetup.langLibrary//this.initLangLibrary(this.props.userSetup.langLibrary)
        // let langLibrary = this.props.userSetup.langLibrary //getLangLibrary()
        // console.log("TitleBlock", this.props.userSetup, Object.keys(this.props.userSetup.langLibrary).length)
        let langLibrary = null
        // console.log("TitleBlock", this.props.userSetup, langLib)
        if (!langLib===undefined&&(Object.keys(langLib).length)) {
            langLibrary = langLib
        }
        else {
            langLibrary = getDefLangLibrary()
        }
        let divStyle = {
            "marginTop":"-5px"
        };
         return (
            <div className={"titleBlock"} key={'key'+step} onClick={onclick} id={"title-"+step}>
                {step===1?<div id="buttons">
                    <div id="btn-1" className="btn">1</div>
                    <div id="btn-2" className="btn">2</div>
                    <div id="btn-3" className="btn">3</div>
                    <div id="btn-4" className="btn">4</div>
                    <div id="btn-5" className="btn">5</div>
                    <div id="btn-6" className="btn">6</div>
                    <div id="btn-7" className="btn">7</div>
                    <div id="btn-8" className="btn2">8</div>
                </div>:""}
                <div className={this.classNames(done, hide)} onClick={onclick} id={step}>
                    <div className="block-0-0" onClick={onclick} id={step}>
                        <h3 id={step}>{title}</h3>
                        {step===1?
                            <div className="geoMain">
                            <div className="geoLocation">
                                <div style={divStyle}>
                                    <ReactCountryFlag
                                        styleProps={{
                                            width: '20px',
                                            height: '15px',
                                            border: '.1px solid lightgray',
                                            padding : 0,
                                        }}
                                        code={this.props.myCountryCode?this.props.myCountryCode:"UA"}
                                        svg
                                    />
                                </div>
                                <div className="geoCity">{this.props.myCity}<div className="geoCountryCode">{this.props.myCountryCode}</div></div>
                            </div>
                            </div>
                            :""}
                    </div>
                   <div className="block-0-1" onClick={onclick} id={step}>{
                       !isH5?<h4 id={step}>{
                        this.props.hasOwnProperty("isMarkSpeed")&&this.props.isMarkSpeed?
                                <div className="markDiv">
                                    <div className="markTopLabel">{langLibrary.top}</div>
                                    {caption}
                                    <div className="markBottomLabel">{langLibrary.speedByMark}</div>
                                </div>
                            :caption
                    }</h4>:<h5 id={step}>{
                           this.props.hasOwnProperty("isMarkSpeed")&&this.props.isMarkSpeed?
                               <div className="markDiv">
                                   <div className="markTopLabel">{langLibrary.top}</div>
                                   {caption}
                                   <div className="markBottomLabel">{langLibrary.speedByMark}</div>
                               </div>
                               :caption
                       }</h5>}</div>
                   <div className="block-0-2" onClick={onclick}>
                        <img id={step} src={hide?arrow_down:arrow_up} alt={hide?"Раскрыть":"Свернуть"}/>
                        {/*<a href="#"><span></span></a>*/}
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(TitleBlock)