import axios from 'axios'

export default {

    // Create a user
    createUser: function (userInfo) {
        return axios.post('/api/user', userInfo)
    },

    // Gets the user with the given fb auth id
    getUser: function (authId) {
        return axios.get('/api/user/' + authId + '/auth')
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
    }
}
