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
        lat: 26.035229,
        lng: -80.284628
    }
}

const clubSeed = {
    name: 'Test Supper Club',
    frequency: 'monthly'
}

const eventSeed = {
    name: 'Test event',
    theme: 'Summer Delights',
    location: {
        formattedAddress: '10419 Quito St, Hollywood, FL 33026, USA',
        url: 'https://maps.google.com/?q=10419+Quito+St,+Hollywood,+FL+33026,+USA&ftid=0x88d9a62f03b0e4ed:0x541174800e19140b',
        lat: 26.035229,
        lng: -80.284628
    },
    dates: [
        { _id: mongoose.Types.ObjectId(), date: new Date(Date.now()) },
        { _id: mongoose.Types.ObjectId(), date: new Date('July 15, 2018 19:00:00') },
        { _id: mongoose.Types.ObjectId(), date: new Date('July 12, 2018 18:30:00') }
    ]
}


db.User
    .remove({})
    .then(() => db.User.collection.insertOne(userSeed))
    .then(data => {
        console.log(data.result.n + ' user records inserted')
        console.log(data.insertedId)
        clubSeed.owner = data.insertedId
        console.log('clubseed: ', clubSeed)
        db.Club.remove({})
            .then(() => db.Club.collection.insertOne(clubSeed))
            .then(data => {
                console.log(data.result.n + ' club records inserted')
                console.log(data.insertedId)
                eventSeed.club = data.insertedId
                eventSeed.host = clubSeed.owner

                db.Event.remove({})
                    .then(() => db.Event.collection.insertOne(eventSeed).then(data => {
                        db.Club.findOneAndUpdate({ _id: eventSeed.club }, { $push: { events: data.insertedId } }).exec()
                    }))
                db.User.collection.findOneAndUpdate({ _id: clubSeed.owner }, { $push: { clubs: { club: data.insertedId, hostingEnabled: true } } })
                    .then(data => {
                        process.exit(0)
                    })
            })
    })
    .catch(err => {
        console.error(err)
        process.exit(1)
    })
