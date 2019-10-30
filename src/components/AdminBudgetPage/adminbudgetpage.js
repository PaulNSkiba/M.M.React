/**
 * Created by Paul on 18.10.2019.
 */

import React, {Component} from 'react'
import {
    AddDay,
    arrOfWeekDays,
    dateDiff,
    toYYYYMMDD,
    instanceAxios,
    addMonths,
    dateFromYYYYMMDD,
    mapStateToProps,
    getLangByCountry
} from '../../js/helpers'
import Menu from '../Menu/menu'
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
import ReactPlayer from 'react-player'
import DatePicker from "react-datepicker";
import {registerLocale, setDefaultLocale} from  "react-datepicker";
import {ru} from 'date-fns/locale';
import UniversalTable from '../UniversalTable/universaltable'
// import YearPicker from "react-year-picker";

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
            renderRows : 1,
            curInRow : null,
            curInColumn : null,
            curOutRow : null,
            curOutColumn : null,
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
            {name: "Регул- ный (раз в месяц)", width: "60px"},
            {name: "Дата оплаты", width: "70px"},
            {name: "Дата оконч-я оплаты", width: "70px"},
            {name: "День месяца (для регул-х)", width: "50px"},
            {name: "Нач. сальдо", width: "40px"},
            {name: "-", width: "20px"},
        ]
       this.headOutArray = [
           {name: "№ п/п", width: "20px"},
           {name: "РАСХОД", width: "200px"},
           {name: "Сокр", width: "50px"},
           {name: "Сумма", width: "50px"},
           {name: "Регул- ный (раз в месяц)", width: "60px"},
           {name: "Дата оплаты", width: "70px"},
           {name: "Дата оконч-я оплаты", width: "70px"},
           {name: "День месяца (для регул-х)", width: "50px"},
           {name: "Нач. сальдо", width: "40px"},
           {name: "-", width: "20px"},
        ]
        this.onClick = this.onClick.bind(this)
    }
    initData() {
        instanceAxios().get(`${API_URL}budgetpays/get/${this.props.userSetup.classID}`)
            .then(res=>{

                    const planIns = res.data.filter(item=>item.debet===1)
                    const planOuts = res.data.filter(item=>item.debet!==1)
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
            .catch(res=>{
                console.log("getpaysError", res)
            })
        instanceAxios().get(`${API_URL}budget/get/${this.props.userSetup.classID}`)
            .then(res=>{
                    this.setState({
                        factIns: res.data
                    })
                    this.props.onReduxUpdate("BUDGET_UPDATE", res.data)
                    console.log("getbudget", res)
                }
            )
            .catch(res=>{
                console.log("getbudgetError", res)
            })
    }

    componentWillMount() {
        this.initData()
    }
    onClick=(e)=>{
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
    fillInTable = () => {
        registerLocale('ru', ru)
        const daysArr = (() => {
            let arr = [];
            for (let i = 1; i < 32; i++) {
                arr.push(i)
            }
            return arr
        })()
        const {curInRow : row, curInColumn : column} = this.state
        return <div>
            <table style={{marginTop: "5px", width: "98%", overflowY: "scroll"}}>
                <thead style={{backgroundColor: "#C6EFCE", display: "block"}}>
                <tr>
                    <th style={{width: "20px", padding: "5px"}}>№ п/п</th>
                    <th style={{width: "200px", padding: "5px"}}>Наименование</th>
                    <th style={{width: "50px", padding: "5px"}}>Сокр.</th>
                    <th style={{width: "50px", padding: "5px"}}>Сумма</th>
                    <th style={{width: "60px", padding: "5px"}}>Регуляр- ный (раз в месяц)</th>
                    <th style={{width: "70px", padding: "5px"}}>Дата оплаты</th>
                    <th style={{width: "70px", padding: "5px"}}>Дата окончания оплаты</th>
                    <th style={{width: "50px", padding: "5px"}}>День месяца (для регул-х)</th>
                    <th style={{width: "40px", padding: "5px"}}>Нач. сальдо</th>
                    <th style={{width: "20px", padding: "5px"}}>-</th>
                </tr>
                </thead>
            </table>
            <div style={{maxHeight: "250px", overflowY: "scroll"}}>
                <table>
                <tbody>
                {this.state.planIns.map((item, key) =>
                    <tr key={"r" + key}>
                        <td style={{width: "20px", padding: "5px", textAlign: "center"}}>{key + 1}</td>
                        <td style={{width: "200px", padding: "5px"}} onClick={()=>this.setState({curInRow : key + 1, curInColumn : 2})}>{item.name}
                            {(row === (key + 1) && column === 2) ?
                                <input type="text" id={(key + 1) + "#2#" + item.id} className="inputEditor"
                                       onChange={e=>this.onInputChange(e.target.value, item.id)}
                                       onKeyPress={this.onInputKeyPress}
                                       onBlur={this.onBlur}
                                       defaultValue={item.name}/> : ""}
                        </td>
                        <td style={{width: "50px", padding: "5px", textAlign: "center"}}>{item.short}</td>
                        <td style={{width: "50px", padding: "5px", textAlign: "center"}}>{item.sum}</td>
                        <td style={{width: "60px", padding: "5px", textAlign: "center"}}>
                            <input type="checkbox" onChange={(e) => {
                                console.log(e.target.value);
                                this.changeState(e, item.id, 4)
                            }} id={(key + 1) + "#7_1#" + key} checked={item.isregular===1}/>
                        </td>
                        <td style={{width: "70px", padding: "5px", textAlign: "center"}}>
                            <DatePicker
                                // showMonthYearDropdown
                                fixedHeight
                                dateFormat="dd/MM/yy"
                                withPortal
                                locale="ru"
                                selected={item.paydate === null ? null : item.paydate.length===8?dateFromYYYYMMDD(item.paydate):new Date(item.paydate)}
                                onChange={date => this.handleDate('start', item.id, date)}
                                customInput={<input style={{
                                    width: "55px",
                                    textAlign: "center",
                                    backgroundColor: "#7DA8E6",
                                    color: "#fff", fontSize : "0.9em"
                                }}/>}

                            />
                        </td>
                        <td style={{width: "70px", padding: "5px", textAlign: "center"}}>
                            <DatePicker
                                // showMonthYearDropdown
                                fixedHeight
                                dateFormat="dd/MM/yy"
                                withPortal
                                locale="ru"
                                selected={item.payend === null ? null : item.payend.length===8?dateFromYYYYMMDD(item.payend):new Date(item.payend)}
                                onChange={date => this.handleDate('end', item.id, date)}
                                customInput={<input style={{
                                    width: "55px",
                                    textAlign: "center",
                                    backgroundColor: "#7DA8E6",
                                    color: "#fff", fontSize : "0.9em"
                                }}/>}
                            />
                        </td>
                        <td style={{width: "50px", padding: "5px", textAlign: "center"}}>
                            <select name="days" onClick={this.onLangClick} defaultValue={item.dayOfPayment}>
                                {daysArr.map((item, key) => {
                                    return <option key={key}>
                                        {item}
                                    </option>
                                })}
                            </select>
                        </td>
                        <td style={{width: "40px", padding: "5px", textAlign: "center"}}>
                            <input type="checkbox" onChange={(e) => {
                                console.log(e.target.value);
                                this.changeState(e, item.id, 8)
                            }} id={(key + 1) + "#7_1#" + key} checked={item.issaldo}/>
                        </td>
                        <td style={{width: "20px", padding: "5px", textAlign: "center"}}><button onClick={()=>{console.log("Удалить?")}}>-</button></td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        </div>
    }
    fillOutTable = () => {
        registerLocale('ru', ru)
        const daysArr = (() => {
            let arr = [];
            for (let i = 1; i < 32; i++) {
                arr.push(i)
            }
            return arr
        })()
        return <div>
            <table height="300px" style={{margin: "5px", width: "98%"}}>
                <thead style={{backgroundColor: "#ecabb9"}}>
                <tr>
                    <th style={{width: "30px", padding: "5px"}}>№ п/п</th>
                    <th style={{width: "100%", padding: "5px"}}>Наименование</th>
                    <th style={{width: "50px", padding: "5px"}}>Сумма</th>
                    <th style={{width: "30px", padding: "5px"}}>Регуляр- ный (раз в месяц)</th>
                    <th style={{width: "70px", padding: "5px"}}>Дата оплаты</th>
                    <th style={{width: "70px", padding: "5px"}}>Дата окончания оплаты</th>
                    <th style={{width: "50px", padding: "5px"}}>День месяца (для регул-х)</th>
                    <th style={{width: "20px", padding: "5px"}}>-</th>
                </tr>
                </thead>
                <tbody>
                {this.state.planOuts.map((item, key) =>
                    <tr key={"r" + key}>
                        <td style={{width: "30px", textAlign: "center"}}>{key + 1}</td>
                        <td style={{width: "100px"}}>{item.name}</td>
                        <td style={{width: "30px", textAlign: "center"}}>{item.sum}</td>
                        <td style={{width: "30px", textAlign: "center"}}>
                            <input type="checkbox" onChange={(e) => {
                                console.log(e.target.value);
                                this.changeState(e, item.id, 4)
                            }} id={(key + 1) + "#7_1#" + key} checked={item.isregular===1}/>
                        </td>
                        <td style={{width: "70px", textAlign: "center"}}>
                            <DatePicker
                                // showMonthYearDropdown
                                fixedHeight
                                dateFormat="dd/MM/yy"
                                withPortal
                                locale="ru"
                                selected={item.start === null ? null : item.paydate.length===8?dateFromYYYYMMDD(item.paydate):new Date(item.paydate)}
                                onChange={date => this.handleDate('start', item.id, date)}
                                customInput={<input style={{
                                    width: "70px",
                                    textAlign: "center",
                                    backgroundColor: "#7DA8E6",
                                    color: "#fff", fontSize : "0.9em"
                                }}/>}

                            />
                        </td>
                        <td style={{width: "70px", textAlign: "center"}}>
                            <DatePicker
                                // showMonthYearDropdown
                                fixedHeight
                                dateFormat="dd/MM/yy"
                                withPortal
                                locale="ru"
                                selected={item.payend === null ? null : item.payend.length===8?dateFromYYYYMMDD(item.payend):new Date(item.payend)}
                                onChange={date => this.handleDate('end', item.id, date)}
                                customInput={<input style={{
                                    width: "70px",
                                    textAlign: "center",
                                    backgroundColor: "#7DA8E6",
                                    color: "#fff", fontSize : "0.9em"
                                }}/>}
                            />
                        </td>
                        <td style={{width: "30px", textAlign: "center"}}>
                            <select name="days" onClick={this.onDayOfPaymentClick} defaultValue={item.dayOfPayment}>
                                {daysArr.map((item, key) => {
                                    return <option key={key}>
                                        {item}
                                    </option>
                                })}
                            </select>
                        </td>
                        <td><button onClick={()=>{console.log("Удалить?")}}>-</button></td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    }
    classNameOfTD = (email, verified) => {
        return email ? (verified ? "left-text verified" : "left-text verification") : "left-text"
    }
    onDayOfPaymentClick=e=>{

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
        console.log("createInTableRows", rowsArr)
        rowsArr = this.props.userSetup.budgetpays.filter(item=>item.debet===1)
        let key, item
        if (rowsArr) {
            for (let i = 0; i < rowsArr.length; i++) {
                cell = []
                key = i
                item = rowsArr[i]
                cell.push(<td key={"bbr" + (i + 1) + "c1"} style={{width: "20px", padding: "2px", textAlign: "center", fontSize : "0.8em"}}>{i + 1}</td>)
                cell.push(<td key={"bbr" + (i + 1) + "c2"} style={{width: "200px", padding: "2px", fontSize : "0.8em"}}
                              // onClick={()=>this.setState({curInRow : key + 1, curInColumn : 2})}
                              id={(i + 1) + "#2#" + rowsArr[i].id}
                              onClick={this.onClick}
                >
                    {item.name}
                        {(row === (i + 1) && column === 2) ?
                            <input type="text" id={(i + 1) + "#2#" + item.id} className="inputEditor"
                                   onChange={e=>this.onInputChange(e.target.value, item.id)}
                                   onKeyPress={this.onInputKeyPress}
                                   onBlur={this.onBlur}
                                   defaultValue={item.name}/> : ""}
                        </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c3"} style={{width: "50px", padding: "2px", textAlign: "center", fontSize : "0.8em"}}>{item.short}</td>)
                cell.push(<td key={"bbr" + (i + 1) + "c4"} style={{width: "50px", padding: "2px", textAlign: "center", fontSize : "0.8em"}}>{item.sum}</td>)
                cell.push(<td key={"bbr" + (i + 1) + "c5"} style={{width: "60px", padding: "2px", textAlign: "center"}}>
                        <input type="checkbox" onChange={(e) => {
                            console.log(e.target.value);
                            this.changeState(e, item.id, 4)
                        }} id={(key + 1) + "#7_1#" + key} checked={item.isregular===1}/>
                        </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c6"} style={{width: "70px", padding: "2px", textAlign: "center", fontSize : "0.9em"}}>
                                <DatePicker
                                // showMonthYearDropdown
                                fixedHeight
                                dateFormat="dd/MM/yy"
                                withPortal
                                locale="ru"
                                selected={item.paydate === null ? null : item.paydate.length===8?dateFromYYYYMMDD(item.paydate):new Date(item.paydate)}
                                onChange={date => this.handleDate('start', item.id, date)}
                                customInput={<input style={{
                                    width: "55px",
                                    textAlign: "center",
                                    backgroundColor: "#7DA8E6",
                                    color: "#fff", fontSize : "0.9em"
                                }}/>}
                                />
                             </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c7"} style={{width: "70px", padding: "2px", textAlign: "center", fontSize : "0.9em"}}>
                                <DatePicker
                                // showMonthYearDropdown
                                fixedHeight
                                dateFormat="dd/MM/yy"
                                withPortal
                                locale="ru"
                                selected={item.payend === null ? null : item.payend.length===8?dateFromYYYYMMDD(item.payend):new Date(item.payend)}
                                onChange={date => this.handleDate('end', item.id, date)}
                                customInput={<input style={{
                                    width: "55px",
                                    textAlign: "center",
                                    backgroundColor: "#7DA8E6",
                                    color: "#fff", fontSize : "0.9em"
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
                                    this.changeState(e, item.id, 8)
                                }} id={(key + 1) + "#9#" + key} checked={item.issaldo}/>
                            </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c10"} style={{width: "20px", padding: "2px", textAlign: "center"}}><button onClick={()=>{console.log("Удалить?")}}>-</button></td>)
                rows.push(<tr style={{backgroundColor : rowsArr[i].id===0?"rgba(64, 155, 230, 0.25)":"#fff"}} key={i}>{cell}</tr>)
            }
        }
        console.log("rows", rows)
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
        rowsArr = this.props.userSetup.budgetpays.filter(item=>item.debet===null)
        console.log("createOutTableRows", rowsArr)
        let key, item
        if (rowsArr) {
            for (let i = 0; i < rowsArr.length; i++) {
                cell = []
                key = i
                item = rowsArr[i]
                cell.push(<td key={"bbr" + (i + 1) + "c1"} style={{width: "20px", padding: "2px", textAlign: "center", fontSize : "0.8em"}}>{i + 1}</td>)
                cell.push(<td key={"bbr" + (i + 1) + "c2"}
                              style={{width: "200px", padding: "2px", fontSize : "0.8em"}}
                              // onClick={()=>this.setState({curInRow : key + 1, curInColumn : 2})}
                              id={(i + 1) + "#2#" + rowsArr[i].id}
                              onClick={this.onClick}>
                    {item.name}
                    {(row === (i + 1) && column === 2) ?
                        <input type="text" id={(i + 1) + "#2#" + item.id} className="inputEditor"
                               onChange={e=>this.onInputChange(e.target.value, item.id)}
                               onKeyPress={this.onInputKeyPress}
                               onBlur={this.onBlur}
                               defaultValue={item.name}/> : ""}
                </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c3"} style={{width: "50px", padding: "2px", textAlign: "center", fontSize : "0.8em"}}>
                    {item.short}
                    {(row === (i + 1) && column === 3) ?
                        <input type="text" id={(i + 1) + "#3#" + item.id} className="inputEditor"
                               onChange={e=>this.onInputChange(e.target.value, item.id)}
                               onKeyPress={this.onInputKeyPress}
                               onBlur={this.onBlur}
                               defaultValue={item.short}/> : ""}
                </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c4"} style={{width: "50px", padding: "2px", textAlign: "center", fontSize : "0.8em"}}>
                    {item.sum}
                    {(row === (i + 1) && column === 4) ?
                        <input type="text" id={(i + 1) + "#4#" + item.id} className="inputEditor"
                               onChange={e=>this.onInputChange(e.target.value, item.id)}
                               onKeyPress={this.onInputKeyPress}
                               onBlur={this.onBlur}
                               defaultValue={item.sum}/> : ""}
                </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c5"} style={{width: "60px", padding: "2px", textAlign: "center"}}>
                    <input type="checkbox" onChange={(e) => {
                        console.log(e.target.value);
                        this.changeState(e, item.id, 5)
                    }} id={(key + 1) + "#5#" + key} checked={item.isregular===1}/>
                </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c6"} style={{width: "70px", padding: "2px", textAlign: "center", fontSize : "0.9em"}}>
                    <DatePicker
                        // showMonthYearDropdown
                        fixedHeight
                        dateFormat="dd/MM/yy"
                        withPortal
                        locale="ru"
                        selected={item.paydate === null ? null : item.paydate.length===8?dateFromYYYYMMDD(item.paydate):new Date(item.paydate)}
                        onChange={date => this.handleDate('start', item.id, date)}
                        customInput={<input style={{
                            width: "55px",
                            textAlign: "center",
                            backgroundColor: "#7DA8E6",
                            color: "#fff", fontSize : "0.9em"
                        }}/>}
                    />
                </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c7"} style={{width: "70px", padding: "2px", textAlign: "center", fontSize : "0.9em"}}>
                    <DatePicker
                        // showMonthYearDropdown
                        fixedHeight
                        dateFormat="dd/MM/yy"
                        withPortal
                        locale="ru"
                        selected={item.payend === null ? null : item.payend.length===8?dateFromYYYYMMDD(item.payend):new Date(item.payend)}
                        onChange={date => this.handleDate('end', item.id, date)}
                        customInput={<input style={{
                            width: "55px",
                            textAlign: "center",
                            backgroundColor: "#7DA8E6",
                            color: "#fff", fontSize : "0.9em"
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
                        this.changeState(e, item.id, 8)
                    }} id={(key + 1) + "#9#" + key} checked={item.issaldo}/>
                </td>)
                cell.push(<td key={"bbr" + (i + 1) + "c10"} style={{width: "20px", padding: "2px", textAlign: "center"}}><button onClick={()=>{this.onDelClick("out", item.id)}}>-</button></td>)
                rows.push(<tr style={{backgroundColor : rowsArr[i].id===0?"rgba(64, 155, 230, 0.25)":"#fff"}} key={i}>{cell}</tr>)
            }
        }
        // console.log("rows", rows)
        return rows;
    }
        createTableRows(rowsArr, onInputChange, withInput, row, column, classNameOfTD, checkedMap, headex, year) {
        let cell = [],
            rows = []
            rowsArr = rowsArr.filter(item=>item.isout!==1)
            console.log("createTableRows", rowsArr)
        if (rowsArr) {
            for (let i = 0; i < rowsArr.length; i++) {
                cell = []
                cell.push(<td style={{width: "25px", fontSize : "0.8em"}} key={"bbr" + (i + 1) + "c1"}>{i + 1}</td>)
                cell.push(<td className="left-text" style={{width: "300px", paddingLeft: "2px", paddingRight: "2px", fontSize : "0.9em"}}
                              id={(i + 1) + "#2#" + rowsArr[i].id} key={"bbr" + (i + 1) + "c2"}>
                    {rowsArr[i].student_name} {(row === (i + 1) && column === 2 && withInput) ? rowsArr[i].student_name : null}
                </td>)
                // console.log("datein", rowsArr[i], i, (rowsArr[i].datein===null)?null:((rowsArr[i].datein.length===8)?dateFromYYYYMMDD(rowsArr[i].datein):(new Date(rowsArr[i].datein))))
                cell.push(
                    <td key={"bbr" + (i + 1) + "c3"} style={{width: "70px", textAlign: "center", fontSize : "0.9em"}}>
                        <DatePicker
                            // showMonthYearDropdown
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
                                color: "#fff", fontSize : "0.9em"
                            }}/>}
                        />
                    </td>)


                if (headex!==undefined)
                    for (let j = 0; j < headex.length; j++) {
                        let curSum = null, id = 0
                        if (this.props.userSetup.budget!==undefined&&this.props.userSetup.budget.length) {
                            const arr = this.props.userSetup.budget.filter(item => {
                                // console.log("FILTER", headex[j], item)
                                return item.student_id === rowsArr[i].id
                            && item.payment_id === headex[j].item.id
                            && (headex[j].item.isregular === 1?(item.paydate.length===8?item.paydate:toYYYYMMDD(new Date(item.paydate))) === toYYYYMMDD(new Date(headex[j].realdate)):(item.paydate.length===8?item.paydate:toYYYYMMDD(new Date(item.paydate))) === toYYYYMMDD(new Date(headex[j].item.paydate)))
                            && (headex[j].item.isregular === 1?j === item.payment_offset:true)
                        }
                            )

                            if (arr.length) {

                                id = arr[0].id
                                curSum = arr[0].sum
                                // console.log("CURSUM", id, curSum)
                            }
                        }
                        cell.push(<td key={"bbr" + j + (i + 1) + "c3"}
                                      id={headex[j].item.id + '#' + rowsArr[i].id + "#" + headex[j].item.sum}
                                      onClick={() => {
                                          const budgetID = id
                                          const json = `{"id":${budgetID},
                                                        "class_id":${this.props.userSetup.classID},
                                                        "user_id":${this.props.userSetup.userID},
                                                        "student_id":${rowsArr[i].id},
                                                        "paydate":"${headex[j].item.isregular!==1?headex[j].item.paydate:toYYYYMMDD(new Date(headex[j].realdate))}",
                                                        "sum":${id>0&&curSum!==null&&headex[j].item.isregular?null:headex[j].item.sum.toString().replace(",",".")},
                                                        "payment_id":${headex[j].item.id},
                                                        "payment_offset":${j},
                                                        "isregular":${headex[j].item.isregular}}`
                                          console.log("JSON", json)
                                          instanceAxios().post(`${API_URL}budget/update/${budgetID}`,json)
                                              .then(res=>{
                                                  // console.log("UPDATED", res)
                                                  let newarr = this.props.userSetup.budget
                                                  if (id)
                                                     newarr = newarr.filter(item=>item.id!=id)
                                                  newarr.push(res.data)
                                                  this.props.onReduxUpdate("BUDGET_UPDATE", newarr)
                                                  this.props.onReduxUpdate("RENDER_BUDGET", ++this.props.userSetup.renderBudget)
                                                  this.setState({renderRows : ++this.state.renderRows})

                                              })
                                              .catch(res=>console.log("ERROR", res))
                                          // console.log(headex[j].item.id + '#' + rowsArr[i].id + "#" + headex[j].item.sum)
                                      }}
                                      style={{width: "54px", textAlign: "center", backgroundColor : curSum!==null?"#C6EFCE":"#fff", cursor : "pointer"}}>
                            {curSum}
                        </td>)
                    }
                rows.push(<tr key={i}>{cell}</tr>)
            }
        }
        // console.log("rows", rows)
        return rows;
    }

    prepPaymentsHeaderAndRowArray = (planIns, year) => {
        let arr = []
        let headArray = [...this.headArray]
        console.log("headArrayBef", headArray, year)
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
                        let newStart = addMonths((item.paydate.length === 8?dateFromYYYYMMDD(item.paydate):new Date(item.paydate)), i)
                        // console.log("newStart", toYYYYMMDD(newStart), item, i)
                        let shortdate = ((newStart).getMonth() + 1) + '.' + (newStart).getFullYear().toString().slice(-2)
                        if (Number(year) === Number(newStart.getFullYear())) {
                            if ((item.payend !== null && ((new Date(newStart)) < (new Date(item.payend)))) || item.payend === null) {
                                arr.push({
                                    numb: i + 1,
                                    item: item,
                                    name: item.short + ' ' + shortdate,
                                    realdate : newStart
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
                    <div className="mym-app-button-name">{userName}</div>
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

    render() {
        const yearArr = (() => {
            let arr = [];
            const curYear = (new Date()).getFullYear()
            for (let i = 0; i < 25; i++) {
                arr.push(curYear - 10 + i)
            }
            return arr
        })()
        const objInBlank = {
            id : 0,
            user_id : this.props.userSetup.userID,
            class_id : this.props.userSetup.classID,
            name : "введите название",
            short : "короткое",
            isregular : null,
            paydate : null,
            payend : null,
            sum : 1,
            issaldo : null,
            debet : 1,
            monthday : null
        }
        const objOutBlank = {
            id : 0,
            user_id : this.props.userSetup.userID,
            class_id : this.props.userSetup.classID,
            name : "введите название",
            short : "короткое",
            isregular : null,
            paydate : null,
            payend : null,
            sum : 1,
            issaldo : null,
            debet : null,
            monthday : null,
            created_at: null,
            updated_at: null
        }

        let {userID, userName, isadmin, langLibrary} = this.props.userSetup;
        let {isMobile} = this.state
        console.log("RENDER_BUDGET", this.props.userSetup)
        const objBlank = {}
        return (
            <div className="AdminPage">
                <div className="navbar"
                     style={userID === 0 ? {"justifyContent": "flex-end"} : {"justifyContent": "space-between"}}>
                    <div className="navBlock">
                        <div className="navBlock">
                            <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center"}}>
                                <Link to="/"><img src={Logo} alt={"My.Marks"}/></Link>
                                <div className="myTitle"><h3><Link to="/">{langLibrary.siteName}</Link></h3></div>
                            </div>
                        </div>
                    </div>
                    <div className="navBlockEx">
                        {isMobile ?
                            <MobileMenu userID={userID} userName={userName} isadmin={isadmin}
                                        withtomain={this.props.withtomain} userLogin={this.userLogin.bind(this)}
                                        userLogout={this.userLogout.bind(this)}/> :
                            userID > 0 && <Menu className="menuTop" userid={userID} isadmin={isadmin}/>
                        }
                        {/*{(window.location.href.slice(-3)==="/r3"&&userID===0)?*/}
                        {/*this.fireUserV3Login(window.location.href):""}*/}
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
                <div className="insAndOutsFactBlock">
                    <div className={"insBlock"}>
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
                    <div className={"outsBlock"}>
                        {/*<div style={{*/}
                            {/*display: "flex",*/}
                            {/*justifyContent: "space-between",*/}
                            {/*height: "30px",*/}
                            {/*margin: "5px 5%"*/}
                        {/*}}>*/}
                            {/*<div style={{fontWeight: "600", fontSize: "1em"}}>Расходы</div>*/}
                            {/*<button>Добавить затраты</button>*/}
                        {/*</div>*/}
                        {/*{this.fillOutTable()}*/}
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
                                        year={this.state.curYear}
                        />
                    </div>
                </div>
                <div className="insAndOutsFactBlock">
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
                        />
                    </div>
                </div>
            </div>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate: (key, payload) => dispatch({type: key, payload: payload}),
        onStopLoading: () => dispatch({type: 'APP_LOADED'}),
        onStartLoading: () => dispatch({type: 'APP_LOADING'}),
        onUserLoggingOut  : token => dispatch(userLoggedOut(token)),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminBudgetPage))