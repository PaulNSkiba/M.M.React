/**
 * Created by Paul on 07.04.2019.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import AddSubject from '../AddSubject/addsubject'
import './emaillist.css'
import { ISDEBUG, EMAIL_ADD_URL, EMAIL_DELETE_URL, STUDENTS_ADD_URL } from '../../config/config'
import { instanceAxios, mapStateToProps} from '../../js/helpers'

class EmailList extends Component {
    constructor(props){
        super(props);
        this.state = {
            addEmail : false,
            emails : this.props.userSetup.emails,
        }
        this.addSubUser = this.addSubUser.bind(this)
    }
    componentWillMount(){
    }
    addEmailShow(){
        this.setState({addEmail:true})
    }
    addEmail(email){
        ISDEBUG&&console.log(email)
        instanceAxios().get(EMAIL_ADD_URL + '/' + this.props.userID + '/email/' + email, [])
            .then(response => {
                ISDEBUG&&console.log("addEmail", response.data, this.state.emails)
                let emails = this.state.emails
                emails.push(response.data)
                this.setState({
                    emails : emails
                })
            })
            .catch(response => {
                ISDEBUG&&console.log(response)
            })
     }
    deleteItemInList(e){
        ISDEBUG&&console.log(e, e.target.id)
        let id = e.target.id
        instanceAxios().get(EMAIL_DELETE_URL + '/' + this.props.userID + '/emaildelete/' + id, [])
            .then(response => {
                ISDEBUG&&console.log(response.data, id)

                let emails = this.state.emails
                emails = emails.filter((item)=>(!(item.id.toString()===id.toString())))
                this.setState({
                    emails : emails
                })
            })
            .catch(response => {
                ISDEBUG&&console.log(response)
            })
    }
    hideAddEmail=()=> {
        this.setState({addEmail: false})
    }
    addSubUser=(email, i, e)=>{
        ISDEBUG&&console.log("email", email, i)
        const data = {
            "email": email,
            "name": this.props.userSetup.userName+'[v'+i+']',
            "student_nick" : this.props.userSetup.userName+'[v'+i+']',
            "notwebadding" : true,
            "isadmin" : 3,
            "isout" : true
        };
        ISDEBUG&&console.log(JSON.stringify(data))
        document.body.style.cursor = 'progress';
        instanceAxios().post(STUDENTS_ADD_URL+'/add/'+this.props.userSetup.addUserToken, JSON.stringify(data))
            .then(resp=>{
                    console.log("ADDED_USER", resp)
                    document.body.style.cursor = 'default';
                    let emails = this.state.emails
                    emails = emails.map((item)=>{
                        if (!(item.email===email))
                            return item
                        else {
                            item.subuser_id = resp.data.user.id;
                            return item
                        }})

                    console.log("emails", emails)
                    this.setState({
                        emails : emails
                    })
                    // this.forceUpdate()
                }
            )
            .catch(resp=>{
                document.body.style.cursor = 'default';
                }
            )
    }
    render(){
        ISDEBUG&&console.log('EMAILS', this.state.emails)
        let emails = this.state.emails.map((item, i) => (<div className="itemInEmailList" key={item.id}>
                                                                {item.email}
                                                                <div className="email-buttons">
                                                                    <div className="emaiListRemoveButton" value={i} id={item.id} onClick={this.deleteItemInList.bind(this)}>-</div>
                                                                    {!(item.subuser_id===0||item.subuser_id===null)?"Пользователь создан"
                                                                        :<div className="fastRegAndMail"
                                                                                       id={item.email}
                                                                                       onClick={()=>{this.addSubUser(item.email, (i + 1))}}>Зарегистрировать и отправить ссылку</div>}
                                                                </div>
                                                        </div>))
        return (
            <div className="emailList">
                <div className = "emailListHeader">
                    <div>Адреса рассылки:  <button className="emaiListAddButton" onClick={this.addEmailShow.bind(this)}>+</button></div>
                     {this.state.addEmail&&<AddSubject title={"Новый email"} firehide={this.hideAddEmail.bind(this)} addfunc={this.addEmail.bind(this)}/>}
                    <div>{this.props.studentName}</div>
                </div>
                <div className="emailListItems">
                    <div className="defaultItemInEmailList">{this.props.user.email}</div>
                    {emails}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(EmailList)