import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import AuthUserContext from '../Session/AuthUserContext'
import AuthProvider from '../Session/AuthProvider'
import Nav from '../Nav'
import NavBar from '../NavBar'
import Login from '../../pages/Login'
import UserSettings from '../../pages/UserSettings'
import Clubs from '../../pages/Clubs/'
import ClubCreation from '../../pages/ClubCreation'
import './App.css'

class App extends Component {

    render() {
        return (
            <AuthProvider>
                <Router>
                    <div className="App">
                        <NavBar/>
                        <div className="Site-content">
                            <AuthUserContext.Consumer>
                                {(context) => context.loggedOut ?
                                    <Redirect to="/" />
                                    :
                                    ''
                                }
                            </AuthUserContext.Consumer>
                            <Switch>
                                <Route exact path="/" component={Login} />
                                <Route exact path="/settings" component={UserSettings} />
                                <Route exact path="/clubs" component={Clubs} />
                                <Route exact path="/clubs/create" component={ClubCreation} />
                            </Switch>

                        </div>
                        <Route component={Nav} />
                    </div>
                </Router>
            </AuthProvider>
        )
    }
}

export default App
