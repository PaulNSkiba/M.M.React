/**
 * Created by Paul on 04.02.2019.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { userLoggedOut } from '../../actions/userAuthActions'
// import Checkbox from '../CheckBox/checkbox'

import { STUDENTS_UPDATE_URL, instanceAxios } from '../../config/URLs'

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
        }
    }

    componentDidMount() {
        this.setState ( {
            head : this.createTableHead(this.props.head),
            rows : this.createTableRows(this.props.rows, this.onInputChange, true)
        })
    }
    fillMap=()=>{
        let {rows} = this.props
        let map = new Map()
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].isout===1) map.set((i+1)+"#6_1#"+rows[i].id, rows[i].isout===1)
            if (rows[i].isRealName===1) map.set((i+1)+"#7_1#"+rows[i].id, rows[i].isRealName===1)
            }
        return map;
    }
    // width={val.width}
    columnClassName=key=> {
        return "col-" + key;
    }
    createTableHead=(head)=>(
        <tr id="row-1" key={"r0"}>{head.map((val, index)=>
            <th className={this.columnClassName(index)}
                style={{"width" : val.width, "paddingLeft" : "5px", "paddingRight" : "5px"}} key={index}>{val.name}</th>)}</tr>
    )
    onClick(e) {
        console.log("onClick", e.target, e.target.nodeName, e.target.innerHTML, e.target.getAttribute('id2'))
        if (e.target.nodeName === "TD") {
            let row = Number(e.target.id.split('#')[0]),
                column = Number(e.target.id.split('#')[1])
                // id = Number(e.target.id.split('#')[2])

            console.log("table_OnClick", row, column)
            this.setState(
                {
                    row: row,
                    column: column,
                    rows : this.createTableRows(this.props.rows, this.onInputChange, true)
                }
            )
        }
    }
    onBlur(e) {
        console.log("onBlur", e.target, e.target.nodeName, e.target.innerHTML, e.target.getAttribute('id2'), e.target.value);
        // console.log('do validate', e.target, e.target.value, e.target.id);

        let column = Number(e.target.id.split('#')[1]),
            id = Number(e.target.id.split('#')[2]),
            json = "",
            data = "";

        // row = Number(e.target.id.split('#')[0]),
        switch (column) {
            case 2:
                this.props.rows[this.state.row - 1].student_nick = e.target.value
                json = `{"student_nick":"${e.target.value}"}`;
                break;
            case 3:
                this.props.rows[this.state.row - 1].student_name = e.target.value
                json = `{"student_name":"${e.target.value}"}`;
                break;
            case 4:
                this.props.rows[this.state.row - 1].email = e.target.value
                json = `{"email":"${e.target.value}"}`;
                break;
            case 5:
                this.props.rows[this.state.row - 1].memo = e.target.value
                json = `{"memo":"${e.target.value}"}`;
                break;
            default: break;
        }
        if (json) {
            data = JSON.parse(json);
            this.props.onStudentUpdate(this.props.rows)
            instanceAxios().post(STUDENTS_UPDATE_URL + '/' + id, JSON.stringify(data))
                .then(response => {
                    console.log('UPDATE_STUDENTS_REMOTE', response.data)
                    // dispatch({type: 'UPDATE_STUDENTS_REMOTE', payload: response.data})
                })
                .catch(response => {
                    console.log(response);
                    // dispatch({type: 'UPDATE_STUDENTS_FAILED', payload: response.data})
                })
        }
        this.setState({
            row : -1,
            column :-1,
        })

        this.setState({
            rows: this.createTableRows(this.props.rows, this.onInputChange, false)
        })

    }
    onInputKeyPress=(e)=>{
        if (e.key === 'Enter') {
            console.log('do validate', e.target, e.target.value, e.target.id);

            let column = Number(e.target.id.split('#')[1]),
                id = Number(e.target.id.split('#')[2]),
                json = "",
                data = "";

            // row = Number(e.target.id.split('#')[0]),
            switch (column) {
                case 2:
                    this.props.rows[this.state.row - 1].student_nick = e.target.value
                    json = `{"student_nick":"${e.target.value}"}`;
                    break;
                case 3:
                    this.props.rows[this.state.row - 1].student_name = e.target.value
                    json = `{"student_name":"${e.target.value}"}`;
                    break;
                case 4:
                    this.props.rows[this.state.row - 1].email = e.target.value
                    json = `{"email":"${e.target.value}"}`;
                    break;
                case 5:
                    this.props.rows[this.state.row - 1].memo = e.target.value
                    json = `{"memo":"${e.target.value}"}`;
                    break;
                default: break;
            }
            if (json) {
                data = JSON.parse(json);
                this.props.onStudentUpdate(this.props.rows)
                console.log("UPDATE_STUDENTS_REMOTE", JSON.stringify(data));
                instanceAxios().post(STUDENTS_UPDATE_URL + '/' + id, JSON.stringify(data))
                    .then(response => {
                        console.log('UPDATE_STUDENTS_REMOTE', response.data)
                        // dispatch({type: 'UPDATE_STUDENTS_REMOTE', payload: response.data})
                    })
                    .catch(response => {
                        console.log(response);
                        // dispatch({type: 'UPDATE_STUDENTS_FAILED', payload: response.data})
                    })
            }
            this.setState({
            row : -1,
            column :-1,
        })

        this.setState({
                rows: this.createTableRows(this.props.rows, this.onInputChange, false)
            })
        }
    }
    classNameOfTD=(email, verified)=> {
        return email ? (verified ? "left-text verified" : "left-text verification") : "left-text"
    }
    changeState=(e)=>{
        let column = String(e.target.id.split('#')[1]),
            id = Number(e.target.id.split('#')[2]),
            json = "",
            data = "";
        let {checkedMap} = this.state
        checkedMap.has(e.target.id)?checkedMap.delete(e.target.id):checkedMap.set(e.target.id, true)
        this.setState({checkedMap, })
        this.setState ( {
            rows : this.createTableRows(this.props.rows, this.onInputChange, true)
        })
        console.log(e.target.id, checkedMap, column)
        json = `{"${column==="6_1"?"isout":"isRealName"}":"${checkedMap.has(e.target.id)?1:0}"}`;
        console.log("JSON", json)
        if (json) {
            data = JSON.parse(json);
            this.props.onStudentUpdate(this.props.rows)
            instanceAxios().post(STUDENTS_UPDATE_URL + '/' + id, JSON.stringify(data))
                .then(response => {
                    console.log('UPDATE_STUDENTS_REMOTE', response.data)
                    // dispatch({type: 'UPDATE_STUDENTS_REMOTE', payload: response.data})
                })
                .catch(response => {
                    console.log(response);
                    // dispatch({type: 'UPDATE_STUDENTS_FAILED', payload: response.data})
                })
        }
        console.log(json)
    }
    createTableRows(rowsArr, onInputChange, withInput) {
        let{row, column} = this.state
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
        let {head, rows, row, column} = this.state
        console.log("RENDER", row, column)
        return(
            <div className="containertable">
                <div className="row">
                    <div className="col s12 board">
                        <table id="simple-board">
                            <thead className="marktable">
                            {head}
                            </thead>
                            <tbody>
                            {rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}
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
        onUserLoggingOut  : token => dispatch(userLoggedOut(token)),
        onStudentUpdate: (data)=> dispatch({type: 'UPDATE_STUDENTS_LOCALLY', payload: data})
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(UniversalTable)