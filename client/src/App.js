import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import API from './utils/API'
import UserSettings from './pages/UserSettings'

class App extends Component {

    state = {
        userInfo: null
    }

    componentDidMount() {
        this.authUser('testFBAuthId')
    }

    authUser = authId => API.getUser(authId)
        .then(res => this.setState({ userInfo: res.data }))
        .catch(err => console.error(err))

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Tasty Friends</h1>
                </header>
                <Router>
                    <Switch>
                        <Route exact path="/" render={routeProps => <UserSettings {...routeProps} userInfo={this.state.userInfo} />} />
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default App
