const Campground = require('../models/campground')
const mongoose = require('mongoose');
const cities = require('./locations')
const { descriptors, places } = require('./cities');
mongoose.connect('mongodb://127.0.0.1:27017/yelpcampground', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to mongoDB..");
    })
    .catch(err => {
        console.log("Failed to connect to MongoDB.");
    })

const clearDB = async function () {
    await Campground.deleteMany({});
    for (let x = 1; x <= 50; x++) {
        const placeIndex = Math.floor(Math.random() * places.length);
        const price = Math.floor(Math.random() * 30) + 10;
        const desIndex = Math.floor(Math.random() * descriptors.length);
        const random1000 = Math.floor(Math.random() * 1000);
        let newCampground = new Campground({ location: `${cities[random1000].city}, ${cities[random1000].state}`, title: `${descriptors[desIndex]} ${places[placeIndex]}`, description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere corporis laborum id libero non temporibus, officiis in nulla quo necessitatibus numquam cupiditate architecto. Quo, quibusdam.', price });
        newCampground.author = '656480c3d9c9d03d17e2364d';
        newCampground.geometry = { type: 'Point', coordinates: [cities[random1000].longitude, cities[random1000].latitude] };
        newCampground.images = [
            {

                url: 'https://res.cloudinary.com/dqhecj3tf/image/upload/v1702308374/YelpCampgrounds/abztrzlcul0blfnpfavt.jpg',
                filename: 'YelpCampgrounds/abztrzlcul0blfnpfavt'
            },
            {
                url: 'https://res.cloudinary.com/dqhecj3tf/image/upload/v1701431527/YelpCampgrounds/hxg2gdxcoeca4vvpdojz.jpg',
                filename: 'YelpCampgrounds/hxg2gdxcoeca4vvpdojz'
            }
        ]
        await newCampground.save();
    }
}

clearDB();