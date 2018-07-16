import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Container, Row, Card, Input } from 'react-materialize'
import { CenteredPreloader } from '../../components/CenteredPreloader'
import SearchBar from '../../components/SearchBar'
import API from '../../utils/API'
import AuthUserContext from '../../components/Session/AuthUserContext'
import moment from 'moment'
import utils from '../../utils/utils'


class EventPlanning extends Component {
    constructor() {
        super()
        this.state = {
            club: null,
            which: '',
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

        API.createClubEvent(eventObj).then(result => console.log(result.data))
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

    getDateRange = () => {
        const today = new Date(),
            { which } = this.props.match.params,
            { club } = this.state,
            unit = club.frequency.slice(0, -2),
            range = { min: today }


        range.min = which === "current" ? today : moment(today).startOf(unit).add(1, unit).toDate()
        range.max = moment(today).add(which === "current" ? 0 : 1, unit).endOf(unit).toDate()
        return range
    }

    componentDidMount() {
        if (this.props.context.userInfo) {
            console.log('MOUUNNNTT')
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

                        <Input name="name" onChange={this.handleChange} label="Name" placeholder="Dinner" defaultValue={eventObj.name} required />
                        <Input name="theme" onChange={this.handleChange} label="Theme" placeholder="Foodie Forum" defaultValue={eventObj.theme} />
                        <SearchBar name="location" onChange={this.handleAddressChange} address={(eventObj.location && eventObj.location.formattedAddress) || (userInfo.defaultLocation && userInfo.defaultLocation.formattedAddress)} required />
                        <Input name="date" onChange={this.handleDateChange} label="Date" type="date" options={{ ...this.getDateRange(), closeOnSelect: true }} required />
                        <Input name="time" onChange={this.handleDateChange} label="Time" type="time" defaultValue={this.state.timeSelected} options={{ closeOnSelect: true }} required />

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