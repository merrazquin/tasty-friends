import React, { Component } from 'react'
import AuthUserContext from '../../components/Session/AuthUserContext'
import { Row, Input, Preloader } from 'react-materialize'

class UserSettings extends Component {
    render() {
        return (
            <Row>
                <AuthUserContext.Consumer>
                    {(context) => {
                        return context.userInfo ? (
                            <form>
                                <Input name="displayName" onChange={context.updateUserInfo} s={12} label="Display Name" placeholder="John Doe" defaultValue={context.userInfo.displayName} />
                                <Input name="defaultLocation.formattedAddress" onChange={context.updateUserInfo} s={12} placeholder="123 Main Street" label="Default Hosting Location" defaultValue={context.userInfo.defaultLocation && context.userInfo.defaultLocation.formattedAddress} />
                                <h5>Hosting Availability</h5>
                                {context.userInfo && context.userInfo.clubs.length ?
                                    context.userInfo.clubs.map(club => <Input key={club.club._id} name='hostingEnabled' type='checkbox' label={club.club.name} checked={club.hostingEnabled} />)
                                    :
                                    <span>No clubs</span>
                                }
                                <br />
                            </form>
                        ) : <Preloader />
                    }
                    }
                </AuthUserContext.Consumer>
            </Row>


        )
    }
}

export default UserSettings