/**
 * Created by Paul on 20.01.2019.
 */
// import { createStore } from 'redux'
import { rootReducer } from '../reducers'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// export const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));