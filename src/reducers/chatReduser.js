/**
 * Created by Paul on 21.08.2019.
 */
const initialState = {
// мы вложили в user вместо строки, объект
    localChatMessages : [],
    newMessages : 0,
    newHomeWorks : 0,
    newWorkFlow : 0,
}

export function chatReducer(state = initialState, action) {
    switch (action.type) {
        case "INIT_CHAT_MESSAGES" : {
            return{...state, initialState}
        }
        case "ADD_CHAT_MESSAGES" : {
            console.log("ADD_CHAT_MESSAGES", action.payload)
            return{...state, localChatMessages: action.payload}
        }
        default:
            return state
    }
}