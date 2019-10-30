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
            rows : [],
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
        let reduxrows = []
        console.log("HEAD", this.props.head)
        switch (this.props.kind) {
            case 'students' :
                reduxrows = this.props.userSetup.students;
                break;
            case 'budget' :
                reduxrows = this.props.userSetup.students;
                break;
            case 'aliases' :
                reduxrows = this.props.userSetup.aliasesList;
                break;
            case 'budgetpaysin' :
                reduxrows = this.props.userSetup.budgetpays.filter(item=>item.debet===1);
                break;
            case 'budgetpaysout' :
                reduxrows = this.props.userSetup.budgetpays.filter(item=>item.debet===null);
                break;
            default :
                break;
        }
        this.setState ( {
            head : this.createTableHead(this.props.head),
            rows : this.createTableRows(this.props.initrows(reduxrows), this.onInputChange, true, row_state, column_state, classNameOfTD, checkedMap)
        })
        this.scrollToBottom();
    }
    componentDidUpdate() {
        this.scrollToBottom();
    }

    componentWillReceiveProps(props) {

        const { year, head, render, initrows, rows } = this.props;
        console.log("componentWillReceiveProps", props.rows.length, rows.length)
        if (!(this.props.kind === "aliases")) {

            if (props.year !== year || props.head.lenght !== head.length || props.render !== render || props.rows.length !== rows.length) {

                const {classNameOfTD} = this.props
                const {arrRows: rows, row: row_state, column: column_state, checkedMap} = this.state

                console.log("componentWillReceiveProps:HEAD3", props.rows.length, rows.length, props.head.lenght, head.length, props.render, render)
                this.setState({
                    head: this.createTableHead(this.props.head),
                    rows: this.createTableRows(this.props.initrows(this.props.userSetup.aliasesLang), this.onInputChange, true, row_state, column_state, classNameOfTD, checkedMap)
                })
            }
        }
        else {
            // console.log("HEAD3", props.rows.length, rows.length, rows === undefined, rows)
            if ( (props.rows.length !== rows.length) || rows === undefined) {

                const {classNameOfTD} = this.props
                const {arrRows: rows, row: row_state, column: column_state, checkedMap} = this.state

                console.log("componentWillReceiveProps:HEAD4", props.rows.length, rows.length, props.head.lenght, head.length, props.render, render)
                this.setState({
                    head: this.createTableHead(this.props.head),
                    rows: this.createTableRows(this.props.initrows(this.props.userSetup.aliasesLang), this.onInputChange, true, row_state, column_state, classNameOfTD, checkedMap)
                })
            }
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
        console.log("updateSource", column, id, value, key)
        const {classNameOfTD} = this.props
        const {arrRows : rows, row : row_state, column : column_state, checkedMap} = this.state
        let url, uniqid, arr, newarr
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
                url = ''
                uniqid = new Date().getTime() + this.props.userSetup.userName
                arr = this.props.userSetup.aliasesList
                newarr = arr.map(item=>{
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
                            console.log('ALIASES_LIST', newarr)
                            this.props.onReduxUpdate('ALIASES_LIST', newarr)
                            this.setState({ row : -1, column :-1, rows: this.createTableRows(newarr, this.onInputChange, isCheckBox, row_state, column_state, classNameOfTD, checkedMap)})

                            //console.log('UPDATE_ALIAS_REMOTE', response.data)
                        })
                        .catch(response => {
                            console.log(response);
                        })
                }
                break;
            case "budgetpaysin" :
                url = `${AUTH_URL}/api/budgetpays/update/${id}`
                uniqid = new Date().getTime() + this.props.userSetup.userName
                arr = this.props.userSetup.budgetpays
                newarr = arr.map(item=>{
                    if (item.id === id) {
                        item.uniqid = uniqid;
                    }
                    return item
                })
                switch (column) {
                    case 2 :
                        // Наименование
                        json = `{"name":"${value}", "debet":1, "user_id":${this.props.userSetup.userID},"class_id":${this.props.userSetup.classID},"uniqid":"${uniqid}"}`;
                        break;
                    case 3 :
                        // Короткое
                        json = `{"short":"${value}", "debet":1, "user_id":${this.props.userSetup.userID},"class_id":${this.props.userSetup.classID},"uniqid":"${uniqid}"}`;
                        break;
                    case 4 :
                        // Сумма
                        json = `{"sum":${value}, "debet":1, "user_id":${this.props.userSetup.userID},"class_id":${this.props.userSetup.classID},"uniqid":"${uniqid}"}`;
                        break;
                    case 5 :
                        // Регулярный
                        json = `{"isregular":${value}, "debet":1, "user_id":${this.props.userSetup.userID},"class_id":${this.props.userSetup.classID},"uniqid":"${uniqid}"}`;
                        break;
                    case 6 :
                        // Дата оплаты
                        json = `{"paydate":"${value}", "debet":1, "user_id":${this.props.userSetup.userID},"class_id":${this.props.userSetup.classID},"uniqid":"${uniqid}"}`;
                        break;
                    case 7 :
                        // Дата окончания оплаты
                        json = `{"payend":"${toYYYYMMDD(new Date(value))}", "debet":1, "user_id":${this.props.userSetup.userID},"class_id":${this.props.userSetup.classID},"uniqid":"${uniqid}"}`;
                        break;
                    case 8 :
                        // День месяца
                        json = `{"monthday":${toYYYYMMDD(new Date(value))}, "debet":1, "user_id":${this.props.userSetup.userID},"class_id":${this.props.userSetup.classID},"uniqid":"${uniqid}"}`;
                        break;
                    case 9 :
                        // День месяца
                        json = `{"issaldo":${value}, "debet":1, "user_id":${this.props.userSetup.userID},"class_id":${this.props.userSetup.classID},"uniqid":"${uniqid}"}`;
                        break;
                    default :
                        break;
                }
                if (json) {
                    data = JSON.parse(json);
                    // console.log("UPDATE_URL", url, json)
                    instanceAxios().post(url, JSON.stringify(data))
                        .then(response => {
                            // arr = this.props.userSetup.aliasesList
                            // console.log("RESPONSE", response.data)
                            newarr = arr.map(item=>{
                                if (item.uniqid === response.data.uniqid) {
                                   item = response.data
                                }
                                return item
                            })
                            console.log('BUDGETPAYS_UPDATE', newarr)
                            this.props.onReduxUpdate('BUDGETPAYS_UPDATE', newarr)
                            this.setState({ row : -1, column :-1, rows: this.createTableRows(newarr, this.onInputChange, isCheckBox, row_state, column_state, classNameOfTD, checkedMap)})

                        })
                        .catch(response => {
                            console.log(response);
                        })
                }
                break;
            case "budgetpaysout" :
                url =  `${AUTH_URL}/api/budgetpays/update/${id}`
                uniqid = new Date().getTime() + this.props.userSetup.userName
                arr = this.props.userSetup.budgetpays
                newarr = arr.map(item=>{
                    if (item.id === id) {
                        item.uniqid = uniqid;
                    }
                    return item
                })
                switch (column) {
                    case 2 :
                        // Наименование
                        json = `{"name":"${value}", "debet":null, "user_id":${this.props.userSetup.userID},"class_id":${this.props.userSetup.classID},"uniqid":"${uniqid}"}`;
                        break;
                    case 3 :
                        // Короткое
                        json = `{"short":"${value}", "debet":null, "user_id":${this.props.userSetup.userID},"class_id":${this.props.userSetup.classID},"uniqid":"${uniqid}"}`;
                        break;
                    case 4 :
                        // Сумма
                        json = `{"sum":${value}, "debet":null, "user_id":${this.props.userSetup.userID},"class_id":${this.props.userSetup.classID},"uniqid":"${uniqid}"}`;
                        break;
                    case 5 :
                        // Регулярный
                        json = `{"isregular":${value}, "debet":null, "user_id":${this.props.userSetup.userID},"class_id":${this.props.userSetup.classID},"uniqid":"${uniqid}"}`;
                        break;
                    case 6 :
                        // Дата оплаты
                        json = `{"paydate":"${toYYYYMMDD(new Date(value))}", "debet":null, "user_id":${this.props.userSetup.userID},"class_id":${this.props.userSetup.classID},"uniqid":"${uniqid}"}`;
                        break;
                    case 7 :
                        // Дата окончания оплаты
                        json = `{"payend":"${toYYYYMMDD(new Date(value))}", "debet":null, "user_id":${this.props.userSetup.userID},"class_id":${this.props.userSetup.classID},"uniqid":"${uniqid}"}`;
                        break;
                    case 8 :
                        // День месяца
                        json = `{"monthday":${value}, "debet":null, "user_id":${this.props.userSetup.userID},"class_id":${this.props.userSetup.classID},"uniqid":"${uniqid}"}`;
                        break;
                    case 9 :
                    //     // День месяца
                        json = `{"issaldo":${value}, "debet":null, "user_id":${this.props.userSetup.userID},"class_id":${this.props.userSetup.classID},"uniqid":"${uniqid}"}`;
                        break;
                    default :
                        break;
                }
                if (json) {
                    data = JSON.parse(json);
                    console.log("UPDATE_URL", url, json)
                    instanceAxios().post(url, JSON.stringify(data))
                        .then(response => {
                            // arr = this.props.userSetup.aliasesList
                            console.log("RESPONSE", response.data)
                            newarr = arr.map(item=>{
                                if (item.uniqid === response.data.uniqid) {
                                    item = response.data
                                }
                                return item
                            })
                            console.log('BUDGETPAYS_UPDATE', newarr)
                            this.props.onReduxUpdate('BUDGETPAYS_UPDATE', newarr)
                            this.setState({ row : -1, column :-1, rows: this.createTableRows(newarr, this.onInputChange, isCheckBox, row_state, column_state, classNameOfTD, checkedMap)})

                        })
                        .catch(response => {
                            console.log(response);
                        })
                }
                break;
            default:

                break;
        }
     }
    onClick(e) {
        const {classNameOfTD} = this.props
        const {arrRows : rows, row : row_state, column : column_state, checkedMap} = this.state

        console.log("onClick.1", this.state.arrRows, this.state.rows, row_state, column_state)

        if (e.target.nodeName === "TD") {
            let row = Number(e.target.id.split('#')[0]),
                column = Number(e.target.id.split('#')[1])

            console.log("onClick.2", row, column)
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
    }
    onBlur(e) {
        const {classNameOfTD} = this.props
        const {arrRows : rows, row : row_state, column : column_state, checkedMap} = this.state

        console.log("onBlur", e.target, e.target.nodeName, e.target.innerHTML, e.target.getAttribute('id2'), e.target.value)
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
        console.log('onInputKeyPress', e.target, e.target.id, e.target.value);
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
    onAddNewRow=(objblank)=>{
        const {classNameOfTD} = this.props
        const {arrRows, row : row_state, column : column_state, checkedMap} = this.state
        // let arr = arrRows;
        console.log("onAddNewRow", objblank)
        let arr = [], rows = []
        switch (this.props.kind) {
            case 'students' :
                arr = this.props.userSetup.students;
                arr.push(objblank);
                rows = this.createTableRows(arr, this.onInputChange, true, row_state, column_state, classNameOfTD, checkedMap)
                break;
            case 'budget' :
                arr = this.props.userSetup.budget;
                // arr = arr.filter(item=>item.id!==0)
                arr.push(objblank);
                rows = this.createTableRows(arr, this.onInputChange, true, row_state, column_state, classNameOfTD, checkedMap, this.props.headex, this.props.year)
                break;
            case 'aliases' :
                arr = this.props.userSetup.aliasesList;
                // arr = arr.filter(item=>item.id!==0)
                arr.push(objblank);
                this.props.onReduxUpdate("ALIASES_LIST", arr)
                rows = this.createTableRows(arr, this.onInputChange, true, row_state, column_state, classNameOfTD, checkedMap)
                break;
            case 'budgetpaysin' :
                // console.log('budgetpaysin', objblank)
                arr = this.props.userSetup.budgetpays;
                arr.push(objblank);
                this.props.onReduxUpdate("BUDGETPAYS_UPDATE", arr)
                arr = this.props.userSetup.budgetpays.filter(item=>item.debet===1);
                arr.push(objblank);
                rows = this.createTableRows(arr, this.onInputChange, true, row_state, column_state, classNameOfTD, checkedMap)
                break;
            case 'budgetpaysout' :
                arr = this.props.userSetup.budgetpays;
                arr.push(objblank);
                this.props.onReduxUpdate("BUDGETPAYS_UPDATE", arr)
                arr = this.props.userSetup.budgetpays.filter(item=>item.debet===null);
                arr.push(objblank);
                rows = this.createTableRows(arr, this.onInputChange, true, row_state, column_state, classNameOfTD, checkedMap)
                break;
            default :
                break;
        }

        console.log("onAddNewRow", objblank)
        // arr.push(objblank);
        this.addNewRowFlag = true
        // this.forceUpdate()
        this.setState({
                            arrRows : arr,
                            rows
                            // addNew : true,
                            // rows : this.createTableRows(arr, this.onInputChange, true, row_state, column_state, classNameOfTD, checkedMap)
                        })
        // // alert('addAlias')
    }
    handleDate = (type, id, date) => {
        console.log(type, id, date)
        let url, json
        // let arr = this.state.planIns;
        switch (type) {
            case 'start':
                switch (this.props.kind) {
                    case 'budgetpaysin' :
                        url = AUTH_URL + `/api/budgetpays/update/${id}`
                        json = `{"paydate":"${toYYYYMMDD(date)}", "id":${id}}`;
                        break;
                    case 'budgetpaysout' :
                        url = AUTH_URL + `/api/budgetpays/update/${id}`
                        json = `{"paydate":"${toYYYYMMDD(date)}", "id":${id}}`;
                        break;
                    default :
                        break;
                }
                break;
            case 'end':
                switch (this.props.kind) {
                    case 'budgetpaysin' :
                        url = AUTH_URL + `/api/budgetpays/update/${id}`
                        json = `{"payend":"${toYYYYMMDD(date)}", "id":${id}}`;
                        break;
                    case 'budgetpaysout' :
                        url = AUTH_URL + `/api/budgetpays/update/${id}`
                        json = `{"payend":"${toYYYYMMDD(date)}", "id":${id}}`;
                        break;
                    default :
                        break;
                }
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
        let arr = []
        console.log(json)
        instanceAxios().post(url, json)
            .then(response => {
                // arr = this.props.userSetup.aliasesList
                console.log("RESPONSE", response.data)
                switch (type) {
                    case 'datein' :
                        arr = this.props.userSetup.students.map(item => {
                            if (item.id === id) item.datein = toYYYYMMDD(date)
                            return item
                        });
                        console.log("onStudentUpdate", arr)
                        this.props.onStudentUpdate(arr)
                    break;
                    case 'start' :
                        arr = this.props.userSetup.budgetpays.map(item => {
                            if (item.id === id) item.paydate = toYYYYMMDD(date)
                            return item
                        });
                        // console.log("onStudentUpdate", arr)
                        this.props.onReduxUpdate("BUDGETPAYS_UPDATE", arr)
                        break;
                    case 'end' :
                        arr = this.props.userSetup.budgetpays.map(item => {
                            if (item.id === id) item.payend = toYYYYMMDD(date)
                            return item
                        });
                        // console.log("onStudentUpdate", arr)
                        this.props.onReduxUpdate("BUDGETPAYS_UPDATE", arr)
                        break;
                    default :
                        break;
                }
                //console.log('UPDATE_ALIAS_REMOTE', response.data)
            })
            .catch(response => {
                console.log(response);
            })
        }
    };
    onSelectDateClick=()=>{

    }
    scrollToBottom() {
        const scrollHeight = this.tablerows.scrollHeight;
        const height = this.tablerows.clientHeight;
        const maxScrollTop = scrollHeight - height;
        this.tablerows.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }

    render(){
        // let {head, row, column} = this.state
        const {classNameOfTD, objblank} = this.props
        const {head, row : row_state, column : column_state, checkedMap} = this.state
        let reduxrows = [], rows = []
        switch (this.props.kind) {
            case 'students' :
                reduxrows = this.props.userSetup.students;
                if (this.addNewRowFlag ) {
                    reduxrows.push(objblank);
                    this.addNewRowFlag = false
                }
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
            case 'budgetpaysin' :
                reduxrows = this.props.userSetup.budgetpays.filter(item=>item.debet===1);
                if (this.addNewRowFlag ) {
                    reduxrows.push(objblank);
                    this.addNewRowFlag = false
                }
                rows = this.createTableRows(reduxrows, this.onInputChange, true, row_state, column_state, classNameOfTD, checkedMap)
                break;
            case 'budgetpaysout' :
                reduxrows = this.props.userSetup.budgetpays.filter(item=>item.debet===null);
                if (this.addNewRowFlag ) {
                    reduxrows.push(objblank);
                    this.addNewRowFlag = false
                }
                rows = this.createTableRows(reduxrows, this.onInputChange, true, row_state, column_state, classNameOfTD, checkedMap)
                break;
            default :
                break;
        }
        // console.log("UniversalTable: RENDER", this.addNewRowFlag, reduxrows, rows)

        return(
            <div className="mym-universaltable-container" height={this.props.height}>
                <div className="row">
                    <div className="board">
                        {this.props.btncaption.length?<div className="mym-btn-add-lang-alias" onClick={()=>this.onAddNewRow(this.props.objblank)}>{this.props.btncaption}</div>:null}
                        <table id="simple-board" style={{overflowY: "scroll"}}>
                            <thead style={{display: "block"}}>
                                {head}
                            </thead>
                        </table>
                         <div  ref={(div) => { this.tablerows = div; }} style={{maxHeight: "500px", overflowY: "scroll"}}>
                            <table>
                                <tbody>
                                    {rows}
                                </tbody>
                            </table>
                        </div>
                        {/*{window.scroll(0, window.pageYOffset - this.props.scrollStepInPx)}*/}
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