/**
 * Created by Paul on 26.01.2019.
 */
import React, { Component } from 'react';
import { SUBJECTS_ADD_URL, SUBJECTS_GET_URL, MARKS_STATS_URL, arrLangs, arrClasses } from '../../config/config'
import { instanceAxios, mapStateToProps } from '../../js/helpers'
import { connect } from 'react-redux'
import '../../containers/App.css'
import './adminpageadmin.css'
import {withRouter} from 'react-router-dom'
import Checkbox from '../../components/CheckBox/checkbox'
import UniversalTable from '../UniversalTable/universaltable'

class AdminPageAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subjects : [],
            langs : arrLangs,
            subjectsSelected : [],
            classes : arrClasses,
            curClass : 1,
            stats : [],
            rowArray : this.initLangArray(),
        }
        this.head = this.createTableHead([
            {name: "Дата", width : "80"} ,
            {name: "Час", width : "20"},
            {name: "Начало", width : "180"},
            {name: "Конец", width : "180"},
            {name: "Минут", width : "20"},
            {name: "Оценок", width : "20"},
            {name: "Сек/оценку", width : "100%"},
        ])
        this.headArray = [
            {name: "№ п/п", width : "5%"} ,
            {name: "Алиас", width : "20%"},
            {name: "Базовая фраза", width : "40%"},
            {name: "Перевод", width : "100%"}
        ]
        this.onLoad = this.props.onStartLoading
        this.onLoaded = this.props.onStopLoading
        this.onClassClick = this.onClassClick.bind(this)
        this.onLangClick = this.onLangClick.bind(this)
        this.renderLangs = this.renderLangs.bind(this)
        this.renderClasses = this.renderClasses.bind(this)
        this.onClick = this.onClick.bind(this)
        this.onAddLangAlias = this.onAddLangAlias.bind(this)

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
    initLangArray=()=>{
        return [
            {
                alias : "mainSite",
                base_phrase : "Название сайта",
                translated_phrase : "My.Marks",
                lang : "GB"
            },
            {
                alias : "exit",
                base_phrase : "Выход",
                translated_phrase : "Exit",
                lang : "GB"
            },
        ]
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
                    { subj.subj_name_ua }
                </option>
            );
        })
    }
    onClick=(e)=>{
        // console.log(e.target.id)
    }
    onAddLangAlias=()=>{
        let arr = this.state.rowArray
        let newObj = {
            alias : "empty",
            base_phrase : "введите описание",
            translated_phrase : "введите перевод",
            lang : "GB",
        }
        arr.push(newObj)
        this.setState({rowArray : arr})
        // alert('addAlias')
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
    renderClasses=()=>
            this.state.classes.map(value=>
                <option key={value} value={value}>
                    { value }
                </option>)

    renderLangs=()=>
            this.state.langs.map(value=>
                    <option key={value} value={value}>
                        { value }
                    </option>)

    onLangClick=()=>{

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
    createTableRows(rowsArr, onInputChange, withInput, row, column, classNameOfTD) {
        let cell = [],
            rows = [];
        for (let i = 0; i < rowsArr.length; i++) {
            cell = []
            cell.push(<th key={"r"+(i+1)+"c1"}>{i+1}</th>)
            cell.push(<td className="left-text" style={{"paddingLeft" : "5px", "paddingRight" : "5px"}} id={(i+1)+"#2#"+rowsArr[i].id} key={"r"+(i+1)+"c2"} onClick={this.onClick}>{rowsArr[i].alias} {(row===(i+1)&&column===2&&withInput)?<input type="text" id={(i+1)+"#2#"+rowsArr[i].id} className="inputEditor" onChange={this.onInputChange} onKeyPress={this.onInputKeyPress} defaultValue={rowsArr[i].alias}/>:""}</td>)
            cell.push(<td className="left-text" style={{"paddingLeft" : "5px", "paddingRight" : "5px"}} id={(i+1)+"#3#"+rowsArr[i].id} key={"r"+(i+1)+"c3"} onClick={this.onClick}>{rowsArr[i].base_phrase} {(row===(i+1)&&column===3&&withInput)?<input type="text" id={(i+1)+"#3#"+rowsArr[i].id} className="inputEditor" onChange={this.onInputChange} onKeyPress={this.onInputKeyPress} defaultValue={rowsArr[i].base_phrase}/>:""}</td>)
            cell.push(<td className="left-text" style={{"paddingLeft" : "5px", "paddingRight" : "5px"}} id={(i+1)+"#4#"+rowsArr[i].id} key={"r"+(i+1)+"c4"} onClick={this.onClick}>{rowsArr[i].translated_phrase} {(row===(i+1)&&column===3&&withInput)?<input type="text" id={(i+1)+"#3#"+rowsArr[i].id} className="inputEditor" onChange={this.onInputChange} onKeyPress={this.onInputKeyPress} defaultValue={rowsArr[i].translated_phrase}/>:""}</td>)
            rows.push(<tr key={i}>{cell}</tr>)
        }
        return rows;
    }
    classNameOfTD=(email, verified)=> {
        return email ? (verified ? "left-text verified" : "left-text verification") : "left-text"
    }
    createTableRowsOld(rowsArr, onInputChange, withInput, row, column) {
        // let {row, column} = this.state
        console.log("createTableRows", row, column)
        let cell = [],
            rows = [];
        for (let i = 0; i < rowsArr.length; i++) {
            cell = []
            cell.push(<th key={"r"+(i+1)+"c1"}>{i+1}</th>)
            cell.push(<td className="left-text" style={{"paddingLeft" : "5px", "paddingRight" : "5px"}} id={(i+1)+"#2#"+rowsArr[i].id} key={"r"+(i+1)+"c2"} onClick={this.onClick.bind(this)}>{rowsArr[i].student_nick} {(row===(i+1)&&column===2&&withInput)?<input type="text" id={(i+1)+"#2#"+rowsArr[i].id} className="inputEditor" onChange={this.onInputChange} onKeyPress={this.onInputKeyPress} defaultValue={rowsArr[i].student_nick}/>:""}</td>) //this.isActive(i, 2, rowsArr[i].student_nick)
            cell.push(<td className="left-text" style={{"paddingLeft" : "5px", "paddingRight" : "5px"}} id={(i+1)+"#3#"+rowsArr[i].id} key={"r"+(i+1)+"c3"} onClick={this.onClick.bind(this)}>{rowsArr[i].student_name} {(row===(i+1)&&column===3&&withInput)?<input type="text" id={(i+1)+"#3#"+rowsArr[i].id} className="inputEditor" onChange={this.onInputChange} onKeyPress={this.onInputKeyPress} defaultValue={rowsArr[i].student_name}/>:""}</td>)
            cell.push(<td className={this.classNameOfTD(!(rowsArr[i].email===null), !(rowsArr[i].email_verified_at===null))} style={{"paddingLeft" : "5px", "paddingRight" : "5px", "fontSize" : "0.8em"}} id={(i+1)+"#4#"+rowsArr[i].id} key={"r"+(i+1)+"c4"} onBlur={this.onBlur.bind(this)} onClick={this.onClick.bind(this)}>{rowsArr[i].email}{(row===(i+1)&&column===4&&withInput)?<input type="text" id={(i+1)+"#4#"+rowsArr[i].id} className="inputEditor" onChange={this.onInputChange} onKeyPress={this.onInputKeyPress} defaultValue={rowsArr[i].email}/>:""}</td>)
            // Галочка скрыть студента из списка
            cell.push(<td className="center-text" id={(i+1)+"#6#"+rowsArr[i].id} key={"r"+(i+1)+"c6"}>
                {/*<Checkbox onclick={this.changeState.bind(this)} id={(i+1)+"#6_1#"+rowsArr[i].id} onclick2={this.changeState.bind(this)} name={"isout"+(i+1)} defelem={!!rowsArr[i].isout} label=""/>*/}
                <input type="checkbox" onChange={this.changeState.bind(this)} id={(i+1)+"#6_1#"+rowsArr[i].id} checked={this.state.checkedMap.has((i+1)+"#6_1#"+rowsArr[i].id)}/>
            </td>)
            // Реальный без Email
            cell.push(<td className="center-text" id={(i+1)+"#7#"+rowsArr[i].id} key={"r"+(i+1)+"c7"}>
                {/*<Checkbox onclick={this.changeState.bind(this)} id={(i+1)+"#6_1#"+rowsArr[i].id} onclick2={this.changeState.bind(this)} name={"isout"+(i+1)} defelem={!!rowsArr[i].isout} label=""/>*/}
                <input type="checkbox" onChange={this.changeState.bind(this)} id={(i+1)+"#7_1#"+rowsArr[i].id} checked={this.state.checkedMap.has((i+1)+"#7_1#"+rowsArr[i].id)}/>
            </td>)
            cell.push(<td className="left-text" style={{"paddingLeft" : "5px", "paddingRight" : "5px", "fontSize" : "0.8em"}} id={(i+1)+"#5#"+rowsArr[i].id} key={"r"+(i+1)+"c5"} onClick={this.onClick.bind(this)}>{rowsArr[i].memo}{(row===(i+1)&&column===5&&withInput)?<input type="text" id={(i+1)+"#5#"+rowsArr[i].id} className="inputEditor" onChange={this.onInputChange} onKeyPress={this.onInputKeyPress} defaultValue={rowsArr[i].memo}/>:""}</td>)
            rows.push(<tr key={i}>{cell}</tr>)
        }
        return rows;
    }

    render(){
        const {classes, langs, subjectsSelected, subjects, rowArray, stats} = this.state
        return (
            <div className="mym-adminpage-container">
                <div><Checkbox onclick={this.props.onReduxUpdate.bind(this)} bold={true} name={"CHAT_SSL"} defelem={this.props.userSetup.chatSSL} label=" работа Чата по SSL"/></div>

                <div className="subBlocks">
                    <div className={"mym-adminpage-subjblock"}>
                        <div className={"mym-adminpage-subjblock-header"}>
                            <div className="h4">Перечень предметов для {
                                <select name="classes" onClick={this.onClassClick}>
                                    {classes.length&&this.renderClasses()}
                                </select>}-го класса
                            </div>
                        </div>
                        <div className={"mym-adminpage-subjblock-selectors"}>
                            <div>
                                <select className="subjFromSelector" multiple onClick={this.onClick.bind(this)} onDoubleClick={this.onDoubleClick.bind(this)} name="subjs">
                                    {subjects.length&&this.renderSubjects()}
                                </select>
                            </div>
                            <div>
                                <select className="subjToSelector" multiple onClick={this.onClick.bind(this)} onDoubleClick={this.onDoubleClick.bind(this)} name="subjs">
                                    {subjectsSelected.length&&this.renderSubjectsSelected()}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className={"mym-adminpage-translateblock"}>
                        <div className={"mym-adminpage-translateblock-header"}>
                            <div>
                                <div className="h4">Перечень ключевых слов для {
                                    <select name="langs" onClick={this.onLangClick}>
                                        {langs.length&&this.renderLangs()}
                                    </select>} языка
                                </div>
                            </div>
                            <div className="mym-btn-add-lang-alias" onClick={this.onAddLangAlias}>+Алиас</div>
                        </div>
                        <div>
                            <UniversalTable head={this.headArray} rows={rowArray} createTableRows={this.createTableRows} classNameOfTD={this.classNameOfTD}/>
                        </div>
                    </div>
                </div>

                <div className="tableStats">
                    <h4>Статистика</h4>
                    <table>
                        <thead>
                        {this.head}
                        </thead>
                        <tbody>
                            {stats.map((item, i)=>(<tr key={"tr"+i}><td>{(new Date(item.dd)).toLocaleDateString()}</td>
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