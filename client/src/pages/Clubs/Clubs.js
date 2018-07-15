import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Container, Button, Input, Card, Collection, Icon } from 'react-materialize'
import AuthUserContext from '../../components/Session/AuthUserContext'
import API from '../../utils/API'
import { ClubSummary } from '../../components/Clubs';

class Clubs extends Component {
    state = {
        inviteCode: '',
        clubs: []
    }

    componentDidMount() {
        if (this.props.context.userInfo) {
            this.setState({ clubs: this.props.context.userInfo.clubs })
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.context.userInfo && nextProps.context.userInfo.clubs !== this.state.clubs) {
            this.setState({ clubs: nextProps.context.userInfo.clubs })
        }
    }

    render() {
        return (
            <Container>
                <Card>
                    <h4>Clubs Dashboard</h4>
                    <div>
                        <br />
                        <Link to="/clubs/create" className="btn">Create Club</Link>
                        <br />
                        <br />
                        <p>- OR -</p>
                        <Input onChange={this.updateInviteCode} type="text" label="Accept Invitation" placeholder="Invitation Code" value={this.state.inviteCode} />
                        <Button onClick={this.joinByInvite}>Join Club</Button>
                    </div>
                </Card>
                {this.generateClubsList()}

            </Container>
        )
    }

    generateClubsList = () => {
        if (this.state.clubs) {
            return (
                <Collection header={(<div><h5>Clubs</h5><Icon className="tiny">grade</Icon> - Owner</div>)} className="left-align">
                    {this.state.clubs.map(club => <ClubSummary key={club.club._id} club={club} />)}
                </Collection>
            )
        }

        return null
    }

    updateInviteCode = event => {
        const { value } = event.target
        // Invite codes are 6 character long, and all uppercase
        this.setState({ inviteCode: value.toUpperCase().substring(0, 6) })
    }

    joinByInvite = event => {
        if (!this.state.inviteCode) {
            return window.Materialize.toast('Enter a code', 2000)
        }
        API.acceptInvitation(this.props.context.userInfo._id, this.state.inviteCode)
            .then(result => this.setState({ clubs: result.data.clubs, inviteCode: '' }))
            .catch(err => {
                this.setState({ inviteCode: '' })
                window.Materialize.toast('Invalid code!', 2000)
            })
    }
}

export default props => (
    <AuthUserContext.Consumer>
        {context => <Clubs {...props} context={context} />}
    </AuthUserContext.Consumer>
)
