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
            curYear: (new Date().getFullYear())
        }
        this.headArray = [
            {name: "№ п/п", width: "20px"},
            {name: "Имя", width: "300px"},
            {name: "Нач.учёбы", width: "85px"},
        ]
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

        // const planIns = [
        //     {
        //         id: 5,
        //         name: "Долг",
        //         short: "Долг",
        //         sum: 0,
        //         start: "20180901",
        //         regular: false,
        //         end: null,
        //         dayOfPayment: null,
        //         income: true,
        //     },
        //     {
        //         id: 3,
        //         name: "Разовый взнос (2018)",
        //         short: "РВ(18)",
        //         sum: 1500,
        //         start: "20180901",
        //         regular: false,
        //         end: null,
        //         dayOfPayment: null,
        //         income: false,
        //     },
        //     {
        //         id: 4,
        //         name: "Разовый взнос (2019)",
        //         short: "РВ(19)",
        //         sum: 1500,
        //         start: "20190901",
        //         regular: false,
        //         end: null,
        //         dayOfPayment: null,
        //         income: false,
        //     },
        //     {
        //         id: 1,
        //         name: "Ежемесячный платёж (класс) 2018",
        //         short: "ЕП(к) 2018",
        //         sum: 250,
        //         start: "20180901",
        //         regular: true,
        //         end: null,
        //         dayOfPayment: 1,
        //         income: false,
        //     },
        //     {
        //         id: 2,
        //         name: "Ежемесячный платёж (школа)",
        //         short: "ЕП(ш) 2018",
        //         sum: 0,
        //         start: "20180901",
        //         regular: true,
        //         end: null,
        //         dayOfPayment: 1,
        //         income: false,
        //     },
        //     {
        //         id: 6,
        //         name: "Ежемесячный платёж (класс) 2019",
        //         short: "ЕП(к) 2019",
        //         sum: 250,
        //         start: "20190901",
        //         regular: true,
        //         end: null,
        //         dayOfPayment: 1,
        //         income: false,
        //     },
        //
        // ]
        // const planOuts = [
        //     {
        //         id: 6,
        //         name: "Подарки учителям",
        //         sum: 300,
        //         start: "20190901",
        //         regular: false,
        //         end: null,
        //         dayOfPayment: 1,
        //         income: false,
        //     },
        //     {
        //         id: 7,
        //         name: "Экскурсия",
        //         sum: 4000,
        //         start: "20191001",
        //         regular: false,
        //         end: null,
        //         dayOfPayment: 1,
        //         income: false,
        //     },
        //     {
        //         id: 8,
        //         name: "Подарки мальчикам",
        //         sum: 1500,
        //         start: "20191002",
        //         regular: false,
        //         end: null,
        //         dayOfPayment: null,
        //         income: false,
        //     },
        // ]

    }

    componentWillMount() {
        this.initData()
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
        return <div>
            <table height="300px" style={{margin: "5px", width: "98%"}}>
                <thead style={{backgroundColor: "#C6EFCE"}}>
                <tr>
                    <th style={{width: "30px", padding: "5px"}}>№ п/п</th>
                    <th style={{width: "100%", padding: "5px"}}>Наименование</th>
                    <th style={{width: "50px", padding: "5px"}}>Сокр.</th>
                    <th style={{width: "50px", padding: "5px"}}>Сумма</th>
                    <th style={{width: "30px", padding: "5px"}}>Регуляр- ный (раз в месяц)</th>
                    <th style={{width: "80px", padding: "5px"}}>Дата оплаты</th>
                    <th style={{width: "80px", padding: "5px"}}>Дата окончания оплаты</th>
                    <th style={{width: "50px", padding: "5px"}}>День месяца (для регул-х)</th>
                    <th style={{width: "30px", padding: "5px"}}>Нач. сальдо</th>
                    <th style={{width: "20px", padding: "5px"}}>-</th>
                </tr>
                </thead>
                <tbody>
                {this.state.planIns.map((item, key) =>
                    <tr key={"r" + key}>
                        <td style={{width: "30px", textAlign: "center"}}>{key + 1}</td>
                        <td style={{width: "100%"}}>{item.name}</td>
                        <td style={{width: "50px", textAlign: "center"}}>{item.short}</td>
                        <td style={{width: "30px", textAlign: "center"}}>{item.sum}</td>
                        <td style={{width: "30px", textAlign: "center"}}>
                            <input type="checkbox" onChange={(e) => {
                                console.log(e.target.value);
                                this.changeState(e, item.id, 4)
                            }} id={(key + 1) + "#7_1#" + key} checked={item.isregular===1}/>
                        </td>
                        <td style={{width: "80px", textAlign: "center"}}>
                            <DatePicker
                                // showMonthYearDropdown
                                fixedHeight
                                dateFormat="dd/MM/yyyy"
                                withPortal
                                locale="ru"
                                selected={item.paydate === null ? null : item.paydate.length===8?dateFromYYYYMMDD(item.paydate):new Date(item.paydate)}
                                onChange={date => this.handleDate('start', item.id, date)}
                                customInput={<input style={{
                                    width: "80px",
                                    textAlign: "center",
                                    backgroundColor: "#7DA8E6",
                                    color: "#fff"
                                }}/>}

                            />
                        </td>
                        <td style={{width: "80px", textAlign: "center"}}>
                            <DatePicker
                                // showMonthYearDropdown
                                fixedHeight
                                dateFormat="dd/MM/yyyy"
                                withPortal
                                locale="ru"
                                selected={item.payend === null ? null : item.payend.length===8?dateFromYYYYMMDD(item.payend):new Date(item.payend)}
                                onChange={date => this.handleDate('end', item.id, date)}
                                customInput={<input style={{
                                    width: "80px",
                                    textAlign: "center",
                                    backgroundColor: "#7DA8E6",
                                    color: "#fff"
                                }}/>}
                            />
                        </td>
                        <td style={{width: "30px", textAlign: "center"}}>
                            <select name="days" onClick={this.onLangClick} defaultValue={item.dayOfPayment}>
                                {daysArr.map((item, key) => {
                                    return <option key={key}>
                                        {item}
                                    </option>
                                })}
                            </select>
                        </td>
                        <td style={{width: "30px", textAlign: "center"}}>
                            <input type="checkbox" onChange={(e) => {
                                console.log(e.target.value);
                                this.changeState(e, item.id, 8)
                            }} id={(key + 1) + "#7_1#" + key} checked={item.issaldo}/>
                        </td>
                        <td><button onClick={()=>{console.log("Удалить?")}}>-</button></td>
                    </tr>
                )}
                </tbody>
            </table>
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
                    <th style={{width: "80px", padding: "5px"}}>Дата оплаты</th>
                    <th style={{width: "80px", padding: "5px"}}>Дата окончания оплаты</th>
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
                        <td style={{width: "80px", textAlign: "center"}}>
                            <DatePicker
                                // showMonthYearDropdown
                                fixedHeight
                                dateFormat="dd/MM/yyyy"
                                withPortal
                                locale="ru"
                                selected={item.start === null ? null : item.paydate.length===8?dateFromYYYYMMDD(item.paydate):new Date(item.paydate)}
                                onChange={date => this.handleDate('start', item.id, date)}
                                customInput={<input style={{
                                    width: "80px",
                                    textAlign: "center",
                                    backgroundColor: "#7DA8E6",
                                    color: "#fff"
                                }}/>}

                            />
                        </td>
                        <td style={{width: "80px", textAlign: "center"}}>
                            <DatePicker
                                // showMonthYearDropdown
                                fixedHeight
                                dateFormat="dd/MM/yyyy"
                                withPortal
                                locale="ru"
                                selected={item.payend === null ? null : item.payend.length===8?dateFromYYYYMMDD(item.payend):new Date(item.payend)}
                                onChange={date => this.handleDate('end', item.id, date)}
                                customInput={<input style={{
                                    width: "80px",
                                    textAlign: "center",
                                    backgroundColor: "#7DA8E6",
                                    color: "#fff"
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
    createTableRows(rowsArr, onInputChange, withInput, row, column, classNameOfTD, checkedMap, headex, year) {
        // let {row, column} = this.state
        console.log("createTableRows", headex, this.props.userSetup.budget)
        let cell = [],
            rows = []
            rowsArr = rowsArr.filter(item=>item.isout!==1)
        if (rowsArr) {
            for (let i = 0; i < rowsArr.length; i++) {
                cell = []
                cell.push(<td style={{width: "25px"}} key={"bbr" + (i + 1) + "c1"}>{i + 1}</td>)
                cell.push(<td className="left-text" style={{width: "300px", paddingLeft: "2px", paddingRight: "2px"}}
                              id={(i + 1) + "#2#" + rowsArr[i].id} key={"bbr" + (i + 1) + "c2"}>
                    {rowsArr[i].student_name} {(row === (i + 1) && column === 2 && withInput) ? rowsArr[i].student_name : null}
                </td>)
                // console.log("datein", rowsArr[i], i, (rowsArr[i].datein===null)?null:((rowsArr[i].datein.length===8)?dateFromYYYYMMDD(rowsArr[i].datein):(new Date(rowsArr[i].datein))))
                cell.push(
                    <td key={"bbr" + (i + 1) + "c3"} style={{width: "85px", textAlign: "center"}}>
                        <DatePicker
                            // showMonthYearDropdown
                            fixedHeight
                            dateFormat="dd/MM/yyyy"
                            withPortal
                            locale="ru"
                            scrollableYearDropdown
                            showYearDropdown
                            selected={rowsArr[i].datein === null ? null : ((rowsArr[i].datein.length === 8) ? dateFromYYYYMMDD(rowsArr[i].datein) : (new Date(rowsArr[i].datein)))}
                            onChange={date => this.handleDate('datein', rowsArr[i].id, date)}
                            customInput={<input style={{
                                width: "85px",
                                textAlign: "center",
                                backgroundColor: "#7DA8E6",
                                color: "#fff"
                            }}/>}
                        />
                    </td>)


                if (headex!==undefined)
                    for (let j = 0; j < headex.length; j++) {
                        let curSum = null
                        if (this.props.userSetup.budget!==undefined&&this.props.userSetup.budget.length) {
                            const arr = this.props.userSetup.budget.filter(item => {
                                // console.log("FILTER", headex[j], item)
                                return item.student_id === rowsArr[i].id
                            && item.payment_id === headex[j].item.id
                            && (headex[j].item.isregular === 1?toYYYYMMDD(new Date(item.paydate)) === toYYYYMMDD(new Date(headex[j].realdate)):toYYYYMMDD(new Date(item.paydate)) === toYYYYMMDD(new Date(headex[j].item.paydate)))
                            && (headex[j].item.isregular === 1?j === item.payment_offset:true)
                        }
                            )

                            if (arr.length)
                                curSum = arr[0].sum
                        }
                        cell.push(<td key={"bbr" + j + (i + 1) + "c3"}
                                      id={headex[j].item.id + '#' + rowsArr[i].id + "#" + headex[j].item.sum}
                                      onClick={() => {
                                          const budgetID = 0
                                          const json = `{"id":${budgetID},
                                                        "class_id":${this.props.userSetup.classID},
                                                        "user_id":${this.props.userSetup.userID},
                                                        "student_id":${rowsArr[i].id},
                                                        "paydate":"${toYYYYMMDD(new Date(headex[j].realdate))}",
                                                        "sum":${headex[j].item.sum.toString().replace(",",".")},
                                                        "payment_id":${headex[j].item.id},
                                                        "payment_offset":${j},
                                                        "isregular":${headex[j].item.isregular}}`
                                          console.log("JSON", json)
                                          instanceAxios().post(`${API_URL}budget/update/${budgetID}`,json)
                                              .then(res=>console.log("UPDATED", res))
                                              .catch(res=>console.log("ERROR", res))
                                          console.log(headex[j].item.id + '#' + rowsArr[i].id + "#" + headex[j].item.sum)
                                      }}
                                      style={{width: "54px", textAlign: "center", backgroundColor : curSum!==null?"#C6EFCE":"#fff"}}>
                            {curSum}
                        </td>)
                    }
                // // Галочка скрыть студента из списка
                // cell.push(<td className="center-text" id={(i + 1) + "#6#" + rowsArr[i].id} key={"r" + (i + 1) + "c6"}>
                //     <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#6_1#" + rowsArr[i].id}
                //            checked={checkedMap.has((i + 1) + "#6_1#" + rowsArr[i].id)}/>
                // </td>)
                // // Реальный без Email
                // cell.push(<td className="center-text" id={(i + 1) + "#7#" + rowsArr[i].id} key={"r" + (i + 1) + "c7"}>
                //     <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#7_1#" + rowsArr[i].id}
                //            checked={checkedMap.has((i + 1) + "#7_1#" + rowsArr[i].id)}/>
                // </td>)
                // // Оценок
                // cell.push(<td style={{textAlign : "center"}} id={(i + 1) + "#8#" + rowsArr[i].id} key={"r" + (i + 1) + "c8"}>
                //     {rowsArr[i].marks_count}
                // </td>)
                // // Другой студент
                // cell.push(<td className="center-text" id={(i + 1) + "#9#" + rowsArr[i].id} key={"r" + (i + 1) + "c9"}>
                //     <select name="students" style={{width : "80px"}} defaultValue={-1} onClick={this.onSelectStudent}>
                //         <option key={"key"} value={'-1#-1'}>
                //             { ""}
                //         </option>
                //         {
                //             rowsArr.map((value, key)=>{
                //                 if (value.id!==rowsArr[i].id&&value.email!==null&&value.email.length)
                //                     return      <option key={key} value={rowsArr[i].id+'#'+value.id}>
                //                         { value.student_name + `[${value.student_nick}]` }
                //                     </option>})}
                //     </select>
                // </td>)
                // // Админ
                // cell.push(<td valign="bottom" className="center-text" id={(i + 1) + "#10#" + rowsArr[i].id} key={"r" + (i + 1) + "c10"}>
                //     <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#10#" + rowsArr[i].id}
                //            disabled="disabled" checked={checkedMap.has((i + 1) + "#10#" + rowsArr[i].id)}/>
                // </td>)
                // // Учитель
                // cell.push(<td valign="bottom" className="center-text" id={(i + 1) + "#12#" + rowsArr[i].id} key={"r" + (i + 1) + "c10"}>
                //     <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#12#" + rowsArr[i].id}
                //            disabled="disabled" checked={checkedMap.has((i + 1) + "#12#" + rowsArr[i].id)}/>
                // </td>)
                // // Ученик
                // cell.push(<td valign="bottom" className="center-text" id={(i + 1) + "#13#" + rowsArr[i].id} key={"r" + (i + 1) + "c10"}>
                //     <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#13#" + rowsArr[i].id}
                //            disabled="disabled" checked={checkedMap.has((i + 1) + "#13#" + rowsArr[i].id)}/>
                // </td>)
                // // Родком
                // cell.push(<td valign="bottom" className="center-text" id={(i + 1) + "#14#" + rowsArr[i].id} key={"r" + (i + 1) + "c10"}>
                //     <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#14#" + rowsArr[i].id}
                //            disabled="disabled" checked={checkedMap.has((i + 1) + "#14#" + rowsArr[i].id)}/>
                // </td>)
                // // Подписка
                // cell.push(<td valign="bottom" className="center-text" id={(i + 1) + "#15#" + rowsArr[i].id} key={"r" + (i + 1) + "c10"}>
                //     <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#15#" + rowsArr[i].id}
                //            disabled="disabled" checked={checkedMap.has((i + 1) + "#15#" + rowsArr[i].id)}/>
                // </td>)
                // // Перевод
                // cell.push(<td valign="bottom" className="center-text" id={(i + 1) + "#16#" + rowsArr[i].id} key={"r" + (i + 1) + "c10"}>
                //     <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#16#" + rowsArr[i].id}
                //            disabled="disabled" checked={checkedMap.has((i + 1) + "#16#" + rowsArr[i].id)}/>
                // </td>)
                // // Админ-ция
                // cell.push(<td valign="bottom" className="center-text" id={(i + 1) + "#17#" + rowsArr[i].id} key={"r" + (i + 1) + "c10"}>
                //     <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#17#" + rowsArr[i].id}
                //            disabled="disabled" checked={checkedMap.has((i + 1) + "#17#" + rowsArr[i].id)}/>
                // </td>)
                // // Партнер
                // cell.push(<td valign="bottom" className="center-text" id={(i + 1) + "#18#" + rowsArr[i].id} key={"r" + (i + 1) + "c10"}>
                //     <input type="checkbox" onChange={this.changeState} id={(i + 1) + "#18#" + rowsArr[i].id}
                //            disabled="disabled" checked={checkedMap.has((i + 1) + "#18#" + rowsArr[i].id)}/>
                // </td>)
                // // Примечание
                // cell.push(<td className="left-text"
                //               style={{"paddingLeft": "5px", "paddingRight": "5px", "fontSize": "0.8em"}}
                //               id={(i + 1) + "#5#" + rowsArr[i].id} key={"r" + (i + 1) + "c5"}
                //               onClick={this.onClick}>{rowsArr[i].memo}{(row === (i + 1) && column === 5 && withInput) ?
                //     <input type="text" id={(i + 1) + "#5#" + rowsArr[i].id} className="inputEditor"
                //            onChange={e=>this.onInputChange(e.target.value, rowsArr[i].id)} onKeyPress={this.onInputKeyPress}
                //            defaultValue={rowsArr[i].memo}/> : ""}</td>)
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
                            if ((item.payend !== null && ((new Date(newStart)) < (new Date(item.payend)))) || item.payend == null) {
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
        console.log("loginBlock", loading, userID)
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
        let {userID, userName, isadmin, loading, showLoginLight, langLibrary} = this.props.userSetup;
        let {isMobile} = this.state
        console.log("RENDER_BUDGET")
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
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            height: "30px",
                            margin: "5px 5%"
                        }}>
                            <div style={{fontWeight: "600", fontSize: "1em"}}>Взносы</div>
                            <button>Добавить взнос</button>
                        </div>
                        {this.fillInTable()}
                    </div>
                    <div className={"outsBlock"}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            height: "30px",
                            margin: "5px 5%"
                        }}>
                            <div style={{fontWeight: "600", fontSize: "1em"}}>Расходы</div>
                            <button>Добавить затраты</button>
                        </div>
                        {this.fillOutTable()}
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
                        <UniversalTable head={this.state.factInsHeader} rows={this.state.rowArray}
                                        createTableRows={this.createTableRows} classNameOfTD={this.classNameOfTD}
                                        onstudentclick={this.onSelectStudent}
                                        selectedstudent={this.state.curStudent}
                                        btncaption={""}
                                        objblank={objBlank} initrows={() => {
                            return this.props.userSetup.students
                        }}
                                        kind={"budget"}
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