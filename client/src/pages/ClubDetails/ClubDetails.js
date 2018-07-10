import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { RIEInput } from 'riek'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'
import { Row, Preloader, Button, Container, Collection, Icon, Card, CollectionItem } from 'react-materialize'
import { FrequencySelector } from '../../components/Clubs';
import AuthUserContext from '../../components/Session/AuthUserContext'
import API from '../../utils/API'
import './ClubDetails.css'

const DragHandle = SortableHandle(() => <span className="secondary-content"><Icon>drag_handle</Icon></span>)

const Host = SortableElement(({ member, draggable }) =>
    <CollectionItem className="avatar">
        {/* only owners can change rotation */}
        {draggable ? <DragHandle /> : null}
        <img src={member.member.avatar || "/default-avatar.png"} alt={member.member.displayName + "'s avatar"} className="circle" />
        <h5>{member.member.displayName}</h5>
    </CollectionItem>
);

const HostingRotation = SortableContainer(({ members, id, isOwner }) => {
    return (
        <Collection header={<div><span>Hosting Rotation</span><Link to={id + '/invite'} className="secondary-content"><Icon>person_add</Icon></Link></div>} className="left-align">
            {members.map((member, index) => (
                <Host key={`draggableMember-${index}`} index={index} member={member} draggable={isOwner} />
            ))}
        </Collection>
    );
});

class ClubDetails extends Component {
    state = {
        club: null,
        isOwner: false,
        redirect: false
    }

    getClubDetails = () => API.getClub(this.props.match.params.id).then(result => this.setState({ club: result.data, isOwner: this.props.context.userInfo._id === result.data.owner._id })).catch(err => console.error(err))

    renderFrequency = () => {
        const { isOwner, club } = this.state

        return (<Row className="left-align">
            {isOwner ?
                <FrequencySelector frequency={club.frequency} onChange={this.handleFrequencyChange} />
                :
                <span>{club.frequency}</span>
            }
        </Row>)
    }

    updateOrder = ({ oldIndex, newIndex }) => {
        const club = this.state.club
        club.members = arrayMove(this.state.club.members, oldIndex, newIndex)
        // premtively setting state for smoothness
        this.setState({ club: club })
        API.updateClub(club)
            .then(res => this.setState({ club: club }))

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

    render = () => {
        const { club, isOwner } = this.state,
            hostingMembers = club && club.members.filter(member => member.willHost),
            nonHostingMembers = club && club.members.filter(member => !member.willHost)

        return (
            club ?
                (
                    <Container>
                        {this.state.redirect ? <Redirect to={this.state.redirect} /> : null}
                        <h4>{isOwner ? <RIEInput value={club.name} change={this.handleNameChange} validate={(str) => str.length} propName="name" /> : club.name}</h4>

                        <h6>Organized by: {isOwner ? 'you' : club.owner.displayName}</h6>

                        <Card title="Frequency">
                            {this.renderFrequency()}
                        </Card>

                        <HostingRotation useDragHandle={true} onSortEnd={this.updateOrder} members={hostingMembers} isOwner={this.state.isOwner} id={club._id} />

                        {nonHostingMembers.length ?
                            <Collection header={<span>Non-hosting Members</span>} className="left-align">
                                {nonHostingMembers.map((member, index) => (
                                    <CollectionItem key={`nonDraggableMember-${index}`} className="avatar">
                                        <img src={member.member.avatar || "/default-avatar.png"} alt={member.member.displayName + "'s avatar"} className="circle" />
                                        <h5>{member.member.displayName}</h5>
                                    </CollectionItem>
                                ))}
                            </Collection>
                            : null
                        }


                        {isOwner ? <Button className="red lighten-1" onClick={this.deleteClub}>Delete Club</Button> : null}
                    </Container>
                )
                : <Preloader />
        )
    }

    deleteClub = () => {
        API.deleteClub(this.state.club._id)
            .then(res => {
                this.props.context.refreshUser()
                this.setState({ redirect: '/clubs' })
            })
            .catch(err => console.log(err))
    }

    handleNameChange = newClub => {
        const club = this.state.club
        club.name = newClub.name
        API.updateClub(club)
            .then(result => {
                this.setState({ club: result.data })
                this.props.context.refreshUser()
                this.props.context.popupToast()
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
                this.props.context.popupToast()
            })
            .catch(err => console.log(err))
    }
}

export default props => (
    <AuthUserContext.Consumer>
        {context => <ClubDetails {...props} context={context} />}
    </AuthUserContext.Consumer>
)
