import axios from 'axios'

export default {

    createUser: function(userInfo) {
        return axios.post('/api/user', userInfo)
    },
    // Gets the user with the given fb auth id
    getUser: function (authId) {
        return axios.get('/api/user/' + authId + '/auth')
    },

    updateUserSettings: function(userInfo) {
        return axios.put('/api/user/' + userInfo._id, userInfo)
    }
}
