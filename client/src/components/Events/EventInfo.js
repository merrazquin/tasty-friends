import React from 'react'
import { Collection, CollectionItem, Button, Icon, Row, Input, Col } from 'react-materialize'
import SearchBar from '../SearchBar'
import utils from '../../utils/utils'
import { EventSummary } from './EventSummary';

export const EventInfo = props => {
    const { editable, userId, header, changeHandler, addressChangeHandler, dateChangeHandler, handleRequestClaims, requestHandler, rsvpHandler, requestRemover, request, eventObj, date, time, address, dateOptions } = props
    return (
        <div>
            {header}
            {
                editable ?
                    <Row>
                        <Input s={12} name="name" onChange={changeHandler} label="Name" placeholder="Dinner" defaultValue={eventObj.name} required />
                        <Input s={12} name="theme" onChange={changeHandler} label="Theme" placeholder="Foodie Forum" defaultValue={eventObj.theme} />
                        <SearchBar name="location" onChange={addressChangeHandler} address={address} required />
                        <Input s={12} m={6} name="date" onChange={dateChangeHandler} label="Date" type="date" data-value={date} defaultValue={date} options={{ ...dateOptions, closeOnSelect: true }} required />
                        <Input s={12} m={6} name="time" onChange={dateChangeHandler} label="Time" type="time" defaultValue={time} options={{ closeOnSelect: true }} required />
                    </Row>
                    : <EventSummary event={eventObj} userId={userId} handleRSVP={rsvpHandler} />
            }


            <Collection header="Requests">
                {editable ?
                    <CollectionItem>
                        <Row>
                            <Input s={8} m={10} name="request" onKeyPress={requestHandler} onChange={changeHandler} label="Request" placeholder="Bottle of wine" value={request} />
                            <div className="input-field col s4 m2 right-align">
                                <Button className="btn-small" onClick={requestHandler}><Icon>add</Icon></Button>
                            </div>
                        </Row>
                    </CollectionItem>
                    : <span></span>
                }
                {
                    eventObj.requests ?
                        eventObj.requests.map((request, index) =>
                            (
                                <CollectionItem className="left-align" key={"req_" + index}>
                                    <Row>
                                        <Col s={8} m={10}>
                                            <h5>{request.request}</h5>
                                            {request.provider && ((request.provider._id === userId ? 'You' : request.provider.displayName) + ' will provide')}
                                        </Col>
                                        <Col s={4} m={2} className="right-align">
                                            {editable ?
                                                <Button className="red lighten-1 btn-small" onClick={(evt) => { evt.preventDefault(); requestRemover(request._id || index) }}><Icon>delete</Icon></Button>
                                                :
                                                (
                                                    request.provider && request.provider._id === userId ?
                                                        <Button className="btn-small" onClick={(evt) => { evt.preventDefault(); handleRequestClaims(request._id, false) }}>Unclaim</Button>
                                                        :
                                                        <Button disabled={request.provider} className="btn-small" onClick={(evt) => { evt.preventDefault(); handleRequestClaims(request._id) }}>Claim</Button>
                                                )
                                            }
                                        </Col>
                                    </Row>
                                </CollectionItem>
                            )
                        )
                        : <span></span>
                }
            </Collection>
        </div>
    )
}