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
        // this.props.onclick2(e, this.props.name, !this.state.isChecked)
        this.setState({
            isChecked: !this.state.isChecked,
        });
    }
    render() {
        return (
            <div className="checkboxLabel">
                <input type="checkbox"
                       checked={this.state.isChecked}
                       onChange={this.toggleChange}
                       // id={this.props.id}
                />
                <b>{this.props.label}</b>
            </div>
        );
    }
}
export default Checkbox;