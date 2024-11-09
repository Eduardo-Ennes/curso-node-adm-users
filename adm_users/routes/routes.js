var express = require('express')
var app = express()
var router = express.Router()
var HomeController = require('../Controller/HomeController')
var UserControlle = require('../Controller/UserController')
var AdminAuth = require('../middleware/AdminAuth')
var AdminAuthChief = require('../middleware/AdminAuthChief')

router.get('/', HomeController.index)
router.post('/user', UserControlle.create)
router.get('/user', AdminAuth, UserControlle.index)
router.get('/user/:id', AdminAuthChief, UserControlle.findUser)
router.put('/user', AdminAuthChief, UserControlle.update)
router.delete('/user/:id', AdminAuthChief, UserControlle.delete)
router.post('/recoverpassword', UserControlle.recoverPassword)
router.post('/changepassword', UserControlle.changePassword)
router.post('/login', UserControlle.login)
router.post('/validate', AdminAuth, HomeController.validate)

module.exports = router;