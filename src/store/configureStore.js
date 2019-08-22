/**
 * Created by Paul on 20.01.2019.
 */
// import { createStore } from 'redux'
// import { rootReducer } from '../reducers'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { combineReducers } from 'redux'
import { userSetupReducer } from '../reducers/userSetup'
import { userReducer } from '../reducers/user'
import { chatReducer } from '../reducers/chatReduser'

const rootReducer = combineReducers({
    userSetup: userSetupReducer,
    user: userReducer,
    chat : chatReducer,
})

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));