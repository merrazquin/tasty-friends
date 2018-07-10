import React, { Component } from 'react'
import { Preloader, Button, Container, Card, Collection } from 'react-materialize'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import AuthUserContext from '../../components/Session/AuthUserContext'
import API from '../../utils/API'
import './AddClubMembers.css'


class AddClubMembers extends Component {
    state = {
        club: null
    }

    getClubDetails = () => API.getClub(this.props.match.params.id).then(result => this.setState({ club: result.data, isOwner: this.props.context.userInfo._id === result.data.owner._id })).catch(err => console.error(err))
    getFriendsList = () => API.testFB((response) => console.log('fb response', response))

    componentDidMount() {
        if (this.props.context.userInfo) {
            this.getClubDetails()
            this.getFriendsList()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.club) {
            this.getClubDetails()
            this.getFriendsList()
        }
    }

    render() {
        const { club } = this.state
        return (
            club ?
                (
                    <Container>
                        <h5>Invite friends to join <br />{club.name}</h5>

                        <Card>
                            <span className="card-title"><h5>Share invite code</h5></span>
                            <CopyToClipboard text={club.inviteCode} onCopy={() => this.props.context.popupToast('Copied!', 2000)}>
                                <Button>{club.inviteCode}</Button>
                            </CopyToClipboard>
                        </Card>

                        <Collection header={<h5>Select friends</h5>}>

                        </Collection>

                    </Container>
                )
                : <Preloader />
        )
    }
}

export default props => (
    <AuthUserContext.Consumer>
        {context => <AddClubMembers {...props} context={context} />}
    </AuthUserContext.Consumer>
)
