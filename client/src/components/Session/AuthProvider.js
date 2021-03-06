import React, { Component } from 'react'
import AuthUserContext from './AuthUserContext'
import API from '../../utils/API'


const LOCAL_STORAGE_KEY = 'authUser'

class AuthProvider extends Component {
    constructor() {
        super()
        this.state = {
            userInfo: null,
            loggedOut: false,
            login: response => this.handleFacebookResponse(response),
            logout: event => this.logout(event),
            updateUserInfo: event => this.updateUserInfo(event),
            updateUserAddress: addressInfo => this.updateUserAddress(addressInfo), //userInfo => this.setState({ userInfo: userInfo }),
            refreshUser: () => this.refreshUser(),
            popupToast: (message) => this.popupToast(message)
        }

        this.toastActive = false
        this.toastTimeout = null
        this.saveTimeout = null
    }

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
        API.authUser(userInfo.authId)
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

    refreshUser = () => {
        if (!this.state.userInfo) {
            return;
        }
        API.getUser(this.state.userInfo._id)
            .then(res => this.setState({ userInfo: this.prepData(res.data) }))
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
        this.setState({ userInfo: null, loggedOut: true, redirect: '/' })
    }

    updateUserInfo = event => {
        const { name, value, id } = event.target,
            userInfo = this.state.userInfo

        let isDirty = false,
            immediateSave = false

        switch (name) {
            case 'hostingEnabled':
                immediateSave = true
                isDirty = true
                let hostingEnabled = event.target.checked
                try {
                    userInfo.clubs.find(club => club.club._id === id).hostingEnabled = hostingEnabled
                    API.updateHostingStatus(id, userInfo._id, hostingEnabled)
                        .catch(err => console.error(err))
                } catch (err) {
                    isDirty = false
                }
                break;
            default:
                isDirty = true
                userInfo[name] = value
        }
        if (isDirty) {
            // bundle calls so as not to flood
            clearTimeout(this.saveTimeout)
            this.saveTimeout = setTimeout(() =>
                API.updateUserSettings(userInfo)
                    .then(result => this.popupToast())
                , immediateSave ? 0 : 1000)
        }

        this.setState({ userInfo: this.prepData(userInfo) })
    }

    updateUserAddress = addressInfo => {
        const userInfo = this.state.userInfo
        if (!userInfo.defaultLocation) {
            userInfo.defaultLocation = {}
        }

        userInfo.defaultLocation.formattedAddress = addressInfo.address
        userInfo.defaultLocation.lat = addressInfo.latitude
        userInfo.defaultLocation.lng = addressInfo.longitude

        clearTimeout(this.saveTimeout)
        this.saveTimeout = setTimeout(() =>
            API.updateUserSettings(userInfo)
                .then(result => this.popupToast())
            , 1000)
    }

    prepData = userInfo => {
        // Sort clubs
        if (userInfo.clubs && userInfo.clubs.length) {
            userInfo.clubs.sort((a, b) => a.club.name > b.club.name)
        }

        return userInfo
    }

    popupToast = (message = 'Saved!') => {
        if (this.toastActive) {
            const toast = document.querySelector('#toast-container>.toast')
            if (toast) {
                this.toastActive = false
                clearTimeout(this.toastTimeout)
                toast.remove()
            }
        }
        if (!this.toastActive) {
            this.toastActive = true

            window.Materialize.toast(message, 2000)
            clearTimeout(this.toastTimeout)
            this.toastTimeout = setTimeout(() => this.toastActive = false, 2000)
        }
    }
}

export default AuthProvider