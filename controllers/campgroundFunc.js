const campground = require('../models/campground');
const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index = async (req, res) => {
    let campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}
module.exports.showCamp = async (req, res) => {
    let id = req.params.id;
    let campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    let user = req.user;
    res.render('campgrounds/showCampground', { campground, user });
}

module.exports.postNewCamp = async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    newCampground.geometry = geoData.body.features[0].geometry;
    newCampground.author = req.user._id;
    console.log(newCampground.images)
    await newCampground.save();
    req.flash('success', 'You have successfully created a new campground..!!')
    res.redirect(`/campground/${newCampground._id}/show`);
}

module.exports.patchEditCamp = async (req, res) => {
    let p = req.body.campground;
    console.log(req.body.deleteImages);
    let camp = await Campground.findById(req.params.id);
    camp.title = p.title;
    camp.location = p.location;
    let image = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }))
    camp.images.push(...image)
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    await camp.save();
    req.flash('success', 'You have successfully updated the campground..!!')
    res.redirect(`/campground/${camp._id}/show`)
}

module.exports.deleteCamp = async (req, res) => {
    let camp = await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'You have successfully deleted the campground..!!')
    res.redirect("/")
}
module.exports.getEditCamp = async (req, res) => {
    let campground = await Campground.findById(req.params.id);
    res.render("campgrounds/editCampground", { campground });
}