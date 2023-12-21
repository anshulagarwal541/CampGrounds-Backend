const express = require('express');
const Router = express.Router({ mergeParams: true });
const User = require('../../models/user')
const passport = require('passport')
const userFunc = require('../../controllers/userFunc');

Router.route('/signup')
    .get(userFunc.getIndex)
    .post(userFunc.postIndex)


Router.route('/login')
    .get(userFunc.getLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userFunc.postLogin)

Router.get('/logout', userFunc.getLogout)

module.exports = Router;