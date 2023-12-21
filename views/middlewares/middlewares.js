const Campground = require('../../models/campground');
const { campgroundSchema } = require('../utilities/joi');
const { Review } = require('../../models/review');
module.exports.validateCampground = (req, res, next) => {
    const result = campgroundSchema.validate(req.body);
    console.log(result);
    const { error } = result;
    console.log(error);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',');
        //throw new ExpressError(msg, 400);
        req.flash('error', msg);
        res.redirect('/campground')
    }
    else {
        next();
    }
}

module.exports.isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', "Please login first!!")
        res.redirect('/login');
    }
    else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (campground.author.equals(req.user._id)) {
        next();
    }
    else {
        req.flash('error', 'You don\'t have permission to do that sorry.')
        res.redirect(`/campground/${id}/show`);
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let reviews = await Review.findById(req.params.reviewId);
    if (reviews.author.equals(req.user._id)) {
        next();
    }
    else {
        req.flash('error', 'You dont\' have permission to do that sorry..')
        res.redirect(`/campground/${id}/show`);
    }
}