/**
 * Created by Paul on 06.01.2019.
 */
import React, { Component } from 'react';
import './classlist.css'

class ClassList extends Component {

    classNames(curclass) {
        return curclass?"btn-class btn-active":"btn-class"
    }
    render() {
    const {classtype, classlabel, buttons, click, classnumber} = this.props;
        return (
            <div className={classtype}>
                <h2>{classlabel}</h2>
                {buttons.map((number, key) =>
                    <button className={this.classNames(classnumber===number)} onClick={click} id={"btn-class-"+number} key={number}>
                        {number}
                    </button>)}
            </div>
            )
    }
}
export default ClassList