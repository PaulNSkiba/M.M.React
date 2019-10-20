/**
 * Created by Paul on 04.02.2019.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { userLoggedOut } from '../../actions/userAuthActions'
import { AUTH_URL, API_URL, STUDENTS_UPDATE_URL } from '../../config/config'
import { instanceAxios, mapStateToProps, toYYYYMMDD } from '../../js/helpers'
import '../../containers/App.css'
import './universaltable.css'

class UniversalTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            row : -1,
            column: -1,
            head : [],
            rows : [], //this.props.rowsArr,
            checkedMap : this.fillMap(),
            arrRows : [],
            addNew : false,
            curAlias : '',
            curStudent : this.props.selectedstudent,
        }
        this.currentEditedCellValue = ''
        this.currentEditedCellId = -1
        this.addNewRowFlag = false
        this.onClick = this.onClick.bind(this)
        this.onBlur = this.onBlur.bind(this)
        this.changeState = this.changeState.bind(this)
        this.createTableRows = this.props.createTableRows.bind(this)
        this.onAddNewRow = this.onAddNewRow.bind(this)
        this.updateSource = this.updateSource.bind(this)
        this.onSelectStudent = this.props.onstudentclick
        this.handleDate = this.handleDate.bind(this)
    }
    componentDidMount() {
        // console.log("UniversalTable.DidMount")
        const {classNameOfTD} = this.props
        const {arrRows : rows, row : row_state, column : column_state, checkedMap} = this.state

        // console.log("HEAD", this.props.head)
        this.setState ( {
            head : this.createTableHead(this.props.head),
            rows : this.createTableRows(this.props.initrows(this.props.userSetup.aliasesLang), this.onInputChange, true, row_state, column_state, classNameOfTD, checkedMap)
        })
    }
    componentWillReceiveProps(props) {

        const { year, head } = this.props;
        // console.log("HEAD2", props.year, year, props.head, head)
        if (props.year !== year || props.head.lenght !== head.length) {
            // this.fetchShoes(id)
            //     .then(this.refreshShoeList)
            const {classNameOfTD} = this.props
            const {arrRows : rows, row : row_state, column : column_state, checkedMap} = this.state

            // console.log("HEAD3", this.props.head)
            this.setState ( {
                head : this.createTableHead(this.props.head),
                rows : this.createTableRows(this.props.initrows(this.props.userSetup.aliasesLang), this.onInputChange, true, row_state, column_state, classNameOfTD, checkedMap)
            })
        }
    }
    fillMap=()=>{
        let {rows} = this.props
        let map = new Map()
        // console.log('fillMap', rows)
        if (rows) {
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].isout === 1) map.set((i + 1) + "#6_1#" + rows[i].id, rows[i].isout === 1)
                if (rows[i].isRealName === 1) map.set((i + 1) + "#7_1#" + rows[i].id, rows[i].isRealName === 1)
            }
        }
        return map;
    }
    createTableHead=(head)=>(

        <tr id="row-1" key={"r0"}>{head.map((val, index)=>
            <th className={(val.isvert===true?' rotate':'')}
                style={{width : val.width, paddingLeft : "2px", paddingRight : "2px"}} key={index}>
                <div>
                    {val.name}
                    </div>
            </th>)}</tr>
    )
    onInputChange(text, id) {
        // console.log("onInputChange", text, id)
        this.currentEditedCellValue = text
        this.currentEditedCellId = id
        // console.log("onInputChange", e.target)
    }
    updateSource=(column, id, value, key)=>{
        // console.log("updateSource", column, id, value, key)
        const {classNameOfTD} = this.props
        const {arrRows : rows, row : row_state, column : column_state, checkedMap} = this.state

        let json = "", data = "", isCheckBox = false;
        switch (this.props.kind) {
            case 'students' :
                switch (column) {
                    case 2:
                        this.props.rows[this.state.row - 1].student_nick = value
                        json = `{"student_nick":"${value}"}`;
                        break;
                    case 3:
                        this.props.rows[this.state.row - 1].student_name = value
                        json = `{"student_name":"${value}"}`;
                        break;
                    case 4:
                        this.props.rows[this.state.row - 1].email = value
                        json = `{"email":"${value}"}`;
                        break;
                    case 5:
                        this.props.rows[this.state.row - 1].memo = value
                        json = `{"memo":"${value}"}`;
                        break;
                    case 6:
                        checkedMap.has(value) ? checkedMap.delete(value) : checkedMap.set(value, true)
                        json = `{"isout":"${checkedMap.has(value) ? 1 : 0}"}`;
                        this.setState({checkedMap});
                        isCheckBox = true;
                        console.log("checkedMap", checkedMap, checkedMap.has(value), value)
                        break;
                    case 7:
                        checkedMap.has(value) ? checkedMap.delete(value) : checkedMap.set(value, true)
                        json = `{"isRealName":"${checkedMap.has(value) ? 1 : 0}"}`;
                        this.setState({checkedMap});
                        isCheckBox = true;
                        console.log("checkedMap", checkedMap, checkedMap.has(value), value)
                        break;
                    default:
                        break;
                }
                if (json) {
                    data = JSON.parse(json);
                    this.props.onStudentUpdate(this.props.rows)
                    instanceAxios().post(STUDENTS_UPDATE_URL + '/' + id, JSON.stringify(data))
                        .then(response => {
                            console.log('UPDATE_STUDENTS_REMOTE', response.data)
                        })
                        .catch(response => {
                            console.log(response);
                        })
                }
                this.setState({ row : -1, column :-1, rows: this.createTableRows(rows, this.onInputChange, isCheckBox, row_state, column_state, classNameOfTD, checkedMap)})
                break;
            case "aliases" :
                const   alias =  String(key.split('#')[3]),
                        llw_id = Number(key.split('#')[4])
                let url = ''
                const uniqid = new Date().getTime() + this.props.userSetup.userName
                let arr = this.props.userSetup.aliasesList
                let newarr = arr.map(item=>{
                    if (item.id === id) {
                        item.uniqid = uniqid;
                    }
                    return item
                })
                switch (column) {
                    case 2 :
                        // Алиасы
                        url = AUTH_URL + '/api/langs/update/alias' + (id?`/${id}`:'')
                        json = `{"alias":"${value}","uniqid":"${uniqid}"}`;
                        break;
                    case 3 :
                        // Описание
                        url = AUTH_URL + '/api/langs/update/alias' + (id?`/${id}`:'')
                        json = `{"baseLangValue":"${value}","uniqid":"${uniqid}"}`;
                        break;
                    case 4 :
                        // Перевод
                        url = AUTH_URL + '/api/langs/update/word' + (llw_id?`/${llw_id}`:'')
                        json = `{"word":"${value}","lang":"${this.props.userSetup.aliasesLang}","alias":"${alias}","uniqid":"${uniqid}"}`;
                        break;
                    default :
                        break;
                }
                if (json) {
                    data = JSON.parse(json);
                    // this.props.onStudentUpdate(this.props.rows)
                    // console.log("UPDATE_URL", url, json)
                    instanceAxios().post(url, JSON.stringify(data))
                        .then(response => {
                            // arr = this.props.userSetup.aliasesList
                            // console.log("RESPONSE", response.data)
                            newarr = arr.map(item=>{
                                if (item.uniqid === response.data.uniqid) {
                                    if (column === 4) {
                                        item.word = response.data.word
                                    }
                                    else {
                                        item.id = response.data.id
                                        item.lang = response.data.lang
                                        item.alias = response.data.alias
                                        item.baseLangValue = response.data.baseLangValue
                                        item.description = response.data.description
                                    }
                                }
                                return item
                            })
                            // console.log('ALIASES_LIST', newarr)
                            this.props.onReduxUpdate('ALIASES_LIST', newarr)
                            this.setState({ row : -1, column :-1, rows: this.createTableRows(newarr, this.onInputChange, isCheckBox, row_state, column_state, classNameOfTD, checkedMap)})

                            //console.log('UPDATE_ALIAS_REMOTE', response.data)
                        })
                        .catch(response => {
                            console.log(response);
                        })
                }
                break;
            default:

                break;
        }
        // this.setState({ row : -1, column :-1, rows: this.createTableRows(rows, this.onInputChange, isCheckBox, row_state, column_state, classNameOfTD, checkedMap)})
    }
    onClick(e) {
        const {classNameOfTD} = this.props
        const {arrRows : rows, row : row_state, column : column_state, checkedMap} = this.state

        // console.log("onClick", this.state.arrRows, this.state.rows)
        if (e.target.nodeName === "TD") {
            let row = Number(e.target.id.split('#')[0]),
                column = Number(e.target.id.split('#')[1])

            // console.log("onClick", row, column)
            if (this.currentEditedCellId>0) {
                if ((Math.abs(row - this.state.row) + Math.abs(column - this.state.column)) && (this.state.row > 0) && (this.state.column > 0)) {
                    // alert(`${this.state.row} and ${this.state.column} was edited. And now: ${row} and ${column}`, this.currentEditedCellValue)
                    // this.updateSource(this.state.column, this.currentEditedCellId, this.currentEditedCellValue, e.target.id)
                }
            }
            // console.log("table_OnClick", row, column)
            this.currentEditedCellValue = ''
            this.currentEditedCellId = -1
            this.setState(
                {
                    row: row,
                    column: column,
                    rows : this.createTableRows(rows, this.onInputChange, true, row_state, column_state, classNameOfTD, checkedMap)
                }
            )
        }
        // console.log("onClick.2", this.state.arrRows, this.state.rows)
    }
    onBlur(e) {
        const {classNameOfTD} = this.props
        const {arrRows : rows, row : row_state, column : column_state, checkedMap} = this.state

        // console.log("onBlur", e.target, e.target.nodeName, e.target.innerHTML, e.target.getAttribute('id2'), e.target.value)
        if (true) {//(e.target.nodeName === "TD") {
            // let row = Number(e.target.id.split('#')[0]),
            //     column = Number(e.target.id.split('#')[1])
            const column = Number(e.target.id.split('#')[1]),
                id = Number(e.target.id.split('#')[2]),
                value = e.target.value;
            this.updateSource(column, id, value, e.target.id)

            this.currentEditedCellValue = ''
            this.currentEditedCellId = -1
            this.setState(
                {
                    row: Number(e.target.id.split('#')[0]),
                    column: Number(e.target.id.split('#')[1]),
                    rows: this.createTableRows(rows, this.onInputChange, true, row_state, column_state, classNameOfTD, checkedMap)
                }
            )
        }
    }
    onInputKeyPress=(e)=>{
        // console.log('onInputKeyPress', e.target, e.target.id, e.target.value);
        if (e.key === 'Enter') {
            const   column = Number(e.target.id.split('#')[1]),
                    id = Number(e.target.id.split('#')[2]),
                    value = e.target.value;
            this.updateSource(column, id, value, e.target.id)
        }
    }
    changeState=(e)=>{
        const   column = String(e.target.id.split('#')[1]),
                id = Number(e.target.id.split('#')[2])
        console.log("changeState", e.target.id, column.split('_')[0])
        this.updateSource(Number(column.split('_')[0]), id, e.target.id, e.target.id)
    }
    onAddNewRow=()=>{
        const {classNameOfTD, objblank} = this.props
        const {arrRows, row : row_state, column : column_state, checkedMap} = this.state
        let arr = arrRows;
        // console.log("onAddNewRow", arr)
        arr.push(objblank);
        this.addNewRowFlag = true
        // this.forceUpdate()
        this.setState({
                            arrRows : arr,
                            // addNew : true,
                            rows : this.createTableRows(arr, this.onInputChange, true, row_state, column_state, classNameOfTD, checkedMap)
                        })
        // // alert('addAlias')
    }
    handleDate = (type, id, date) => {
        console.log(type, id, date)
        let url, json
        // let arr = this.state.planIns;
        switch (type) {
            case 'start':
                break;
            case 'end':
                break;
            case 'datein':
                console.log("datein", type, id, date)
                switch (this.props.kind) {
                    case 'budget' :
                        url = AUTH_URL + `/api/student/update/${id}`
                        json = `{"datein":"${toYYYYMMDD(date)}", "id":${id}}`;
                        break;
                    default :
                        break;
                }
                break;
            default :
                break;
        }
    if (json) {
        // let data = JSON.parse(json);
        console.log(json)
        instanceAxios().post(url, json)
            .then(response => {
                // arr = this.props.userSetup.aliasesList
                console.log("RESPONSE", response.data)
                let arr = this.props.userSetup.students
                arr = arr.map(item=>{
                    if (item.id===id) item.datein = toYYYYMMDD(date)
                    return item
                })
                console.log("onStudentUpdate", arr)
                this.props.onStudentUpdate(arr)
                //console.log('UPDATE_ALIAS_REMOTE', response.data)
            })
            .catch(response => {
                console.log(response);
            })
        }
    };
    render(){
        // let {head, row, column} = this.state
        const {classNameOfTD, objblank} = this.props
        const {head, row : row_state, column : column_state, checkedMap} = this.state
        let reduxrows = [], rows = []
        switch (this.props.kind) {
            case 'students' :
                reduxrows = this.props.userSetup.students;
                rows = this.createTableRows(reduxrows, this.onInputChange, true, row_state, column_state, classNameOfTD, checkedMap)
                break;
            case 'budget' :
                reduxrows = this.props.userSetup.students;
                rows = this.createTableRows(reduxrows, this.onInputChange, true, row_state, column_state, classNameOfTD, checkedMap, this.props.headex, this.props.year)
                break;
            case 'aliases' :
                reduxrows = this.props.userSetup.aliasesList;
                rows = this.createTableRows(reduxrows, this.onInputChange, true, row_state, column_state, classNameOfTD, checkedMap)
                break;
            default :
                break;
        }
        if (this.addNewRowFlag ) {
            reduxrows.push(objblank);
            this.addNewRowFlag = false
        }


        console.log("UniversalTable: RENDER")

        return(
            <div className="mym-universaltable-container">
                <div className="row">
                    <div className="board">
                        {this.props.btncaption.length?<div className="mym-btn-add-lang-alias" onClick={this.onAddNewRow}>{this.props.btncaption}</div>:null}
                        <table id="simple-board" style={{overflowY: "scroll"}}>
                            <thead style={{display: "block"}}>
                                {head}
                            </thead>
                        </table>
                        <div style={{maxHeight: "500px", overflowY: "scroll"}}>
                            <table>
                                <tbody>
                                    {rows}
                                </tbody>
                            </table>
                        </div>
                        {/*<table id="simple-board" style={{display: "block", overflowX: "auto"}}>*/}
                            {/*<thead style={{display: "block"}}>*/}
                                {/*{head}*/}
                            {/*</thead>*/}
                            {/*<tbody style={{overflow: "auto", height: "100px"}}>*/}
                                {/*{rows}*/}
                            {/*</tbody>*/}
                        {/*</table>*/}
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return ({
        onInitState: () => dispatch([]),
        onUserLoggingOut  : token => dispatch(userLoggedOut(token)),
        onStudentUpdate: (data)=> dispatch({type: 'UPDATE_STUDENTS_LOCALLY', payload: data}),
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(UniversalTable)