/**
 * Created by Paul on 22.01.2019.
 */
import { LOGOUTUSER_URL, LOGINUSER_URL, API_URL, ISDEBUG, ISCONSOLE } from '../config/config'
import { instanceAxios, toYYYYMMDD, axios2 } from '../js/helpers'

export const userLoggedIn = (email, pwd, provider, provider_id, langLibrary, code) => {
    return dispatch => {

        const data = {
            "email": email,
            "password": pwd,
            "provider" : provider,
            "provider_id" : provider_id,
            "token" : null,
            "code" : code
        };
        // console.log('USER_LOGGIN', LOGINUSER_URL, JSON.stringify(data))
        document.body.style.cursor = 'progress';

        instanceAxios().post(LOGINUSER_URL, JSON.stringify(data), null)
            .then(response => {
                // console.log('USER_LOGGEDIN.1', response.data);
                if (response.data.loggedin) {
                    dispatch({type: 'USER_LOGGEDIN', payload: response.data, langLibrary: langLibrary});
                    dispatch({type: 'ADD_CHAT_MESSAGES', payload: response.data.chatrows});
                    // пробуем записать в LocalStorage имя пользователя, ID, имя и тип авторизации
                    saveToLocalStorage("myMarks.data", email, response.data)
                    window.localStorage.setItem("userSetupDate", toYYYYMMDD(new Date()))
                    window.localStorage.setItem("localChatMessages", response.data.chatrows)
                }
                else {
                    dispatch({type : 'USER_PWD_MISSEDMATCH', payload : response.data.message})
                }
                document.body.style.cursor = 'default';
                dispatch({type: 'APP_LOADED'})
            })
            .catch(error => {
                // Список ошибок в отклике...
                // console.log("ERROR_LOGGEDIN", error)
                document.body.style.cursor = 'default';
                dispatch({type: 'USER_PWD_MISSEDMATCH', payload : "Ошибка ввода"})
                dispatch({type: 'APP_LOADED'})
            })
   };
}

export const userLoggedInByToken = (email, token, kind, langLibrary) => {
    return dispatch => {
        const data = {
            "email": email,
            "token": token,
            "kind": kind,
        };
        ISCONSOLE && console.log("userLoggedInByToken");
        document.body.style.cursor = 'progress';
        // instanceAxios().get(`${API_URL}user`, data)
        axios2('get', `${API_URL}user`)
            .then(response => {
                response.data.token = token
                dispatch({type: 'USER_LOGGEDIN', payload: response.data, langLibrary : langLibrary});
                // dispatch({type: "UPDATE_TOKEN", payload: token})
                dispatch({type: 'ADD_CHAT_MESSAGES', payload : response.data.chatrows});
                dispatch({type: 'APP_LOADED'})
                // пробуем записать в LocalStorage имя пользователя, ID, имя и тип авторизации
                saveToLocalStorage("myMarks.data", email, response.data)
                window.localStorage.setItem("userSetupDate", toYYYYMMDD(new Date()))
                window.localStorage.setItem("localChatMessages", response.data.chatrows)

                document.body.style.cursor = 'default';
            })
            .catch(response => {
                ISCONSOLE && console.log("userLoggedInByTokenError", response.data);
                window.localStorage.removeItem("myMarks.data");
                // dispatch({type: "LANG_LIBRARY", langLibrary: langLibrary})
                dispatch({type: 'APP_LOADED'})
                document.body.style.cursor = 'default';
                // Список ошибок в отклике...
            })
    };
}

export const userLoggedOut = (token, langLibrary) => {
    return dispatch => {
            // console.log("userLoggedOut", langLibrary)
            document.body.style.cursor = 'progress';
            window.localStorage.removeItem("myMarks.data");
            window.localStorage.removeItem("userSetup")
            window.localStorage.removeItem("userSetupDate")
            window.localStorage.removeItem("localChatMessages")

            // console.log("LOGOUT_TOKEN", token)
            dispatch({type: 'APP_LOADING'})
            instanceAxios().get(LOGOUTUSER_URL)
                .then(response => {
                    // return response.data;
                    // console.log(response.data, response.data);
                    dispatch({type: 'USER_LOGGEDOUT', langLibrary : langLibrary});
                    dispatch({type: 'APP_LOADED'})
                    ISCONSOLE && console.log("logoutSuccess", response);
                    document.body.style.cursor = 'default';
                })
                .catch(response => {
                    dispatch({type: 'USER_LOGGEDOUT', langLibrary : langLibrary});
                    dispatch({type: "LANG_LIBRARY", payload: langLibrary})
                    dispatch({type: 'APP_LOADED'})
                    document.body.style.cursor = 'default';
                    console.log("logoutError", response);
                    // Список ошибок в отклике...
                })
                dispatch({type: 'APP_LOADED'})
                document.body.style.cursor = 'default';
            };
}

const saveToLocalStorage=(localName, email, data)=>{
    let ls = {}
    let { name : userName, id : userID, class_id : classID } = data.user;
    let { token} = data;
    ls.email = email;
    ls.name = userName;
    ls.id = userID;
    ls.token = token;
    ls.class_id = classID;
    window.localStorage.setItem(localName, JSON.stringify(ls));
}