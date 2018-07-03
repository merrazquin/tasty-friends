const router = require('express').Router(),
    userRoutes = require('./user'),
    clubRoutes = require('./club')

// User routes
router.use('/user', userRoutes)
router.use('/club', clubRoutes)

module.exports = router
