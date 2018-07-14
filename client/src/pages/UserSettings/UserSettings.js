import React, { Component } from 'react'
import AuthUserContext from '../../components/Session/AuthUserContext'
import { Input, Preloader, Collection, CollectionItem, Container } from 'react-materialize'
import SearchBar from '../../components/SearchBar'
import './UserSettings.css'

class UserSettings extends Component {
    render() {
        return (
            <Container>
                <AuthUserContext.Consumer>
                    {(context) => {
                        return context.userInfo ? (
                            <form>
                                <h5>User Settings</h5>
                                <Input name="displayName" onChange={context.updateUserInfo} s={12} label="Display Name" placeholder="John Doe" defaultValue={context.userInfo.displayName} />
                                <SearchBar onChange={context.updateUserAddress} address={context.userInfo.defaultLocation && context.userInfo.defaultLocation.formattedAddress} />
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
                                    <span>No clubs</span>
                                }
                                <br />
                            </form>
                        ) : <Preloader />
                    }
                    }
                </AuthUserContext.Consumer>
            </Container>


        )
    }
}

export default UserSettings