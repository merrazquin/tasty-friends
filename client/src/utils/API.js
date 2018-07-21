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

    // Retrieve information about a club
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
        return axios.put('/api/club/' + clubId + '/updateHosting', { userId, hostingEnabled })
    },

    // Delete a club
    deleteClub: function (clubId) {
        return axios.delete('/api/club/' + clubId)
    },

    // Create an event
    createClubEvent: function (eventInfo) {
        return axios.post('/api/event/', eventInfo)
    },

    // Update an event's details
    updateClubEvent: function (eventInfo) {
        return axios.put('/api/event/' + eventInfo._id, eventInfo)
    },

    // Get all events for a given user
    getUserEvents: function (userId) {
        return axios.get('/api/event/user/' + userId)
    },

    // Retrieve information about an event
    getEvent: function (eventId) {
        return axios.get('/api/event/' + eventId)
    },

    // Delete an event
    deleteEvent: function (eventId) {
        return axios.delete('/api/event/' + eventId)
    },

    addEventRequest: function (eventId, request) {
        return axios.post('/api/event/' + eventId + '/request', { request })
    },

    removeEventRequest: function (eventId, requestId) {
        return axios.delete('/api/event/' + eventId + '/request/' + requestId)
    },

    claimEventRequest: function (userId, requestId) {
        return axios.put('/api/user/' + userId + '/bringing/' + requestId)
    },

    unclaimEventRequest: function (userId, requestId) {
        return axios.delete('/api/user/' + userId + '/bringing/' + requestId)
    },

    rsvpToEvent: function(userId, eventId, rsvp) {
        return axios.put('/api/user/'+userId+'/rsvp/'+eventId, {rsvp})
    }
}
