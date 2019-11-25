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
    const {classtype, classlabel, buttons, click, classnumber,  classcount} = this.props;
        return (
            <div className={classtype}>
                <h2>{classlabel}</h2>
                <div  className="buttonsList">
                {buttons.map((number, key) =>{
                    const arr = classcount.filter(item=>item.class_number===number)
                    return <div key={"key"+key} style={{position : "relative", borderWidth : "1px"}}>
                        <button className={this.classNames(classnumber===number)} onClick={arr.length?click:null} id={"btn-class-"+number} key={number}>
                            {number}
                        </button>
                        {/*{console.log(arr, number, classcount)}*/}
                        {arr.length?<div className="classCount">{arr[0].cnt}</div>:null}
                    </div>})}
                </div>
            </div>
            )
    }
}
export default ClassList