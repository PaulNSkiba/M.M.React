/**
 * Created by Paul on 20.01.2019.
 */

const initialState = {
        curClass: 0, classNumber : 0, classID : 0,
        pupilCount: 0,
        students : [],
        currentYear: "",
        curYearDone: 0,
        subjCount: "0/0",
        userID: 0,
        selectedSubjsArray: [], selectedSubjects:[], selectedSubj : {id:0, subj_key:"#null"},
        subjects_list : [],
        markBlank : {id: "", alias: "", pk: 1},
        currentPeriodDateCount : 5,
        marks : [],
        direction : "UPDOWN",
        titlekind : "NICK",
        withoutholidays : true,
        token: "",
        userName: "",
        isadmin: 0,
        studentName : "", studentId : 0,
        studSubj : new Map(),
        mark_dates : [], best_lines : [], avg_lines : [], avg_marks : [],
        addUserToken : "",
        cnt_marks : 0,
        stud_cnt : 0,
        subj_cnt : 0,
        lastmarkssent : "",
        emails : [],
        homework : [],
        stats2 : [], stats3 : [],
        mark_date : {date : new Date()},
        avgclassmarks : [],
        loading : true,
        stepsLeft : 6,
        chatSessionID : '',
        classObj : { chatroom_id : 0},
}

export function userSetupReducer(state = initialState, action) {
    // ToDO: При отсутствтии настроек проверить на undefined
    switch (action.type) {
        case 'INIT_STATE':
            // console.log('INIT_STATE')
            return {...state, initialState}
        case 'USER_LOGGEDIN' : {
            // console.log("JUST_LOGGEDIN", action.payload)
            let {   token, subj_count, subjects_list,
                    selected_subjects, selected_subj, students, marks,
                    mark_dates, best_lines, avg_lines, avg_marks, addUserToken,
                    lastmarkssent, emails, homework, stats2, stats3, mark_date, avgclassmarks, classObj} = action.payload;
            let {   name : userName, id : userID, isadmin } = action.payload.user;
            let {   class_number, pupil_count, year_name, perioddayscount,
                    markblank_id, markblank_alias, selected_marker, titlekind,
                    direction, class_id } = action.payload.usersetup;
            let {   id : studentId, student_name : studentName} = action.payload.student;
            let {   cnt_marks, stud_cnt, subj_cnt } = action.payload.stats[0];
            studentId = studentId?studentId:0;
            return {...state, userName, userID, token,
                curClass: class_number, classNumber : class_number, classID : class_id, pupilCount: pupil_count,
                currentYear: year_name, currentPeriodDateCount: perioddayscount,
                markBlank:{id: markblank_id, alias: markblank_alias, pk: selected_marker},
                titlekind: titlekind, direction : direction,
                subjCount: subj_count, subjects_list: subjects_list, selectedSubjects : selected_subjects,
                selectedSubj : selected_subj, students : students?students:[], classObj,
                isadmin, studentName, studentId, marks, mark_dates, best_lines, avg_lines, avg_marks, addUserToken,
                cnt_marks, stud_cnt, subj_cnt, lastmarkssent, emails, homework, stats2 : stats2[0], stats3 : stats3[0],
                mark_date, avgclassmarks,
                }
            }
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
            console.log('UPDATE_SETUP_LOCALLY', Object.keys(action.payload)[0], Object.values(action.payload)[0], Object.values(action.payload)[0][0])
            // if (Object.keys(action.payload)[0]==='students') {
            //     console.log(Object.values(action.payload)[0].map(value=>JSON.parse(JSON.stringify(value))))
            // }
            switch(Object.keys(action.payload)[0]) {
                case "year_name":
                    return{...state, currentYear: Object.values(action.payload)[0]};
                case "pupil_count":
                    return{...state, pupilCount: Object.values(action.payload)[0]};
                case "class_number":
                    return{...state,    curClass: Object.values(action.payload)[0],
                                        classNumber : Object.values(action.payload)[0],
                                        selectedSubjects : []};
                case "subjects_count" :
                    return{...state, subjCount: Object.values(action.payload)[0]};
                case "selected_subject" :
                    let arr = Object.values(action.payload)[0].split(",");
                    return{...state, selectedSubj: JSON.parse(`{"id":${arr[2]},"subj_key":"${arr[0]}","subj_name_ua":"${arr[1]}"}`)};
                case "selected_subjects" :
                    return{...state, selectedSubjects: Object.values(action.payload)[0]};
                case "markblank_alias" :
                    return{...state, markBlank:{alias: Object.values(action.payload)[0]}};
                case "markblank_id" :
                    return{...state, markBlank:{id: Object.values(action.payload)[0]}};
                case "selected_marker" :
                    return{...state, markBlank:{pk: Object.values(action.payload)[0]}};
                case "markblank" :
                    return{...state, markBlank:{id: Object.values(action.payload)[0][0].markblank_id,  alias: Object.values(action.payload)[0][1].markblank_alias, pk: Object.values(action.payload)[0][2].selected_marker}}
                case "students" :
                    return{...state, students: Object.values(action.payload)[0]};
                case "titlekind" :
                    return{...state, titlekind: Object.values(action.payload)[0]};
                case "perioddayscount" :
                    return{...state, currentPeriodDateCount: Object.values(action.payload)[0]};
                case "direction" :
                    return{...state, direction: Object.values(action.payload)[0]};
                case "withoutholidays" :
                    return{...state, withoutholidays: Object.values(action.payload)[0]};
                default :
                    return state
            }}
        case 'UPDATE_SETUP_LOCALLY_SUBJLIST' : {
            return{...state, subjects_list: action.payload}
        }
        case 'UPDATE_SETUP_LOCALLY_SUBJCOUNT' : {
            return{...state, subjCount: action.payload}
        }
        case 'UPDATE_STUDENTS_REMOTE' : {
            return{...state, students: action.payload}
        }
        case 'UPDATE_STUDENTS_LOCALLY' : {
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
        case 'CHAT_SESSION_ID' : {
            return{...state, chatSessionID : action.payload}
        }
        case 'APP_LOADING' : {
            return{...state, loading : true}
        }
        case 'ENABLE_SAVE_STEPS' : {
            return{...state, stepsLeft : action.payload}
        }
        case 'USER_LOGGEDOUT' :
            // console.log("userSetupReducer", 'USER_LOGGEDOUT')
            return {...state,         curClass: 0,
                classNumber : 0,
                classID : 0,
                pupilCount: 0,
                students : [],
                currentYear: "",
                curYearDone: 0,
                subjCount: "0/0",
                userID: 0,
                selectedSubjsArray: [],
                selectedSubjects:[],
                selectedSubj : {id:0, subj_key:"#null"},
                subjects_list : [],
                markBlank : {id: "", alias: "", pk: 1},
                currentPeriodDateCount : 5,
                marks : [],
                direction : "UPDOWN",
                titlekind : "NICK",
                withoutholidays : true,
                token: "",
                userName: "",
                isadmin: 0,
                studentId : 0,
                studentName : '',
                studSubj : new Map(),
                mark_dates : [],
                best_lines : [],
                avg_lines : [],
                avg_marks : [],
                addUserToken : "",
                cnt_marks : 0,
                stud_cnt : 0,
                subj_cnt : 0,
                lastmarkssent : "",
                emails : [],
                homework : [],
                stats2 : [],
                stats3 : [],
                mark_date : {date : new Date()},
                avgclassmarks : [],
                loading : false,
                stepsLeft : 6,
                chatSessionID : '',
                classObj : { chatroom_id : 0},
                };
        default :
            return state
    }
}

