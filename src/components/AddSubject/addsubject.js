/**
 * Created by Paul on 24.03.2019.
 */
/**
 * Created by Paul on 22.01.2019.
 */
import React, { Component } from 'react';
import { SUBJECT_CREATE_URL } from '../../config/config'
import { instanceAxios, mapStateToProps } from '../../js/helpers'
import { connect } from 'react-redux'
import './addsubject.css'

class AddSubject extends Component {

    addSubject=()=> {
        // console.log("LoginBlockLight.userLogin", this.inputEmail.value, this.inputPwd.value)
        // this.props.onclick(this.inputEmail.value, this.inputPwd.value)
        let postdata = []

        // , this.props.userSetup.classID
        if (this.props.hasOwnProperty('addfunc')) {
            console.log('hasOwnProperty', this.inputSubject.value);
            this.props.addfunc(this.inputSubject.value)
        }
        else {
            instanceAxios().get(SUBJECT_CREATE_URL + '/' + this.inputSubject.value + '/' + this.props.classid + '/' + this.props.userid, postdata)
                .then(response => {
                    console.log(response.data)
                    // dispatch({type: 'UPDATE_SETUP_REMOTE', payload: response.data})
                    this.props.onInitState(response.data.subjects_list, response.data.subjects_count);
                })
                .catch(response => {
                    console.log(response);
                })
        }
        this.props.firehide(true)
    }
    addCancel=()=> {
        // console.log(this.inputEmail.value, this.inputPwd.value)
        // this.props.onclick(this.inputEmail.value, this.inputPwd.value)
        this.props.firehide(true)
    }
    componentDidMount() {
        this.inputSubject.focus();
    }
    // userLogout() {
    //
    // }
    render(){
        return (
            <div className="addSubject">
                <form>
                    <label>{this.props.title}</label><input type="text" ref={input=>{this.inputSubject=input}}></input>
                    {/*<label>Пароль</label><input type="password" ref={input=>{this.inputPwd=input}}></input>*/}
                    <button type="submit" onClick={this.addSubject.bind(this)}>Добавить</button><button onClick={this.addCancel.bind(this)}>Отмена</button>
                </form>
            </div>
        )

    }
}

const mapDispatchToProps = dispatch => {
    return ({
        onInitState: (subjList, subjCount) => {
            dispatch({type: 'UPDATE_SETUP_LOCALLY_SUBJLIST', payload: subjList})
            dispatch({type: 'UPDATE_SETUP_LOCALLY_SUBJCOUNT', payload: subjCount})
        },
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(AddSubject)