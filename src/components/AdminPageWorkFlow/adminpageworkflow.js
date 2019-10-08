/**
 * Created by Paul on 10.08.2019.
 */
import React, { Component } from 'react';
import { AUTH_URL, defLang, arrLangs } from '../../config/config'
import { connect } from 'react-redux'
import { toYYYYMMDD, instanceAxios, mapStateToProps, getLangByCountry, dateDiffHour } from '../../js/helpers'
import LoginBlockLight from '../LoginBlockLight/loginblocklight'
import '../../css/colors.css';
import './adminpageworkflow.css'
import '../Menu/menu.css'
import { Link } from 'react-router-dom';
import MobileMenu from '../MobileMenu/mobilemenu'
import {withRouter} from 'react-router-dom'
import Menu from '../Menu/menu'
import { userLoggedInByToken, userLoggedOut } from '../../actions/userAuthActions'
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import Logo from '../../img/LogoMyMsmall.png'

class AdminPageWorkFlow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            workflowitems : this.loadWorkItems(),
            selectedItem : {id:0},
            itemEdit : false,
            filterType : [],
            filterStatus : [],
            isMobile : window.screen.width < 400,
        }
        this.onItemClick = this.onItemClick.bind(this)
        this.loadWorkItems = this.loadWorkItems.bind(this)
        this.onClickItemType = this.onClickItemType.bind(this)
        this.onClickItemStatus = this.onClickItemStatus.bind(this)
        this.onChangeItemType = this.onChangeItemType.bind(this)
        this.onChangeItemStatus = this.onChangeItemStatus.bind(this)
        this.onNewFlowItem = this.onNewFlowItem.bind(this)
        this.onNewFlowSubItem = this.onNewFlowSubItem.bind(this)
        this.onDoubleItemDescrClick = this.onDoubleItemDescrClick.bind(this)
        this.OnKeyPressTextArea = this.OnKeyPressTextArea.bind(this)
        this.onNewFlowItemSave = this.onNewFlowItemSave.bind(this)
        this.onNewFlowItemCancel = this.onNewFlowItemCancel.bind(this)
        this.onFilterTypeClick = this.onFilterTypeClick.bind(this)
        this.onFilterStatusClick = this.onFilterStatusClick.bind(this)
        this.userLogout = this.userLogout.bind(this)
        this.userID = 0
        this.currentType = 0
        this.currentStatus = 0

    }
    componentWillMount(){
        this.loadWorkItems()
        this.userID = this.props.userSetup.userID
    }
    componentDidMount(){
    }
    renderSubjects() {
    }
    loadWorkItems=()=>{
        instanceAxios().get(AUTH_URL + '/api/workflow/get', null, null)
            .then(response => {
                // this.setState({ subjects: response.data });
                // console.log(response.data);
                let workflowitems = response.data.map((item)=> {
                    item.active = false
                    return item
                }
                    // <div key={item.id} id={item.id} className="mym-wf-workflow-item" onClick={this.onItemClick}>{item.wf_memo}</div>
                )
                this.setState({workflowitems})

            })
            .catch(response => {
                console.log(response.data);
                // Список ошибок в отклике...
            })
    }
    onClickItemType=(e)=>{
    }
    onClickItemStatus=(e)=>{
    }
    onClick=(e)=> {
    }
    onChangeItemType=(e)=>{
        let {selectedItem : itemState} = this.state
        if (!itemState.id>0) {
            this.currentType = e.target.value
            return
        }
        let json
            json = `{
                       "wf_type" : "${e.target.value}"
            }`
        console.log("JSON", json);
        instanceAxios().post(AUTH_URL + '/api/workflow/add/'+itemState.id, json)
            .then(response => {
                // console.log(response.data)
                let arr = this.state.workflowitems.filter(item=>Number(item.id)!==Number(itemState.id))
                let workflowitem = response.data
                workflowitem.active = true
                console.log(workflowitem)
                this.setState({
                    workflowitems : [...arr, workflowitem],
                    selectedItem : workflowitem
                })
            })
            .catch(response => {
                console.log(response.data);
                // Список ошибок в отклике...
            })
        console.log(e.target.value)
    }
    userLogout() {
        this.props.history.push('/')
        this.props.onUserLoggingOut(this.props.userSetup.token, this.props.userSetup.langLibrary)
    }
    onChangeItemStatus=(e)=>{
        let {selectedItem : itemState} = this.state
        if (!itemState.id>0) {
            this.currentStatus = e.target.value
            return
        }
        let json
        json = `{
                       "wf_status" : "${e.target.value}",
                       "wf_status_name" : "${Number(e.target.value)===2?"Сделана":(Number(e.target.value)===1?"В работе":"Запланирована")}",
                       "wf_date_done" : ${Number(e.target.value)===2?toYYYYMMDD(new Date()):null},
                       "wf_date_start" : ${Number(e.target.value)===1?toYYYYMMDD(new Date()):null}
            }`
        console.log("JSON", json);
        instanceAxios().post(AUTH_URL + '/api/workflow/add/'+itemState.id, json)
            .then(response => {
                // console.log(response.data)
                let arr = this.state.workflowitems.filter(item=>Number(item.id)!==Number(itemState.id))
                let workflowitem = response.data
                workflowitem.active = true
                console.log(workflowitem)
                this.setState({
                    workflowitems : [...arr, workflowitem],
                    selectedItem : workflowitem
                })
            })
            .catch(response => {
                console.log(response.data);
                // Список ошибок в отклике...
            })
        console.log(e.target.value)
    }
    onItemClick=(e)=>{
        let workflowitems = this.state.workflowitems, selectedItem = {}
        console.log(e.target.id)
        workflowitems = workflowitems.map(item=> {
            item.active = (item.id === Number(e.target.id))
            if (item.id === Number(e.target.id)) selectedItem = item
            return item
        }
        )
//        e.target.className=e.target.className==="mym-wf-workflow-item"?e.target.className="mym-wf-workflow-item mym-wf-workflow-active":"mym-wf-workflow-item"
        this.setState({workflowitems, selectedItem : selectedItem, itemEdit : false})
    }
    // Создание новой работы
    onNewFlowItem=(e)=>{
        this.setState({itemEdit : true,  selectedItem : {id:-1}})
        console.log("onNewFlowItem")
    }
    onNewFlowSubItem=()=>{
        console.log("onNewFlowSubItem")
    }
    onDoubleItemDescrClick=(e)=>{
        this.setState({itemEdit : true})
        console.log("onDoubleItemDescrClick")
    }
    OnKeyPressTextArea=(e)=>{
        // console.log(e)
    }
    onNewFlowItemSave=()=>{
        let {selectedItem : itemState} = this.state
        let json
        if (itemState.id <=0 ) {
            json = `{
            "wf_memo" : ${JSON.stringify(this.textareaValue.value)},
            "user_id_author" : ${this.userID},
            "wf_type" : ${this.currentType},
            "wf_status": ${this.currentStatus},
            "wf_status_name": "${"Запланирована"}",
            "wf_date": "${toYYYYMMDD(new Date())}"
            }`
        }
        else {
            json = `{
                       "wf_memo" : ${JSON.stringify(this.textareaValue.value.replace('\"', '\''))}
            }`
        }
        console.log("JSON", json);
        instanceAxios().post(AUTH_URL + '/api/workflow/add' + (itemState.id>0?('/'+itemState.id):''), json)
            .then(response => {
                console.log(response.data)
                let arr = this.state.workflowitems.filter(item=>Number(item.id)!==Number(itemState.id))
                let workflowitem = response.data
                workflowitem.active = true
                console.log("workflowitem", workflowitem)
                this.setState({
                    workflowitems : [...arr, workflowitem],
                    itemEdit : false,
                    selectedItem : workflowitem
                })
                // workflowitems : [...this.state.workflowitems, workflowitem],
            })
            .catch(response => {
                console.log("ОШИБКА",response.data);
                // Список ошибок в отклике...
            })
    }
    onNewFlowItemCancel=()=>{
        this.currentType = 0
        this.currentStatus = 0
        this.setState({itemEdit:!this.state.itemEdit})
    }
    onFilterTypeClick=(e)=>{
        let options = []
        console.log(e.target.selectedOptions, e.target.options.length)
        // return
        for (let i = 0, l = e.target.options.length; i < l; i++) {
            if (e.target.options[i].selected) {
                options.push(Number(e.target.options[i].value));
            }
        }
        this.setState({filterType : options, selectedItem : {id:0}})
        // console.log(e.target.options)
    }
    onFilterStatusClick=(e)=>{
        let options = []
        console.log(e.target.selectedOptions)
        // return
        for (let i = 0, l = e.target.options.length; i < l; i++) {
            if (e.target.options[i].selected) {
                options.push(Number(e.target.options[i].value));
            }
        }
        this.setState({filterStatus : options, selectedItem : {id:0}})
    }
    langBlock=()=>{
        return <div style={{"width" : "80px"}}><ReactFlagsSelect
            defaultCountry={localStorage.getItem("langCode")?localStorage.getItem("langCode"):defLang}
            placeholder={getLangByCountry(localStorage.getItem("langCode"))}
            showSelectedLabel={false}
            searchPlaceholder={this.props.userSetup.langLibrary?this.props.userSetup.langLibrary.lang:defLang}
            countries={arrLangs}
            onSelect={this.onSelectLang}
            selectedSize={14}
            optionsSize={12}/>
        </div>
    }
    loginBlock=(userID, userName, langLibrary)=>{
        let {loading} = this.props.userSetup
        let {showLoginLight} = this.state
        console.log("loginBlock", loading, userID)
        return <div className="logBtnsBlock">
            <div>
                {!loading&&!userID?
                    <button className={userID?"loginbtn":showLoginLight?"loginbtn mym-login-logged":"loginbtn"} onClick={this.userLogin.bind(this)}><div className="mym-app-button-with-arrow">{langLibrary.entry}<div className="mym-app-arrow-down">{!this.state.showLoginLight?'\u25BC':'\u25B2'}</div></div></button>:null}

                {showLoginLight?
                    <LoginBlockLight onLogin={this.props.onUserLogging} langLibrary={langLibrary} firehide={this.fireLoginLight.bind(this)}/>:null
                }
            </div>
            <div>
                {userID>0?<button className="logoutbtn" onClick={this.userLogout}><div className="mym-app-button-name">{userName}</div><div className="mym-app-button-exit">{langLibrary.exit}</div></button>:null}
            </div>
            {this.langBlock()}
        </div>
    }
    render(){
        // console.log('SUBJECTS', this.state.subjects, this.state.subjects.length, this.state.subjectsSelected)
        // console.log(this.props.userSetup)
        let {selectedItem : item, itemEdit, workflowitems} = this.state
        // let arrTypeFilter = this.state.filterType.indexOf("-1")>=0?[-1]:this.state.filterType
        // let arrStatusFilter = this.state.filterStatus
        let cnt = 0
        if (workflowitems) {
            cnt = workflowitems.length
            workflowitems = workflowitems.filter(item => (this.state.filterType.indexOf(-1) >= 0 || this.state.filterType.indexOf(Number(item.wf_type)) >= 0) || this.state.filterType.length === 0)
            // console.log(workflowitems)
            workflowitems = workflowitems.filter(item => (this.state.filterStatus.indexOf(-1) >= 0 || this.state.filterStatus.indexOf(Number(item.wf_status)) >= 0) || this.state.filterStatus.length === 0)
            // console.log(workflowitems)
            cnt = '['+workflowitems.length+'/'+cnt+']'
        }
        let {userID, userName, isadmin, loading, showLoginLight, langLibrary} = this.props.userSetup;
        let {isMobile} = this.state
        return (

            <div>
                <div className="navbar" style={userID===0?{"justifyContent":  "flex-end"}:{"justifyContent":  "space-between"}}>
                    <div className="navBlock">
                        <div style={{"display": "flex", "justifyContent" : "space-between", "alignItems" : "center"}}>
                            <Link to="/"><img src={Logo} alt={"My.Marks"}/></Link>
                            <div className="myTitle"><h3><Link to="/">{langLibrary.siteName}</Link></h3></div>
                        </div>
                    </div>
                    <div className="navBlockEx">
                        {isMobile?
                            <MobileMenu userID={userID} userName={userName} isadmin={isadmin} withtomain={this.props.withtomain} userLogin={this.userLogin.bind(this)} userLogout={this.userLogout.bind(this)}/>:
                            userID>0 && <Menu className="menuTop" userid={userID} isadmin={isadmin}/>
                        }
                        {/*{(window.location.href.slice(-3)==="/r3"&&userID===0)?*/}
                        {/*this.fireUserV3Login(window.location.href):""}*/}
                        {isMobile?<div>
                            {this.state.showLoginLight||(window.location.href.slice(-2)==="/r"&&userID===0)?
                                <LoginBlockLight onLogin={this.props.onUserLogging} firehide={this.fireLoginLight.bind(this)}/>:""}

                            <div className={this.props.user.loginmsg.length?"popup show":"popup"} onClick={this.props.onClearErrorMsg}>
                                {this.props.user.loginmsg.length?<span className="popuptext" id="myPopup">{this.props.user.loginmsg}</span>:""}
                            </div>
                        </div>:""}
                        {!isMobile?this.loginBlock(userID, userName, langLibrary):null}
                    </div>
                </div>
                <div className="navbar-shadow"></div>
                <h4 className="mym-wf-main-title">Перечень работ для проекта <b>My.Marks</b>{" "}{cnt}</h4>
                <div className="mym-wf-main-block">
                    <div className="mym-wf-left-block">
                        <div className="mym-wf-workflow-list" name="workflows">
                            {workflowitems?workflowitems.sort((a,b)=>a.id-b.id).map(
                                item=>
                                    <div key={"row"+item.id} className={item.active?"mym-wf-workflow-row mym-wf-workflow-active":"mym-wf-workflow-row"} onDoubleClick={this.onDoubleItemDescrClick}>
                                        <div className={Number(item.wf_type)===4?"mym-wf-type mym-wf-type-error":Number(item.wf_type)===2?"mym-wf-type mym-wf-type-future":Number(item.wf_type)===1?"mym-wf-type mym-wf-type-nearest":"mym-wf-type"}>
                                            {item.created_at!==item.updated_at?<span className={"mym-wf-modified"}>{'Updated-' + dateDiffHour(item.updated_at, new Date()) + 'ч: '}</span>:null}
                                            {Number(item.wf_type)===2?"На перспективу":(Number(item.wf_type)===1?"Ближайшая":(Number(item.wf_type)===4?"Ошибка":"Текущая"))}
                                        </div>
                                        <div className={Number(item.wf_status)===2?"mym-wf-workflow-rowno mym-wf-workflow-done":(Number(item.wf_status)===1?"mym-wf-workflow-rowno mym-wf-workflow-doing":"mym-wf-workflow-rowno mym-wf-workflow-plan")}>
                                            {item.id+"\u00a0"}
                                        </div>
                                        <div key={item.id} id={item.id} className={item.active?"mym-wf-workflow-item mym-wf-workflow-active":"mym-wf-workflow-item"} onClick={this.onItemClick}>
                                            <b>{`[${item.name}]`}</b>{item.wf_memo}
                                        </div>
                                        {item.created_at!==item.updated_at?
                                            <div className={"mym-wf-modified"}>
                                                {dateDiffHour(item.created_at, item.updated_at) + 'ч'}
                                            </div>:
                                            null}
                                    </div>):null
                            }
                        </div>
                    </div>
                    <div className="mym-wf-right-block">
                            <b>ОПИСАНИЕ РАБОТЫ:</b>
                            {itemEdit?
                                <div className="mym-wf-right-block-title">
                                    <button onClick={(e) => this.onNewFlowItemSave()}>СОХРАНИТЬ</button>
                                    <button onClick={(e) => this.onNewFlowItemCancel()} >ОТМЕНА</button>
                                </div>
                                :
                                <div className="mym-wf-right-block-title">
                                    <button onClick={(e) => this.onNewFlowItem(e)}>НОВАЯ+</button>
                                    <button onClick={this.OnNewFlowSubItem} disabled={item.id===0}>ПОДЗАДАЧА+</button>
                                </div>
                            }
                        <div className="mym-wf-workdescr" onClick={this.onClick.bind(this)} onDoubleClick={this.onDoubleItemDescrClick}>
                            {(item.id !== 0)?
                                itemEdit?
                                    <div className="mym-wf-workdescr-content">
                                        <textarea className="mym-wf-workdescr-edit" ref={input=>{this.textareaValue=input}} defaultValue={item.id !== 0?item.wf_memo:null}
                                              onKeyPress={this.OnKeyPressTextArea} onChange={this.OnChangeTextArea}>
                                        </textarea>
                                        <div  className="mym-wf-workdescr-select">
                                            <select className="mym-wf-filter-type" value={item.wf_type} onChange={this.onChangeItemType} onClick={this.onClickItemType} /*onDoubleClick={this.onDoubleClick.bind(this)}*/ name="itemType">
                                                {/*{this.state.subjectsSelected.length&&this.renderSubjectsSelected()}*/}
                                                <option value={0}>Текущая</option>
                                                <option value={1}>Ближайшая</option>
                                                <option value={2}>На перспективу</option>
                                                <option value={4}>Ошибка</option>
                                            </select>
                                            <select className="mym-wf-filter-status" value={item.wf_status} onChange={this.onChangeItemStatus} onClick={this.onClickItemStatus} /*onDoubleClick={this.onDoubleClick.bind(this)}*/ name="itemStatus">
                                                {/*{this.state.subjectsSelected.length&&this.renderSubjectsSelected()}*/}
                                                <option value={0}>Запланирована</option>
                                                <option value={1}>В работе</option>
                                                <option value={2}>Сделана</option>
                                            </select>
                                        </div>
                                    </div>
                                    :
                                    <div className="mym-wf-workdescr-content">
                                        <div className={Number(item.wf_status)===2?"mym-wf-workflow-done":(Number(item.wf_status)===1?"mym-wf-workflow-doing":"mym-wf-workflow-plan")}>
                                            {item.wf_memo}
                                        </div>
                                        <div  className="mym-wf-workdescr-select">
                                            <select className="mym-wf-filter-type" value={item.wf_type} onChange={this.onChangeItemType} onClick={this.onClickItemType} /*onDoubleClick={this.onDoubleClick.bind(this)}*/ name="itemType">
                                                <option value={0}>Текущая</option>
                                                <option value={1}>Ближайшая</option>
                                                <option value={2}>На перспективу</option>
                                                <option value={4}>Ошибка</option>
                                            </select>
                                            <select className="mym-wf-filter-status" value={item.wf_status} onChange={this.onChangeItemStatus} onClick={this.onClickItemStatus} /*onDoubleClick={this.onDoubleClick.bind(this)}*/ name="itemStatus">
                                                <option value={0}>Запланирована</option>
                                                <option value={1}>В работе</option>
                                                <option value={2}>Сделана</option>
                                            </select>
                                        </div>
                                    </div>
                            :null}

                        </div>
                        {
                            /*
                             *
                             0.Текущая задача,
                             1.На ближайшую перспективу,
                             2.На дальнюю перспективу,
                             4.Ошибка

                             wf_status :
                             0.Запланирована
                             1.В работе
                             2.Сделана
                             * */
                        }
                        <div className="mym-wf-filter-header"><div><b>ФИЛЬТРЫ:</b></div><div>{"  Задача"}</div></div>

                        <div className="mym-wf-filter">

                            <select className="mym-wf-filter-type" multiple onChange={(e)=>this.onFilterTypeClick(e)} /*onDoubleClick={this.onDoubleClick.bind(this)}*/ name="filter-type">
                                {/*{this.state.subjectsSelected.length&&this.renderSubjectsSelected()}*/}
                                <option value={-1}>Все</option>
                                <option value={0}>Текущая</option>
                                <option value={1}>Ближайшая</option>
                                <option value={2}>На перспективу</option>
                                <option value={4}>Ошибка</option>
                            </select>
                            <div className="mym-wf-filter-header-bottom"><div>{"  Тип"}</div></div>
                            <select className="mym-wf-filter-status" multiple onChange={(e)=>this.onFilterStatusClick(e)} /*onDoubleClick={this.onDoubleClick.bind(this)}*/ name="filter-status">
                                {/*{this.state.subjectsSelected.length&&this.renderSubjectsSelected()}*/}
                                <option value={-1}>Все</option>
                                <option value={0}>Запланирована</option>
                                <option value={1}>В работе</option>
                                <option value={2}>Сделана</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onInitState: () => dispatch([]),
        onUserLoggingByToken : (email, token, kind)=>{
            const asyncLoggedInByToken = (email, token, kind) =>{
                return dispatch => {
                    dispatch(userLoggedInByToken(email, token, kind))
                }}
            dispatch(asyncLoggedInByToken(email, token, kind))
        },
        onHomeWorkChanged : (arr)=>{
            console.log("onHomeWorkChanged")
            dispatch({type: 'UPDATE_HOMEWORK', payload: arr})
        },
        onUserLoggingOut  : token => dispatch(userLoggedOut(token)),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminPageWorkFlow))