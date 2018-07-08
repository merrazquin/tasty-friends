import React, { Component } from 'react'
import { RIEInput } from 'riek'
import { Row, Preloader, Button, Container } from 'react-materialize'
import AuthUserContext from '../../components/Session/AuthUserContext'
import API from '../../utils/API'
import './ClubDetails.css'
import { FrequencySelector } from '../../components/Clubs';

class ClubDetails extends Component {
    state = {
        club: null,
        isOwner: false
    }

    getClubDetails = () => API.getClub(this.props.match.params.id).then(result => this.setState({ club: result.data, isOwner: this.props.context.userInfo._id === result.data.owner._id })).catch(err => console.error(err))

    renderFrequency = () => {
        const { isOwner, club } = this.state

        return (<Row className="left-align">
            <h4>Frequency</h4>
            {isOwner ?
                <FrequencySelector frequency={club.frequency} onChange={this.handleFrequencyChange} />
                :
                <span>{club.frequency}</span>
            }
        </Row>)
    }

    componentDidMount() {
        if (this.props.context.userInfo) {
            this.getClubDetails()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.club) {
            this.getClubDetails()
        }
    }

    render() {
        const { club, isOwner } = this.state
        return (
            club ?
                (
                    <div>
                        {/* <ContentEditable tagName="h5" html={club.name} contentEditable="plaintext-only" disabled={!isOw} /> */}
                        <h5>{isOwner ? <RIEInput value={club.name} change={this.handleNameChange} validate={(str) => str.length} propName="name" /> : club.name}</h5>

                        <h6>Organized by: {isOwner ? 'you' : club.owner.displayName}</h6>
                        <Container>
                            {this.renderFrequency()}
                            {isOwner ? <Button className="red lighten-1" onClick={this.deleteClub}>Delete Club</Button> : null}
                        </Container>
                    </div>
                )
                : <Preloader />
        )
    }

    deleteClub = () => {
        API.deleteClub(this.state.club._id)
            .then(res => { window.location = '/clubs' })
            .catch(err => console.log(err))
    }

    handleNameChange = newClub => {
        const club = this.state.club
        club.name = newClub.name
        API.updateClub(club)
            .then(result => {
                this.setState({ club: result.data })
                this.props.context.refreshUser()
                this.props.context.saveToast()
            })
            .catch(err => console.log(err))
    }

    handleFrequencyChange = event => {
        const { name, value } = event.target,
            club = this.state.club
        club[name] = value

        API.updateClub(club)
            .then(result => {
                this.setState({ club: result.data })
                this.props.context.refreshUser()
                this.props.context.saveToast()
            })
            .catch(err => console.log(err))
    }
}

export default props => (
    <AuthUserContext.Consumer>
        {context => <ClubDetails {...props} context={context} />}
    </AuthUserContext.Consumer>
)
