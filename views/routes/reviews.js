const express = require('express');
const router = express.Router({ mergeParams: true });
const ExpressError = require('../utilities/expresserror')
const catchAsync = require('../utilities/catchAsync')
const Campground = require('../../models/campground')
const { Review } = require('../../models/review')
const { isAuthenticated, isReviewAuthor } = require('../middlewares/middlewares');
const reviewFunc = require('../../controllers/reviewFunc');



router.post('/', catchAsync(reviewFunc.postReview))

router.delete('/:reviewId/delete', isAuthenticated, isReviewAuthor, catchAsync(reviewFunc.deleteReview))

module.exports = router;