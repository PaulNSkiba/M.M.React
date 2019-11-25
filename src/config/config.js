/**
 * Created by Paul on 17.08.2019.
 */
// Global consts
export const ISDEBUG = true
export const isSSLChat = true

// URL's
export const AUTH_URL  = ISDEBUG?'https://sch-journal.dev':'https://mymarks.info'
export const BASE_URL  = ISDEBUG?'https://localhost:3000':'https://mymarks.info'
export const BASE_HOST = ISDEBUG?'sch-journal.dev':'mymarks.info'

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


// Personal access client created successfully.
export const OAUTH_CLIENT_ID = 2
export const OAUTH_CLIENT_SECRECT = 'Z7ccv17TD6jf03E6MUTpFBXVl9NuLfzBKRqf8AFK'

// Pusher's config
export const instanceLocator = "v1:us1:6150d554-65a3-4c66-897a-bc65b2a5402d"
export const testToken = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/6150d554-65a3-4c66-897a-bc65b2a5402d/token"
export const chatUserName = "my-marks"

// FB config
export const appIdFB = "2330660220490285"

// Local chat
export const WEBSOCKETPORT = 6001
export const LOCALPUSHERPWD = 123456

// Mark types
export const markType = [
    {id : 0, letter : '', name : 'Пустое'},
    {id : 1, letter : 'Kр', name : 'Контрольная'},
    {id : 2, letter : 'Cр', name : 'Самостоятельная'},
    {id : 3, letter : 'T', name : 'Тематическая'},
    {id : 4, letter : 'S1', name : '1-й Семестр'},
    {id : 5, letter : 'S2', name : '2-й Семестр'},
    {id : 6, letter : 'A', name : 'Годовая'},
    {id : 7, letter : 'Дт', name : 'Диктант'},
    {id : 8, letter : 'Дз', name : 'Домашняя'},
    {id : 9, letter : 'Тт', name : 'Тест'},
]

export const arrClasses = [1,2,3,4,5,6,7,8,9,10,11,12]
export const arrLangs = ["DE", "FR", "IT", "PL", "PT", "RU", "ES", "UA", "GB"]
export const defLang = localStorage.getItem("myCountryCode")&& arrLangs.includes(localStorage.getItem("myCountryCode")) ? localStorage.getItem("myCountryCode") : "GB"