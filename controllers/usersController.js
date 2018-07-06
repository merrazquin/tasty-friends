const db = require('../models')

module.exports = {
    findAll: function (req, res) {
        db.User
            .find(req.query)
            .populate('clubs.club')
            .sort({ displayName: 1 })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    findById: function (req, res) {
        db.User
            .findById(req.params.id)
            .populate('clubs.club')
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
    },
    findByAuthId: function (req, res) {
        db.User
            .findOne({ authId: req.params.id })
            .populate('clubs.club')
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    create: function (req, res) {
        db.User
            .create(req.body)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    update: function (req, res) {
        db.User
            .findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    remove: function (req, res) {
        db.User
            .findById({ _id: req.params.id })
            .then(dbModel => dbModel.remove())
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    joinClub: function (req, res) {
        db.Club
            .findOneAndUpdate({ _id: req.params.club, members: { $not: { $elemMatch: { member: req.params.id } } } }, { $push: { members: { member: req.params.id, willHost: req.body.willHost } } }, { new: true })
            .then(dbModel => {
                db.User
                    .findByIdAndUpdate(req.params.id, { $push: { clubs: { club: dbModel._id, hostingEnabled: req.body.willHost } } }, { new: true })
                    .populate('clubs.club')
                    .then(dbModel => res.json(dbModel))
                    .catch(err => res.status(422).json(err))
            })
            .catch(err => res.status(422).json(err))
    },
    joinClubByInvite: function (req, res) {
        db.Club
            .findOneAndUpdate({ inviteCode: req.params.inviteCode, members: { $not: { $elemMatch: { member: req.params.id } } } }, { $push: { members: { member: req.params.id, willHost: req.body.willHost } } }, { new: true })
            .then(dbModel => {
                db.User
                    .findByIdAndUpdate(req.params.id, { $push: { clubs: { club: dbModel._id, hostingEnabled: req.body.willHost } } }, { new: true })
                    .populate('clubs.club')
                    .then(dbModel => res.json(dbModel))
                    .catch(err => res.status(422).json(err))
            })
            .catch(err => res.status(422).json(err))
    },
    leaveClub: function (req, res) {
        db.Club
            .findOneAndUpdate({ _id: req.params.club }, { $pull: { members: { member: req.params.id } } }, { new: true })
            .then(dbModel => res.json(dbModel))
            .create(err => res.status(422).json(err))
    },
    rsvpToEvent: function (req, res) {
        db.Event
            .findOneAndUpdate({ _id: req.params.event }, { $push: { guests: { user: req.params.id, rsvp: req.body.rsvp } } }, { new: true })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
    },
    voteForDate: function (req, res) {
        db.Event
            .findOneAndUpdate({ 'dates._id': req.params.date }, { $push: { 'dates.$.votes': req.params.id } }, { new: true })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
    },
    voteAgainstDate: function (req, res) {
        db.Event
            .findOneAndUpdate({ 'dates._id': req.params.date }, { $pull: { 'dates.$.votes': req.params.id } }, { new: true })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
    },
    claimRequest: function (req, res) {
        db.Event
            .findOneAndUpdate({ 'requests._id': req.params.request }, { $set: { 'requests.$.provider': req.params.id } }, { new: true })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
    },
    unclaimRequest: function (req, res) {
        db.Event
            .findOneAndUpdate({ 'requests._id': req.params.request }, { $set: { 'requests.$.provider': undefined } }, { new: true })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
    }
}
