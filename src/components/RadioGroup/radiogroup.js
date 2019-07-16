/**
 * Created by Paul on 13.01.2019.
 */
import React, { Component } from 'react';
import './radiogroup.css'

class RadioGroup extends Component {

    setValue(event) {
        console.log("setValue", this.props.name, event.target.value);
        this.props.onclick(this.props.name, event.target.value)
    }

// <div key={key}>
// <input type="radio" value={elem.id} name="gender" defaultChecked/> {elem.alias}
// </div>
// :
// <div key={key}>
// <input type="radio" value={elem.id} name="gender"/> {elem.alias}
// </div>

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
                    {this.props.hasOwnProperty("addinput")?(<label>Задать: <input className="customInput" defaultValue={defelem} type="text" id="custominput"/></label>):""}
                </div>
            </div>

        )
    }
}
export default RadioGroup