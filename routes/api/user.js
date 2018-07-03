const router = require('express').Router(),
    usersController = require('../../controllers/usersController')

// route prefix: '/api/user

router.route('/')
    .get(usersController.findAll)
    .post(usersController.create)


router.route('/:id')
    .get(usersController.findById)
    .put(usersController.update)
    .delete(usersController.remove)

router.route('/:id/auth')
    .get(usersController.findByAuthId)

router.route('/:id/club/:club')
    .put(usersController.joinClub)
    .delete(usersController.leaveClub)

router.route('/:id/rsvp/:event')
    .put(usersController.rsvpToEvent)

router.route('/:id/vote/:date')
    .put(usersController.voteForDate)
    .delete(usersController.voteAgainstDate)

router.route('/:id/bringing/:request')
    .put(usersController.claimRequest)
    .delete(usersController.unclaimRequest)

module.exports = router
