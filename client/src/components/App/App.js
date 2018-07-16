import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import FacebookLogin from 'react-facebook-login'
import AuthProvider from '../Session/AuthProvider'
import AuthUserContext from '../Session/AuthUserContext'
import Nav from '../Nav'
import NavBar from '../NavBar'
import Login from '../../pages/Login'
import UserSettings from '../../pages/UserSettings'
import Clubs from '../../pages/Clubs'
import ClubDetails from '../../pages/ClubDetails'
import ClubCreation from '../../pages/ClubCreation'
import AddClubMembers from '../../pages/AddClubMembers'
import EventPlanning from '../../pages/EventPlanning/EventPlanning'
import './App.css'

class App extends Component {

    render() {
        return (
            <AuthProvider>
                <Router>
                    <div className="App">
                        <AuthUserContext.Consumer>
                            {(context) => context.loggedOut ?
                                <Redirect to="/" />
                                :
                                null
                            }
                        </AuthUserContext.Consumer>
                        <NavBar />
                        <div className="Site-content">
                            <Switch>
                                <Route exact path="/" component={Login} />
                                <Route exact path="/settings" component={UserSettings} />
                                <Route exact path="/clubs" component={Clubs} />
                                <Route exact path="/clubs/create" component={ClubCreation} />
                                <Route exact path="/clubs/:id" component={ClubDetails} />
                                <Route exact path="/clubs/:id/invite" component={AddClubMembers} />
                                <Route exact path="/clubs/:id/plan/:which" component={EventPlanning} />
                            </Switch>
    
                        </div>
                            <Route component={Nav} />
                            <FacebookLogin cssClass="hidden" appId={process.env.REACT_APP_FB_APP_ID} autoLoad={false} version="3.0" />
                        </div>
                </Router>
            </AuthProvider>
                )
            }
        }
        
        export default App
