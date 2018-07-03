const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    locationSchema = new Schema({
        formattedAddress: String,
        url: String,
        lat: Number,
        lng: Number
    }),
    dateOptionSchema = new Schema({
        date: {
            type: Date,
            required: true
        },
        votes: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        confirmed: {
            type: Boolean,
            default: false
        }
    }),
    requestSchema = new Schema({
        request: {
            type: String,
            required: true
        },
        provider: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }),
    guestSchema = new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        rsvp: {
            type: Number,
            enum: [-1, 0, 1], // -1 no response, 0 not attending, 1 attending
            default: -1
        }
    }),
    eventSchema = new Schema({
        name: { type: String, trim: true, required: true },
        theme: {type: String, trim: true},
        host: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        location: locationSchema,
        dates: [dateOptionSchema],
        club: {
            type: Schema.Types.ObjectId,
            ref: 'Club'
        },
        guests: [guestSchema],
        requests: [requestSchema]
    }),
    Event = mongoose.model('Event', eventSchema)

module.exports = Event