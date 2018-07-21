import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Container, Card, Collection, CollectionItem } from 'react-materialize'
import { EventSummary } from '../../components/Events'
import AuthUserContext from '../../components/Session/AuthUserContext'
import API from '../../utils/API'
import { CenteredPreloader } from '../../components/CenteredPreloader';

class Events extends Component {
    state = {
        events: null
    }

    getEvents = (userId) => API.getUserEvents(userId).then(result => this.setState({ events: result.data })).catch(err => console.error(err))

    componentDidMount() {
        if (this.props.context.userInfo) {
            this.getEvents(this.props.context.userInfo._id)
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.context.userInfo && !this.state.events) {
            this.getEvents(nextProps.context.userInfo._id)
        }
    }

    render() {
        if (!this.state.events) {
            return <CenteredPreloader />
        }
        return (
            <Container>
                <Card>
                    {this.generateEventsList()}
                </Card>
            </Container>
        )
    }

    generateEventsList = () => {
        return (
            <Collection header={<h5>Events</h5>} className="left-align">
                {this.state.events.length ?
                    this.state.events.map(event => (
                        <CollectionItem key={event._id}>
                            <EventSummary event={event} userId={this.props.context.userInfo._id} showNav />
                        </CollectionItem>
                    ))
                    :
                    <CollectionItem>
                        <p>You have no events planned.</p>
                        <p>Head over to the <Link to="/clubs">Clubs Dashboard</Link> to set something up</p>
                    </CollectionItem>
                }
            </Collection>
        )
    }
}

export default props => (
    <AuthUserContext.Consumer>
        {context => <Events {...props} context={context} />}
    </AuthUserContext.Consumer>
)
