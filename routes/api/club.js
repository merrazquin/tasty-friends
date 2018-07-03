const router = require('express').Router(),
    clubsController = require('../../controllers/clubsController')

// route prefix: '/api/club

router.route('/')
    .get(clubsController.findAll)
    .post(clubsController.create)

router.route('/:id')
    .get(clubsController.findById)
    .put(clubsController.update)
    .delete(clubsController.remove)

module.exports = router
