/**
 * Created by Paul on 20.01.2019.
 */
const initialState = {
// мы вложили в user вместо строки, объект
        name: '',
        surname: '',
        age: 0,
        id : 0,
        token : "",
        logging : false,
        verified : false,
        email : "",
        loginmsg : ""
}

export function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'USER_LOGGEDIN' :
            let {username, id, token, email_verified_at, email} = action.payload
            return {...state, name : username, id : id, token : token, logging : true, verified: email_verified_at, email,
                        loginmsg : ""}
        case 'USER_LOGGEDOUT' :
            return {...state, name: '',
                surname: '',
                age: 0,
                id : 0,
                token : "",
                logging : false};
        case 'USER_LOGGEDIN_DONE' :
            return {...state, logging: false};
        case 'USER_PWD_MISSEDMATCH':
            console.log('USER_PWD_MISSEDMATCH', action.payload)
            return {...state, loginmsg: action.payload};
        case 'USER_MSG_CLEAR':
            return {...state, loginmsg: ''};
        default:
            return state
    }
}