require('dotenv').config();
const express = require('express');
const { Review } = require('./models/review')
const port = 4000;
const path = require('path');
const User = require('./models/user')
const Campground = require('./models/campground')
const app = express();
const Joi = require('joi')
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const campgroundRoutes = require('./views/routes/campgrounds')
const reviewRoutes = require('./views/routes/reviews');
const userRoutes = require('./views/routes/user');
const session = require('express-session');
const flash = require('connect-flash')
const passport = require('passport');
const localStrategy = require('passport-local');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const dbUrl = process.env.DB_URL;
const MongoDBStore = require('connect-mongo')(session);
//'mongodb://127.0.0.1:27017/yelpcampground'
mongoose.connect('mongodb://127.0.0.1:27017/yelpcampground', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to mongoDB..");
    })
    .catch(err => {
        console.log("Failed to connect to MongoDB.");
    })


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static('static'))
app.use(mongoSanitize());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    'https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.js',
    "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
    'https://res.cloudinary.com/dqhecj3tf/image/upload/v1702308374/YelpCampgrounds/abztrzlcul0blfnpfavt.jpg',
    'https://res.cloudinary.com/dqhecj3tf/image/upload/v1701431527/YelpCampgrounds/hxg2gdxcoeca4vvpdojz.jpg'
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
    'https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css',
    "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"

];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dqhecj3tf/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
// setting up for the flash.....
app.use(flash());

const store = new MongoDBStore({
    url: dbUrl,
    secret: "thisisasecret",
    touchAfter: 24 * 60 * 60
});
store.on("error", function (e) {
    console.log(e);
});
// setting up for the session....
const sessionConfig = {
    store,
    name: "session",
    secret: "thisisasecret",
    resave: false,
    saveUninitialised: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
// Setting up the app with authentication..
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


module.exports = Campground;

app.use((req, res, next) => {
    res.locals.returnTo = req.session.returnTo;
    res.locals.user = req.isAuthenticated();
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.render('campgrounds/home');
})

app.use('/campground', campgroundRoutes)

app.use('/campground/:id/review', reviewRoutes);

app.use("/", userRoutes);


app.use((err, req, res, next) => {
    res.render('error/error', { error: err });
})

app.listen(port, function () {
    console.log(`Connected to port ${port}...`);
})