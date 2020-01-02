/**
 * Created by Paul on 15.10.2019.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import '../../containers/App.css'
import '../Menu/menu.css'
import {Link} from 'react-router-dom';
import MobileMenu from '../MobileMenu/mobilemenu'
import {instanceAxios, mapStateToProps, getLangByCountry, waitCursorBlock, axios2, classLetters} from '../../js/helpers'
import {arrLangs, defLang, STUDENTS_GET_URL} from '../../config/config'
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import {API_URL} from '../../config/config'
import '../../css/colors.css'
import './schoollistblock.css'

class SchoolListBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schools: [],
            city: [],
            district: [],
            type: [],
            region: [],
            curRegion: "",
            curCity: "",
            curType: "",
            curDistrict: "",
            curCountry: "",
            curSchool: "",
            curSchoolID: 0,
            btnEnabled: false,
            curLetter: "",
            curTimer : null,
            curSchools : []
        }
        this.findText = ""
        this.onClickCity = this.onClickCity.bind(this)
        this.getOptions = this.getOptions.bind(this)
        this.onClickType = this.onClickType.bind(this)
        this.onClickDistrict = this.onClickDistrict.bind(this)
        this.onFindChange = this.onFindChange.bind(this)
        this.setSchools = this.setSchools.bind(this)
    }

    componentDidMount() {
        // this.getSchList()
    }

    getByRegion = async (country, region) => {
        const json = `{"country":"${country}", "region":"${region}"}`
        console.log("getByRegionJSON:", json)
        this.props.onStartLoading()
        await axios2('post', `${API_URL}schlist/getbyregion`, json)
            .then(res => {
                let city = res.data.city;
                city.unshift({'city': ''})
                let district = res.data.district;
                district.unshift({'district': ''})
                let type = res.data.type;
                type.unshift({'type': ''})
                // let region = res.data.region; type.unshift({'region':''})
                // console.log("getByRegion", res.data)
                this.setState({
                    schools: res.data.schools,
                    curSchools : res.data.schools,
                    city, district, type, curCity: "",
                })
                this.props.onStopLoading()
            })
            .catch(res => {
                console.log("error", res)
                this.props.onStopLoading()
            })
    }
    getSchList = async (country) => {
        this.props.onStartLoading()
        // console.log("getSchList", country)
        await axios2('get', `${API_URL}schlist/get/${country}`)
            .then(res => {
                let city = res.data.city;
                city.unshift({'city': ''})
                let district = res.data.district;
                district.unshift({'district': ''})
                let type = res.data.type;
                type.unshift({'type': ''})
                let region = res.data.region;
                type.unshift({'region': ''})
                console.log("getSchList", res.data)
                this.setState({
                    schools: res.data.schools,
                    city, district, type, region, curCity: "",
                })
                this.props.onStopLoading()
            })
            .catch(res => {
                console.log("error", res)
                this.props.onStopLoading()
            })
    }
    getOptions = (array, kind) => {
        const {curCountry, curCity, curRegion, curDistrict, curType, schools} = this.state
        let arr = array, arrRet = []
        const types = schools.sort((a, b) => {
            if (a.name > b.name) return 1; // если первое значение больше второго
            if (a.name == b.name) return 0; // если равны
            if (a.name < b.name) return -1; // если первое значение меньше второго
        }).filter(item => (item.city === curCity.length ? curCity : item.city) &&
        item.district === (curDistrict.length ? curDistrict : item.district) &&
        item.type === (curType.length && kind !== "type" ? curType : item.type))
        switch (kind) {
            case 'type' :
                let mp = new Map()
                types.forEach(item =>
                    mp.set(item.type, item.type)
                )
                // console.log("Map",types, mp)
                arr = array.filter(item => mp.has(item.type))
                break;
            default:
                break;
        }
        arrRet = arr.map((item, key) => {
            return <option key={key} id={kind === null ? item : item[kind]}>
                { kind === null ? item : item[kind] }
            </option>
        })
        arrRet.unshift(<option key={10000} id={10000}>{""}</option>)
        return arrRet
        // +(kind==='type'?'['+types.filter(itemType=>itemType.type===item[kind]).length+']':'')
        // .unshift(<option key={1000}>{}</option>)
    }
    getMultyOptions = arr => {
        // console.log("getMultyOptions", this.state.schools.filter(item=>item.city===this.state.curCity&&item.district===this.state.curDistrict&&item.type===this.state.curType),
        //     this.state.curCity, this.state.curDistrict, this.state.curType)
        // console.log("getMultyOptions", arr)
        return arr.map((item, key) => {
            return <option key={key} id={item.id} onClick={() => {
                this.onSchoolSelected(item.name, item.id)
            }}>
                { item.name }
            </option>
        })
    }
    getClassLetters = () => {
        const arr = classLetters //["А", "Б", "В", "Г", "Д"]
        let retArr = []
        retArr = arr.map((item, key) => <option key={"let" + key} onClick={() => {
            this.changeLetter(item)
        }}>{item}</option>)
        retArr.unshift(<option key={10001} onClick={() => {
            this.changeLetter("")
        }}>{""}</option>)
        return retArr
    }
    onChangeLetterEx = e => {
        console.log("onChangeLetterEx", e.target.value)
        this.setState({curLetter: e.target.value})
    }
    changeLetter = item => {
        console.log("changeLetter", item, this.state.curLetter)
        this.setState({curLetter: item})
    }
    onClickCountry = e => {
        if (e.target.value.length) {
            this.getSchList(e.target.value)
            this.setState({curCountry: e.target.value, curSchool: "", curSchoolID: 0})
        }
    }
    onClickRegion = e => {
        if (e.target.value.length) {
            const {curCountry, curCity, curDistrict, curType} = this.state
            const {schools} = this.state
            console.log("onClickRegion", schools)
            // if (e.target.value.length) {
            const curRegion = e.target.value
            // const curSchools = schools.filter(item => (item.city === curCity.length ? curCity : item.city) &&
            // item.region === (curRegion.length ? curRegion : item.region) &&
            // item.district === (curDistrict.length ? curDistrict : item.district) &&
            // item.type === (curType.length ? curType : item.type));
            this.getByRegion(curCountry, e.target.value)
            this.setState({curRegion, curSchool: "", curSchoolID: 0})
            // }
        }
    }
    onClickType = e => {
        if (e.target.value.length) {
            const { curCity, curDistrict, curRegion } = this.state
            const {schools} = this.state
            const curType = e.target.value
            const curSchools = schools.filter(item => (item.city === curCity.length ? curCity : item.city) &&
            item.region === (curRegion.length ? curRegion : item.region) &&
            item.district === (curDistrict.length ? curDistrict : item.district) &&
            item.type === (curType.length ? curType : item.type));
            this.setState({curType: e.target.value, curSchools})
        }
    }
    onClickDistrict=e=> {
        if (e.target.value.length) {
            const { curCity, curRegion, curType } = this.state
            const {schools} = this.state
            const curDistrict = e.target.value
            const curSchools = schools.filter(item => (item.city === curCity.length ? curCity : item.city) &&
            item.region === (curRegion.length ? curRegion : item.region) &&
            item.district === (curDistrict.length ? curDistrict : item.district) &&
            item.type === (curType.length ? curType : item.type));
            this.setState({curDistrict: e.target.value, curSchool: "", curSchoolID: 0, curSchools})
        }
    }
    onClickCity = e => {
        const { curDistrict, curRegion, curType } = this.state
        const {schools} = this.state
        const  curCity =  e.target.value
        const curSchools = schools.filter(item => (item.city === curCity.length ? curCity : item.city) &&
        item.region === (curRegion.length ? curRegion : item.region) &&
        item.district === (curDistrict.length ? curDistrict : item.district) &&
        item.type === (curType.length ? curType : item.type));
        this.setState({curCity: e.target.value, curSchool: "", curSchoolID: 0, curSchools})
        // console.log(e.target.value)
    }
    onDoubleClick = e => {

    }
    addToSchool = () => {
        const {curSchool, curSchoolID, curLetter} = this.state
        axios2('post', `${API_URL}class/update/${this.props.userSetup.classID}/${curSchoolID}/${curLetter}`)
            .then(res => {
                    console.log('Success-SchoolUpdate')
                    this.props.onReduxUpdate('UPDATE_SCHOOL', {id: curSchoolID, name: curSchool, class_letter : curLetter})
                }
            )
            .catch(res => console.log('Error-SchoolUpdate', res))
        //console.log("Привязка к учебному заведению")
    }
    onSchoolSelected = (item, id) => {
        this.setState({curSchool: item, curSchoolID: id})
        // console.log("onSchoolSelected", item, id)
        // , e.nativeEvent.target[e.nativeEvent.target.selectedIndex].id
    }
    waitCursorBlock = () => {
        return <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    }
    onFindChange=(e)=> {
        const {schools} = this.state
        // if (e.target.value.length > 1) {
            clearTimeout(this.state.curTimer);
            const timer = setTimeout((val, schools, setSchools) => {
                // console.log("TimerDone", val)
                const curSchools = schools.filter(item=>val.length>1?item.name.indexOf(val)>0:item)
                setSchools(curSchools)
            }, 1000, e.target.value, schools, this.setSchools)
            this.setState({curTimer: timer})
            console.log("onFindChange", e.target.value)
        // }
    }
    setSchools=(curSchools)=>{
        console.log("setSchools", curSchools)
        this.setState({curSchools})
    }

    render() {
        const {
            curCountry, curCity, curRegion, curDistrict, curType, curSchool, curSchoolID,
            region, district, city, type, curLetter, curSchools
        } = this.state
        const {loading} = this.props.userSetup
        console.log("RENDER_SCHOOL", curSchoolID, curLetter.length, this.props.userSetup.curClass)

        return (
            <div>
                <div className={"schoolSelectedBlock"}>
                    {curSchools.length ?
                        <div className="schoolBlock-count">{`Заведений: ${curSchools.length}`}</div> : null}
                    {(loading || loading === -1) ? <div>{loading ? this.waitCursorBlock() : null}</div> : null}
                    <div className="schoolFilters">
                        <div style={{position: "relative"}}>
                            <div className={"schlist-label"}>{"Страна"}</div>
                            <div style={{marginTop: "15px"}}>
                                <select style={{width: "40px"}} name="countries" onClick={this.onClickCountry}
                                        defaultValue={curCountry}>
                                    {this.getOptions(arrLangs, null)}
                                </select>
                            </div>
                        </div>
                        <div style={{position: "relative"}}>
                            <div className={"schlist-label"}>{"Область"}</div>
                            <div style={{marginTop: "15px"}}>
                                <select style={{width: "170px"}} onClick={this.onClickRegion} defaultValue={curRegion}
                                        name="region">
                                    {this.getOptions(region, 'region')}
                                </select>
                            </div>
                        </div>
                        <div style={{position: "relative"}}>
                            <div className={"schlist-label"}>{"Район"}</div>
                            <div style={{marginTop: "15px"}}>
                                <select style={{width: "170px"}} onClick={this.onClickDistrict}
                                        defaultValue={curDistrict} name="distrs">
                                    {this.getOptions(district, 'district')}
                                </select>
                            </div>
                        </div>
                        <div style={{position: "relative"}}>
                            <div className={"schlist-label"}>{"Город/село"}</div>
                            <div style={{marginTop: "15px"}}>
                                <select style={{width: "100px"}} onClick={this.onClickCity} defaultValue={curCity}
                                        name="cities">
                                    {this.getOptions(city, 'city')}
                                </select>
                            </div>
                        </div>
                        <div style={{position: "relative"}}>
                            <div className={"schlist-label"}>{"Тип"}</div>
                            <div style={{marginTop: "15px"}}>
                                <select style={{width: "70px"}} onClick={this.onClickType} defaultValue={curType}
                                        name="types">
                                    {/*{console.log("curType:type", curType, curType.length, type)}*/}
                                    {this.getOptions(type, 'type')}
                                </select>
                            </div>
                        </div>
                        <div style={{position: "relative"}}>
                            <div className={"schlist-label"}>{"Найти по названию"}</div>
                            <div style={{marginTop: "15px"}}>
                                <input
                                       ref={component => this.findText}
                                       onChange={this.onFindChange}
                                       style={{width: "100px"}}
                                       disabled={curCountry.length && curRegion.length ? false : true}/>
                            </div>
                        </div>
                        <div style={{position: "relative"}}>
                            <div className={"schlist-label"}>{"Литера"}</div>
                            <div style={{marginTop: "15px"}}>
                                <select style={{width: "70px"}} onChange={this.onChangeLetterEx}
                                        defaultValue={curLetter} name="letters">
                                    {/*{console.log("curType:type", curType, curType.length, type)}*/}
                                    {this.getClassLetters()}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{left: 0, width: "70%", margin: "5px", height: "100px"}}>
                            <select style={{
                                left: 0,
                                width: "100%",
                                marginBottom: "5px",
                                height: "100px"
                            }} multiple={true}>
                                {this.getMultyOptions(curSchools)}
                            </select>
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            width: "27%",
                            height: "100px"
                        }}>
                            <div style={{fontSize: ".8em"}}>Дополнительная информация</div>
                            <div style={{
                                fontSize: ".8em",
                                color: "#4472C4",
                                textAlign: "center",
                                marginBottom: "7px"
                            }}>{curSchoolID ? "ЛОГО" : null}</div>
                            <div style={{fontSize: ".8em", color: "#4472C4", textAlign: "center"}}>{curSchool}</div>
                            <div
                                className={curSchoolID && curLetter.length && this.props.userSetup.curClass ? "addToSchool" : "addToSchoolDisabled"}
                                onClick={curSchoolID && curLetter.length && this.props.userSetup.curClass ? () => this.addToSchool() : null}>{`Присоединить ${this.props.userSetup.curClass}"${curLetter}"`}</div>
                        </div>
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
    })
}
export default  connect(mapStateToProps, mapDispatchToProps)(withRouter(SchoolListBlock))