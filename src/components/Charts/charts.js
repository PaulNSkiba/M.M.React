/**
 * Created by Paul on 01.03.2019.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux'
// import {LineChart, BarChart} from 'react-easy-chart';
import Select from '../Select/select'
import {AddDay} from '../../js/helpers'
import Chart from "react-google-charts";

import "./charts.css"

class Charts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            marksarray : [],
            marksmap : new Map(),
            periodStart : AddDay((new Date()),-31),
            periodDays : 31,
            place : ""
        };
    }
    componentWillMount(){
        this.setState({
            marksarray:this.getMarksArray()
        });
    }
    getDateFormat(value) {
        // return value.getDay()+'-'+
    }
    getMarksArray(){
        let {marks:marksredux} = this.props.userSetup;
        let marksarray = [], map = new Map(),
            // marksarray2 = [],
            arr = [], arr2 = [], mark = {};
        // class Markobj {
        //     constructor(x, y) {
        //         this.x = x;
        //         this.y = y;
        //     }
        // }
        // console.log("getMarksArrayPeriod", new Date(marksredux[0].mark_date), new Date(this.state.periodStart));
        let newDate = new Date()
        if (marksredux.length>0) {
            for (let i = 0; i < marksredux.length; i++) {

                if (new Date(marksredux[i].mark_date) > new Date(this.state.periodStart)){
                mark = {}
                newDate = new Date(marksredux[i].mark_date)
                mark.x = (newDate.getDate() + '.' + (Number(newDate.getMonth()) + 1).toString()) //marksredux[i].mark_date //(i+1).toString()//
                mark.y = Number(marksredux[i].mark)
                if (!map.has(marksredux[i].subj_key))
                    map.set(marksredux[i].subj_key, [])

                arr2 = map.get(marksredux[i].subj_key)
                arr2.push(mark)
                map.set(marksredux[i].subj_key, arr2)

                arr.push(mark);
            }
                // marks.set(marksredux[i].subj_key.replace('#', '')+"#"+marksredux[i].stud_id+"#"+toYYYYMMDD(new Date(marksredux[i].mark_date)), marksredux[i].mark)
            }
            marksarray.push(arr);
        }
        // else
        //     marksarray = [
        //         [
        //             { x: '1-Jan-15', y: 20 },{ x: '1-Feb-15', y: 10 },{ x: '1-Mar-15', y: 33 },
        //             { x: '1-Apr-15', y: 45 },{ x: '1-May-15', y: 15 }
        //         ], [
        //             { x: '1-Jan-15', y: 10 },{ x: '1-Feb-15', y: 15 },{ x: '1-Mar-15', y: 13 },
        //             { x: '1-Apr-15', y: 15 },{ x: '1-May-15', y: 10 }
        //         ]
        //     ]
        // marksarray2 = [
        //     [
        //         { x: '1-Jan-15', y: 20 },{ x: '1-Feb-15', y: 10 },{ x: '1-Mar-15', y: 33 },
        //         { x: '1-Apr-15', y: 45 },{ x: '1-May-15', y: 15 }
        //     ], [
        //         { x: '1-Jan-15', y: 10 },{ x: '1-Feb-15', y: 15 },{ x: '1-Mar-15', y: 13 },
        //         { x: '1-Apr-15', y: 15 },{ x: '1-May-15', y: 10 }
        //     ]
        // ]


        // console.log("map", map, this.props.userSetup.studSubj,
        //                         this.props.userSetup.studSubj.keys(),
        //                         Array.from(this.props.userSetup.studSubj.keys())[0],
        //                         map.has(Array.from(this.props.userSetup.studSubj.keys())[0]), this.props.userSetup.studSubj.size)
        marksarray = []

        if (this.props.userSetup.studSubj.size) {
            if (map.has(Array.from(this.props.userSetup.studSubj.keys())[0]))
                marksarray.push(map.get(Array.from(this.props.userSetup.studSubj.keys())[0]))
            }
        else {
            for (let valarr of map.values()) {
                marksarray.push(valarr)
            }
        }
        // console.log(marksarray);
        return marksarray

    }
    changePeriod(name, value){
        switch(name) {
            case 'listperiods' :
            switch (value)
            {
                case 'WEEK':
                    this.setState({ periodStart : AddDay((new Date()),-7), periodDays : 7 }); break;
                case 'MONTH':
                    this.setState({ periodStart : AddDay((new Date()),-31), periodDays : 31 }); break;
                case 'QUARTER':
                    this.setState({ periodStart : AddDay((new Date()),-90), periodDays : 90 }); break;
                case 'TERM':
                    this.setState({ periodStart : AddDay((new Date()),-150), periodDays : 150 }); break;
                case 'YEAR':
                    this.setState({ periodStart : AddDay((new Date()),-365), periodDays : 365 }); break;
                case 'ALL':
                    this.setState({ periodStart : AddDay((new Date()),-3650), periodDays : 3650 }); break;
                default:
                    break;
            }
            break;
            default:
                break;
        }
        // console.log(name, value)
    }
    prepDataForChart(subj_key){
        let {mark_dates, marks, best_lines, avg_lines} = this.props.userSetup;
        let retArr = [], datestr = '', datemod = 1

        // retArr.push(["Дата", "Мои оценки", "Лучший ученик", "Средние оценки"])

        let newDate = new Date(), arrMyMarks = [], arrBestMarks = [], arrAvgMarks = [], tempArr = []
            // , MyPlace = [], place = "";
        // Каждый 12й убираем (проверим сколько дат - максимум 15)
        datemod = Math.round(mark_dates.length / 7);

        for (let i = 0; i < mark_dates.length; i++) {
            newDate = new Date(mark_dates[i].mark_date)
            if (new Date(mark_dates[i].mark_date) > new Date(this.state.periodStart)) {
                datestr = newDate.getDate() + '.' + (Number(newDate.getMonth()) + 1).toString()
                datemod = datemod ===0?1:datemod;
                if ((i % datemod === 0)) datestr = "";
                arrMyMarks = marks.filter((value)=>(
                     (mark_dates[i].mark_date===value.mark_date)&&(subj_key===value.subj_key)
                        ))

                tempArr = best_lines.filter((value)=> (
                    value.subj_key === subj_key && value.days === this.state.periodDays
                ))
                if (!(tempArr===undefined))
                    // console.log("tempArr0", tempArr[0], Object(tempArr[0]), Object(tempArr[0]).marks, typeof tempArr,  tempArr===undefined)
                    if (Object(tempArr[0]).marks) {
                    arrBestMarks = Object(tempArr[0]).marks.filter((value)=>(
                        (mark_dates[i].mark_date===value.mark_date)&&(subj_key===value.subj_key)
                        ))
                    }

                tempArr = avg_lines.filter((value)=> (
                    value.subj_key === subj_key && value.days === this.state.periodDays
                ))
                if (!(tempArr===undefined))
                    // console.log("tempArr0", tempArr[0], Object(tempArr[0]), Object(tempArr[0]).marks, typeof tempArr,  tempArr===undefined)
                {
                    if (Object(tempArr[0]).marks) {
                        arrAvgMarks = Object(tempArr[0]).marks.filter((value) => (
                            (mark_dates[i].mark_date === value.mark_date) && (subj_key === value.subj_key)
                        ))
                    }

                    // if (Object(tempArr[0]).myplace) {
                    //     place = Object(tempArr[0]).myplace.length
                    //     MyPlace = Object(tempArr[0]).myplace.filter((value) => (
                    //         (subj_key === value.subj_key) && (value.stud_id === this.props.userSetup.studentId)
                    //     ))
                    // }
                }

                // console.log("MyPLACE", Object(MyPlace[0]).rank, Object(tempArr[0]).myplace, this.props.userSetup.studentId)
                // console.log("arrMyMarks+arrBestMarks", arrMyMarks, arrBestMarks, arrMyMarks.length, arrBestMarks.length)

                // (retArr.length===1?Number(null):null)

                retArr.push([datestr,   arrMyMarks.length?Number(arrMyMarks[0].mark):null,
                                        arrBestMarks.length?Number(arrBestMarks[0].mark):null,
                                        arrAvgMarks.length?Number(arrAvgMarks[0].mark):null])

            }
            }
         // console.log("prepDataForChart", subj_key, retArr)
        return retArr;
    }
    getPlace(subj_key){
        let {avg_lines} = this.props.userSetup;
        let tempArr = [], MyPlace = [], place = "";

        tempArr = avg_lines.filter((value)=> (
            value.subj_key === subj_key && value.days === this.state.periodDays
        ))

        if (!(tempArr===undefined))
        // console.log("tempArr0", tempArr[0], Object(tempArr[0]), Object(tempArr[0]).marks, typeof tempArr,  tempArr===undefined)
        {
            if (Object(tempArr[0]).myplace) {
                place = Object(tempArr[0]).myplace.length
                MyPlace = Object(tempArr[0]).myplace.filter((value) => (
                    (subj_key === value.subj_key) && (value.stud_id === this.props.userSetup.studentID)
                ))
            }
        }
        if (tempArr.length && MyPlace.length)
            return Object(MyPlace[0]).rank + " из " + place
        else
            return "Нет оценок за " + this.state.periodDays + "дн."
    }
    prepDataForBarChart() {
        let {avg_marks} = this.props.userSetup;
        let colors = [   "#87DD97", "#7DA8E6", "#C6EFCE", "#409be6", "silver", "gold", "#e5e4e2", "#C00000",'green','#006EFF','#00FF08', "#b87333", "#FFEB9C", "#FF8594", ]
        let retArr = [], tempArr = [] // datestr = '',
        retArr.push(["Предмет", "Средняя оценка", { role: "style" }])
        tempArr = avg_marks.filter((value)=> (
            value.days === this.state.periodDays
        ))
        if (Object(tempArr[0]).marks) {
            for (let i = 0; i < Object(tempArr[0]).marks.length; i++) {
                retArr.push([Object(tempArr[0]).marks[i].subj_name_ua, Number(Object(tempArr[0]).marks[i].mark), colors.length>i?colors[i]:"lightgrey"])
            }
        }

        // console.log("prepDataForBarChart", retArr, tempArr)
        return retArr
    }
    render() {
        console.log("this.props.userSetup.studSubj", this.props.userSetup.studSubj, this.props.userSetup)
        let data = []
        let data2 = []
        let place = ""
        let {studSubj, userID} = this.props.userSetup
        let map = new Map()

        if (!userID) return (<div></div>)

        if (!studSubj.size) {
            let {subjects_list : subjlist} = this.props.userSetup
            map.clear()
            // const name = subjlist[0].subj_name_ua
            map.set(subjlist[0].subj_key, subjlist[0].subj_name_ua)
            studSubj = map
        }

        // let data = [
        //     ["Дата", "Мои оценки", "Лучший ученик", "Средние оценки"],
        //     ["2004", 1000, 400, 300],
        //     ["2005", 1170, 460, 400],
        //     ["2006", 660, 1120, 800],
        //     ["2007", 1030, 540, 700]
        // ];
        // console.log("this.props.userSetup.studSubj.keys())[0]", Array.from(this.props.userSetup.studSubj.keys())[0])
        // if (!this.props.userSetup.studSubj.length) return (<div></div>)

        data = this.prepDataForChart(Array.from(studSubj.keys())[0])
        data2 = this.prepDataForBarChart()
        const options = {
            title: studSubj.size?Array.from(studSubj.values())[0].toString().toUpperCase():'',
            curveType: "function",
            // series: {
            //     1: { curveType: 'function' },
            //     2: { curveType: 'function' },
            //     3: { curveType: 'function' },
            // },
            interpolateNulls: true,
            legend: { position: "bottom" },
            pointsVisible: true,
            chartArea:{left:30,top:30,width:"90%",height:"80%"},
        };
        // "Дата", "Мои оценки", "Лучший ученик", "Средние оценки"
        const options2 = {
            colors: [  "#87DD97", "#7DA8E6", "#C6EFCE", "#409be6", "silver", "gold", "#e5e4e2", "#C00000",'green','#006EFF','#00FF08', "#b87333", "#FFEB9C", "#FF8594", ],
            chartArea:{left:30,top:30,width:"90%",height:"80%"},
        }
        place = this.getPlace(Array.from(studSubj.keys())[0])

        return(
            <div className="mainChartSection">
                <div className="selectGroup">
                    <Select  list={[{id:"WEEK", alias:"Неделя (7дней)"},
                                    {id:"MONTH", alias:"Месяц (31день)"},
                                    {id:"QUARTER", alias:"Четверть (90дней)"},
                                    {id:"TERM", alias:"Семестр (150дней)"},
                                    {id:"YEAR", alias:"Год (365дней)"},
                                    {id:"ALL", alias:"Все данные (10лет)"}
                                    ]}
                             selected={"MONTH"}
                             key={"id"}
                             valuename={"alias"}
                             name={"listperiods"}
                             caption="Период:"
                             value={"id"}
                             onchange={this.changePeriod.bind(this)}
                    />
                   <div id="rangeStatus"><b>{"УСПЕВАЕМОСТЬ: " + place}</b></div>
                </div>

                {/*{console.log("DATA", data, data.length)}*/}
                {this.props.userSetup.marks.length?
                <Chart
                    chartType="LineChart"
                    width="100%"
                    height="400px"
                    columns={[
                    {
                        type: 'string',
                        label: 'Дата',
                    },
                    {
                        type: 'number',
                        label: 'Мои оценки',
                    },
                    {
                        type: 'number',
                        label: 'Лучший ученик',
                    },
                    {
                        type: 'number',
                        label: 'Средние оценки',
                    }
                        ]}
                    rows={data}
                    options={options}
                />:""}


            {/*<LineChart*/}
                {/*axes*/}
                {/*grid*/}
                {/*dataPoints*/}
                {/*lineColors={["#52aee6"]}*/}
                {/*// yAxisOrientRight*/}
                {/*// xTicks={5}*/}
                {/*// yTicks={5}*/}
                {/*xType={'text'}*/}
                {/*yDomainRange={[0, 13]}*/}
                {/*interpolate={'cardinal'}*/}
                {/*width={750}*/}
                {/*height={300}*/}
                {/*margin={{top: 30, right: 30, bottom: 30, left: 40}}*/}
                {/*axisLabels={{x: 'Даты оценок', y: 'Оценки'}}*/}
                {/*data={this.getMarksArray()}*/}
            {/*/>*/}
                {this.props.userSetup.marks.length?
                    <Chart
                    chartType="ColumnChart"
                    width="100%"
                    height="400px"
                    data={data2}
                    options={options2}
                    />:""
                }
            {/*<BarChart*/}
                {/*axisLabels={{x: 'My x Axis', y: 'My y Axis'}}*/}
                {/*axes*/}
                {/*grid*/}
                {/*colorBars*/}
                {/*width={750}*/}
                {/*height={300}*/}
                {/*margin={{top: 30, right: 30, bottom: 30, left: 30}}*/}
                {/*barWidth={40}*/}
                {/*// xType={'time'}*/}
                {/*data={[*/}
                    {/*{ x: 'Математика', y: 20 },*/}
                    {/*{ x: 'Биология', y: 30, color: '#f00' },*/}
                    {/*{ x: 'C', y: 40 },*/}
                    {/*{ x: 'D', y: 20 },*/}
                    {/*{ x: 'E', y: 40 },*/}
                    {/*{ x: 'F', y: 25 },*/}
                    {/*{ x: 'G', y: 5, color: 'orange' }*/}
                {/*]}*/}
            {/*/>*/}
            </div>
        )
    }
}
const mapStateToProps = store => {
    return {
        user:       store.user,
        userSetup:  store.userSetup,
    }
}

const mapDispatchToProps = dispatch => {
    return ({

    })
}


export default connect(mapStateToProps, mapDispatchToProps)(Charts)
