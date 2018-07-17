const mongoose = require('mongoose'),
    autopopulate = require('mongoose-autopopulate'),
    Schema = mongoose.Schema,
    memberSchema = new Schema({
        member: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            autopopulate: { maxDepth: 2 }
        },
        willHost: {
            type: Boolean,
            default: true
        }
    }),
    clubSchema = new Schema({
        name: { type: String, trim: true, required: true },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            autopopulate: { maxDepth: 2 }
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
            required: true,
            default: 'monthly'
        },
        events: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Event',
                autopopulate: { maxDepth: 2 }
            }
        ]
    })

clubSchema.plugin(autopopulate)

const Club = mongoose.model('Club', clubSchema)

module.exports = Club