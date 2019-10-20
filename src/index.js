import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App';
import * as serviceWorker from './serviceWorker';

import { store } from './store/configureStore'
import { Provider } from 'react-redux'
import { Route, BrowserRouter } from 'react-router-dom';
import AdminPage from './components/AdminPage/adminpage'
import AdminPageTeacher from './components/AdminPageTeacher/adminpageteacher'
import HomeWorkSection from './components/AdminHomeWorkSection/homeworksection'
import AdminPageWorkFlow from './components/AdminPageWorkFlow/adminpageworkflow'
import AdminBudgetPage from './components/AdminBudgetPage/adminbudgetpage'
import { CookiesProvider } from 'react-cookie';
// import {CSSTransitionGroup, CSSTransition, TransitionGroup } from 'react-transition-group/CSSTransitionGroup';
// const store = createStore(() => {}, {})

ReactDOM.render(
    <Provider store={store}>
        {/*<TransitionGroup>*/}
        <CookiesProvider>
            <BrowserRouter>
                <div>
                    {/*<CSSTransition key={"route-root"}>*/}
                    <Route exact path="/" component={App} />
                    <Route exact path="/r" component={App} />
                    <Route path="/r3/" component={App} />
                    <Route path="/admin" component={AdminPage}/>
                    <Route path="/adminteacher" component={AdminPageTeacher}/>
                    <Route path="/hw" component={HomeWorkSection}/>
                    <Route path="/budget" component={AdminBudgetPage}/>
                    <Route path="/workflow" component={AdminPageWorkFlow}/>
                </div>
            </BrowserRouter>
        </CookiesProvider>
        {/*</TransitionGroup>*/}
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
