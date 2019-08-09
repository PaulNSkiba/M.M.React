/**
 * Created by Paul on 21.01.2019.
 */
import axios from 'axios';
import { store } from '../store/configureStore'
import {ISDEBUG} from '../components/helpers'


export const AUTH_URL = ISDEBUG?'https://sch-journal.dev':'https://mymarks.info'
export const BASE_URL = ISDEBUG?'https://localhost:3000':'https://mymarks.info'
export const BASE_HOST = ISDEBUG?'sch-journal.dev':'mymarks.info'
export const WEBSOCKETPORT = 6001
export const LOCALPUSHERPWD = 123456
    // export const AUTH_URL = 'https://mymarks.info'
    // export const BASE_URL = 'https://mymarks.info'

export const API_URL = AUTH_URL + '/api/'
export const TOKEN_URL = AUTH_URL + '/oauth/token'
export const CLIENTS_URL = AUTH_URL + '/oauth/clients'
export const CREATEOAUTH_URL = AUTH_URL + '/oauth/clients'
export const CREATEUSER_URL = AUTH_URL + '/api/signup'
export const LOGINUSER_URL = AUTH_URL + '/api/login'
export const LOGOUTUSER_URL = AUTH_URL + '/api/logout'
export const UPDATESETUP_URL = AUTH_URL + '/api/usersetup/update'
export const GETSETUP_URL = AUTH_URL + '/api/usersetup/get'

export const SUBJECTS_GET_URL = AUTH_URL + '/api/subjects'
export const SUBJECTS_ADD_URL = AUTH_URL + '/api/subjects'
export const SUBJECT_CREATE_URL = AUTH_URL + '/api/subject'

export const STUDENTS_GET_URL = AUTH_URL + '/api/students'
export const STUDENTS_ADD_URL = AUTH_URL + '/api/students'
export const STUDENTS_UPDATE_URL = AUTH_URL + '/api/students'

export const FACEBOOK_URL = AUTH_URL + '/auth/facebook'

export const MARKS_URL = AUTH_URL + '/api/marks'
export const MARKS_STATS_URL = AUTH_URL + '/api/marks/stats'
export const EXCEL_URL = AUTH_URL + '/api/excel'

export const EMAIL_ADD_URL = AUTH_URL + '/api/student'
export const EMAIL_GET_URL = AUTH_URL + '/api/students'
export const EMAIL_DELETE_URL = AUTH_URL + '/api/student'

export const TABLE_GET_URL = AUTH_URL + '/api/student'

export const HOMEWORK_ADD_URL = AUTH_URL + '/api/homework/class'
export const HOMEWORK_GET_URL = AUTH_URL + '/api/homework/class'

export const UPDATECLASS_URL = AUTH_URL + '/api/class/'

// Route::get('/students/{user_id}/emails', 'StudentCountrolle@getEmails')->name('getemails'); // Получить все адреса рассылки студента
// Route::get('/student/{user_id}/email/{email}', 'StudentCountrolle@addEmail')->name('emailadd'); // Добавить адрес рассылки студента
// Route::get('/student/{user_id}/emaildelete/{id}', 'StudentCountrolle@deleteEmail')->name('emaildelete'); // Удалить адрес рассылки студента


export let instanceAxios=()=>{
    // const token = token
    let {token} = store.getState().user
    // console.log("URLs", token, store.getState())

    return (axios.create({
    baseURL: AUTH_URL + '/api/',
    timeout: 0,
    headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE, OPTIONS',
    }
    }));

};

export function userSetupGet(userID) {
    // let {userID} = store.getState().user
    console.log("userSetupGet", userID)
    instanceAxios().post(GETSETUP_URL+'/'+userID)
        .then(response => {
            // return response.data;
            console.log("userSetupGet", response.data, response.data);
        })
        .catch(response => {
            console.log(response);
            // Список ошибок в отклике...
        })
}