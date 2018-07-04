import React from "react"
import { Link } from 'react-router-dom'
import { Icon } from 'react-materialize'
import './Nav.css'

const Nav = () => (
    <nav className="nav-center">
        <div className="nav-wrapper container">
            <ul>
                <li><Link to="/clubs"><Icon>group</Icon></Link></li>
                <li><Link to="/events"><Icon>event</Icon></Link></li>
                <li><Link to="/settings"><Icon>settings</Icon></Link></li>
            </ul>
        </div>
    </nav>
)

export default Nav
