import React, { Component } from 'react'
import AuthUserContext from './AuthUserContext'
import API from '../../utils/API.js'

const LOCAL_STORAGE_KEY = 'authUser'

class AuthProvider extends Component {
    state = {
        userInfo: null,
        loggedOut: false,
        login: response => this.handleFacebookResponse(response),
        logout: event => this.logout(event),
        updateUserInfo: event => this.updateUserInfo(event)
    }

    toastActive = false
    toastTimeout = null

    componentDidMount() {
        // check local storage for logged in info
        let userInfo = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
        if (userInfo) {
            this.authUser(userInfo)
        }
    }

    render() {
        return (
            <AuthUserContext.Provider value={this.state}>
                {this.props.children}
            </AuthUserContext.Provider>
        )
    }

    authUser = userInfo => {
        API.getUser(userInfo.authId)
            .then(res => {
                if (!res.data) {
                    API.createUser(userInfo)
                        .then(res => this.setState({ userInfo: this.prepData(res.data) }))
                } else {
                    // updates the avatar
                    API.updateUserSettings({ _id: res.data._id, avatar: userInfo.avatar })
                        .then(res => this.setState({ userInfo: this.prepData(res.data) }))

                }
            })
            .catch(err => console.error(err))
    }

    handleFacebookResponse = response => {
        let userInfo = this.state.userInfo || {}
        if (response.id) {
            userInfo.authId = response.id
            userInfo.displayName = response.name
            userInfo.avatar = response.picture.data.url

            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userInfo))
            this.authUser(userInfo)
        } else {
            switch (response.status) {
                case 'not_authorized':
                default:
                    this.setState({ loggedOut: true })
            }
        }

    }

    logout = event => {
        localStorage.removeItem(LOCAL_STORAGE_KEY)
        this.setState({ userInfo: null, loggedOut: true })
    }

    updateUserInfo = event => {
        const { name, value, id } = event.target,
            userInfo = this.state.userInfo

        let isDirty = false
        switch (name) {
            case 'hostingEnabled':
                isDirty = true
                try {
                    userInfo.clubs.find(club => club.club._id === id).hostingEnabled = event.target.checked
                } catch (err) {
                    isDirty = false
                }
                break;
            case 'defaultLocation.formattedAddress':
                //TODO: need to implement Google maps autocomplete here
                isDirty = true
                if (!userInfo.defaultLocation) {
                    userInfo.defaultLocation = {}
                }
                userInfo.defaultLocation.formattedAddress = value
                break;
            default:
                isDirty = true
                userInfo[name] = value
        }
        if (isDirty) {
            //TODO: bundle calls
            API.updateUserSettings(userInfo)
                .then(result => this.saveToast())
        }

        this.setState({ userInfo: this.prepData(userInfo) })
    }

    prepData = userInfo => {
        // Sort clubs
        if (userInfo.clubs && userInfo.clubs.length) {
            userInfo.clubs.sort((a, b) => a.club.name > b.club.name)
        }

        return userInfo
    }

    saveToast = () => {
        if (!this.toastActive) {
            this.toastActive = true

            window.Materialize.toast('Saved!', 2000)
            clearTimeout(this.toastTimeout)
            this.toastTimeout = setTimeout(() => this.toastActive = false, 2000)
        }
    }
}

export default AuthProvider