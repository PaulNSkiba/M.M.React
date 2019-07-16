/**
 * Created by Paul on 22.01.2019.
 */
import axios from 'axios';
import { LOGINUSER_URL, instanceAxios } from '../config/URLs'
// import { store } from '../store/configureStore'

export const userLoggedIn = (email, pwd, provider, provider_id) => {
    return dispatch => {

        dispatch({type: 'APP_LOADING'})

        let header = {
            headers: {
                'Content-Type': "application/json",
            }
        }

        const data = {
            "email": email,
            "password": pwd,
            "provider" : provider,
            "provider_id" : provider_id,
            "token" : null,
        };
        console.log('USER_LOGGIN', JSON.stringify(data))

        document.body.style.cursor = 'progress';
        instanceAxios().post(LOGINUSER_URL, JSON.stringify(data), header)
            .then(response => {
                console.log('USER_LOGGEDIN', response.data);
                // let token = response.data.token;
                dispatch({type: 'USER_LOGGEDIN', payload: response.data});
                // пробуем записать в LocalStorage имя пользователя, ID, имя и тип авторизации
                let ls = {}
                let {   name : userName, id : userID } = response.data.user;
                let {   token} = response.data;
                ls.email = email;
                ls.name = userName;
                ls.id = userID;
                ls.token = token;
                window.localStorage.setItem("myMarks.data", JSON.stringify(ls));

                document.body.style.cursor = 'default';
            })
            .catch(error => {
                console.log("Error", error)
                document.body.style.cursor = 'default';
                dispatch({type: 'USER_PWD_MISSEDMATCH'})
                dispatch({type: 'APP_LOADED'})
                // Список ошибок в отклике...
            })
   };
}

export const userLoggedInByToken = (email, token, kind) => {
    // console.log("userLoggedInByToken", email, token)
    return dispatch => {

        dispatch({type: 'APP_LOADING'})

        let header = {
            headers: {
                'Content-Type': "application/json",
            }
        }

        const data = {
            "email": email,
            "token": token,
            "kind": kind,
        };
        // console.log("TEST");
        document.body.style.cursor = 'progress';
        axios.post(LOGINUSER_URL, data, header)
            .then(response => {
                // console.log('USER_LOGGEDINBYTOKEN');
                // let token = response.data.token;
                dispatch({type: 'USER_LOGGEDIN', payload: response.data});
                // пробуем записать в LocalStorage имя пользователя, ID, имя и тип авторизации
                let ls = {}
                let {   name : userName, id : userID } = response.data.user;
                let {   token} = response.data;
                ls.email = email;
                ls.name = userName;
                ls.id = userID;
                ls.token = token;
                window.localStorage.setItem("myMarks.data", JSON.stringify(ls));
                dispatch({type: 'APP_LOADED'})
                document.body.style.cursor = 'default';
            })
            .catch(response => {
                console.log(response.data);
                dispatch({type: 'APP_LOADED'})
                // Список ошибок в отклике...
            })
    };
}

export const userLoggedOut = (token) => {
    return dispatch => {
        document.body.style.cursor = 'progress';
        instanceAxios().get('logout')
            .then(response => {
                // return response.data;
                // console.log(response.data, response.data);
                dispatch({type: 'USER_LOGGEDOUT', payload: response.data});
                window.localStorage.removeItem("myMarks.data");
                document.body.style.cursor = 'default';
            })
            .catch(response => {

                window.localStorage.removeItem("myMarks.data");
                document.body.style.cursor = 'default';
                console.log(response);
                // Список ошибок в отклике...
            })
                window.localStorage.removeItem("myMarks.data");
                document.body.style.cursor = 'default';
            };

}
