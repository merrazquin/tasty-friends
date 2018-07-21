import React, { Component } from 'react'
import AuthUserContext from '../../components/Session/AuthUserContext'
import { Row, Card, Input, Collection, CollectionItem, Container } from 'react-materialize'
import { CenteredPreloader } from '../../components/CenteredPreloader/CenteredPreloader'
import SearchBar from '../../components/SearchBar'
import './UserSettings.css'

class UserSettings extends Component {
    render() {
        const { context } = this.props

        if (!context.userInfo) return <CenteredPreloader />


        return (
            <Container>
                <form>
                    <Card>
                        <h4>User Settings</h4>
                        <Row>
                            <Input name="displayName" onChange={context.updateUserInfo} s={12} label="Display Name" placeholder="John Doe" defaultValue={context.userInfo.displayName} />
                            <SearchBar label="Default Hosting Location" onChange={context.updateUserAddress} address={context.userInfo.defaultLocation && context.userInfo.defaultLocation.formattedAddress} />
                        </Row>
                    </Card>
                    {context.userInfo && context.userInfo.clubs.length ?
                        <Collection header="Hosting Availability" className="left-align">
                            {context.userInfo.clubs.map(club => (
                                <CollectionItem key={club.club._id} className="switch">
                                    <label>
                                        <input name="hostingEnabled" type="checkbox" id={club.club._id} defaultChecked={club.hostingEnabled} onChange={context.updateUserInfo} />
                                        <span className="lever"></span>
                                        {club.club.name}
                                    </label>
                                    <span className="secondary-content">{club.club.frequency}</span>
                                </CollectionItem>)
                            )}
                        </Collection>
                        :
                        null
                    }
                    <br />
                </form>
            </Container>
        )
    }
}

export default props => (
    <AuthUserContext.Consumer>
        {context => <UserSettings {...props} context={context} />}
    </AuthUserContext.Consumer>
)