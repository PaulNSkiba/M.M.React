/**
 * Created by Paul on 27.01.2019.
 */
import React, { Component } from 'react';
import './select.css'
import { UPDATESETUP_URL, SUBJECTS_GET_URL } from '../../config/config'
import { instanceAxios, mapStateToProps } from '../../js/helpers'
import { connect } from 'react-redux'


class Select extends Component {
    constructor(props){
        super(props);
        this.state = {
            map : new Map()
        }
    }
    onChangeSelect=(e)=>{

        // let json = `{"selected_subject":"${[e.target.value, e.target.options[e.target.selectedIndex].text]}"}`;
        // let data = JSON.parse(json);
        // this.props.onSetSetup(data, this.props.userSetup.userID)
        console.log(e.target,
                    e.target.options[e.target.selectedIndex].text,
                    e.target.selectedIndex,
                    e.target.options[e.target.selectedIndex].value,
                    this.state.map.get(e.target.options[e.target.selectedIndex].value), this.state.map)
        switch (this.props.name) {
            case "selectedSubj" :
                this.props.onchange(this.props.name, [e.target.options[e.target.selectedIndex].value, e.target.options[e.target.selectedIndex].text])
                break;
            default :
                this.props.onchange(this.props.name, e.target.value)
                break;
        }
        if (this.props.hasOwnProperty('additionalEvent')){
            this.props.additionalEvent(e.target.options[e.target.selectedIndex].value)
        }
    }
    render() {
        // name={this.props.name}
        let {key, value, selected, valuename, name} = this.props
        // console.log("SELECT", name, value, selected)
        // defaultValue={selected}
        return(
            <div className={this.props.hasOwnProperty("vertical")?"selSectionV":"selSection"}>
                <pre>{this.props.caption}</pre>
                <select onChange={this.onChangeSelect} value={selected} onClick={this.onSelectorClick}>
                    {this.props.list.map((val,index)=><option key={index} id={val[key]} id2={val.id} value={val[value]}>{val[valuename]}</option>)})}
                </select>
            </div>
        )
    }
}
// приклеиваем данные из store
const mapDispatchToProps = dispatch => {
    return ({
        onSetSetup: (data, userID) => {
            const asyncSetSetup = (data, userID) =>{
                return dispatch => {
                    // let responsedata = []
                    dispatch({type: 'UPDATE_SETUP_LOCALLY', payload: data})
                    if (Object.keys(data)[0]==="class_number") {
                        let postdata = JSON.parse(`{"subjects_list":"${Object.values(data)[0]}"}`);
                        instanceAxios().get(SUBJECTS_GET_URL+'/'+Object.values(data)[0], postdata)
                            .then(response => {
                                // responsedata = response.data;
                                dispatch({type: 'UPDATE_SETUP_LOCALLY_SUBJLIST', payload: response.data})
                                let arr = response.data.map(value=>value.subj_key);
                                let postdata = `{"subjects_list":"${arr}"}`;
                                userID&&instanceAxios().post(UPDATESETUP_URL + '/' + userID, postdata)
                                    .then(response=>{
                                        console.log('UPDATE_SETUP_SUCCESSFULLY_subjects_list', response.data, userID);
                                    })
                                    .catch(response => {
                                        console.log('UPDATE_SETUP_FAILED_subjects_list', response);
                                    })
                            })
                            .catch(response => {
                                console.log(response);
                                dispatch({type: 'UPDATE_SETUP_FAILED', payload: response.data})
                            })
                    }
                    if (userID) {
                        if (Object.keys(data)[0]==="selected_subjects") {
                            console.log("SELECTED_SUBJECTS", data, Object.values(data)[0], Object.values(data)[0].map(val=>val.subj_key), Object.values(data)[0].map(val=>val.subj_key).join())
                            let json = `{"selected_subjects":"${Object.values(data)[0].map(val=>val.subj_key).join()}"}`;
                            data = JSON.parse(json);
                        }
                        instanceAxios().post(UPDATESETUP_URL + '/' + userID, data)
                            .then(response => {
                                dispatch({type: 'UPDATE_SETUP_REMOTE', payload: response.data})
                        })
                            .catch(response => {
                                dispatch({type: 'UPDATE_SETUP_FAILED', payload: response.data})
                            })
                    }
                }
            }
            dispatch(asyncSetSetup(data, userID))
        },

    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Select)
