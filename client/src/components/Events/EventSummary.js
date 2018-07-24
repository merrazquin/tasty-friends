import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'react-materialize'
import moment from 'moment'

export const EventSummary = props => {

    const { event, userId, showNav, handleRSVP } = props,
        { _id, date, name, theme, host } = event,
        { formattedAddress } = event.location,
        isHost = host._id === userId,
        rsvp = event.guests.find(guest => guest.guest && guest.guest._id === userId)
    return (
        <div className="left-align">
            <h5>{moment(date).format('MM/DD')} {name}</h5>
            <h6>Hosted by {isHost ? 'you' : host.displayName}</h6>
            {showNav ? <span className="secondary-content"><Link to={"/events/" + _id}><Icon>chevron_right</Icon></Link></span> : null}
            {theme && (<p><Icon>lightbulb</Icon> {theme}</p>)}
            <p><Icon>schedule</Icon> {moment(date).format('h:mma')}</p>
            <p><Icon>place</Icon> <a href={"https://www.google.com/maps/place/" + formattedAddress.replace(' ', '+')} target="_blank">{formattedAddress}</a></p>
            {!isHost &&
                (
                    <div className="switch">
                        <label>
                            <input type="checkbox" defaultChecked={rsvp && rsvp.rsvp} onChange={(event) => handleRSVP(_id, event.target.checked)} />
                            <span className="lever"></span>
                            {!rsvp || !rsvp.rsvp ? 'Not ' : ''}Going
                                </label>
                    </div>
                )
            }
        </div>
    )
}