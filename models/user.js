const mongoose = require('mongoose'),
    autopopulate = require('mongoose-autopopulate'),
    Schema = mongoose.Schema,
    locationSchema = new Schema({
        formattedAddress: String,
        url: String,
        lat: Number,
        lng: Number
    }),
    userClubSchema = new Schema({
        club: {
            type: Schema.Types.ObjectId,
            ref: 'Club',
            autopopulate: { maxDepth: 2 }
        },
        isOwner: {
            type: Boolean,
            default: false
        },
        hostingEnabled: Boolean
    }),
    userSchema = new Schema({
        authId: { type: String, required: true },
        displayName: { type: String, trim: true, required: true },
        avatar: String,
        defaultLocation: locationSchema,
        clubs: [userClubSchema]
    })

userSchema.plugin(autopopulate)

const User = mongoose.model('User', userSchema)

module.exports = User