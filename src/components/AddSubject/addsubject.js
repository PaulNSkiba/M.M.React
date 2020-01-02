/**
 * Created by Paul on 24.03.2019.
 */
/**
 * Created by Paul on 22.01.2019.
 */
import React, { Component } from 'react';
import { SUBJECT_CREATE_URL } from '../../config/config'
import { instanceAxios, mapStateToProps, getSubjFieldName, axios2 } from '../../js/helpers'
import { connect } from 'react-redux'
import './addsubject.css'

class AddSubject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedSubj : "",
            selectedSubjKey : "",
        }
    }
    addSubject=()=> {
        // console.log("LoginBlockLight.userLogin", this.inputEmail.value, this.inputPwd.value)
        // this.props.onclick(this.inputEmail.value, this.inputPwd.value)
       const {classid, userid} = this.props
       // console.log("addSubj", this.props.userSetup.token, `${SUBJECT_CREATE_URL}/${this.inputSubject.value.length?this.inputSubject.value:null}/${classid}/${userid}/${this.state.selectedSubjKey}`, this.state.selectedSubjKey )

        // , this.props.userSetup.classID
        if (this.props.hasOwnProperty('addfunc')) {
            console.log('hasOwnProperty', this.inputSubject.value);
            this.props.addfunc(this.inputSubject.value)
        }
        else {
            // instanceAxios().get(SUBJECT_CREATE_URL + '/' + this.inputSubject.value + '/' + this.props.classid + '/' + this.props.userid, postdata)
            axios2('get', `${SUBJECT_CREATE_URL}/${this.inputSubject.value.length?this.inputSubject.value:null}/${classid}/${userid}/${this.state.selectedSubjKey.length?this.state.selectedSubjKey:null}`)
                .then(res => {
                    console.log(res.data)
                    // dispatch({type: 'UPDATE_SETUP_REMOTE', payload: response.data})
                    this.props.onInitState(res.data.subjects_list, res.data.subjects_count);
                })
                .catch(res => {
                    console.log(res);
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
    onSubjClick=(e)=>{
        //const subj_key = e.nativeEvent.target[e.nativeEvent.target.selectedIndex].id
        this.setState({selectedSubj : e.target.value, selectedSubjKey : (e.nativeEvent.target[e.nativeEvent.target.selectedIndex].id).toString().replace('#','')})
        console.log('onSubjClick', e.target.value, e.nativeEvent.target[e.nativeEvent.target.selectedIndex].id)
        //
        // if (Number(e.target.value)!==Number(this.state.curClass)) {
    }
    renderSubjects=()=>{
        const {langCode, subjects, subjects_list} = this.props.userSetup
        // console.log("renderSubjects", subjects, subjects_list, this.props.userSetup)
        let arr = subjects.filter(item=>!(subjects_list.filter(item2=>item2.subj_key===item.subj_key).length)).map(subj=>{
            return (
                <option key={subj.id} id={subj.subj_key}>
                    { subj[getSubjFieldName(langCode)] }
                </option>
            );
        })
        arr.unshift(   <option key={0} id={0}>
            {""}
        </option>)
        return arr
    }
    render(){
        // console.log("AddObject", this.state)
        return (
            <div className={this.props.hasOwnProperty('withselect')?"addSubjectEx":this.props.hasOwnProperty('addsubjecttop')?"addSubjectTop":"addSubject"}>
                <form>
                    {this.props.hasOwnProperty('withselect')?
                        <div>
                        <label>{"Выбрать"}</label>
                            <select name="subjects"
                                onClick={this.onSubjClick}
                                defaultValue={""}
                                >
                                {this.renderSubjects()}
                            </select>
                        </div>:null}
                    <label>{this.props.title}</label>
                    <input disabled={this.state.selectedSubj.length} type="text" ref={input=>{this.inputSubject=input}}></input>
                    {/*{this.props.hasOwnProperty('withselect')?<select name="subjects"*/}
                                                                     {/*onClick={this.onSubjClick}>*/}
                        {/*{this.renderSubjects()}*/}
                    {/*</select>:null}*/}
                    {/*<label>Пароль</label><input type="password" ref={input=>{this.inputPwd=input}}></input>*/}
                    <button type="submit"
                            onClick={this.addSubject.bind(this)}>Добавить
                    </button>
                    <button onClick={this.addCancel.bind(this)}>Отмена</button>
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