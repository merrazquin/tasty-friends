import React, { Component } from 'react'
import { Preloader, Button, Container, Card, Collection, CollectionItem, Icon } from 'react-materialize'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import AuthUserContext from '../../components/Session/AuthUserContext'
import API from '../../utils/API'
import './AddClubMembers.css'


class AddClubMembers extends Component {
    state = {
        club: null,
        friends: []
    }

    getClubDetails = () => API.getClub(this.props.match.params.id).then(result => this.setState({ club: result.data, isOwner: this.props.context.userInfo._id === result.data.owner._id })).catch(err => console.error(err))
    getFriendsList = () => API.getFacebookFriends(this.props.context.userInfo._id, response => this.setState({ friends: response.data }))

    addMemberToClub(userId) {
        API.joinClub(userId, this.state.club._id)
            .then(club => this.getClubDetails())
            .catch(err => console.error(err))
    }

    componentDidMount() {
        if (this.props.context.userInfo) {
            this.getClubDetails()
            this.getFriendsList()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.club) {
            this.getClubDetails()
        }
        if (this.props.context.userInfo) {
            this.getFriendsList()
        }
    }

    render() {
        const { club, friends } = this.state
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

                        <Collection header={<h5>Select friends</h5>} className="left-align">
                            {friends && friends.map(friend => (
                                <CollectionItem key={friend._id} className="avatar">
                                    <img src={friend.avatar || "/default-avatar.png"} alt={friend.displayName + "'s avatar"} className="circle" />
                                    <h5>{friend.displayName}</h5>
                                    {
                                        club.members.find(member => member.member._id === friend._id) ?
                                            <span className="secondary-content disabled"><Icon>check</Icon></span>
                                            :
                                            <span className="secondary-content" onClick={() => this.addMemberToClub(friend._id)}><Icon>add</Icon></span>
                                    }
                                </CollectionItem>
                            ))}
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
