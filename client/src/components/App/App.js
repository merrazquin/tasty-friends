import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import AuthProvider from '../Session/AuthProvider'
import Nav from '../Nav'
import NavBar from '../NavBar'
import Login from '../../pages/Login'
import UserSettings from '../../pages/UserSettings'
import Clubs from '../../pages/Clubs'
import ClubDetails from '../../pages/ClubDetails'
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
                            <Switch>
                                <Route exact path="/" component={Login} />
                                <Route exact path="/settings" component={UserSettings} />
                                <Route exact path="/clubs" component={Clubs} />
                                <Route exact path="/clubs/create" component={ClubCreation} />
                                <Route exact path="/clubs/:id" component={ClubDetails} />
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
