import axios from 'axios'

export default {
    getFacebookFriends: function (id, callback) {
        if (!window.FB) return callback(false)

        window.FB.api('/me/friends?fields=name,picture', 'get', (response) => {
            axios.post('/api/user/' + id + '/fb', { fbIDs: response.data.map(friend => friend.id) })
                .then(response => callback(response))
        })
    },
    // Create a user
    createUser: function (userInfo) {
        return axios.post('/api/user', userInfo)
    },

    // Gets the user with the given fb auth id
    authUser: function (authId) {
        return axios.get('/api/user/' + authId + '/auth')
    },

    // Gets the user with the given id
    getUser: function (id) {
        return axios.get('/api/user/' + id)
    },

    // Update user settings (display name, address, hosting availability)
    updateUserSettings: function (userInfo) {
        return axios.put('/api/user/' + userInfo._id, userInfo)
    },

    // Accept an invitaion to a club 
    acceptInvitation: function (userId, inviteCode) {
        return axios.put('/api/user/' + userId + '/acceptInvite/' + inviteCode)
    },

    // Create a new club (club name and frequency)
    createClub: function (clubInfo) {
        return axios.post('/api/club', clubInfo)
    },

    // Retrieve information abotu a club
    getClub: function (clubId) {
        return axios.get('/api/club/' + clubId)
    },

    // Add a user to a club
    joinClub: function (userId, clubId) {
        return axios.put('/api/user/' + userId + '/club/' + clubId)
    },

    // Update Club details
    updateClub: function (clubInfo) {
        return axios.put('/api/club/' + clubInfo._id, clubInfo)
    },

    // Update a club member's hosting availability 
    updateHostingStatus(clubId, userId, hostingEnabled) {
        return axios.put('/api/club/' + clubId + '/updateHosting', { userId: userId, hostingEnabled: hostingEnabled })
    },

    deleteClub: function (clubId) {
        return axios.delete('/api/club/' + clubId)
    }
}
