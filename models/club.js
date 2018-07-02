const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    clubSchema = new Schema({
        name: { type: String, trim: true, required: true },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        members: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
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