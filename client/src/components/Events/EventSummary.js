import React from 'react'
import { Link } from 'react-router-dom'
import { Icon, Row, Col } from 'react-materialize'
import AddToCalendar from 'react-add-to-calendar'
import moment from 'moment'
import 'react-add-to-calendar/dist/react-add-to-calendar.min.css'
import './EventSummary.css'

export const EventSummary = props => {

    const { event, userId, showNav, handleRSVP } = props,
        { _id, date, name, theme, host } = event,
        { formattedAddress } = event.location,
        isHost = host._id === userId,
        rsvp = event.guests.find(guest => guest.guest && guest.guest._id === userId)
    return (
        <div className="left-align">
            <Row>
                <Col s={12} m={7}>
                    <h5>{moment(date).format('MM/DD')} {name}</h5>
                    <h6>Hosted by {isHost ? 'you' : host.displayName}</h6>
                </Col>
                <Col s={12} m={5}>
                    <AddToCalendar event={
                        {
                            title: name,
                            description: 'event for ' + event.club.name,
                            location: formattedAddress,
                            startTime: date,
                            endTime: moment(date).add(1.5, 'hours').valueOf()
                        }
                    }
                    />
                </Col>
            </Row>

            {showNav ? <span className="secondary-content"><Link to={"/events/" + _id}><Icon>chevron_right</Icon></Link></span> : null}
            <Row style={{ clear: 'both' }}>
                <Col s={2}><Icon>lightbulb</Icon></Col>
                <Col s={10}>{theme || 'N/A'}</Col>
            </Row>
            <Row>
                <Col s={2}><Icon>schedule</Icon></Col>
                <Col s={10}>{moment(date).format('h:mma')}</Col>
            </Row>
            <Row>
                <Col s={2}><Icon>place</Icon></Col>
                <Col s={10}><a href={"https://www.google.com/maps/place/" + formattedAddress.replace(' ', '+')} target="_blank">{formattedAddress}</a></Col>
            </Row>
            {!isHost &&
                (
                    <div className="switch">
                        <label>
                            <input type="checkbox" defaultChecked={rsvp && rsvp.rsvp} onChange={(event) => handleRSVP(_id, event.target.checked)} />
                            <span className="lever"></span>
                            {!rsvp || !rsvp.rsvp ? 'Not ' : ''} Going
                        </label>
                    </div>
                )
            }
        </div>
    )
}