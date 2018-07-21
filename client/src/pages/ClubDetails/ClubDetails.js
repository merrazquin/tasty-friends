import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { RIEInput } from 'riek'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'
import { Row, Button, Container, Collection, Icon, Card, CollectionItem, Modal } from 'react-materialize'
import { CenteredPreloader } from '../../components/CenteredPreloader'
import { FrequencySelector } from '../../components/Clubs'
import AuthUserContext from '../../components/Session/AuthUserContext'
import API from '../../utils/API'
import moment from 'moment'
import './ClubDetails.css'
import { EventSummary } from '../../components/Events';
import { CopyToClipboard } from 'react-copy-to-clipboard'


const DragHandle = SortableHandle(() => <span className="secondary-content dragHandle"><Icon>drag_handle</Icon></span>)

const Host = SortableElement(({ member, draggable }) =>
    <CollectionItem className="avatar">
        {/* only owners can change rotation */}
        {draggable ? <DragHandle /> : null}
        <img src={member.member.avatar || "/images/default-avatar.png"} alt={member.member.displayName + "'s avatar"} className="circle" />
        <h5>{member.member.displayName}</h5>
    </CollectionItem>
)

const HostingRotation = SortableContainer(({ members, id, isOwner, inviteCode }) => {
    return (
        <Collection header={<span>Hosting Rotation</span>} className="left-align">
            {members.map((member, index) => (
                <Host key={`draggableMember-${index}`} index={index} member={member} draggable={isOwner} />
            ))}
        </Collection>
    )
})

class ClubDetails extends Component {
    constructor() {
        super()
        this.state = {
            club: null,
            isOwner: false,
            redirect: false
        }
    }

    getClubDetails = () => API.getClub(this.props.match.params.id).then(result => this.setState({ club: result.data, isOwner: this.props.context.userInfo._id === result.data.owner._id })).catch(err => console.error(err))

    handleRSVP(eventId, rsvp) {
        API.rsvpToEvent(this.props.context.userInfo._id, eventId, rsvp)
            .then(() => this.getClubDetails())
            .catch(err => console.error(err))
    }

    // Add the dragged item to a styled container so it can inherit the correct styles
    sortStart = () => {
        document.getElementById('sortingContainer').appendChild(document.querySelector('.sorting'))
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

    displayEvents() {
        const { club } = this.state,
            { frequency } = club,
            unit = frequency.slice(0, -2),
            today = new Date(),
            currentMoment = moment(today),
            nextMoment = moment(today).add(1, unit),
            events = club.events.sort((eventA, eventB) => new Date(eventA.date) - new Date(eventB.date)).filter(event => new Date(event.date) >= today),
            currentEvent = events.find(event => moment(new Date(event.date)).isBetween(currentMoment.startOf(unit).toDate(), currentMoment.endOf(unit).toDate(), '[]')),
            nextEvent = events.find(event => moment(new Date(event.date)).isBetween(nextMoment.startOf(unit).toDate(), nextMoment.endOf(unit).toDate(), '[]'))

        let currentMember, nextMember, first = true

        for (let i = 0; i < club.members.length; i++) {
            const member = club.members[i];

            if (member.willHost && first) {
                first = false
                currentMember = member
                continue
            }
            if (member.willHost && !first) {
                nextMember = member
                break
            }
        }

        if (!nextMember) {
            nextMember = currentMember
        }

        return (
            <Collection header={<span>Upcoming Events</span>} className="left-align">
                <CollectionItem>
                    {!currentEvent && (<h5>Current ({this.renderRange(frequency, currentMoment)})</h5>)}
                    {
                        !currentEvent ?
                            this.renderHostInfo(currentMember, "current")
                            : <EventSummary event={currentEvent} userId={this.props.context.userInfo._id} handlRSVP={(eventId, rsvp) => this.handleRSVP(eventId, rsvp)} showNav />
                    }
                </CollectionItem>
                <CollectionItem>
                    {!nextEvent && <h5>Next ({this.renderRange(frequency, nextMoment)})</h5>}
                    {
                        !nextEvent ?
                            this.renderHostInfo(nextMember, "next")
                            : <EventSummary event={nextEvent} userId={this.props.context.userInfo._id} handleRSVP={(eventId, rsvp) => this.handleRSVP(eventId, rsvp)} showNav />
                    }
                </CollectionItem>
            </Collection>
        )
    }

    renderRange(frequency, mMoment) {
        return frequency === 'monthly' ? mMoment.format('MMMM') : (mMoment.startOf('w').format('MM/DD') + " - " + mMoment.endOf('w').format('MM/DD'))
    }

    renderHostInfo(member, which) {
        return member ? (
            <div>
                <h6>{(member.member._id === this.props.context.userInfo._id ? "You" : member.member.displayName) + " will host"}</h6>
                {member.member._id === this.props.context.userInfo._id ? <Link className="btn" to={this.props.match.url + "/plan/" + which}>Start planning</Link> : null}
            </div>
        ) : "Nobody available to host"
    }

    render() {
        const { club, isOwner } = this.state,
            hostingMembers = club && club.members.filter(member => member.willHost),
            nonHostingMembers = club && club.members.filter(member => !member.willHost)

        return (
            club ?
                (
                    <Container>
                        {this.state.redirect ? <Redirect to={this.state.redirect} /> : null}
                        <span className="breadcrumbs"><Button className="btn-flat" onClick={() => this.props.history.goBack()}><Icon>keyboard_backspace</Icon> <span className="label">Clubs</span></Button></span>

                        <Card>
                            <h4>{isOwner ? <RIEInput className="editable" value={club.name} change={this.handleNameChange} validate={(str) => str.length} propName="name" /> : club.name}</h4>
                            <h6>{!isOwner ? `A ${club.frequency} club organized by: ` : 'Organized by: '} {isOwner ? 'you' : club.owner.displayName}</h6>

                            {
                                isOwner ?
                                    <Row className="left-align">
                                        <h5>Frequency</h5>

                                        <FrequencySelector frequency={club.frequency} onChange={this.handleFrequencyChange} />
                                    </Row>
                                    : null
                            }
                            <Row className="left-align">
                                <h5>Invite friends to join:</h5>
                                <CopyToClipboard text={club.inviteCode} onCopy={() => this.props.context.popupToast('Copied!', 2000)}>
                                    <Button className="secondary-content">{club.inviteCode}</Button>
                                </CopyToClipboard>
                            </Row>
                        </Card>

                        <HostingRotation useDragHandle={true} helperClass="sorting" onSortStart={this.sortStart} onSortEnd={this.updateOrder} members={hostingMembers} isOwner={this.state.isOwner} id={club._id} inviteCode={club.inviteCode} />

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

                        {this.displayEvents()}

                        {isOwner ?
                            <Modal header="Delete Club?" trigger={<Button className="red lighten-1">Delete Club</Button>}
                                actions={
                                    <span>
                                        <Button className="modal-action modal-close btn-flat">Cancel</Button>
                                        <Button className="modal-action modal-close red lighten-1" onClick={this.deleteClub}>Yes</Button>
                                    </span>
                                }>
                                <p>Are you sure you want to delete "{club.name}"?</p>
                            </Modal>

                            : null}

                        {/* this is a hack to style the dragged items */}
                        <ul id="sortingContainer" className="collection left-align" />
                    </Container>
                )
                : <CenteredPreloader />
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
