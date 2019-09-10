/**
 * Created by Paul on 13.01.2019.
 */
import React, { Component } from 'react';
import './radiogroup.css'
import { connect } from 'react-redux'
import {mapStateToProps, getLangLibrary, getDefLangLibrary} from '../../js/helpers'

class RadioGroup extends Component {

    setValue(event) {
        console.log("setValue", this.props.name, event.target.value);
        this.props.onclick(this.props.name, event.target.value)
    }

    getInput = (defelem, elem, name)=>
    {
        // console.log("getInput", defelem, elem, name)
            if (elem.id === defelem) {
                return(<div key={elem.id}>
                    <input type="radio" value={elem.id} name={name} defaultChecked/> {elem.alias}
                </div>)
                }
            else {
                return(<div key={elem.id}>
                    <input type="radio" value={elem.id} name={name}/> {elem.alias}
                </div>)
            }
    }

    render() {
        const {defelem, values, name, title} = this.props;
        return (
            <div>
                <div className="radioTitle">
                    <div><b>{title}</b></div>
                </div>
                <div className="radioMap" onChange={this.setValue.bind(this)}>
                    {values.map((elem, key)=>this.getInput(defelem, elem, name))}
                    {this.props.hasOwnProperty("addinput")?(<label>{this.props.userSetup.langLibrary.addSettings1_1} <input className="customInput" defaultValue={defelem} type="text" id="custominput"/></label>):""}
                </div>
            </div>

        )
    }
}

export default connect(mapStateToProps)(RadioGroup)
