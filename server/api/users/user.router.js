const router = require('express').Router()
const {createUser, getUsers, getUsersById, login} = require('./user.controller')
const auth = require("../middleware/auth")

router.post('/', createUser)
router.get('/all', getUsers)
router.get('/', auth, getUsersById)
router.post('/login', login)

module.exports = router