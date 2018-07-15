import React from 'react'
import { Preloader } from 'react-materialize'

export const CenteredPreloader = props => (
    <div className="valign-wrapper">
        <div className="center-align">
            <Preloader />
        </div>
    </div>
)