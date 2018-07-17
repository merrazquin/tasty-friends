import React from 'react'
import { Row, Input } from 'react-materialize'
import SearchBar from '../SearchBar'

export const EventInfo = props => {
    const {changeHandler, addressChangeHandler, dateChangeHandler, eventObj, date, time, address, dateOptions} = props
    return (
        <Row>
            <Input s={12} name="name" onChange={changeHandler} label="Name" placeholder="Dinner" defaultValue={eventObj.name} required />
            <Input s={12} name="theme" onChange={changeHandler} label="Theme" placeholder="Foodie Forum" defaultValue={eventObj.theme} />
            <SearchBar name="location" onChange={addressChangeHandler} address={address} required />
            <Input s={12} m={6} name="date" onChange={dateChangeHandler} label="Date" type="date" data-value={date} defaultValue={date} options={{ ...dateOptions, closeOnSelect: true }} required />
            <Input s={12} m={6} name="time" onChange={dateChangeHandler} label="Time" type="time" defaultValue={time} options={{ closeOnSelect: true }} required />
        </Row>
    )
}