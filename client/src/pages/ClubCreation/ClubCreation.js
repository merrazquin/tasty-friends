import React, { Component } from 'react'
import { Row, Input, Card } from 'react-materialize'
import AuthUserContext from '../../components/Session/AuthUserContext'
import API from '../../utils/API'

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
                        <span className="col s12">
                            <input name="frequency" type="radio" value="weekly" id="weekly" className="with-gap" checked={this.state.frequency === "weekly"} onChange={this.handleChange} /> <label htmlFor="weekly">Weekly</label>
                        </span>
                        <span className="col s12">
                            <input name="frequency" type="radio" value="monthly" id="monthly" className="with-gap" checked={this.state.frequency === "monthly"} onChange={this.handleChange} /> <label htmlFor="monthly">Monthly</label>
                        </span>
                    </Row>
                    <Row>
                        <input type="submit" value="Create" className="btn" />
                    </Row>
                </Card>
            </form>
        )
    }
    handleChange = event => {
        const { name, value } = event.target
        console.log(name, value)
        this.setState({ [name]: value })
    }

    createClub = event => {
        event.preventDefault()
        const clubInfo = this.state
        if (clubInfo.name) {
            clubInfo.owner = this.props.context.userInfo
            API.createClub(clubInfo)
                .then(res => {
                    let userInfo = this.props.context.userInfo
                    userInfo.clubs = res.data
                    this.props.context.replaceUserInfo(userInfo)
                    window.location.href = '/clubs'
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
