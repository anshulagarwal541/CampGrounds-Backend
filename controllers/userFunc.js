const User=require('../models/user')
module.exports.getIndex = (req, res) => {
    res.render('authenticationPage/signup')
}

module.exports.postIndex = async (req, res) => {
    let newUser = new User({
        username: req.body.username,
        email: req.body.email
    })
    await User.register(newUser, req.body.password)
    await newUser.save();
    req.login(newUser, function (error) {
        if (error) {
            return next(error);
        }
        else {
            res.redirect('campground')
        }
    })

}


module.exports.getLogin = (req, res) => {
    res.render('authenticationPage/login')
}

module.exports.postLogin = async (req, res) => {
    req.flash('success', "Successfully Logged in..")
    const redirectUrl = res.locals.returnTo || '/campground';
    res.redirect(redirectUrl);
}

module.exports.getLogout = (req, res) => {
    req.logout(e => {
        if (e) {
            return next(e); f
        }
        delete req.user;
        req.flash('success', 'Logged out successfully..')
        res.redirect('login');
    });
}