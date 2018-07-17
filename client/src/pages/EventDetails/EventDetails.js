import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import AuthUserContext from '../../components/Session/AuthUserContext'
import { CenteredPreloader } from '../../components/CenteredPreloader'
import { Container, Card, Icon, Modal, Button } from 'react-materialize'
import { EventInfo } from '../../components/Events/EventInfo'
import API from '../../utils/API'
import utils from '../../utils/utils'
import moment from 'moment'

class EventDetails extends Component {
    constructor() {
        super()
        this.state = {
            eventObj: null,
            dateSelected: null,
            timeSelected: null,
            isHost: false,
            redirect: false
        }
    }

    getEventDetails = () => API.getEvent(this.props.match.params.id).then(result => this.setState({ eventObj: result.data, isHost: this.props.context.userInfo._id === result.data.host._id })).catch(err => console.error(err))

    updateEvent = (event) => {
        event.preventDefault()
    }

    deleteEvent = () => {
        let clubId = this.state.eventObj.club._id
        API.deleteEvent(this.state.eventObj._id)
            .then(result => this.setState({ redirect: '/clubs/' + clubId }))
    }

    componentDidMount() {
        if (this.props.context.userInfo) {
            this.getEventDetails()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.eventObj) {
            this.getEventDetails()
        }
    }
    render() {
        const { eventObj, isHost } = this.state
        if (!eventObj) {
            return <CenteredPreloader />
        }

        return (
            <Container>
                {this.state.redirect ? <Redirect to={this.state.redirect} /> : null}
                <span className="breadcrumbs"><Link to={"/clubs/" + eventObj.club._id}><Icon>keyboard_backspace</Icon> <span className="label">Club details</span></Link></span>
                <Card>
                    {
                        isHost ?
                            (
                                <form onSubmit={this.updateEvent}>
                                    <h4>{eventObj.name}</h4>
                                    <EventInfo
                                        changeHandler={this.handleChange}
                                        addressChangeHandler={this.handleAddressChange}
                                        dateChangeHandler={this.handleDateChange}
                                        eventObj={eventObj}
                                        address={eventObj.location && eventObj.location.formattedAddress}
                                        time={this.state.timeSelected || moment(eventObj.date).format('hh:mmA')}
                                        date={this.state.dateSelected || moment(eventObj.date).format('D MMMM, YYYY')}
                                        dateOptions={utils.getDateRange(eventObj.club.frequency.slice(0, -2), 'current')}
                                    />
                                </form>
                            ) : <h4>{eventObj.name}</h4>
                    }

                    {isHost ?
                        <Modal header="Delete Event?" trigger={<Button className="red lighten-1">Delete Event</Button>}
                            actions={<span>
                                <Button className="modal-close">Cancel</Button>
                                <Button className="modal-close red lighten-1" onClick={this.deleteEvent}>Yes</Button>
                            </span>}>
                            <p>Are you sure you want to delete "{eventObj.name}"?</p>
                        </Modal>

                        : null}

                </Card>
            </Container>
        )
    }
}
export default props => (
    <AuthUserContext.Consumer>
        {context => <EventDetails {...props} context={context} />}
    </AuthUserContext.Consumer>
)