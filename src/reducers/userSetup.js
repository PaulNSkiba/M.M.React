/**
 * Created by Paul on 20.01.2019.
 */
import {saveToLocalStorageOnDate, toYYYYMMDD } from '../js/helpers'
import {defLang} from '../config/config'
import {isSSLChat} from '../config/config'

const initialState = (check)=>{
        // console.log("initialState", window.localStorage.getItem("userSetup"), window.localStorage.getItem("userSetupDate")===toYYYYMMDD(new Date()))
        let obj = {}
        if (localStorage.getItem("userSetup")!==null&&localStorage.getItem("userSetup")&&localStorage.getItem("userSetupDate")===toYYYYMMDD(new Date())&&check) {
            obj = JSON.parse(localStorage.getItem("userSetup"))
            obj.loading = false }
        else {
            // console.log("langlib", langLibrary)
            // const langlib = (localStorage.getItem("langLibrary")!==null)&&localStorage.getItem("langLibrary")?JSON.parse(localStorage.getItem("langLibrary")):getLangLibrary()
            // console.log("userSetup", langlib,
            //     localStorage.getItem("langLibrary")===null, localStorage.getItem("langLibrary"), (localStorage.getItem("langLibrary")!==null)&&localStorage.getItem("langLibrary"))

            obj =
                {
                    curClass: 0, classNumber: 0, classID: 0,
                    pupilCount: 0, students: [], currentYear: "", curYearDone: 0, subjCount: "0/0", userID: 0,
                    selectedSubjsArray: [], selectedSubjects: [], selectedSubj: {id: 0, subj_key: "#null"},
                    subjects_list: [], markBlank: {id: "", alias: "", pk: 1},
                    currentPeriodDateCount: 5, marks: [], direction: "UPDOWN", titlekind: "NICK",
                    withoutholidays: true, token: "", userName: "",
                    isadmin: 0, studentName: "", studentID: 0,
                    studSubj: new Map(), mark_dates: [], best_lines: [], avg_lines: [], avg_marks: [],
                    addUserToken: "", cnt_marks: 0, stud_cnt: 0, subj_cnt: 0,
                    lastmarkssent: "", emails: [], homework: [],
                    stats2: [], stats3: [], mark_date: {date: new Date()},
                    avgclassmarks: [], loading: -1, stepsLeft: 6,
                    chatSessionID: '', classObj: {chatroom_id: 0},
                    newMsgCount: 0, countryCode: defLang,
                    langLibrary: {}, //(localStorage.getItem("langLibrary")!==null)&&localStorage.getItem("langLibrary")?JSON.parse(localStorage.getItem("langLibrary")):getLangLibrary(),
                    chatSSL: isSSLChat, localChatMessages: [],
                    isMobile: false, aliasesList: [], aliasesLang: "", menuItem : "",
                    budget : [], budgetpays : [],
                    renderBudget : 1,
                }
        }
    return obj
}

