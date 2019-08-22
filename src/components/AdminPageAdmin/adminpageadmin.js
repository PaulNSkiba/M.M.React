/**
 * Created by Paul on 26.01.2019.
 */
import React, { Component } from 'react';
import { SUBJECTS_ADD_URL, SUBJECTS_GET_URL, MARKS_STATS_URL } from '../../config/config'
import { instanceAxios, mapStateToProps } from '../../js/helpers'
import { connect } from 'react-redux'
import '../../containers/App.css'
import './adminpageadmin.css'
import {withRouter} from 'react-router-dom'
import Checkbox from '../../components/CheckBox/checkbox'

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
        this.onLoad = this.props.onStartLoading
        this.onLoaded = this.props.onStopLoading
        this.onClassClick = this.onClassClick.bind(this)
    }
    componentWillMount(){
        (async()=>{
            await this.getSubjects()
            await this.getSubjListForClass(1)
            await this.getStats()
        })()
    }
    componentDidMount(){

   }
    getSubjects=()=>{
       instanceAxios().get(SUBJECTS_GET_URL)
           .then(response => {
               this.setState({ subjects: response.data });
               // console.log(response);
           })
           .catch(response => {
               console.log(response.data);
               // Список ошибок в отклике...
           })
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
        let rows = ''
        console.log('query', MARKS_STATS_URL+'/'+this.props.userSetup.classID)
        instanceAxios().get(MARKS_STATS_URL+'/'+this.props.userSetup.classID)
            .then(response => {
                this.setState({
                    stats :response.data.stats,
                })
                this.props.onStopLoading()
                console.log(response.data.stats, rows);
            })
            .catch(response => {
                console.log(response.data);
                this.props.onStopLoading()
            })
        return <table>{rows}</table>
    }
    getSubjListForClass(classid){
        this.onLoad()
        this.setState({ subjectsSelected: [] })
        instanceAxios().get(SUBJECTS_GET_URL+'/'+classid)
            .then(response => {
                this.setState({ subjectsSelected: response.data });
                this.onLoaded()
                // console.log(response);
            })
            .catch(response => {
                console.log(response.data);
                this.onLoaded()
                // Список ошибок в отклике...
            })
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
        console.log("onClassClick", e.target.value, this.state.curClass, e.target.value!==this.state.curClass)
        // console.log("renderSubjectsSelected", this.state.subjects, this.state.subjectsSelected )
        if (Number(e.target.value)!==Number(this.state.curClass)) {
            this.getSubjListForClass(e.target.value)
            this.setState({curClass: e.target.value})
        }
    }
    renderSubjectsSelected() {
        // console.log("renderSubjectsSelected", this.state.subjects, this.state.subjectsSelected )
        return this.state.subjectsSelected.map(subj=>{
            return (
                <option key={subj.id} id={subj.subj_key}>
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
        return (
            <div className="mym-adminpage-container">
                <div><Checkbox onclick={this.props.onReduxUpdate.bind(this)} bold={true} name={"CHAT_SSL"} defelem={this.props.userSetup.chatSSL} label=" работа Чата по SSL"/></div>

                <h4 className="h4">Перечень предметов для {
                <select name="classes" onClick={this.onClassClick}>
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

const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
        onStopLoading : ()=> dispatch({type: 'APP_LOADED'}),
        onStartLoading : ()=> dispatch({type: 'APP_LOADING'}),
    })
}
export default  connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminPageAdmin))