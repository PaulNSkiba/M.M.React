/**
 * Created by Paul on 26.01.2019.
 */
import React, { Component } from 'react';
import { AUTH_URL, SUBJECTS_ADD_URL, SUBJECTS_GET_URL, MARKS_STATS_URL, arrLangs, arrClasses, defLang } from '../../config/config'
import { instanceAxios, mapStateToProps, getSubjFieldName } from '../../js/helpers'
import { connect } from 'react-redux'
import '../../containers/App.css'
import './adminpageadmin.css'
import {withRouter} from 'react-router-dom'
import Checkbox from '../../components/CheckBox/checkbox'
import UniversalTable from '../UniversalTable/universaltable'
import Tabs from 'react-responsive-tabs';
import 'react-responsive-tabs/styles.css';

class AdminPageAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subjects : [],
            langs : arrLangs,
            subjectsSelected : [],
            classes : arrClasses,
            curClass : 1,
            curLang : localStorage.getItem("langCode") ? localStorage.getItem("langCode") : defLang,
            stats : [],
            rowArray : this.initAliasArray(localStorage.getItem("langCode") ? localStorage.getItem("langCode") : defLang),
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
        this.headStat = [
            {name: "Дата", width : "80px"} ,
            {name: "Час", width : "50px"},
            {name: "Начало", width : "80px"},
            {name: "Конец", width : "80px"},
            {name: "Минут", width : "80px"},
            {name: "Оценок", width : "80px"},
            {name: "Сек/оценку", width : "80px"},
        ]
        this.headArray = [
            {name: "№ п/п", width : "20px"} ,
            {name: "Алиас", width : "200px"},
            {name: "Базовая фраза", width : "200px"},
            {name: "Перевод", width : "400px"}
        ]
        this.onLoad = this.props.onStartLoading
        this.onLoaded = this.props.onStopLoading
        this.onClassClick = this.onClassClick.bind(this)
        this.onClick = this.onClick.bind(this)
        this.onDoubleClick = this.onDoubleClick.bind(this)
        this.onLangClick = this.onLangClick.bind(this)
        this.renderLangs = this.renderLangs.bind(this)
        this.renderClasses = this.renderClasses.bind(this)
        this.onClick = this.onClick.bind(this)
        this.tabs = [{ name: 'Справочники', memo: 'Справочники', id : 0 },
            { name: 'Перевод', memo: 'Перевод', id : 1 },
            { name: 'Статистика', memo: 'Статистика', id : 2 },
            { name: 'Параметры', memo: 'Параметры', id : 3 },
        ];
    }
    componentWillMount(){
        (async()=>{
            await this.getSubjects()
            await this.getSubjListForClass(1)
            await this.getStats()
        })()
        const defLangValue = localStorage.getItem("langCode") ? localStorage.getItem("langCode") : defLang
        this.props.onReduxUpdate('ALIASES_LANG', defLangValue)
    }
    componentDidMount(){

   }
    initAliasArray=async (langid)=>{
        if (!langid) {
            langid = localStorage.getItem("langCode") ? localStorage.getItem("langCode") : defLang
        }
        // console.log('initAliasArray', AUTH_URL + ('/api/langs/get' + (langid?('/' + langid):'')));
        await  instanceAxios().get(AUTH_URL + ('/api/langs/get' + (langid?('/' + langid):'')))
            .then(response => {
                console.log('initAliasArray', response.data);
                this.props.onReduxUpdate('ALIASES_LIST', response.data)
                return response.data
                //this.setState({ subjects: response.data });
                // console.log(response);
            })
            .catch(response => {
                console.log('initAliasArray:err', response.data);
                // Список ошибок в отклике...
            })
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
        const {langCode} = this.props.userSetup
        return this.state.subjects.map(subj=>{
            return (
                <option key={subj.id} subj_key={subj.subj_key} id={subj.id}>
                    { subj[getSubjFieldName(langCode)] }
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
        const {langCode} = this.props.userSetup
        subjectsSelected = subjectsSelected.filter(function(subj) {
            return subj.id!==e.target.id;
        })

        let obj = {}
        obj["id"] = e.target.id
        obj["subj_key"] = e.target.getAttribute('subj_key')
        obj[getSubjFieldName(langCode)] = e.target.text

        // {id: e.target.id, subj_key : e.target.getAttribute('subj_key'), subj_name_ua : e.target.text }
        // subjectsSelected.push({id: e.target.id, subj_key : e.target.getAttribute('subj_key'), subj_name_ua : e.target.text })
        subjectsSelected.push(obj)

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
            "class_number" : ${this.state.curClass},
            "subj_id" : ${e.target.id},
            "subj_key" : "${e.target.getAttribute('subj_key')}",
            "${getSubjFieldName(langCode)}": "${e.target.text}"
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
        console.log('query', MARKS_STATS_URL + '/' + this.props.userSetup.classID)
        instanceAxios().get(MARKS_STATS_URL + '/' + this.props.userSetup.classID)
            .then(response => {
                this.setState({
                    stats: response.data.stats,
                })
                this.props.onStopLoading()
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

    renderLangs=()=> {
        // const defLangValue = localStorage.getItem("langCode") ? localStorage.getItem("langCode") : defLang
        // this.props.onReduxUpdate('ALIASES_LANG', defLangValue)
        return this.state.langs.map(value =>
            <option key={value} value={value} /*selected={defLangValue===value}*/>
                { value }
            </option>)
    }
    onLangClick=(e)=>{
        // console.log("ONLANGCLICK", (e.target.value), this.state.curLang)
        if (e.target.value!==(this.state.curLang)) {
            this.setState({curLang: e.target.value})
            this.initAliasArray(e.target.value)
            this.props.onReduxUpdate('ALIASES_LANG', e.target.value)
        }
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
        const {langCode} = this.props.userSetup
        return this.state.subjectsSelected.map(subj=>{
            return (
                <option key={subj.id} id={subj.subj_key}>
                    { subj[getSubjFieldName(langCode)] }
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
    createTableRows(rowsArrOrig, onInputChange, withInput, row, column, classNameOfTD) {
        let cell = [],
            rows = [];
        const rowsArr = rowsArrOrig //this.props.userSetup.aliasesList
        // console.log("createTableRows.3", rowsArr, row, column)
        if (rowsArr) {
            for (let i = 0; i < rowsArr.length; i++) {
                cell = []
                // console.log("createTableRows", rowsArr[i])
                cell.push(<th key={"r" + (i + 1) + "c1"} style={{paddingLeft: "2px", paddingRight: "2px", width : "20px"}}>{i + 1}</th>)
                cell.push(<td className="left-text"
                              style={{paddingLeft: "2px", paddingRight: "2px", width : "200px"}}
                              id={(i + 1) + "#2#" + rowsArr[i].id}
                              key={"r" + (i + 1) + "c2" }
                              onClick={this.onClick}>
                                {rowsArr[i].alias} {(row === (i + 1) && column === 2 && withInput) ?
                    <input type="text"
                           id={(i + 1) + "#2#" + rowsArr[i].id + "#" + rowsArr[i].alias + "#" + (rowsArr[i].llw_id||rowsArr[i].llw_id===null?0:rowsArr[i].llw_id)} className="inputEditor"
                           onChange={e=>this.onInputChange(e.target.value, rowsArr[i].id)}
                           onKeyPress={this.onInputKeyPress}
                           onBlur={this.onBlur}
                           defaultValue={rowsArr[i].alias}/> : ""}</td>)
                cell.push(<td className="left-text" style={{paddingLeft: "2px", paddingRight: "2px", width : "200px"}}
                              id={(i + 1) + "#3#" + rowsArr[i].id} key={"r" + (i + 1) + "c3"}
                              onClick={this.onClick}>{rowsArr[i].baseLangValue} {(row === (i + 1) && column === 3 && withInput) ?
                    <input type="text" id={(i + 1) + "#3#" + rowsArr[i].id + "#" + rowsArr[i].alias + "#" + (rowsArr[i].llw_id||rowsArr[i].llw_id===null?0:rowsArr[i].llw_id)} className="inputEditor"
                           onChange={e=>this.onInputChange(e.target.value, rowsArr[i].id)} onKeyPress={this.onInputKeyPress}  onBlur={this.onBlur}
                           defaultValue={rowsArr[i].baseLangValue}/> : ""}</td>)
                cell.push(<td className="left-text" style={{paddingLeft: "2px", paddingRight: "2px", width : "400px"}}
                              id={(i + 1) + "#4#" + rowsArr[i].id} key={"r" + (i + 1) + "c4"}
                              onClick={this.onClick}>{rowsArr[i].word} {(row === (i + 1) && column === 4 && withInput) ?
                    <input type="text" id={(i + 1) + "#4#" + rowsArr[i].id + "#" + rowsArr[i].alias + "#" + (rowsArr[i].llw_id||rowsArr[i].llw_id===null?0:rowsArr[i].llw_id)} className="inputEditor"
                           onChange={text=>this.onInputChange(text, rowsArr[i].id)} onKeyPress={this.onInputKeyPress} onBlur={this.onBlur}
                           defaultValue={rowsArr[i].word}/> : ""}</td>)
                rows.push(<tr style={{backgroundColor : rowsArr[i].id===0?"rgba(64, 155, 230, 0.25)":"#fff"}} key={i}>{cell}</tr>)
            }
         }
        return rows;
    }
    classNameOfTD=(email, verified)=> {
        return email ? (verified ? "left-text verified" : "left-text verification") : "left-text"
    }

    createStatTableRows(rowsArr, onInputChange, withInput, row, column, classNameOfTD, checkedMap) {
        console.log("createStatTableRows", row, column, rowsArr)
        {/*{stats.map((item, i)=>(<tr key={"tr"+i}><td>{(new Date(item.dd)).toLocaleDateString()}</td>*/}
        {/*<td>{item.hh}</td>*/}
        {/*<td>{(new Date(item.min)).toLocaleTimeString()}</td>*/}
        {/*<td>{(new Date(item.max)).toLocaleTimeString()}</td>*/}
        {/*<td>{item.diff}</td><td>{item.cnt}</td>*/}
        {/*<td>{item.tomark===null?"":item.tomark}</td></tr>))}*/}
        // [
        //     {name: "Дата", width : "80"} ,
        //     {name: "Час", width : "20"},
        //     {name: "Начало", width : "180"},
        //     {name: "Конец", width : "180"},
        //     {name: "Минут", width : "20"},
        //     {name: "Оценок", width : "20"},
        //     {name: "Сек/оценку", width : "40"},
        // ]
        let cell = [],
            rows = []
        if (rowsArr) {
            for (let i = 0; i < rowsArr.length; i++) {
                cell = []
                // isNewDate = !mp.has(rowsArr[i].ondate)
                // mp.set(rowsArr[i].ondate, true)
                cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", width : "80px", fontSize : "0.8em"}}
                              id={(i + 1) + "#2#" + rowsArr[i].id}
                              key={"r" + (i + 1) + "c2"}>
                    {(new Date(rowsArr[i].dd)).toLocaleDateString()}
                </td>)
                cell.push(<td style={{paddingLeft: "2px", paddingRight: "2px", textAlign: "right", width : "50px", fontSize : "0.8em"}}
                              id={(i + 1) + "#3#" + rowsArr[i].id}
                              key={"r" + (i + 1) + "c3"}>
                    {rowsArr[i].hh}
                </td>)
                cell.push(<td
                    style={{paddingLeft: "2px", paddingRight: "2px", textAlign: "center", width : "80px", fontSize: "0.8em"}}
                    id={(i + 1) + "#4#" + rowsArr[i].id}
                    key={"r" + (i + 1) + "c4"}>
                    {(new Date(rowsArr[i].min)).toLocaleTimeString()}
                </td>)
                cell.push(<td
                    style={{paddingLeft: "2px", paddingRight: "2px", textAlign: "center", width : "80px", "fontSize": "0.8em"}}
                    id={(i + 1) + "#5#" + rowsArr[i].id}
                    key={"r" + (i + 1) + "c5"}>
                    {(new Date(rowsArr[i].max)).toLocaleTimeString()}
                </td>)
                cell.push(<td
                    style={{paddingLeft: "2px", paddingRight: "2px", textAlign: "center", width : "80px", "fontSize": "0.8em"}}
                    id={(i + 1) + "#6#" + rowsArr[i].id}
                    key={"r" + (i + 1) + "c6"}>
                    {rowsArr[i].diff}
                </td>)
                cell.push(<td
                    style={{paddingLeft: "2px", paddingRight: "2px", textAlign: "center", width : "80px", "fontSize": "0.8em"}}
                    id={(i + 1) + "#7#" + rowsArr[i].id}
                    key={"r" + (i + 1) + "c7"}>
                    {rowsArr[i].cnt}
                </td>)
                cell.push(<td
                    style={{paddingLeft: "2px", paddingRight: "2px", textAlign: "center", width : "80px", "fontSize": "0.8em"}}
                    id={(i + 1) + "#8#" + rowsArr[i].id}
                    key={"r" + (i + 1) + "c8"}>
                    {rowsArr[i].tomark===null?"":rowsArr[i].tomark}
                </td>)
                rows.push(<tr key={i}>{cell}</tr>)
            }
        }
        return rows;
    }

    getLangCounters=()=>{
        return this.props.aliasesList.length + "/" + this.props.aliasesList.filter(item=>true)
    }
    getTabs=()=> {
        const {classes, langs, subjectsSelected, subjects, rowArray, stats} = this.state
        const objBlank = {
            id : 0,
            alias : "empty",
            baseLangValue : "введите описание",
            description : "введите перевод",
            lang : this.props.userSetup.aliasesLang?this.props.userSetup.aliasesLang:defLang,
            llw_id : 0,
            uniqid : localStorage.getItem("langCode") ? localStorage.getItem("langCode") : defLang,
        }
        return this.tabs.map((item, key) => ({
            title: item.name,
            getContent: () => {
                switch (item.id) {
                    case 0 :
                        return                     <div className={"mym-adminpage-subjblock"}>
                            <div className={"mym-adminpage-subjblock-header"}>
                                <div className="h4">Перечень предметов для {
                                    <select name="classes" onClick={this.onClassClick}>
                                        {classes.length&&this.renderClasses()}
                                    </select>}-го класса
                                </div>
                            </div>
                            <div className={"mym-adminpage-subjblock-selectors"}>
                                <div>
                                    <select className="subjFromSelector" multiple onClick={this.onClick} onDoubleClick={this.onDoubleClick} name="subjs">
                                        {subjects.length&&this.renderSubjects()}
                                    </select>
                                </div>
                                <div>
                                    <select className="subjToSelector" multiple onClick={this.onClick} onDoubleClick={this.onDoubleClick} name="subjs">
                                        {subjectsSelected.length&&this.renderSubjectsSelected()}
                                    </select>
                                </div>
                            </div>
                        </div>
                    case 1 :
                        return                     <div className={"mym-adminpage-translateblock"}>
                            <div className={"mym-adminpage-translateblock-header"}>
                                <div>
                                    <div className="h4">Перечень ключевых слов для {
                                        <select name="langs" onClick={this.onLangClick} defaultValue={localStorage.getItem("langCode") ? localStorage.getItem("langCode") : defLang}>
                                            {langs.length&&this.renderLangs()}
                                        </select>} языка
                                        {this.props.userSetup.aliasesList.length?': ' + (this.props.userSetup.aliasesList.length + "/" + this.props.userSetup.aliasesList.filter(item=>item.word!==null).length):null}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <UniversalTable head={this.headArray} rows={rowArray} createTableRows={this.createTableRows} classNameOfTD={this.classNameOfTD} btncaption={"+Алиас"}
                                                objblank={objBlank} initrows={this.initAliasArray} kind={"aliases"}/>
                            </div>
                        </div>
                    case 2 :
                        return                 <div className="tableStats">
                            <div className="h4">Статистика</div>
                            <UniversalTable head={this.headStat}
                                            rows={stats}
                                            createTableRows={this.createStatTableRows}
                                            classNameOfTD={this.classNameOfTD}
                                            btncaption={""}
                                            onstudentclick={null}
                                            selectedstudent={null}
                                            objblank={null}
                                            initrows={()=>{return this.state.stats}}
                                            kind={""}/>
                        </div>
                    case 3 :
                        return <div><Checkbox onclick={this.props.onReduxUpdate.bind(this)} bold={true} name={"CHAT_SSL"} defelem={this.props.userSetup.chatSSL} label=" работа Чата по SSL"/></div>
                }}
            ,
            /* Optional parameters */
            key: key,
            tabClassName: 'tab',
            panelClassName: 'panel',}))
    }
    render(){
        // const {classes, langs, subjectsSelected, subjects, rowArray, stats} = this.state
        // const objBlank = {
        //     id : 0,
        //     alias : "empty",
        //     baseLangValue : "введите описание",
        //     description : "введите перевод",
        //     lang : this.props.userSetup.aliasesLang?this.props.userSetup.aliasesLang:defLang,
        //     llw_id : 0,
        //     uniqid : localStorage.getItem("langCode") ? localStorage.getItem("langCode") : defLang,
        // }

        // console.log("adminPareAdmin:Render", this.props.userSetup)
        return (

            <div className="mym-adminpage-container">
                <Tabs items={this.getTabs()} />
                {/*<div><Checkbox onclick={this.props.onReduxUpdate.bind(this)} bold={true} name={"CHAT_SSL"} defelem={this.props.userSetup.chatSSL} label=" работа Чата по SSL"/></div>*/}

                {/*<div className="subBlocks">*/}
                    {/*<div className={"mym-adminpage-subjblock"}>*/}
                        {/*<div className={"mym-adminpage-subjblock-header"}>*/}
                            {/*<div className="h4">Перечень предметов для {*/}
                                {/*<select name="classes" onClick={this.onClassClick}>*/}
                                    {/*{classes.length&&this.renderClasses()}*/}
                                {/*</select>}-го класса*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        {/*<div className={"mym-adminpage-subjblock-selectors"}>*/}
                            {/*<div>*/}
                                {/*<select className="subjFromSelector" multiple onClick={this.onClick} onDoubleClick={this.onDoubleClick} name="subjs">*/}
                                    {/*{subjects.length&&this.renderSubjects()}*/}
                                {/*</select>*/}
                            {/*</div>*/}
                            {/*<div>*/}
                                {/*<select className="subjToSelector" multiple onClick={this.onClick} onDoubleClick={this.onDoubleClick} name="subjs">*/}
                                    {/*{subjectsSelected.length&&this.renderSubjectsSelected()}*/}
                                {/*</select>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}

                    {/*<div className={"mym-adminpage-translateblock"}>*/}
                        {/*<div className={"mym-adminpage-translateblock-header"}>*/}
                            {/*<div>*/}
                                {/*<div className="h4">Перечень ключевых слов для {*/}
                                    {/*<select name="langs" onClick={this.onLangClick} defaultValue={localStorage.getItem("langCode") ? localStorage.getItem("langCode") : defLang}>*/}
                                        {/*{langs.length&&this.renderLangs()}*/}
                                    {/*</select>} языка*/}
                                    {/*{this.props.userSetup.aliasesList.length?': ' + (this.props.userSetup.aliasesList.length + "/" + this.props.userSetup.aliasesList.filter(item=>item.word!==null).length):null}*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        {/*<div>*/}
                            {/*<UniversalTable head={this.headArray} rows={rowArray} createTableRows={this.createTableRows} classNameOfTD={this.classNameOfTD} btncaption={"+Алиас"}*/}
                                            {/*objblank={objBlank} initrows={this.initAliasArray} kind={"aliases"}/>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                {/*</div>*/}

                {/*<div className="tableStats">*/}
                    {/*<div className="h4">Статистика</div>*/}
                    {/*<UniversalTable head={this.headStat}*/}
                                    {/*rows={stats}*/}
                                    {/*createTableRows={this.createStatTableRows}*/}
                                    {/*classNameOfTD={this.classNameOfTD}*/}
                                    {/*btncaption={""}*/}
                                    {/*onstudentclick={null}*/}
                                    {/*selectedstudent={null}*/}
                                    {/*objblank={null}*/}
                                    {/*initrows={()=>{return this.state.stats}}*/}
                                    {/*kind={""}/>*/}
                {/*</div>*/}

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