const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../../models/campground')
const Review = require('../../models/review')
const catchAsync = require('../utilities/catchAsync')
const { campgroundSchema } = require('../utilities/joi')
const ExpressError = require('../utilities/expresserror')
const { validateCampground, isAuthenticated, isAuthor } = require('../middlewares/middlewares');
const campgroundFunc = require('../../controllers/campgroundFunc');
const { storage } = require('../../cloudinary');
const multer = require('multer');
const upload = multer({ storage });


router.get("/", catchAsync(campgroundFunc.index))

router.route('/new')
    .get(isAuthenticated, catchAsync((req, res) => {
        res.render('campgrounds/newCampground');
    }))
    .post(isAuthenticated, upload.array('image'), validateCampground, catchAsync(campgroundFunc.postNewCamp))

router.get('/:id/show', isAuthenticated, catchAsync(campgroundFunc.showCamp))

router.route('/:id/edit')
    .get(isAuthenticated, catchAsync(campgroundFunc.getEditCamp))
    .patch(isAuthenticated, upload.array('image'), isAuthor, validateCampground, catchAsync(campgroundFunc.patchEditCamp))


router.delete('/:id/delete', isAuthor, catchAsync(campgroundFunc.deleteCamp))

module.exports = router;