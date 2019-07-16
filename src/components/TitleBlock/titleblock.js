/**
 * Created by Paul on 08.01.2019.
 */
import React, { Component } from 'react';
import './titleblock.css'
import arrow_down from '../../img/ARROW_DOWN.png'
import arrow_up from '../../img/ARROW_UP.png'
import ReactCountryFlag from "react-country-flag";

class TitleBlock extends Component {

    classNames=(curclass, hide)=>{
        return (curclass?"block-0 done":"block-0") + (hide?"":" activeblock ") + (this.props.hasOwnProperty("isyellow")?" saveDiv":"") + (this.props.hasOwnProperty("isgrey")?(this.props.isgrey?" disabledSave":""):"")
    }

    render() {
        const {done, title, step, onclick, hide, caption} = this.props;
        var divStyle = {
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
                                            width: '22px',
                                            height: '18px',
                                            border: '.2px solid lightgray',
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

                    <div className="block-0-1" onClick={onclick} id={step}><h4 id={step}>{
                        this.props.hasOwnProperty("isMarkSpeed")&&this.props.isMarkSpeed?
                                <div className="markDiv">
                                    <div className="markTopLabel">{"TОП"}</div>
                                    {caption}
                                    <div className="markBottomLabel">{"сек/оценку"}</div>
                                </div>
                            :caption
                    }</h4></div>

                    <div className="block-0-2" onClick={onclick}>
                        <img id={step} src={hide?arrow_down:arrow_up} alt={hide?"Раскрыть":"Свернуть"}/>
                        {/*<a href="#"><span></span></a>*/}
                    </div>

                </div>
            </div>
        )
    }
}

export default TitleBlock