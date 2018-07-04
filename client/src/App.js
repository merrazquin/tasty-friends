import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Navbar, NavItem } from 'react-materialize'
import API from './utils/API'
import UserSettings from './pages/UserSettings'
import Nav from './components/Nav'
import './App.css'

class App extends Component {

    state = {
        userInfo: null
    }

    logout(event) {
        event.preventDefault()
        console.log('logout')
    }

    componentDidMount() {
        this.authUser('testFBAuthId')
    }

    authUser = authId => API.getUser(authId)
        .then(res => this.setState({ userInfo: res.data }))
        .catch(err => console.error(err))

    render() {
        return (
            <Router>
                <div className="App">
                    <Navbar brand="Tasty Friends" right>
                        <NavItem onClick={this.logout}>Logout</NavItem>
                    </Navbar>
                    <div className="Site-content">
                        <Switch>
                            <Route exact path="/settings" render={routeProps => <UserSettings {...routeProps} userInfo={this.state.userInfo} />} />
                        </Switch>
                    </div>
                    <Nav />
                </div>
            </Router>
        )
    }
}

export default App
