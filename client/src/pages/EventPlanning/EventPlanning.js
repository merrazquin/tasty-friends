import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Container, Row, Card } from 'react-materialize'
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
        eventObj[name] = value;
        this.setState({ eventObj })
    }

    handleAddressChange = ({ address, latitude, longitude }) => {
        const { eventObj } = this.state

        eventObj.location = { formattedAddress: address, lat: latitude, lng: longitude }
        this.setState({ eventObj })

    }

    handleDateChange = (event, val) => {
        this.setState({ [event.target.name + 'Selected']: val })
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
                        <h4>Plan Event for {club.name}</h4>
                        <EventInfo
                            changeHandler={this.handleChange}
                            addressChangeHandler={this.handleAddressChange}
                            dateChangeHandler={this.handleDateChange}
                            eventObj={eventObj}
                            address={(eventObj.location && eventObj.location.formattedAddress) || (userInfo.defaultLocation && userInfo.defaultLocation.formattedAddress)}
                            time={this.state.timeSelected}
                            dateOptions={utils.getDateRange(club.frequency.slice(0, -1), this.props.match.params.which)}
                        />

                        <Row>
                            <Link to={"/clubs/" + this.state.club._id} className="btn red lighten-1">Cancel</Link>&nbsp;
                            <input type="submit" value="Create" className="btn" />
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