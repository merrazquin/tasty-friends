import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Row, Input, Card, Container, Col } from 'react-materialize'
import AuthUserContext from '../../components/Session/AuthUserContext'
import API from '../../utils/API'
import { FrequencySelector } from '../../components/Clubs';

class ClubCreation extends Component {
    state = {
        name: '',
        frequency: 'monthly',
        redirect: false
    }

    render() {
        return (
            <Container>
                <form onSubmit={this.createClub}>
                    {this.state.redirect ? <Redirect to={this.state.redirect} /> : null}
                    <Card>
                        <h4>Create Club</h4>
                        <Row>
                            <Input s={12} type="text" name="name" label="Club Name" defaultValue={this.state.name} onChange={this.handleChange} required />
                        </Row>
                        <Row className="left-align">
                            <h6>Frequency</h6>
                            <FrequencySelector frequency={this.state.frequency} onChange={this.handleChange} />
                        </Row>
                        <Row>
                            <Col s={6} className="input-field right-align">
                                <Link to="/clubs" className="btn red lighten-1">Cancel</Link>
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
    handleChange = event => {
        const { name, value } = event.target
        this.setState({ [name]: value })
    }

    createClub = event => {
        event.preventDefault()
        const clubInfo = this.state
        if (clubInfo.name) {
            clubInfo.owner = this.props.context.userInfo
            clubInfo.members = [{ member: this.props.context.userInfo }]
            API.createClub(clubInfo)
                .then(res => {
                    this.props.context.refreshUser()
                    this.setState({ redirect: '/clubs/' + res.data._id })
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
