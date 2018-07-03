const router = require('express').Router(),
    userRoutes = require('./user'),
    clubRoutes = require('./club')
    eventRoutes = require('./event')

// User routes
router.use('/user', userRoutes)
router.use('/club', clubRoutes)
router.use('/event', eventRoutes)

module.exports = router
