const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    locationSchema = new Schema({
        formattedAddress: String,
        url: String
    }),
    userClubSchema = new Schema({
        club: {
            type: Schema.Types.ObjectId,
            ref: 'Club'
        },
        hostingEnabled: Boolean
    }),
    userSchema = new Schema({
        authId: { type: String, required: true },
        displayName: { type: String, trim: true, required: true },
        avatar: String,
        defaultLocation: locationSchema,
        clubs: [userClubSchema]
    }),
    User = mongoose.model('User', userSchema)

module.exports = User