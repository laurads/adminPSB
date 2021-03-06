/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect, Link, Switch } from 'react-router-dom';
import { Button, Card, Row, Col, Icon } from 'react-materialize';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import Main from './Main';
import Login from './Auth/Login';
import Forget from './Auth/Forget';
import awsmobile from './aws-exports';
import Amplify,{Auth} from 'aws-amplify';
import './css/general.css';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import rootReducer from './reducers/index.js';
import {IntlProvider, addLocaleData} from 'react-intl';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import localeData from "./../public/locales/data.json";

 
Amplify.configure(awsmobile);

require('file-loader?name=[name].[ext]!./index.html');
require("babel-polyfill");

addLocaleData([...en, ...fr]);

const PublicRoute = ({ component: Component, authStatus, ...rest}) => (
    <Route {...rest} render={props => authStatus == false
        ? ( <Component {...props} /> ) : (<Redirect to="/main" />)
    } />
)

const PrivateRoute = ({ component: Component, authStatus, ...rest}) => (
    <Route {...rest} render={props => authStatus == false
        ? ( <Redirect to="/login" /> ) : ( <Component {...props} /> )
    } />
)

const store = createStore(rootReducer);

// Define user's language
const language =
(navigator.languages && navigator.languages[0]) ||
navigator.language ||
navigator.userLanguage;

// Split locales with a region code
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

// Try full locale, try locale without region code, fallback to 'en'
const messages =
localeData[languageWithoutRegionCode] ||
localeData[language] ||
localeData.en;

export default class AppRoute extends Component {

    constructor(props) {
        super(props);
        this.state = {authStatus: this.props.authStatus || false}
        this.handleWindowClose = this.handleWindowClose.bind(this);
    }

    handleWindowClose = async (e) => {
        e.preventDefault();
        Auth.signOut()
            .then(
                sessionStorage.setItem('isLoggedIn', false),
                this.setState(() => {
                    return {
                        authStatus: false
                    }
                })
            )
            .catch(err => console.log(err))
    }

    componentWillMount() {
        this.validateUserSession();
        window.addEventListener('beforeunload', this.handleWindowClose);
    }

    componentWillUnMount() {
        window.removeEventListener('beforeunload', this.handleWindowClose);
    }

    validateUserSession() {
        let checkIfLoggedIn = sessionStorage.getItem('isLoggedIn');
        if(checkIfLoggedIn === 'true'){
            this.setState(() => {
                return {
                    authStatus: true
                }
            })
        } else {
            this.setState(() => {
                return {
                    authStatus: false
                }
            })
        }
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <PublicRoute authStatus={this.state.authStatus} path='/' exact component={Login} />
                    <PublicRoute authStatus={this.state.authStatus} path='/login' exact component={Login} />
                    <PublicRoute authStatus={this.state.authStatus} path='/forget' exact component={Forget} />
                    <PrivateRoute authStatus={this.state.authStatus} path='/main' component={Main} />
                    <Route render={() => (<Redirect to="/login" />)} />
                </Switch>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(
<IntlProvider locale={language} messages={messages}>
    <Provider store ={store}>
        <AppRoute /> 
    </Provider>
</IntlProvider>, 
document.getElementById('root'));
