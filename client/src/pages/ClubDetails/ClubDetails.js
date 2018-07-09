import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { RIEInput } from 'riek'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'
import { Row, Preloader, Button, Container, Collection, Icon, Card } from 'react-materialize'
import AuthUserContext from '../../components/Session/AuthUserContext'
import API from '../../utils/API'
import './ClubDetails.css'
import { FrequencySelector } from '../../components/Clubs';
import CollectionItem from '../../../node_modules/react-materialize/lib/CollectionItem';

const DragHandle = SortableHandle(() => <span className="secondary-content"><Icon>drag_handle</Icon></span>)

const SortableItem = SortableElement(({ member, isOwner }) =>
    <CollectionItem className="avatar">
        {/* only owners can change rotation */}
        {isOwner ? <DragHandle /> : null}
        <img src={member.member.avatar || "/default-avatar.png"} alt={member.member.displayName + "'s avatar"} className="circle" />
        <h5>{member.member.displayName}</h5>
    </CollectionItem>
);

const SortableList = SortableContainer(({ items, isOwner }) => {
    return (
        <Collection header={<div><span>Hosting Rotation</span><span className="secondary-content"><Icon>person_add</Icon></span></div>} className="left-align">
            {items.map((value, index) => (
                <SortableItem key={`item-${index}`} index={index} member={value} isOwner={isOwner} />
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
        const { club, isOwner } = this.state
        return (
            club ?
                (
                    <div>
                        {this.state.redirect ? <Redirect to={this.state.redirect} /> : null}
                        <h4>{isOwner ? <RIEInput value={club.name} change={this.handleNameChange} validate={(str) => str.length} propName="name" /> : club.name}</h4>

                        <h6>Organized by: {isOwner ? 'you' : club.owner.displayName}</h6>
                        <Container>
                            <Card title="Frequency">
                            {this.renderFrequency()}
                            </Card>

                            <SortableList items={club.members} useDragHandle={true} onSortEnd={this.updateOrder} isOwner={this.state.isOwner} />

                            {isOwner ? <Button className="red lighten-1" onClick={this.deleteClub}>Delete Club</Button> : null}
                        </Container>
                    </div>
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
