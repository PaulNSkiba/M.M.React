/**
 * Created by Paul on 15.10.2019.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom'
import '../../containers/App.css'
import '../Menu/menu.css'
import { Link } from 'react-router-dom';
import MobileMenu from '../MobileMenu/mobilemenu'
import { instanceAxios, mapStateToProps, getLangByCountry, waitCursorBlock } from '../../js/helpers'
import { arrLangs, defLang, STUDENTS_GET_URL } from '../../config/config'
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import { API_URL } from '../../config/config'
import '../../css/colors.css'
import './schoollistblock.css'

class SchoolListBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schools : [],
            cities : [],
            distrs : [],
            types : [],
            curCity : null,
            curType : null,
            curDistrict : null,
            curCountry : null,
        }
        this.onClickCity = this.onClickCity.bind(this)
        this.getOptions = this.getOptions.bind(this)
        this.onClickType = this.onClickType.bind(this)
        this.onClickDistrict = this.onClickDistrict.bind(this)
    }
    componentDidMount(){
        this.getSchList()
    }
    getSchList=async ()=>{
        await instanceAxios().get(API_URL + 'schlist/get')
            .then(res=>{
                let city = res.data.city; city.unshift({'city':''})
                let district = res.data.district; district.unshift({'district':''})
                let type = res.data.type; type.unshift({'type':''})
                this.setState({
                    schools : res.data.schools,
                        cities : city,
                        distrs : district,
                        types : type,
                        curCity : null,
                    })
            })
            .catch(res=>{
                console.log("error", res)
            })
    }
    getOptions=(array, kind)=>{
        let arr = array
        const types = this.state.schools.filter(item=>item.city===this.state.curCity&&item.district===this.state.curDistrict)
        switch (kind) {
            case 'type' :
                let mp = new Map()
                types.forEach(item=>
                    mp.set(item.type, item.type)
                )
                console.log("Map",types, mp)
                arr = array.filter(item=>mp.has(item.type))
                break;
            default:
                break;
        }
        return arr.map((item,key)=>{
            return <option key={key} id={kind===null?item:item[kind]}>
                        { kind===null?item:item[kind] }
                    </option>
        })
            // +(kind==='type'?'['+types.filter(itemType=>itemType.type===item[kind]).length+']':'')
            // .unshift(<option key={1000}>{}</option>)
    }
    getMultyOptions=arr=>{
        console.log("getMultyOptions", this.state.schools.filter(item=>item.city===this.state.curCity&&item.district===this.state.curDistrict&&item.type===this.state.curType),
            this.state.curCity, this.state.curDistrict, this.state.curType)
        return arr.map((item,key)=>{
            return <option key={key} id={item.pk}>
                { item.name }
            </option>
        })
    }
    onClickCountry=e=>{
        this.setState({curCountry: e.target.value})
    }
    onClickType=e=>{
        this.setState({curType: e.target.value})
    }
    onClickDistrict=e=>{
        console.log("getMultyOptions", e.target.value)
            this.setState({curDistrict: e.target.value})
    }
    onClickCity=e=>{
        this.setState({curCity: e.target.value})
        console.log(e.target.value)
    }
    onDoubleClick=e=>{

    }
    render() {
        return (
            <div>
                <div className={"schoolSelectedBlock"}>
                    <div className="schoolFilters">
                        <div>
                            {"Страна "}
                            <select name="langs" onClick={this.onClickCountry} defaultValue={defLang}>
                                {this.getOptions(arrLangs, null)}
                            </select>
                        </div>
                        <div>
                            {"Город/Область "}
                            <select onClick={this.onClickCity} defaultValue={-1} name="cities">
                                {this.getOptions(this.state.cities, 'city')}
                            </select>
                        </div>
                        <div>
                            {"Область/Район "}
                            <select onClick={this.onClickDistrict} defaultValue={-1} name="distrs">
                                {this.getOptions(this.state.distrs.filter(item=>item.city===this.state.curCity),'district')}
                            </select>
                        </div>
                        <div>
                            {"Тип "}
                            <select onClick={this.onClickType} defaultValue={-1} name="types">
                                {this.getOptions(this.state.types, 'type')}
                            </select>
                        </div>
                        <div>
                            {"НАЙТИ ПО НАЗВАНИЮ "}
                            <input/>
                        </div>
                    </div>
                    <select style={{left : 0, width : "98%", margin : "5px"}} multiple={true}>
                        {this.getMultyOptions(this.state.schools.filter(item=>item.city===this.state.curCity&&item.district===this.state.curDistrict&&item.type===this.state.curType))}
                    </select>
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
export default  connect(mapStateToProps, mapDispatchToProps)(withRouter(SchoolListBlock))