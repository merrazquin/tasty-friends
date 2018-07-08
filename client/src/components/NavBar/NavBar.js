import React, { Component } from 'react'
import AuthUserContext from '../Session/AuthUserContext'
import { Navbar, NavItem } from 'react-materialize'
import Login from '../../pages/Login'
import './NavBar.css'

class NavBar extends Component {
    render() {
        return (
            <Navbar brand="Tasty Friends" right options={{ closeOnClick: true }}>
                <AuthUserContext.Consumer>
                    {context => context.userInfo ? <NavItem onClick={context.logout}>Logout</NavItem> : <Login/>}
                </AuthUserContext.Consumer>
            </Navbar>
        )
    }
}

export default NavBar