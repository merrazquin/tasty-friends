const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    memberSchema = new Schema({
        member: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        willHost: {
            type: Boolean,
            default: true
        }
    })
clubSchema = new Schema({
    name: { type: String, trim: true, required: true },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inviteCode: {
        type: String,
        default: () => {
            // generate a random invite code
            const alphabet = '23456789ABDEGJKMNPQRVWXYZ'
            var idLength = 6
            let rtn = '';
            for (let i = 0; i < idLength; i++) {
                rtn += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
            }
            return rtn
        }
    },
    members: [memberSchema],
    frequency: {
        type: String,
        enum: ['weekly', 'monthly'],
        required: true
    },
    events: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    ]
}),
    Club = mongoose.model('Club', clubSchema)

module.exports = Club