const db = require('../models')

module.exports = {
    findAll: function (req, res) {
        db.Club
            .find(req.query)
            .sort({ name: 1 })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
    },
    findById: function (req, res) {
        db.Club
            .findById(req.params.id)
            .populate('owner')
            .populate('members.member')
            .populate('events')
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
    },
    create: function (req, res) {
        db.Club
            .create(req.body)
            .then(dbModel => {
                db.User
                    .findByIdAndUpdate(dbModel.owner, { $push: { clubs: { club: dbModel._id, isOwner: true, hostingEnabled: true } } }, { new: true })
                    .then(dbModel => res.json(dbModel))
                    .catch(err => res.status(422).json(err))
            })
            .catch(err => res.status(422).json(err));
    },
    update: function (req, res) {
        db.Club
            .findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('owner')
            .populate('members.member')
            .populate('events')
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    remove: function (req, res) {
        db.User
            .update({}, { $pull: { clubs: { $elemMatch: {club: req.params.id} } } }, {multi: true})
            .then(dbModel => {
                db.Club
                    .findById(req.params.id)
                    .then(dbModel => dbModel.remove())
                    .then(dbModel => res.json(dbModel))
                    .catch(err => res.status(422).json(err));
            })

    }
}