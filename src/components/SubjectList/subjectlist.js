/**
 * Created by Paul on 06.01.2019.
 */
import React, { Component } from 'react';
import './subjectlist.css'
import {getSubjFieldName} from '../../js/helpers'
import { connect } from 'react-redux'
import AddSubject from "../AddSubject/addsubject";

// import subjectsforclasses from './subjectsforclasses'

class SubjectList extends Component {
    state = {
        map : new Map(this.props.selectedsubjects.map(obj=>[obj.subj_key, obj[getSubjFieldName(this.props.userSetup.langCode)]])), //new Map()//this.props.selectedsubjects.reduce((map, obj) => (map[obj.key] = obj.val, map), {}),
        showAddSubject: false
    }

    componentDidMount(){
        console.log("subjectList: componentDidMount", this.state.map, this.props.selectedsubjects, this.props.userSetup.selectedsubjects, this.props.userSetup)
    }
    addClass(e) {
        // let isActive = false

        if (this.props.studentid>0) return;
        let map = this.state.map
        e.preventDefault()
        console.log("selectedSubj", e.target.id, e.target.innerHTML)
        switch (this.props.step) {
            case 4 : // Если кликают для выбора предметов в учёбе
                if (e.target.id ==='#xxxxxx')
                    this.setState({showAddSubject:true})
                else {
                    if (map.has(e.target.id)) {
                        map.delete(e.target.id)
                    }
                    else {
                        map.set(e.target.id, e.target.innerHTML)
                    }
                    this.setState({map})

                    this.props.changestate("selectedSubjects", this.props.subjects_list.filter(value => map.has(value.subj_key)))
                }
                // this.props.changestate("subjCount", "")
                break;
            case 5 : // Если кликают для выбора конкретного предмета
                console.log("selectedSubj", e.target.id, e.target.innerHTML, e.target.id ==='#xxxxxx')

                this.props.changestate("selectedSubj", [e.target.id, e.target.innerHTML])
                break;
            default :
                break;
        }
    }
    // Сохраним или выберем из LocalStorage'a

    classNames(curclass, subjkey) {
        return curclass ? (this.state.showAddSubject&&subjkey?"subjclass activeadd":"subjclass active"):("subjclass"+(subjkey?" addbutton":""))
    }
    hideAddSubj=()=>{
        this.setState({
            showAddSubject: false
    })
    }
    render() {
        // console.log("subjects",subjects, subjects())
        // const {classnumber, step, selectedsubjects} = this.props;
        const {step} = this.props;
        const {langCode, classID, userID} = this.props.userSetup

        let subjArray = []
            switch (step) {
                case 4:
                     subjArray = this.props.subjects_list;
                    break;
                case 5:
                    subjArray = this.props.selectedsubjects
                    break;
                default:
                    //  + 1
                    break
            }
        // }
        // console.log("subjArray2", subjArray, "selectedsubjects", selectedsubjects, this.state.map)
        console.log("this.state.showAddSubject", this.state.showAddSubject, langCode, getSubjFieldName(langCode))
        return (

            <div id="subjects">
                <div className="subjMain">
                    {subjArray.map((value, key)=>
                    <div className={this.classNames((this.state.map.has(value.subj_key)&&step===4&&!(value.subj_key==="#xxxxxx"))
                        ||(value.subj_key==="#xxxxxx" && this.state.showAddSubject)
                        ||(step===5&&this.props.selectedSubj.subj_key === value.subj_key), (value.subj_key==="#xxxxxx"))}
                         key={key}
                         id={value.subj_key}
                         onClick={this.addClass.bind(this)}>
                        {value[getSubjFieldName(langCode)]}
                    </div>)
                    }
                    {this.state.showAddSubject?<AddSubject firehide={this.hideAddSubj.bind(this)}
                                                           classid={classID}
                                                           userid ={userID}
                                                           title={"Новый предмет"}
                                                            />:""}
                </div>
            </div>
        )
    }
}

// export default SubjectList
// приклеиваем данные из store
const mapStateToProps = store => {
    // console.log(store) // посмотрим, что же у нас в store?
    return {
        user:       store.user,
        userSetup:  store.userSetup,
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onInitState: () => dispatch([]),
        // onUserLoggingOut  : token => dispatch(userLoggedOut(token)),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(SubjectList)