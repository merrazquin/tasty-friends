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
            request: '',
            isHost: false,
            redirect: false
        }

        this.saveTimeout = null
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
    handleChange = event => {
        const { name, value } = event.target,
            { eventObj } = this.state
        switch (name) {
            case 'request':
                this.setState({ [name]: value })
                break;
            default:
                eventObj[name] = value;
                // this.setState({ eventObj })
                clearTimeout(this.saveTimeout)
                this.saveTimeout = setTimeout(() =>
                    API.updateClubEvent(eventObj)
                        .then(() => {
                            this.props.context.popupToast()
                            this.getEventDetails()
                        })
                        .catch(err => console.error(err))
                    , 1000)


        }
    }

    handleAddressChange = ({ address, latitude, longitude }) => {
        const { eventObj } = this.state

        eventObj.location = { formattedAddress: address, lat: latitude, lng: longitude }
        clearTimeout(this.saveTimeout)
        this.saveTimeout = setTimeout(() =>
            API.updateClubEvent(eventObj)
                .then(() => {
                    this.props.context.popupToast()
                    this.getEventDetails()
                })
                .catch(err => console.error(err))
            , 1000)

    }

    handleDateChange = (event, val) => {
        this.setState({ [event.target.name + 'Selected']: val })
    }

    handleRequestAdd = (event) => {
        if (event.type === 'click' || event.key === 'Enter') {
            event.preventDefault()

            if (!this.state.request) {
                return this.props.context.popupToast('Please provide a request')
            }
            const { eventObj, request } = this.state
            API.addEventRequest(eventObj._id, request)
                .then(() => this.getEventDetails())
                .catch(err => console.error(err))

            this.setState({ request: '' })
        }
    }

    handleRSVP = (eventId, rsvp) => {
        API.rsvpToEvent(this.props.context.userInfo._id, eventId, rsvp)
            .then(() => this.getEventDetails())
            .catch(err => console.error(err))
    }

    handleRequestRemove = (requestId) => {
        const { eventObj } = this.state
        API.removeEventRequest(eventObj._id, requestId)
            .then(() => this.getEventDetails())
            .catch(err => console.error(err))
    }

    handleRequestClaim = (requestId, claim = true) => {
        const userId = this.props.context.userInfo._id;

        (claim ?
            API.claimEventRequest(userId, requestId)
            :
            API.unclaimEventRequest(userId, requestId)
        )
            .then(() => this.getEventDetails())
            .catch(err => console.error(err))
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
        console.log(this.props.history[0])
        return (
            <Container>
                {this.state.redirect ? <Redirect to={this.state.redirect} /> : null}
                <span className="breadcrumbs"><Button className="btn-flat" onClick={() => this.props.history.goBack()}><Icon>keyboard_backspace</Icon> <span className="label">Back</span></Button></span>
                <Card>
                    {/* <form onSubmit={this.updateEvent}> */}
                    <EventInfo
                        editable={isHost}
                        userId={this.props.context.userInfo._id}
                        header={<h4>Event Details</h4>}
                        changeHandler={this.handleChange}
                        addressChangeHandler={this.handleAddressChange}
                        dateChangeHandler={this.handleDateChange}
                        requestHandler={this.handleRequestAdd}
                        requestRemover={this.handleRequestRemove}
                        handleRequestClaims={this.handleRequestClaim}
                        rsvpHandler={this.handleRSVP}
                        eventObj={eventObj}
                        address={eventObj.location && eventObj.location.formattedAddress}
                        time={this.state.timeSelected || moment(eventObj.date).format('hh:mmA')}
                        date={this.state.dateSelected || moment(eventObj.date).format('D MMMM, YYYY')}
                        dateOptions={utils.getDateRange(eventObj.club.frequency.slice(0, -2), 'current')}
                        request={this.state.request}
                    />
                    {/* </form> */}

                    {isHost ?
                        <Modal header="Delete Event?" trigger={<Button className="red lighten-1">Delete Event</Button>}
                            actions={<span>
                                <Button className="modal-action modal-close btn-flat">Cancel</Button>
                                <Button className="modal-action modal-close red lighten-1" onClick={this.deleteEvent}>Yes</Button>
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