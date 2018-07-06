import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'react-materialize'
import AuthUserContext from '../Session/AuthUserContext'
import './Nav.css'

const Nav = () => (
    <AuthUserContext.Consumer>
        {(context) =>

            (<nav className="nav-center">
                <div className="nav-wrapper container">
                    {context.userInfo ?
                        (
                            <ul>
                                <li><Link to="/clubs"><Icon>group</Icon></Link></li>
                                <li><Link to="/events"><Icon>event</Icon></Link></li>
                                <li><Link to="/settings"><Icon>settings</Icon></Link></li>
                            </ul>
                        ) : <br />
                    }
                </div>
            </nav>)
        }
    </AuthUserContext.Consumer>
)

export default Nav
