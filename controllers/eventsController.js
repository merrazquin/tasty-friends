const db = require('../models')

module.exports = {
    findAll: function (req, res) {
        db.Event
            .find(req.query)
            .sort({ name: 1 })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
    },
    findById: function (req, res) {
        db.Event
            .findById(req.params.id)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
    },
    findByUser: function (req, res) {
        db.Event
            .find({ $or: [{ host: req.params.userId }, { guests: { user: req.params.userId } }] })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
    },
    create: function (req, res) {
        db.Event
            .create(req.body)
            .then(eventModel =>
                db.Club.findOneAndUpdate({ _id: req.body.club }, { $push: { events: eventModel._id } }, { new: true })
                    .then(clubModel => res.json(eventModel))
                    .catch(err => res.status(422).json(err))
            )
            .catch(err => res.status(422).json(err))
    },
    update: function (req, res) {
        db.Event
            .findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
    },
    remove: function (req, res) {
        db.Club
            .findOneAndUpdate({ events: req.params.id }, { $pull: { events: req.params.id } })
            .then(
                db.Event
                    .findById(req.params.id)
                    .then(dbModel => dbModel.remove())
                    .then(dbModel => res.json(dbModel))
                    .catch(err => res.status(422).json(err))
                )
            .catch (err => res.status(422).json(err))
    },
    addRequest: function (req, res) {
        db.Event
            .findOneAndUpdate({ _id: req.params.id }, { $push: { requests: { request: req.body.request } } }, { new: true })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
    },
    removeRequest: function (req, res) {
        db.Event
            .findOneAndUpdate({ _id: req.params.id }, { $pull: { requests: { _id: req.params.request } } }, { new: true })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
    }
}