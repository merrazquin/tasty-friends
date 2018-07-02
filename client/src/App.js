import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import API from './utils/API';

class App extends Component {

    state = {
        userInfo: null
    }

    componentDidMount() {
        this.getUser('testFBAuthId')
    }

    getUser = authId => API.getUser(authId)
        .then(res => { console.log('data',res.data); this.setState({ userInfo: res.data })})
        .catch(err => console.error(err))

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    <strong>Display Name:</strong> {this.state.userInfo && this.state.userInfo.displayName}<br/>
                    <strong>Default Location:</strong> {this.state.userInfo && this.state.userInfo.defaultLocation && this.state.userInfo.defaultLocation.formattedAddress}
                </p>
            </div>
        );
    }
}

export default App;
