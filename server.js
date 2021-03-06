const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const sslRedirect = require('heroku-ssl-redirect')
const routes = require('./routes');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(sslRedirect())

// Define middleware here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}
// Add routes, both API and view
app.use(routes);

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/tastyfriends');

// Start the API server
app.listen(PORT, function () {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
