const mongoose = require('mongoose'),
    autopopulate = require('mongoose-autopopulate'),
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
            ref: 'User',
            autopopulate: { maxDepth: 2 }
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
            ref: 'User',
            autopopulate: { maxDepth: 2 }
        }
    }),
    guestSchema = new Schema({
        guest: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            autopopulate: { maxDepth: 2 }
        },
        rsvp: {
            type: Number,
            enum: [-1, 0, 1], // -1 no response, 0 not attending, 1 attending
            default: -1
        }
    }),
    eventSchema = new Schema({
        name: { type: String, trim: true, required: true },
        theme: { type: String, trim: true },
        host: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            autopopulate: { maxDepth: 2 }
        },
        location: locationSchema,
        date: {
            type: Date,
            required: true
        },
        dates: [dateOptionSchema],
        club: {
            type: Schema.Types.ObjectId,
            ref: 'Club',
            autopopulate: { maxDepth: 2 }
        },
        guests: [guestSchema],
        requests: [requestSchema]
    })

eventSchema.plugin(autopopulate)
const Event = mongoose.model('Event', eventSchema)

module.exports = Event