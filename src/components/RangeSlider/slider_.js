/**
 * Created by Paul on 07.01.2019.
 */
import React, { Component } from 'react'
import './slider_.css'

class CustomSlider extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {}
    }

    render() {
        return (
            <div className="slider container">
                <div className="slider customSlider">
                    <div className="slider thumb">||</div>
                </div>
            </div>)
    }
}

export default CustomSlider