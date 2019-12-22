/**
 * Created by Paul on 13.01.2019.
 */
import React, { Component } from 'react';
import "./checkbox.css"
class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: this.props.defelem,
        };
    }
    toggleChange = () => {
        this.props.onclick(this.props.name, !this.state.isChecked)
        console.log("toggleChange", this.props.name, !this.state.isChecked)
        this.setState({
            isChecked: !this.state.isChecked,
        });
    }
    render() {
        // console.log("CheckBox", `"${this.props.fsize?this.props.fsize:1}em"`)
        return (
            <div className="checkboxLabel">
                <input type="checkbox"
                       checked={this.state.isChecked}
                       onChange={this.toggleChange}/>
                <span style={{fontSize : ".9em"}}>{this.props.label}</span>
            </div>
        );
    }
}
export default Checkbox;