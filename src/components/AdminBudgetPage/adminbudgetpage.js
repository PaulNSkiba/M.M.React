/**
 * Created by Paul on 18.10.2019.
 */

import React, {Component} from 'react'
import { addDay, arrOfWeekDays, dateDiff, toYYYYMMDD, instanceAxios, addMonths, dateFromYYYYMMDD, mapStateToProps, getLangByCountry, axios2} from '../../js/helpers'
// import Menu from '../Menu/menu'
import MenuEx from '../MenuEx/menuex'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {userLoggedInByToken, userLoggedOut} from '../../actions/userAuthActions'
import {Link} from 'react-router-dom';
import MobileMenu from '../MobileMenu/mobilemenu'
import LoginBlockLight from '../LoginBlockLight/loginblocklight'
import edit_icon from '../../img/Edit-512s.png'
import {defLang, arrLangs, API_URL} from '../../config/config'
import '../../containers/App.css'
import './adminbudgetpage.css'
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import Logo from '../../img/LogoMyMsmall.png'
// import ReactPlayer from 'react-player'
import DatePicker from "react-datepicker";
import {registerLocale, setDefaultLocale} from  "react-datepicker";
import {ru} from 'date-fns/locale';
import UniversalTable from '../UniversalTable/universaltable'
import AddSubject from '../AddSubject/addsubject'
import Tabs from 'react-responsive-tabs';
import 'react-responsive-tabs/styles.css';

import "react-datepicker/dist/react-datepicker.css";

const ExampleCustomInput = ({value, onClick}) => (
    <button className="example-custom-input" onClick={onClick}>
        {value}
    </button>
);

class AdminBudgetPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            planIns: [],
            factIns: [],
            planOuts: [],
            factOuts: [],
            rowArray: this.props.userSetup.students,
            isMobile: this.props.userSetup.isMobile,
            factInsHeader: [],
            factInsHeaderEx: [],
            curYear: (new Date().getFullYear()),
            renderRows: 1,
            curInRow: null,
            curInColumn: null,
            curOutRow: null,
            curOutColumn: null,
            row: -1,
            column: -1,
        }
        this.headArray = [
            {name: "№ п/п", width: "20px"},
            {name: "Имя", width: "300px"},
            {name: "Нач. учёбы", width: "70px"},
        ]
        this.headInArray = [
            {name: "№ п/п", width: "20px"},
            {name: "ВЗНОС", width: "200px"},
            {name: "Сокр", width: "50px"},
            {name: "Сумма", width: "50px"},
            {name: "Регул- ный (раз в месяц)", width: "40px"},
            {name: "Дата оплаты", width: "80px"},
            {name: "Дата оконч-я оплаты", width: "80px"},
            {name: "День месяца (для регул-х)", width: "50px"},
            {name: "Нач. сальдо", width: "40px"},
            {name: "-", width: "20px"},
        ]
        this.headOutArray = [
            {name: "№ п/п", width: "20px"},
            {name: "РАСХОД", width: "200px"},
            {name: "Сокр", width: "50px"},
            {name: "Сумма", width: "50px"},
            {name: "Регул- ный (раз в месяц)", width: "40px"},
            {name: "Дата оплаты", width: "80px"},
            {name: "Дата оконч-я оплаты", width: "80px"},
            {name: "День месяца (для регул-х)", width: "50px"},
            {name: "Нач. сальдо", width: "40px"},
            {name: "-", width: "20px"},
        ]
        this.tabs = [{ name: 'Взносы', memo: 'Взносы', id : 0 },
            { name: 'Расходы класса', memo: 'Расходы класса', id : 1 },
            { name: 'Взносы фактические', memo: 'Взносы фактические', id : 2 },
        ];
        this.onClick = this.onClick.bind(this)
    }

    initData() {
        instanceAxios().get(`${API_URL}budgetpays/get/${this.props.userSetup.classID}`)
            .then(res => {

                    const planIns = res.data.filter(item => item.debet === 1)
                    const planOuts = res.data.filter(item => item.debet !== 1)
                    // console.log("getpays", res, planIns, planOuts)
                    this.setState({
                        planIns,
                        planOuts,
                        factInsHeader: this.prepPaymentsHeaderAndRowArray(planIns, this.state.curYear)
                    })
                    this.props.onReduxUpdate("BUDGETPAYS_UPDATE", res.data)
                    console.log("getbudgetpays", res)
                }
            )
            .catch(res => {
                console.log("getpaysError", res)
            })
        instanceAxios().get(`${API_URL}budget/get/${this.props.userSetup.classID}`)
            .then(res => {
                    this.setState({
                        factIns: res.data
                    })
                    this.props.onReduxUpdate("BUDGET_UPDATE", res.data)
                    console.log("getbudget", res)
                }
            )
            .catch(res => {
                console.log("getbudgetError", res)
            })
    }

    componentWillMount() {
        this.initData()
    }

    onClick = (e) => {
        // console.log(e.target.id)
    }
    changeState = (e, id, number) => {
        console.log(e.target.value, id, number)
        let arr = this.state.planIns;
        switch (number) {
            case 4:
                arr = arr.map(item => {
                    if (item.id === id) {
                        item.regular = !item.regular
                    }
                    return item
                })
                break;
            case 8:
                arr = arr.map(item => {
                    if (item.id === id) {
                        item.income = !item.income
                    }
                    return item
                })
                break;
            default :
                break;
        }
        console.log("changeState", id, arr)
        this.setState({planIns: arr})

    }
    handleDate = (type, id, date) => {
        console.log(type, id, date)
        let arr = this.state.planIns;
        switch (type) {
            case 'start':
                arr = arr.map(item => {
                    if (item.id === id) {
                        item.start = toYYYYMMDD(date)
                    }
                    return item
                })
                break;
            case 'end':
                arr = arr.map(item => {
                    if (item.id === id) {
                        item.end = toYYYYMMDD(date)
                    }
                    return item
                })
                break;
            case 'datein':
                console.log("datein")
                arr = arr.map(item => {
                    if (item.id === id) {
                        // item.end = toYYYYMMDD(date)
                    }
                    return item
                })
                break;
            default :
                break;
        }
        this.setState({planIns: arr})
    };
    classNameOfTD = (email, verified) => {
        return email ? (verified ? "left-text verified" : "left-text verification") : "left-text"
    }
    onDayOfPaymentClick = e => {

    }

    createInTableRows(rowsArr, onInputChange, withInput, row, column, classNameOfTD, checkedMap, headex, year) {
        let cell = [],
            rows = []
        const daysArr = (() => {
            let arr = [];
            for (let i = 1; i < 32; i++) {
                arr.push(i)
            }
            return arr
        })()
        // console.log("createInTableRows", rowsArr, checkedMap)
        rowsArr = this.props.userSetup.budgetpays.filter(item => item.debet === 1)
        let key, item
        if (rowsArr) {
            for (let i = 0; i < rowsArr.length; i++) {
                cell = []
                key = i
                item = rowsArr[i]
                cell.push(<td key={"bbr" + (i + 1) + "c1"} style={{
                    width: "20px",
                    padding: "2px",
                    textAlign: "center",
                    fontSize: "0.8em"
                }}>{i + 1}</td>)
                cell.push(<td key={"bbr" + (i + 1) + "c2"} style={{width: "200px", padding: "2px", fontSize: "0.8em"}}
                    // onClick={()=>this.setState({curInRow : key + 1, curInColumn : 2})}
                              id={(i + 1) + "#2#" + rowsArr[i].id}
                              onClick={this.onClick}
                >
                    {item.name}
                    {(row === (i + 1) && column === 2) ?
                        <input type="text" id={(i + 1) + "#2#" + item.id} className="inputEditor"
                               onChange={e => this.onInputChange(e.target.value, item.id)}
                               onKeyPress={this.onInputKeyPress}
                               onBlur={this.onBlur}
                               defaultValue={item.name}/> : ""}
                </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c3"}
                              style={{width: "50px", padding: "2px", textAlign: "center", fontSize: "0.8em"}}
                              id={(i + 1) + "#3#" + rowsArr[i].id}
                              onClick={this.onClick}>
                    {item.short}
                    {(row === (i + 1) && column === 3) ?
                        <input type="text" id={(i + 1) + "#3#" + item.id} className="inputEditor"
                               onChange={e => this.onInputChange(e.target.value, item.id)}
                               onKeyPress={this.onInputKeyPress}
                               onBlur={this.onBlur}
                               defaultValue={item.short}/> : ""}</td>)
                cell.push(<td key={"bbr" + (i + 1) + "c4"}
                              style={{width: "50px", padding: "2px", textAlign: "center", fontSize: "0.8em"}}
                              id={(i + 1) + "#4#" + rowsArr[i].id}
                              onClick={this.onClick}>
                    {item.sum}
                    {(row === (i + 1) && column === 4) ?
                        <input type="text" id={(i + 1) + "#4#" + item.id} className="inputEditor"
                               onChange={e => this.onInputChange(e.target.value, item.id)}
                               onKeyPress={this.onInputKeyPress}
                               onBlur={this.onBlur}
                               defaultValue={item.sum}/> : ""}
                </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c5"} style={{width: "40px", padding: "2px", textAlign: "center"}}>
                    <input type="checkbox" onChange={(e) => {
                        console.log(e.target.value);
                        this.changeState(e, item.id, 5)
                    }} id={(i + 1) + "#5#" + rowsArr[i].id} checked={checkedMap.has((i + 1) + "#5#" + rowsArr[i].id)}/>
                </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c6"}
                              style={{width: "80px", padding: "2px", textAlign: "center", fontSize: "0.9em"}}>
                    <DatePicker
                        // showMonthYearDropdown
                        isClearable
                        fixedHeight
                        dateFormat="dd/MM/yy"
                        withPortal
                        locale="ru"
                        selected={rowsArr[i].paydate === null ? null : rowsArr[i].paydate.length === 8 ? dateFromYYYYMMDD(rowsArr[i].paydate) : new Date(rowsArr[i].paydate)}
                        onChange={date => this.handleDate('start', rowsArr[i].id, date)}
                        customInput={<input style={{
                            width: "70px",
                            textAlign: "left",
                            backgroundColor: "#7DA8E6",
                            color: "#fff", fontSize: "0.9em"
                        }}/>}
                    />
                </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c7"}
                              style={{width: "80px", padding: "2px", textAlign: "center", fontSize: "0.9em"}}>
                    <DatePicker
                        // showMonthYearDropdown
                        isClearable
                        fixedHeight
                        dateFormat="dd/MM/yy"
                        withPortal
                        locale="ru"
                        selected={rowsArr[i].payend === null ? null : rowsArr[i].payend.length === 8 ? dateFromYYYYMMDD(rowsArr[i].payend) : new Date(rowsArr[i].payend)}
                        onChange={date => this.handleDate('end', rowsArr[i].id, date)}
                        customInput={<input style={{
                            width: "70px",
                            textAlign: "left",
                            backgroundColor: "#7DA8E6",
                            color: "#fff", fontSize: "0.9em"
                        }}/>}
                    />
                </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c8"} style={{width: "50px", padding: "2px", textAlign: "center"}}>
                    <select name="days" onClick={this.onLangClick} defaultValue={item.dayOfPayment}>
                        {daysArr.map((item, key) => {
                            return <option key={key}>
                                {item}
                            </option>
                        })}
                    </select>
                </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c9"} style={{width: "40px", padding: "2px", textAlign: "center"}}>
                    <input type="checkbox" onChange={(e) => {
                        console.log(e.target.value);
                        this.changeState(e, item.id, 9)
                    }} id={(i + 1) + "#9#" + rowsArr[i].id} checked={checkedMap.has((i + 1) + "#9#" + rowsArr[i].id)}/>
                </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c10"}
                              style={{width: "20px", padding: "2px", textAlign: "center"}}>
                    <button onClick={() => {
                        this.onDelClick(rowsArr[i].id)
                    }}>-
                    </button>
                </td>)
                rows.push(<tr style={{backgroundColor: rowsArr[i].id === 0 ? "rgba(64, 155, 230, 0.25)" : "#fff"}}
                              key={i}>{cell}</tr>)
            }
        }
        // console.log("rows", rows)
        return rows;
    }

    createOutTableRows(rowsArr, onInputChange, withInput, row, column, classNameOfTD, checkedMap, headex, year) {
        let cell = [],
            rows = []
        const daysArr = (() => {
            let arr = [];
            for (let i = 1; i < 32; i++) {
                arr.push(i)
            }
            return arr
        })()
        rowsArr = this.props.userSetup.budgetpays.filter(item => item.debet === null)
        // console.log("createOutTableRows", rowsArr, checkedMap)
        let item
        if (rowsArr) {
            for (let i = 0; i < rowsArr.length; i++) {
                // console.log("OutTable", rowsArr[i].paydate, rowsArr[i].payend)
                cell = []
                item = rowsArr[i]
                cell.push(<td key={"bbr" + (i + 1) + "c1"} style={{
                    width: "20px",
                    padding: "2px",
                    textAlign: "center",
                    fontSize: "0.8em"
                }}>{i + 1}</td>)
                cell.push(<td key={"bbr" + (i + 1) + "c2"}
                              style={{width: "200px", padding: "2px", fontSize: "0.8em"}}
                    // onClick={()=>this.setState({curInRow : key + 1, curInColumn : 2})}
                              id={(i + 1) + "#2#" + rowsArr[i].id}
                              onClick={this.onClick}>
                    {checkedMap.has((i + 1) + "#9#" + rowsArr[i].id) ? <div className={"plusSaldo"}>V</div> : null}
                    {item.name}
                    {(row === (i + 1) && column === 2) ?
                        <input type="text" id={(i + 1) + "#2#" + item.id} className="inputEditor"
                               onChange={e => this.onInputChange(e.target.value, item.id)}
                               onKeyPress={this.onInputKeyPress}
                               onBlur={this.onBlur}
                               defaultValue={item.name}/> : ""}
                </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c3"}
                              style={{width: "50px", padding: "2px", textAlign: "center", fontSize: "0.8em"}}
                              id={(i + 1) + "#3#" + rowsArr[i].id}
                              onClick={this.onClick}>
                    {item.short}
                    {(row === (i + 1) && column === 3) ?
                        <input type="text" id={(i + 1) + "#3#" + item.id} className="inputEditor"
                               onChange={e => this.onInputChange(e.target.value, item.id)}
                               onKeyPress={this.onInputKeyPress}
                               onBlur={this.onBlur}
                               defaultValue={item.short}/> : ""}
                </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c4"}
                              style={{width: "50px", padding: "2px", textAlign: "center", fontSize: "0.8em"}}
                              id={(i + 1) + "#4#" + rowsArr[i].id}
                              onClick={this.onClick}>
                    {item.sum}
                    {(row === (i + 1) && column === 4) ?
                        <input type="text" id={(i + 1) + "#4#" + item.id} className="inputEditor"
                               onChange={e => this.onInputChange(e.target.value, item.id)}
                               onKeyPress={this.onInputKeyPress}
                               onBlur={this.onBlur}
                               defaultValue={item.sum}/> : ""}
                </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c5"} style={{width: "40px", padding: "2px", textAlign: "center"}}>
                    <input type="checkbox" onChange={(e) => {
                        console.log(e.target.value);
                        this.changeState(e, item.id, 5)
                    }} id={(i + 1) + "#5#" + item.id} checked={checkedMap.has((i + 1) + "#5#" + rowsArr[i].id)}/>
                </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c6"}
                              style={{width: "80px", padding: "2px", textAlign: "center", fontSize: "0.9em"}}>
                    <DatePicker
                        // showMonthYearDropdown
                        isClearable
                        fixedHeight
                        dateFormat="dd/MM/yy"
                        withPortal
                        locale="ru"
                        selected={rowsArr[i].paydate === null ? null : rowsArr[i].paydate.length === 8 ? dateFromYYYYMMDD(rowsArr[i].paydate) : new Date(rowsArr[i].paydate)}
                        onChange={date => this.handleDate('start', rowsArr[i].id, date)}
                        customInput={<input style={{
                            width: "70px",
                            textAlign: "left",
                            backgroundColor: "#7DA8E6",
                            color: "#fff", fontSize: "0.9em"
                        }}/>}
                    />
                </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c7"}
                              style={{width: "80px", padding: "2px", textAlign: "center", fontSize: "0.9em"}}>
                    <DatePicker
                        // showMonthYearDropdown
                        isClearable
                        fixedHeight
                        dateFormat="dd/MM/yy"
                        withPortal
                        locale="ru"
                        selected={rowsArr[i].payend === null ? null : rowsArr[i].payend.length === 8 ? dateFromYYYYMMDD(rowsArr[i].payend) : new Date(rowsArr[i].payend)}
                        onChange={date => this.handleDate('end', rowsArr[i].id, date)}
                        customInput={<input style={{
                            width: "70px",
                            textAlign: "left",
                            backgroundColor: "#7DA8E6",
                            color: "#fff", fontSize: "0.9em"
                        }}/>}
                    />
                </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c8"} style={{width: "50px", padding: "2px", textAlign: "center"}}>
                    <select name="days" onClick={this.onSelectDateClick} defaultValue={item.dayOfPayment}>
                        {daysArr.map((item, key) => {
                            return <option key={key}>
                                {item}
                            </option>
                        })}
                    </select>
                </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c9"} style={{width: "40px", padding: "2px", textAlign: "center"}}>
                    <input type="checkbox" onChange={(e) => {
                        console.log(e.target.value);
                        this.changeState(e, item.id, 9)
                    }} id={(i + 1) + "#9#" + rowsArr[i].id} checked={checkedMap.has((i + 1) + "#9#" + rowsArr[i].id)}/>
                </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c10"}
                              style={{width: "20px", padding: "2px", textAlign: "center"}}>
                    <button onClick={() => {
                        this.onDelClick(rowsArr[i].id)
                    }}>-
                    </button>
                </td>)
                rows.push(<tr style={{backgroundColor: rowsArr[i].id === 0 ? "rgba(64, 155, 230, 0.25)" : "#fff"}}
                              key={i}>{cell}</tr>)
            }
        }
        // console.log("rows", rows)
        return rows;
    }

    createTableRows(rowsArr, onInputChange, withInput, row, column, classNameOfTD, checkedMap, headex, year) {
        let cell = [],
            rows = []
        rowsArr = rowsArr.filter(item => item.isout !== 1)
        console.log("createTableRows", this.state.row, this.state.column)
        if (rowsArr) {
            for (let i = 0; i < rowsArr.length; i++) {
                cell = []
                cell.push(<td style={{width: "25px", fontSize: "0.8em"}} key={"bbr" + (i + 1) + "c1"}>{i + 1}</td>)
                cell.push(<td className="left-text"
                              style={{width: "300px", paddingLeft: "2px", paddingRight: "2px", fontSize: "0.9em"}}
                              id={(i + 1) + "#2#" + rowsArr[i].id} key={"bbr" + (i + 1) + "c2"}>
                    {rowsArr[i].student_name} {(row === (i + 1) && column === 2 && withInput) ? rowsArr[i].student_name : null}
                </td>)
                // console.log("datein", rowsArr[i], i, (rowsArr[i].datein===null)?null:((rowsArr[i].datein.length===8)?dateFromYYYYMMDD(rowsArr[i].datein):(new Date(rowsArr[i].datein))))
                cell.push(
                    <td key={"bbr" + (i + 1) + "c3"} style={{width: "70px", textAlign: "center", fontSize: "0.9em"}}>
                        <DatePicker
                            // showMonthYearDropdown
                            isClearable
                            fixedHeight
                            dateFormat="dd/MM/yy"
                            withPortal
                            locale="ru"
                            scrollableYearDropdown
                            showYearDropdown
                            selected={rowsArr[i].datein === null ? null : ((rowsArr[i].datein.length === 8) ? dateFromYYYYMMDD(rowsArr[i].datein) : (new Date(rowsArr[i].datein)))}
                            onChange={date => this.handleDate('datein', rowsArr[i].id, date)}
                            customInput={<input style={{
                                width: "70px",
                                textAlign: "center",
                                backgroundColor: "#7DA8E6",
                                color: "#fff", fontSize: "0.9em"
                            }}/>}
                        />
                    </td>)

                if (headex !== undefined)
                    for (let j = 0; j < headex.length; j++) {
                        let curSum = null, id = 0, factSum = null
                        if (this.props.userSetup.budget !== undefined && this.props.userSetup.budget.length) {
                            const arr = this.props.userSetup.budget.filter(item => {
                                    // console.log("FILTER", headex[j], item)
                                    return item.student_id === rowsArr[i].id
                                        && item.payment_id === headex[j].item.id
                                        && (headex[j].item.isregular === 1 ? (item.paydate.length === 8 ? item.paydate : toYYYYMMDD(new Date(item.paydate))) === toYYYYMMDD(new Date(headex[j].realdate)) : (item.paydate.length === 8 ? item.paydate : toYYYYMMDD(new Date(item.paydate))) === toYYYYMMDD(new Date(headex[j].item.paydate)))
                                        && (headex[j].item.isregular === 1 ? j === item.payment_offset : true)
                                }
                            )

                            if (arr.length) {
                                id = arr[0].id
                                curSum = arr[0].sum
                                factSum = arr[0].sum_fact
                                // console.log("CURSUM", id, curSum, factSum)
                            }
                        }
                        cell.push(<td key={"bbr" + j + (i + 1) + "c3"}
                                      id={headex[j].item.id + '#' + rowsArr[i].id + "#" + headex[j].item.sum}
                                      onClick={this.state.row === -1 && this.state.column === -1 ? () => {
                                          const json = `{"id":${id},
                                                        "class_id":${this.props.userSetup.classID},
                                                        "user_id":${this.props.userSetup.userID},
                                                        "student_id":${rowsArr[i].id},
                                                        "paydate":"${headex[j].item.isregular !== 1 ? headex[j].item.paydate : toYYYYMMDD(new Date(headex[j].realdate))}",
                                                        "sum":${id > 0 && curSum !== null && (headex[j].item.isregular || headex[j].item.isregular === null) ? null : headex[j].item.sum.toString().replace(",", ".")},
                                                        "sum_fact":${id > 0 && curSum !== null && (headex[j].item.isregular || headex[j].item.isregular === null) ? null : null},
                                                        "payment_id":${headex[j].item.id},
                                                        "payment_offset":${j},
                                                        "isregular":${headex[j].item.isregular}}`
                                          console.log("JSON", json)
                                          instanceAxios().post(`${API_URL}budget/update/${id}`, json)
                                              .then(res => {
                                                  // console.log("UPDATED", res)
                                                  let newarr = this.props.userSetup.budget
                                                  if (id)
                                                      newarr = newarr.filter(item => item.id !== id)
                                                  newarr.push(res.data)
                                                  this.props.onReduxUpdate("BUDGET_UPDATE", newarr)
                                                  this.props.onReduxUpdate("RENDER_BUDGET", ++this.props.userSetup.renderBudget)
                                                  this.setState({renderRows: ++this.state.renderRows})

                                              })
                                              .catch(res => console.log("ERROR", res))
                                          // console.log(headex[j].item.id + '#' + rowsArr[i].id + "#" + headex[j].item.sum)
                                      } : null}
                                      style={{
                                          positon: "relative",
                                          width: "54px",
                                          textAlign: "center",
                                          backgroundColor: curSum !== null ? "#C6EFCE" : "#fff",
                                          cursor: "pointer"
                                      }}>

                            {curSum!==null ? <div className="budget-rightArrow" onClick={e => {
                                this.setState({row: i, column: j});
                                e.stopPropagation();
                                this.onFactSumClick(e, i, j, factSum)
                            }}></div> : null}
                            {factSum!==null ? <div className="budget-rightText" onClick={e => {
                                this.setState({row: i, column: j});
                                e.stopPropagation();
                                this.onFactSumClick(e, i, j, factSum)
                            }}>{factSum}</div> : null}
                            {this.state.row === i && this.state.column === j ?
                                <AddSubject addsubjecttop title={"Фактическая оплата"} firehide={(hide) => {
                                    this.setState({row: -1, column: -1})
                                }} addfunc={(sum) => {
                                    console.log("ADD_FUNC", sum)
                                    const json = `{     "id":${id},
                                                        "sum_fact":${id > 0 && sum !== null ? sum.toString().replace(",", ".") : null}}`
                                    console.log("JSON:FACT", json)
                                    axios2('post', `${API_URL}budget/update/${id}`, json)
                                        .then(res => {
                                            console.log("UPDATED", res)
                                            let newarr = this.props.userSetup.budget
                                            if (id)
                                                newarr = newarr.filter(item => item.id!==id)
                                            newarr.push(res.data)
                                            this.props.onReduxUpdate("BUDGET_UPDATE", newarr)
                                            this.props.onReduxUpdate("RENDER_BUDGET", ++this.props.userSetup.renderBudget)
                                            this.setState({renderRows: ++this.state.renderRows})

                                        })
                                        .catch(res => console.log("ERROR", res))

                                }
                                }/> : null}
                            {curSum}

                        </td>)
                    }
                rows.push(<tr key={i}>{cell}</tr>)
            }
        }
        // console.log("rows", rows)
        return rows;
    }

    onFactSumClick = (e, row, column, factSum) => {
        // alert(row + " " + column + " " + factSum)

        // e.preventDefault()
        e.stopPropagation()
    }
    prepPaymentsHeaderAndRowArray = (planIns, year) => {
        let arr = []
        let headArray = [...this.headArray]
        // console.log("headArrayBef", headArray, year)
        planIns.forEach(item => {
            // console.log("paydate", item.paydate)
            if (item.sum > 0 || item.issaldo === 1) {
                if (item.isregular !== 1 || item.issaldo === 1) {
                    let start = (item.paydate.length === 8 ? dateFromYYYYMMDD(item.paydate) : new Date(item.paydate))
                    let shortdate = (((new Date(start)).getMonth() + 1) + '.' + ((new Date(start)).getFullYear().toString().slice(-2)))
                    if (Number(year) === Number(start.getFullYear())) {
                        arr.push({
                            numb: -1,
                            item: item,
                            name: item.short + ' ' + shortdate,
                        })
                        headArray.push({name: item.short + ' [' + shortdate + ']', width: "50px"})
                    }
                }
                else {
                    // Вставить проверку на срок действия
                    for (let i = 0; i < 20; i++) {
                        let newStart = addMonths((item.paydate.length === 8 ? dateFromYYYYMMDD(item.paydate) : new Date(item.paydate)), i)
                        // console.log("newStart", toYYYYMMDD(newStart), item, i)
                        let shortdate = ((newStart).getMonth() + 1) + '.' + (newStart).getFullYear().toString().slice(-2)
                        if (Number(year) === Number(newStart.getFullYear())) {
                            if ((item.payend !== null && ((new Date(newStart)) < (new Date(item.payend)))) || item.payend === null) {
                                arr.push({
                                    numb: i + 1,
                                    item: item,
                                    name: item.short + ' ' + shortdate,
                                    realdate: newStart
                                })
                                headArray.push({name: item.short + ' [' + shortdate + ']', width: "50px"})
                            }
                        }
                    }
                }
            }
        })
        // console.log("headArrayAft", headArray)
        this.setState({factInsHeader: headArray, factInsHeaderEx: arr})
        return headArray
    }
    handleYear = async year => {
        const arr = await this.prepPaymentsHeaderAndRowArray(this.state.planIns, year)
        console.log("changeYear", year, arr)
        this.setState({curYear: year, factInsHeader: arr})
    }
    loginBlock = (userID, userName, langLibrary) => {
        let {loading} = this.props.userSetup
        let {showLoginLight} = this.state
        // console.log("loginBlock", loading, userID)
        return <div className="logBtnsBlock">
            <div>
                {!loading && !userID ?
                    <button className={userID ? "loginbtn" : showLoginLight ? "loginbtn mym-login-logged" : "loginbtn"}
                            onClick={this.userLogin.bind(this)}>
                        <div className="mym-app-button-with-arrow">{langLibrary.entry}
                            <div className="mym-app-arrow-down">{!this.state.showLoginLight ? '\u25BC' : '\u25B2'}</div>
                        </div>
                    </button> : null}

                {showLoginLight ?
                    <LoginBlockLight onLogin={this.props.onUserLogging} langLibrary={langLibrary}
                                     firehide={this.fireLoginLight.bind(this)}/> : null
                }
            </div>
            <div>
                {userID > 0 ? <button className="logoutbtn" onClick={this.userLogout.bind(this)}>
                    <div
                        className={userName.length > 10 ? "mym-app-button-name-small" : "mym-app-button-name"}>{userName}</div>
                    <div className="mym-app-button-exit">{langLibrary.exit}</div>
                </button> : null}
            </div>
            {this.langBlock()}
        </div>
    }
    userLogout = () => {
        this.props.history.push('/')
        this.props.onUserLoggingOut(this.props.userSetup.token, this.props.userSetup.langLibrary)
    }
    langBlock = () => {
        return <div style={{"width": "80px"}}><ReactFlagsSelect
            defaultCountry={localStorage.getItem("langCode") ? localStorage.getItem("langCode") : defLang}
            placeholder={getLangByCountry(localStorage.getItem("langCode"))}
            showSelectedLabel={false}
            searchPlaceholder={this.props.userSetup.langLibrary ? this.props.userSetup.langLibrary.lang : defLang}
            countries={arrLangs}
            onSelect={this.onSelectLang}
            selectedSize={14}
            optionsSize={12}/>
        </div>
    }
    getTabs=()=>{
        const yearArr = (() => {
            let arr = [];
            const curYear = (new Date()).getFullYear()
            for (let i = 0; i < 25; i++) {
                arr.push(curYear - 10 + i)
            }
            return arr
        })()
        const objInBlank = {
            id: 0,
            user_id: this.props.userSetup.userID,
            class_id: this.props.userSetup.classID,
            name: "введите название",
            short: "короткое",
            isregular: null,
            paydate: null,
            payend: null,
            sum: 1,
            issaldo: null,
            debet: 1,
            monthday: null
        }
        const objOutBlank = {
            id: 0,
            user_id: this.props.userSetup.userID,
            class_id: this.props.userSetup.classID,
            name: "введите название",
            short: "короткое",
            isregular: null,
            paydate: null,
            payend: null,
            sum: 1,
            issaldo: null,
            debet: null,
            monthday: null,
            created_at: null,
            updated_at: null
        }
        const objBlank = {}
        return this.tabs.map((item, key) => ({
            title: item.name,
            getContent: () => {
                switch (item.id) {
                    case 0 :
                        return                     <div className={"insBlock"}>
                            {/*<div style={{*/}
                            {/*display: "flex",*/}
                            {/*justifyContent: "space-between",*/}
                            {/*height: "30px",*/}
                            {/*margin: "5px 5%"*/}
                            {/*}}>*/}
                            {/*<div style={{fontWeight: "600", fontSize: "1em"}}>Взносы</div>*/}
                            {/*<button>Добавить взнос</button>*/}
                            {/*</div>*/}
                            {/*{this.fillInTable()}*/}
                            <UniversalTable head={this.headInArray}
                                            rows={this.state.planIns}
                                            createTableRows={this.createInTableRows}
                                            classNameOfTD={this.classNameOfTD}
                                            onstudentclick={this.onSelectStudent}
                                            selectedstudent={this.state.curStudent}
                                            btncaption={"+Взнос"}
                                            objblank={objInBlank}
                                            initrows={() => {
                                                return this.props.userSetup.budgetpays
                                            }}
                                            height={"300px"}
                                            kind={"budgetpaysin"}
                                            year={this.state.curYear}
                            />
                        </div>
                    case 1 :
                        return                     <div className={"outsBlock"}>
                            <UniversalTable head={this.headOutArray}
                                            rows={this.state.planOuts}
                                            createTableRows={this.createOutTableRows}
                                            classNameOfTD={this.classNameOfTD}
                                            onstudentclick={this.onSelectStudent}
                                            selectedstudent={this.state.curStudent}
                                            btncaption={"+Расход"}
                                            objblank={objOutBlank}
                                            initrows={() => {
                                                return this.props.userSetup.budgetpays
                                            }}
                                            height={"300px"}
                                            kind={"budgetpaysout"}
                                            saldo={true}
                                            year={this.state.curYear}
                            />
                        </div>
                    case 2 :
                        return                 <div className="insAndOutsFactBlock">
                            <div className={"insFactBlock"}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    height: "30px",
                                    margin: "5px 5%"
                                }}>
                                    <div style={{fontWeight: "600", fontSize: "1em"}}>Взносы(факт)</div>
                                    <div>
                                        <select name="days" onClick={(e) => this.handleYear(e.target.value)}
                                                defaultValue={this.state.curYear}>
                                            {yearArr.map((item, key) => {
                                                return <option key={key}>
                                                    {item}
                                                </option>
                                            })}
                                        </select>
                                    </div>
                                    {/*<YearPicker onChange={this.handleYear} />;*/}
                                </div>
                                <UniversalTable head={this.state.factInsHeader}
                                                rows={this.state.rowArray}
                                                createTableRows={this.createTableRows}
                                                classNameOfTD={this.classNameOfTD}
                                                onstudentclick={this.onSelectStudent}
                                                selectedstudent={this.state.curStudent}
                                                btncaption={""}
                                                render={this.props.userSetup.renderBudget}
                                                objblank={objBlank}
                                                initrows={() => {
                                                    return this.props.userSetup.students
                                                }}
                                                kind={"budget"}
                                                height={"500px"}
                                                headex={ this.state.factInsHeaderEx}
                                                year={this.state.curYear}
                                                onfactclick={this.onFactSumClick}
                                />
                            </div>
                        </div>
                    default :
                        break;
                }
            },
            /* Optional parameters */
            key: key,
            tabClassName: 'tab',
            panelClassName: 'panel',
        }));
    }
    render() {

        let {userID, userName, isadmin, langLibrary} = this.props.userSetup;
        let {isMobile} = this.state
        console.log("RENDER_BUDGET", this.props.userSetup)

        return (
            <div className="AdminPage">
                <div className="navbar"
                     style={userID === 0 ? {"justifyContent": "flex-end"} : {"justifyContent": "space-between"}}>
                    <div className="navBlock">
                        <div className="navBlock">
                            <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center"}}>
                                <Link
                                    onClick={() => {
                                        this.props.onReduxUpdate("MENU_ITEM", {id: 0, label: ''});
                                        this.props.onReduxUpdate("MENU_CLICK", "")
                                    }}
                                    to="/"><img src={Logo} alt={"My.Marks"}/></Link>
                                <div className="myTitle"><h3><Link
                                    onClick={() => {
                                        this.props.onReduxUpdate("MENU_ITEM", {id: 0, label: ''});
                                        this.props.onReduxUpdate("MENU_CLICK", "")
                                    }}
                                    to="/">{langLibrary.siteName}</Link></h3></div>
                            </div>
                        </div>
                    </div>
                    <div className="navBlockEx">
                        {isMobile ?
                            <MobileMenu userID={userID} userName={userName} isadmin={isadmin}
                                        withtomain={this.props.withtomain} userLogin={this.userLogin.bind(this)}
                                        userLogout={this.userLogout.bind(this)}/> :
                            userID > 0 && <MenuEx className="menuTop" userid={userID} isadmin={isadmin}/>
                        }
                        {isMobile ? <div>
                            {this.state.showLoginLight || (window.location.href.slice(-2) === "/r" && userID === 0) ?
                                <LoginBlockLight onLogin={this.props.onUserLogging}
                                                 firehide={this.fireLoginLight.bind(this)}/> : ""}

                            <div className={this.props.user.loginmsg.length ? "popup show" : "popup"}
                                 onClick={this.props.onClearErrorMsg}>
                                {this.props.user.loginmsg.length ?
                                    <span className="popuptext" id="myPopup">{this.props.user.loginmsg}</span> : ""}
                            </div>
                        </div> : ""}
                        {!isMobile ? this.loginBlock(userID, userName, langLibrary) : null}
                    </div>
                </div>
                <div className="navbar-shadow"></div>

                <div style={{marginTop : "10px"}}>
                    <Tabs items={this.getTabs()} />
                </div>
                {/*<div className="insAndOutsFactBlock">*/}
                    {/*<div className={"insBlock"}>*/}
                        {/*<UniversalTable head={this.headInArray}*/}
                                        {/*rows={this.state.planIns}*/}
                                        {/*createTableRows={this.createInTableRows}*/}
                                        {/*classNameOfTD={this.classNameOfTD}*/}
                                        {/*onstudentclick={this.onSelectStudent}*/}
                                        {/*selectedstudent={this.state.curStudent}*/}
                                        {/*btncaption={"+Взнос"}*/}
                                        {/*objblank={objInBlank}*/}
                                        {/*initrows={() => {*/}
                                            {/*return this.props.userSetup.budgetpays*/}
                                        {/*}}*/}
                                        {/*height={"300px"}*/}
                                        {/*kind={"budgetpaysin"}*/}
                                        {/*year={this.state.curYear}*/}
                        {/*/>*/}
                    {/*</div>*/}
                    {/*<div className={"outsBlock"}>*/}
                        {/*<UniversalTable head={this.headOutArray}*/}
                                        {/*rows={this.state.planOuts}*/}
                                        {/*createTableRows={this.createOutTableRows}*/}
                                        {/*classNameOfTD={this.classNameOfTD}*/}
                                        {/*onstudentclick={this.onSelectStudent}*/}
                                        {/*selectedstudent={this.state.curStudent}*/}
                                        {/*btncaption={"+Расход"}*/}
                                        {/*objblank={objOutBlank}*/}
                                        {/*initrows={() => {*/}
                                            {/*return this.props.userSetup.budgetpays*/}
                                        {/*}}*/}
                                        {/*height={"300px"}*/}
                                        {/*kind={"budgetpaysout"}*/}
                                        {/*saldo={true}*/}
                                        {/*year={this.state.curYear}*/}
                        {/*/>*/}
                    {/*</div>*/}
                {/*</div>*/}
                {/*<div className="insAndOutsFactBlock">*/}
                    {/*<div className={"insFactBlock"}>*/}
                        {/*<div style={{*/}
                            {/*display: "flex",*/}
                            {/*justifyContent: "space-between",*/}
                            {/*height: "30px",*/}
                            {/*margin: "5px 5%"*/}
                        {/*}}>*/}
                            {/*<div style={{fontWeight: "600", fontSize: "1em"}}>Взносы(факт)</div>*/}
                            {/*<div>*/}
                                {/*<select name="days" onClick={(e) => this.handleYear(e.target.value)}*/}
                                        {/*defaultValue={this.state.curYear}>*/}
                                    {/*{yearArr.map((item, key) => {*/}
                                        {/*return <option key={key}>*/}
                                            {/*{item}*/}
                                        {/*</option>*/}
                                    {/*})}*/}
                                {/*</select>*/}
                            {/*</div>*/}
                            {/*/!*<YearPicker onChange={this.handleYear} />;*!/*/}
                        {/*</div>*/}
                        {/*<UniversalTable head={this.state.factInsHeader}*/}
                                        {/*rows={this.state.rowArray}*/}
                                        {/*createTableRows={this.createTableRows}*/}
                                        {/*classNameOfTD={this.classNameOfTD}*/}
                                        {/*onstudentclick={this.onSelectStudent}*/}
                                        {/*selectedstudent={this.state.curStudent}*/}
                                        {/*btncaption={""}*/}
                                        {/*render={this.props.userSetup.renderBudget}*/}
                                        {/*objblank={objBlank}*/}
                                        {/*initrows={() => {*/}
                                            {/*return this.props.userSetup.students*/}
                                        {/*}}*/}
                                        {/*kind={"budget"}*/}
                                        {/*height={"500px"}*/}
                                        {/*headex={ this.state.factInsHeaderEx}*/}
                                        {/*year={this.state.curYear}*/}
                                        {/*onfactclick={this.onFactSumClick}*/}
                        {/*/>*/}
                    {/*</div>*/}
                {/*</div>*/}
            </div>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate: (key, payload) => dispatch({type: key, payload: payload}),
        onStopLoading: () => dispatch({type: 'APP_LOADED'}),
        onStartLoading: () => dispatch({type: 'APP_LOADING'}),
        onUserLoggingOut: token => dispatch(userLoggedOut(token)),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminBudgetPage))