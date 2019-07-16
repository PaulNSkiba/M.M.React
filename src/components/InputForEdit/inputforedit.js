/**
 * Created by Paul on 04.02.2019.
 */
import React, { Component } from 'react';

export default class InputForEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            row: -1,
            column: -1,
            head: [],
            rows: []
        }
    }
    onChange(){

    }
    render() {
        return(<input type="text" className="inputEditor" onChange={this.onChange} defaultValue={this.props.defvalue}/>)
    }
}