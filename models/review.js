const mongoose = require('mongoose');
const { Campground } = require('./campground');
const { User } = require('./user');
const reviewSchema = new mongoose.Schema({
    text: String,
    rating: Number,
    campground: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campground'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports.Review = mongoose.model('Review', reviewSchema);
