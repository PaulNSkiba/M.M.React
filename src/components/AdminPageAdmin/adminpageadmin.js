/**
 * Created by Paul on 26.01.2019.
 */
import React, { Component } from 'react';
import { SUBJECTS_ADD_URL, SUBJECTS_GET_URL, MARKS_STATS_URL, instanceAxios } from '../../config/URLs'
import { connect } from 'react-redux'
// import UniversalTable from '../UniversalTable/universaltable'
// import { Link } from 'react-router-dom';
// import MobileMenu from '../MobileMenu/mobilemenu'

import '../../containers/App.css'
import './adminpageadmin.css'

import {withRouter} from 'react-router-dom'

class AdminPageAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subjects : [],
            subjectsSelected : [],
            classes : [1,2,3,4,5,6,7,8,9,10,11,12],
            curClass : 1,
            stats : [],
            head : this.createTableHead([
                {name: "Дата", width : "80"} ,
                {name: "Час", width : "20"},
                {name: "Начало", width : "180"},
                {name: "Конец", width : "180"},
                {name: "Минут", width : "20"},
                {name: "Оценок", width : "20"},
                {name: "Сек/оценку", width : "100%"},
            ])
        }
    }
    componentWillMount(){
        this.getStats()
    }
    componentDidMount(){
        let header = {
            headers: {
                'Content-Type': "application/json",
            }
        }
        // console.log("DIDMOUNT")
        instanceAxios().get(SUBJECTS_GET_URL, [], header)
            .then(response => {
                this.setState({ subjects: response.data });
                // console.log(response);
            })
            .catch(response => {
                console.log(response.data);
                // Список ошибок в отклике...
            })

        this.getSubjListForClass(1)
   }
    renderSubjects() {
        return this.state.subjects.map(subj=>{
            return (
                <option key={subj.id} subj_key={subj.subj_key} id={subj.id}>
                    {/*{ console.log("SUBJ", subj)}*/}
                    { subj.subj_name_ua }
                </option>
            );
        })
    }
    onClick=(e)=>{
        // console.log(e.target.id)
    }
    onDoubleClick=(e)=>{
        console.log("dbl.click", e.target, e.target.id)
        // return;
        let {subjectsSelected} = this.state
        subjectsSelected = subjectsSelected.filter(function(subj) {
            return subj.id!==e.target.id;
        })

        subjectsSelected.push({id: e.target.id, subj_key : e.target.getAttribute('subj_key'), subj_name_ua: e.target.text })
         // return
        this.setState({
            subjectsSelected
        })

        let header = {
            headers: {
                'Content-Type': "application/json",
            }
        }
        let json = `{
            "class_id" : ${this.state.curClass},
            "subj_id" : ${e.target.id},
            "subj_key" : "${e.target.getAttribute('subj_key')}",
            "subj_name_ua": "${e.target.text}"
        }`
        console.log("JSON", json);
        let data = JSON.parse(json);

        instanceAxios().post(SUBJECTS_ADD_URL, data, header)
            .then(response => {
                // this.setState({ subjects: response.data });
                // console.log(response);
            })
            .catch(response => {
                console.log(response.data);
                // Список ошибок в отклике...
            })

    }
    getStats=()=>{
        let header = {
            headers: {
                'Content-Type': "application/json",
            }
        }
        let rows = ''
        console.log('query', MARKS_STATS_URL+'/'+this.props.userSetup.classID)
        instanceAxios().get(MARKS_STATS_URL+'/'+this.props.userSetup.classID, [], header)
            .then(response => {
                // this.setState({ subjects: response.data });
                // {60/item.cnt/item.diff}
                // {item.min}
                {/*<td>{item.hh}</td><td></td><td>{item.max}</td><td>{item.diff}</td><td>{item.cnt}</td><td></td>*/}
                // for (let i=1;i<response.data.length;i++){
                //     console.log(response.data[i].hh)
                // }
                this.setState({
                    stats :response.data.stats,
                })
                // rows = response.data.response.map((item)=>(
                //     <tr><td>{item.dd}</td><td>{item.hh}</td><td></td><td>{item.max}</td><td>{item.diff}</td><td>{item.cnt}</td><td><td>{item.hh}</td><td></td><td>{item.max}</td><td>{item.diff}</td><td>{item.cnt}</td><td></td></td></tr>
                // ))
                console.log(response.data.stats, rows);
            })
            .catch(response => {
                console.log(response.data);
                // Список ошибок в отклике...
            })
        return <table>{rows}</table>
    }
    renderClasses=()=>{
        return (
            this.state.classes.map(value=>{
            return (
                <option key={value} value={value}>
                    { value }
                </option>
            );
        })
        )
    }
    onClassClick=(e)=>{
        console.log("onClassClick", e.target.value)
        console.log("renderSubjectsSelected", this.state.subjects, this.state.subjectsSelected )
        this.getSubjListForClass(e.target.value)
        this.setState(
            {
                curClass : e.target.value,
            }
        )
    }
    getSubjListForClass(classid){
        // let header = {
        //     headers: {
        //         'Content-Type': "application/json",
        //     }
        // }
        instanceAxios().get(SUBJECTS_GET_URL+'/'+classid)
            .then(response => {
                this.setState({ subjectsSelected: response.data });
                // console.log('getSubjListForClass', response.data);
                // return response.data;
                // console.log(response);
            })
            .catch(response => {
                console.log(response.data);
                // Список ошибок в отклике...
            })
    }
    renderSubjectsSelected() {
        console.log("renderSubjectsSelected", this.state.subjects, this.state.subjectsSelected )
        return this.state.subjectsSelected.map(subj=>{
            return (
                <option key={subj.id} id={subj.subj_key}>
                    {/*{console.log("subjectsSelected", subj)}*/}
                    { subj.subj_name_ua }
                </option>
            );
        })
    }
    columnClassName=key=> {
        return "colstat-" + key;
    }
    createTableHead=(head)=>(
        <tr id="row-1" key={"r0"}>{head.map((val, index)=><th  className={this.columnClassName(index)} key={index}>{val.name}</th>)}</tr>
    )
    render(){
        // console.log('SUBJECTS', this.state.subjects, this.state.subjects.length, this.state.subjectsSelected)

        return (
            <div>
                <h4 className="h4">Перечень предметов для {
                <select name="classes" onClick={this.onClassClick.bind(this)}>
                    {this.state.classes.length&&this.renderClasses()}
                </select>}-го класса</h4>

                <div className="subBlocks">
                    <div>
                        <select className="subjFromSelector" multiple onClick={this.onClick.bind(this)} onDoubleClick={this.onDoubleClick.bind(this)} name="subjs">
                            {this.state.subjects.length&&this.renderSubjects()}
                        </select>
                    </div>
                    <div>
                        <select className="subjToSelector" multiple onClick={this.onClick.bind(this)} onDoubleClick={this.onDoubleClick.bind(this)} name="subjs">
                            {this.state.subjectsSelected.length&&this.renderSubjectsSelected()}
                        </select>
                    </div>
                </div>

                <div className="tableStats">
                    <h4>Статистика</h4>
                    {/*<UniversalTable head={this.state.headArray} rows={this.state.stats}/>*/}
                    <table>
                        <thead>
                        {this.state.head}
                        </thead>
                        <tbody>
                        {this.state.stats.map((item, i)=>(<tr key={"tr"+i}><td>{(new Date(item.dd)).toLocaleDateString()}</td>
                                                                        <td>{item.hh}</td>
                                                                        <td>{(new Date(item.min)).toLocaleTimeString()}</td>
                                                                        <td>{(new Date(item.max)).toLocaleTimeString()}</td>
                                                                        <td>{item.diff}</td><td>{item.cnt}</td>
                                                                        <td>{item.tomark===null?"":item.tomark}</td></tr>))}
                        </tbody>
                     </table>
                </div>
            </div>

        )
}
}
const mapStateToProps = store => {
    // console.log(store) // посмотрим, что же у нас в store?
    return {
        user:       store.user,
        userSetup:  store.userSetup,
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        // onInitState: () => dispatch([]),
        // onUserLoggingOut  : token => dispatch(userLoggedOut(token)),
        // onStudentUpdate: (data)=> dispatch({type: 'UPDATE_STUDENTS_LOCALLY', payload: data})
    })
}
export default  connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminPageAdmin))