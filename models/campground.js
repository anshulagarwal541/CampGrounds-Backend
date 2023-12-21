const mongoose = require('mongoose');
const { Review } = require('./review');
const { User } = require('./user');


const imageSchema = new mongoose.Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

imageSchema.virtual('displayImage').get(function () {
    return this.url.replace('/upload', '/upload/w_400,h_300')
})

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    price: Number,
    images: [imageSchema],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: [{
            type: Number,
            required: true
        }]
    }
}, opts)

campgroundSchema.virtual('properties.popUpText').get(function () {
    return `<b><a href="/campground/${this._id}/show">${this.title}</a> </b>`
})

campgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground.reviews.length) {
        await Review.deleteMany({ _id: { $in: campground.reviews } });
    }
})


module.exports = mongoose.model('Campground', campgroundSchema);