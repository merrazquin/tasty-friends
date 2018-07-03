import axios from 'axios'

export default {
    // Gets the user with the given fb auth id
    getUser: function (authId) {
        return axios.get('/api/user/' + authId + '/auth')
    }
}
