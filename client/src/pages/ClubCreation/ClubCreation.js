import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Row, Input, Card } from 'react-materialize'
import AuthUserContext from '../../components/Session/AuthUserContext'
import API from '../../utils/API'
import { FrequencySelector } from '../../components/Clubs';

class ClubCreation extends Component {
    state = {
        name: '',
        frequency: 'monthly'
    }

    render() {
        return (
            <form onSubmit={this.createClub}>
                <Card title="Create Club">
                    <Row>
                        <Input type="text" name="name" label="Club Name" defaultValue={this.state.name} onChange={this.handleChange} s={12} required />
                    </Row>
                    <Row className="left-align">
                        <h6>Frequency</h6>
                        <FrequencySelector frequency={this.state.frequency} onChange={this.handleChange} />
                    </Row>
                    <Row>
                        <Link to="/clubs" className="btn red lighten-1">Cancel</Link>&nbsp;
                        <input type="submit" value="Create" className="btn" />
                    </Row>
                </Card>
            </form>
        )
    }
    handleChange = event => {
        const { name, value } = event.target
        this.setState({ [name]: value })
    }

    createClub = event => {
        event.preventDefault()
        const clubInfo = this.state
        if (clubInfo.name) {
            clubInfo.owner = this.props.context.userInfo
            API.createClub(clubInfo)
                .then(res => {
                    this.props.context.refreshUser()
                    window.location.href = '/clubs/' + res.data._id
                })
                .catch(err => console.error(err))
        }
    }
}

export default props => (
    <AuthUserContext.Consumer>
        {context => <ClubCreation {...props} context={context} />}
    </AuthUserContext.Consumer>
)
