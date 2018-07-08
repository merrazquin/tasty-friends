import React from 'react'

export const FrequencySelector = props => (
    <div>
        <span className="col s12">
            <input name="frequency" type="radio" value="weekly" id="weekly" className="with-gap" defaultChecked={props.frequency === "weekly"} onChange={props.onChange} /> <label htmlFor="weekly">Weekly</label>
        </span>
        <span className="col s12">
            <input name="frequency" type="radio" value="monthly" id="monthly" className="with-gap" defaultChecked={props.frequency === "monthly"} onChange={props.onChange} /> <label htmlFor="monthly">Monthly</label>
        </span>
    </div>
)