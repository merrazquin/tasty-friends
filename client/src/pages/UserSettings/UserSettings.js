import React, { Component } from 'react'
import { Row, Input } from 'react-materialize'

class UserSettings extends Component {

    render() {
        return (
            <Row>
                <Input placeholder="John Doe" s={12} label="Display Name" value={this.props.userInfo && this.props.userInfo.displayName} />
                <Input placeholder="123 Main Street" s={12} label="Default Hosting Location" value={this.props.userInfo && this.props.userInfo.defaultLocation && this.props.userInfo.defaultLocation.formattedAddress} />
            </Row>

        )
    }
}

export default UserSettings