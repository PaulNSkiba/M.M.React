/**
 * Created by Paul on 20.01.2019.
 */
import { combineReducers } from 'redux'
import { userSetupReducer } from './userSetup'
import { userReducer } from './user'

export const rootReducer = combineReducers({
    userSetup: userSetupReducer,
    user: userReducer,
})



