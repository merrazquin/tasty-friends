import React, { Component } from 'react'
import { Row, Input, Preloader } from 'react-materialize'
import API from '../../utils/API.js'

class UserSettings extends Component {
    state = {
        userInfo: undefined
    }

    handleFormUpdate = event => {
        const { name, value } = event.target,
            userInfo = this.state.userInfo

        let isDirty = false

        switch (name) {
            case 'defaultLocation.formattedAddress':
                //TODO: need to implement Google maps autocomplete here
                userInfo.defaultLocation.formattedAddress = value
                break;
            default:
                isDirty = true
                userInfo[name] = value
        }
        if (isDirty) {
            //TODO: bundle calls
            API.updateUserSettings(userInfo)
        }

        this.setState({ userInfo: userInfo })
    }
    componentDidMount() {
        this.setState({ userInfo: this.props.userInfo })
    }
    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.userInfo !== this.state.userInfo) {
            this.setState({ userInfo: nextProps.userInfo })
        }
    }

    render() {
        return (
            <Row>
                {
                    this.state.userInfo ? (
                        <form>
                            <Input name="displayName" onChange={this.handleFormUpdate} s={12} label="Display Name" placeholder="John Doe" defaultValue={this.state.userInfo.displayName} />
                            <Input name="defaultLocation.formattedAddress" onChange={this.handleFormUpdate} s={12} placeholder="123 Main Street" label="Default Hosting Location" defaultValue={this.state.userInfo.defaultLocation && this.state.userInfo.defaultLocation.formattedAddress} />
                            <h5>Hosting Availability</h5>
                            {this.state.userInfo && this.state.userInfo.clubs.length ?
                                this.state.userInfo.clubs.map(club => <Input key={club.club._id} name='hostingEnabled' type='checkbox' label={club.club.name} checked={club.hostingEnabled} />)
                                :
                                <span>No clubs</span>
                            }
                            <br />
                        </form>
                    ) : <Preloader />
                }
            </Row>


        )
    }
}

export default UserSettings