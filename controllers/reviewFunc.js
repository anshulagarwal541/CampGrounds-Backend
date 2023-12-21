const Campground = require('../models/campground')
const { Review } = require('../models/review');


module.exports.postReview = async (req, res) => {
    const id = req.params.id;
    let campground = await Campground.findById(id);
    let review = new Review({ text: req.body.review.text, rating: req.body.review.rating });
    campground.reviews.push(review);
    review.campground = campground;
    review.author = req.user._id;
    await campground.save();
    await review.save();
    req.flash('success', 'You have successfully added a review..!!')
    res.redirect(`/campground/${id}/show`)
}

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    req.flash('success', 'You have successfully deleted a review..!!')
    res.redirect(`/campground/${id}/show`);
}