const mongoose = require('mongoose');
const db = require('../models');

// This file empties the Users collection and inserts the users below

mongoose.connect(
    process.env.MONGODB_URI ||
    'mongodb://localhost/tastyfriends'
);

const userSeed = {
    authId: 'testFBAuthId',
    displayName: 'Faux Account',
    defaultLocation: {
        formattedAddress: '10419 Quito St, Hollywood, FL 33026, USA',
        url: 'https://maps.google.com/?q=10419+Quito+St,+Hollywood,+FL+33026,+USA&ftid=0x88d9a62f03b0e4ed:0x541174800e19140b',
    }
}

const clubSeed = {
    name: 'Test Supper Club',
    frequency: 'monthly'
}


db.User
    .remove({})
    .then(() => db.User.collection.insertOne(userSeed))
    .then(data => {
        console.log(data.result.n + ' user records inserted')
        console.log(data.insertedId)
        clubSeed.owner =data.insertedId
        console.log('clubseed: ', clubSeed)
        db.Club.remove({})
        .then(() => db.Club.collection.insertOne(clubSeed))
        .then(data => {
            console.log(data.result.n + ' club records inserted')
            console.log(data.insertedId)
            db.User.collection.findOneAndUpdate({_id: clubSeed.owner}, {$push: {clubs: {club: data.insertedId, hostingEnabled: true}}})
            .then(data => {
                process.exit(0)
            })
        })
    })
    .catch(err => {
        console.error(err)
        process.exit(1)
    })
