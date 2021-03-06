import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Container, Row, Card, Col } from 'react-materialize'
import { CenteredPreloader } from '../../components/CenteredPreloader'
import API from '../../utils/API'
import AuthUserContext from '../../components/Session/AuthUserContext'
import utils from '../../utils/utils'
import { EventInfo } from '../../components/Events/EventInfo'

class EventPlanning extends Component {
    constructor() {
        super()
        this.state = {
            club: null,
            eventObj: {},
            dateSelected: null,
            timeSelected: '07:00PM',
            request: '',
            redirect: false
        }
    }

    getClubDetails = () => API.getClub(this.props.match.params.id).then(result => this.setState({ club: result.data, isOwner: this.props.context.userInfo._id === result.data.owner._id })).catch(err => console.error(err))

    createEvent = event => {
        event.preventDefault()
        const { eventObj, timeSelected, dateSelected } = this.state

        if (!timeSelected || !dateSelected) {
            return window.Materialize.toast('Date and time required!', 2000)
        }

        const { hours, minutes } = utils.convertTimeto24Hour(timeSelected)

        eventObj.date = new Date(dateSelected)
        eventObj.date.setHours(hours, minutes)
        eventObj.club = this.state.club._id
        eventObj.host = this.props.context.userInfo._id

        const { formattedAddress, lat, lng } = eventObj.location || this.props.context.userInfo.defaultLocation
        eventObj.location = { formattedAddress, lat, lng }

        API.createClubEvent(eventObj).then(result => this.setState({ redirect: ('/events/' + result.data._id) }))
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
                this.setState({ eventObj })
        }
    }

    handleAddressChange = ({ address, latitude, longitude }) => {
        const { eventObj } = this.state

        eventObj.location = { formattedAddress: address, lat: latitude, lng: longitude }
        this.setState({ eventObj })

    }

    handleDateChange = (event, val) => {
        this.setState({ [event.target.name + 'Selected']: val })
    }

    handleRequestAdd = (event) => {
        if (event.type === 'click' || event.key === 'Enter') {
            event.preventDefault()
            
            if (!this.state.request) {
                return window.Materialize.toast('Please provide a request', 2000)
            }

            const { eventObj } = this.state
            if (!eventObj.requests) {
                eventObj.requests = []
            }
            eventObj.requests.push({ request: this.state.request })
            this.setState({ eventObj, request: '' })
        }
    }

    handleRequestRemove = (index) => {
        const { eventObj } = this.state
        eventObj.requests.splice(index, 1)
        this.setState({ eventObj })
    }

    componentDidMount() {
        if (this.props.context.userInfo) {
            this.getClubDetails()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.club) {
            this.setState({ eventObj: { location: nextProps.context.userInfo.defaultLocation } })
            this.getClubDetails()
        }
    }

    render() {
        const { club, eventObj } = this.state,
            { userInfo } = this.props.context

        if (!club) {
            return <CenteredPreloader />
        }
        return (
            <Container>
                <form onSubmit={this.createEvent}>
                    {this.state.redirect ? <Redirect to={this.state.redirect} /> : null}
                    <Card>
                        <EventInfo
                            editable={true}
                            userId={this.props.context.userInfo._id}
                            header={<h4>Plan Event for {club.name}</h4>}
                            changeHandler={this.handleChange}
                            addressChangeHandler={this.handleAddressChange}
                            dateChangeHandler={this.handleDateChange}
                            requestHandler={this.handleRequestAdd}
                            requestRemover={this.handleRequestRemove}
                            eventObj={eventObj}
                            address={(eventObj.location && eventObj.location.formattedAddress) || (userInfo.defaultLocation && userInfo.defaultLocation.formattedAddress)}
                            time={this.state.timeSelected}
                            dateOptions={utils.getDateRange(club.frequency.slice(0, -2), this.props.match.params.which)}
                            request={this.state.request}
                        />

                        <Row>
                            <Col s={6} className="input-field right-align">
                                <Link to={"/clubs/" + this.state.club._id} className="btn red lighten-1">Cancel</Link>
                            </Col>
                            <Col s={6} className="input-field left-align">
                                <input type="submit" value="Create" className="btn" />
                            </Col>
                        </Row>
                    </Card>
                </form>
            </Container>
        )
    }
}

export default props => (
    <AuthUserContext.Consumer>
        {context => <EventPlanning {...props} context={context} />}
    </AuthUserContext.Consumer>
)