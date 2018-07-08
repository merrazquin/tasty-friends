import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'react-materialize'
import AuthUserContext from '../Session/AuthUserContext'
import './Nav.css'

class Nav extends Component {
    render() {
        const { context, location } = this.props
        return (
            <nav className="nav-center">
                <div className="nav-wrapper container">
                    {context.userInfo ?
                        (
                            <ul>
                                <li className={location.pathname.startsWith('/clubs') ? 'active' : ''}><Link to="/clubs"><Icon>group</Icon></Link></li>
                                <li className={location.pathname.startsWith('/events') ? 'active' : ''}><Link to="/events"><Icon>event</Icon></Link></li>
                                <li className={location.pathname === "/settings" ? 'active' : ''}><Link to="/settings"><Icon>settings</Icon></Link></li>
                            </ul>
                        ) : <br />
                    }
                </div>
            </nav>
        )
    }
}

export default props => (
    <AuthUserContext.Consumer>
        {context => <Nav {...props} context={context} />}
    </AuthUserContext.Consumer>
) 
