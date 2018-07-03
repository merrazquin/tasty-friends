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