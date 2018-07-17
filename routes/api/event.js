const router = require('express').Router(),
    eventsController = require('../../controllers/eventsController')

// route prefix: '/api/event

router.route('/')
    .get(eventsController.findAll)
    .post(eventsController.create)
    
router.route('/user/:userId')
    .get(eventsController.findByUser)

router.route('/:id')
    .get(eventsController.findById)
    .put(eventsController.update)
    .delete(eventsController.remove)

router.route('/:id/request')
    .post(eventsController.addRequest)

router.route('/:id/request/:request')
    .delete(eventsController.removeRequest)

module.exports = router