export function userSetupReducer(state = initialState(true), action) {
    let setup = []
    // ToDO: При отсутствтии настроек проверить на undefined
    switch (action.type) {
        case 'INIT_STATE':
            console.log('INIT_STATE', initialState)
            return {...state, initialState}
        case 'USER_LOGGEDIN' : {
            // console.log("JUST_LOGGEDIN", action.langLibrary)
            let {   token, subj_count, subjects_list,
                    selected_subjects, selected_subj, students, marks,
                    mark_dates, best_lines, avg_lines, avg_marks, addUserToken,
                    lastmarkssent, emails, homework, stats2, stats3, mark_date, avgclassmarks, classObj, chatrows, budget, budgetpays} = action.payload;
            let {   name : userName, id : userID, isadmin } = action.payload.user;
            let {   class_number, pupil_count, year_name, perioddayscount,
                    markblank_id, markblank_alias, selected_marker, titlekind,
                    direction, class_id } = action.payload.usersetup;
            let {   id : studentID, student_name : studentName} = action.payload.student;
            let {   cnt_marks, stud_cnt, subj_cnt } = action.payload.stats[0];
            studentID = studentID?studentID:0;

            setup = {...state, userName, userID, token,
                curClass: class_number, classNumber : class_number, classID : class_id, pupilCount: pupil_count,
                currentYear: year_name, currentPeriodDateCount: perioddayscount,
                markBlank:{id: markblank_id, alias: markblank_alias, pk: selected_marker},
                titlekind: titlekind, direction : direction,
                subjCount: subj_count, subjects_list: subjects_list, selectedSubjects : selected_subjects,
                selectedSubj : selected_subj, students : students?students:[], classObj,
                isadmin, studentName, studentID, marks, mark_dates, best_lines, avg_lines, avg_marks, addUserToken,
                cnt_marks, stud_cnt, subj_cnt, lastmarkssent, emails, homework, stats2 : stats2[0], stats3 : stats3[0],
                mark_date, avgclassmarks, langLibrary : action.langLibrary, localChatMessages : chatrows, budget, budgetpays
                }
            saveToLocalStorageOnDate("userSetupDate", toYYYYMMDD(new Date()))
            saveToLocalStorageOnDate("userSetup", JSON.stringify(setup))
            saveToLocalStorageOnDate("langLibrary", JSON.stringify(action.langLibrary))
            return setup
            }
        case "USER_SETUP" :
            return {...state}
        case 'UPDATE_SETUP_REMOTE' : {
            let {   class_number, pupil_count, year_name, perioddayscount,
                    markblank_id, markblank_alias, selected_marker, titlekind, direction} = action.payload.usersetup;
            return {...state,
                curClass: class_number, classNumber : class_number, pupilCount: pupil_count, currentYear: year_name,
                currentPeriodDateCount: perioddayscount,
                markBlank:{id: markblank_id, alias: markblank_alias, pk: selected_marker},
                titlekind: titlekind, direction : direction,
            }
        }
        case 'UPDATE_SETUP_LOCALLY' : {
            console.log('UPDATE_SETUP_LOCALLY', Object.keys(action.payload)[0], Object.values(action.payload)[0])

            switch(Object.keys(action.payload)[0]) {
                case "year_name":
                    saveToLocalStorageOnDate("userSetup",
                        JSON.stringify({...state, currentYear: Object.values(action.payload)[0]}))
                    return {...state, currentYear: Object.values(action.payload)[0]};
                case "pupil_count":
                    saveToLocalStorageOnDate("userSetup",
                        JSON.stringify({...state, pupilCount: Object.values(action.payload)[0]}))
                    return {...state, pupilCount: Object.values(action.payload)[0]};
                case "class_number":
                    saveToLocalStorageOnDate("userSetup",
                        JSON.stringify({...state,
                            curClass: Object.values(action.payload)[0],
                            classNumber : Object.values(action.payload)[0],
                            selectedSubjects : []}))
                    return {...state,   curClass: Object.values(action.payload)[0],
                                        classNumber : Object.values(action.payload)[0],
                                        selectedSubjects : []};
                case "subjects_count" :
                    saveToLocalStorageOnDate("userSetup",
                        JSON.stringify({...state, subjCount: Object.values(action.payload)[0]}))
                    return {...state, subjCount: Object.values(action.payload)[0]};
                case "selected_subject" :
                    let arr = Object.values(action.payload)[0].split(",");
                    saveToLocalStorageOnDate("userSetup",
                        JSON.stringify({...state, selectedSubj: JSON.parse(`{"id":${arr[2]},
                                                                "subj_key":"${arr[0]}",
                                                                "subj_name_ua":"${arr[1]}"}`)}))
                    return {...state, selectedSubj: JSON.parse(`{"id":${arr[2]},
                                                                "subj_key":"${arr[0]}",
                                                                "subj_name_ua":"${arr[1]}"}`)};
                case "selected_subjects" :
                    saveToLocalStorageOnDate("userSetup",
                        JSON.stringify({...state, selectedSubjects: Object.values(action.payload)[0]}))
                    return {...state, selectedSubjects: Object.values(action.payload)[0]};
                case "markblank_alias" :
                    saveToLocalStorageOnDate("userSetup",
                        JSON.stringify({...state, markBlank:{alias: Object.values(action.payload)[0]}}))
                    return {...state, markBlank:{alias: Object.values(action.payload)[0]}};
                case "markblank_id" :
                    saveToLocalStorageOnDate("userSetup",
                        JSON.stringify({...state, markBlank:{id: Object.values(action.payload)[0]}}))
                    return {...state, markBlank:{id: Object.values(action.payload)[0]}};
                case "selected_marker" :
                    saveToLocalStorageOnDate("userSetup",
                        JSON.stringify({...state, markBlank:{pk: Object.values(action.payload)[0]}}))
                    return {...state, markBlank:{pk: Object.values(action.payload)[0]}};
                case "markblank" :
                    saveToLocalStorageOnDate("userSetup",
                        JSON.stringify({...state, markBlank:{id: Object.values(action.payload)[0][0].markblank_id,
                            alias: Object.values(action.payload)[0][1].markblank_alias,
                            pk: Object.values(action.payload)[0][2].selected_marker}}))
                    return {...state, markBlank:{id: Object.values(action.payload)[0][0].markblank_id,
                                                 alias: Object.values(action.payload)[0][1].markblank_alias,
                                                 pk: Object.values(action.payload)[0][2].selected_marker}}
                case "students" :
                    saveToLocalStorageOnDate("userSetup",
                        JSON.stringify({...state, students: Object.values(action.payload)[0]}))
                    return {...state, students: Object.values(action.payload)[0]};
                case "titlekind" :
                    saveToLocalStorageOnDate("userSetup",
                        JSON.stringify({...state, titlekind: Object.values(action.payload)[0]}))
                    return {...state, titlekind: Object.values(action.payload)[0]};
                case "perioddayscount" :
                    saveToLocalStorageOnDate("userSetup",
                        JSON.stringify({...state, currentPeriodDateCount: Object.values(action.payload)[0]}))
                    return {...state, currentPeriodDateCount: Object.values(action.payload)[0]};
                case "direction" :
                    saveToLocalStorageOnDate("userSetup",
                        JSON.stringify({...state, direction: Object.values(action.payload)[0]}))
                    return {...state, direction: Object.values(action.payload)[0]};
                case "withoutholidays" :
                    saveToLocalStorageOnDate("userSetup",
                        JSON.stringify({...state, withoutholidays: Object.values(action.payload)[0]}))
                    return {...state, withoutholidays: Object.values(action.payload)[0]};
                default :
                    return state
            }
        }
        case 'UPDATE_SETUP_LOCALLY_SUBJLIST' : {
            return{...state, subjects_list: action.payload}
        }
        case 'UPDATE_SETUP_LOCALLY_SELECTEDSUBJECTS' : {
            return{...state, selectedSubjects: action.payload}
        }
        case 'UPDATE_SETUP_LOCALLY_SELECTEDSUBJECT' : {
            return{...state, selectedSubj: action.payload}
        }
        case 'UPDATE_SETUP_LOCALLY_SUBJCOUNT' : {
            return{...state, subjCount: action.payload}
        }
        case 'UPDATE_STUDENTS_REMOTE' : {
            return{...state, students: action.payload}
        }
        case 'UPDATE_STUDENTS_LOCALLY' : {
            saveToLocalStorageOnDate("userSetup",
                JSON.stringify({...state, students: action.payload}))
            return{...state, students: action.payload}
        }
        case 'UPDATE_STUDENT_CHART_SUBJECT' : {
            return{...state, studSubj : action.payload}
        }
        case 'UPDATE_HOMEWORK' : {
            return{...state, homework : action.payload}
        }
        case 'UPDATE_CHATROOMID' : {
            let classObj = state.classObj
            classObj.chatroom_id = action.payload
            return{...state, classObj}
        }
        case 'APP_LOADED' : {
            return{...state, loading : false}
        }
        case 'LANG_LIBRARY' : {
            return{...state, langLibrary: action.payload}
        }
        case 'CHAT_SESSION_ID' : {
            return{...state, chatSessionID : action.payload}
        }
        case 'APP_LOADING' : {
            return{...state, loading : true}
        }
        case 'IS_MOBILE' : {
            return{...state, isMobile : action.payload}
        }
        case 'ENABLE_SAVE_STEPS' : {
            return{...state, stepsLeft : action.payload}
        }
        case 'CHAT_SSL' : {
            return{...state, chatSSL: action.payload}
        }
        case 'ALIASES_LIST' : {
            console.log("ALIASES_LIST")
            return{...state, aliasesList: action.payload}
        }
        case 'ALIASES_LANG' : {
            console.log("ALIASES_LANG")
            return{...state, aliasesLang: action.payload}
        }
        // case "INIT_CHAT_MESSAGES" : {
        //     return{...state, localChatMessages: action.payload}
        // }
        // case "ADD_CHAT_MESSAGES" : {
        //     return{...state, localChatMessages: action.payload}
        // }
        case 'MENU_CLICK' :
            return{...state, menuItem: action.payload}
        case 'BUDGET_UPDATE' :
            return{...state, budget: action.payload}
        case 'BUDGETPAYS_UPDATE' :
            saveToLocalStorageOnDate("userSetup", JSON.stringify({...state, budgetpays: action.payload}))
            return{...state, budgetpays: action.payload}
        case 'RENDER_BUDGET' :
            return{...state, renderBudget: action.payload}
        case 'USER_LOGGEDOUT' :
            let initState = initialState(false)
            initState.langLibrary = action.langLibrary //action.langLibray?action.langLibray:(localStorage.getItem("langLibrary")?JSON.parse(localStorage.getItem("langLibrary")):null)
            console.log("userSetupReducer", 'USER_LOGGEDOUT', initState)
            return {...initState};
        default :
            return state
    }
}

