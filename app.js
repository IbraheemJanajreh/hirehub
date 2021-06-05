if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const offersRoutes = require('./routes/offers');
const usersRoutes = require('./routes/users');
const companiesRoutes = require('./routes/companies');
const Notification = require('./models/notification');
const MongoDBStore = require('connect-mongo');
const dbUrl=process.env.DB_URL||'mongodb://localhost:27017/hirehub';
const secret=process.env.SECRET||'thisshouldbeabettersecret!';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// const f = async() => {
//     await User.find({})
//     .then(data => console.log(data))
// }

// f()


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: MongoDBStore.create({
        secret,
        mongoUrl: dbUrl,
        touchAfter: 24 * 60 * 60
    })
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const fixDate = (postDate) => {
    let seconds = Math.floor((new Date() - postDate) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}
app.use(async (req, res, next) => {
    /*if (!['/login', '/', '/register'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }*/
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    let notifications = await Notification.find({}).sort({
        postDate: -1
    }).populate('where').populate('from').populate('to');
    if (req.user) {
        notifications = notifications.filter(n => (req.user.equals(n.to)))
        for (let not of notifications) {
            not.dateAgo = fixDate(not.postDate);
            await not.save();

        }
        res.locals.notifications = notifications;
    }
    next();
});





app.get('/', (req, res) => {

    res.render('home');
});

app.get('/logout', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/offers');
    }
    req.logout();
    res.redirect('/offers');
});
//Delete the Notifucation
app.delete('/:notificationID', async (req, res) => {
    const notification = await Notification.findById(req.params.id);
    await Notification.deleteOne(notification);
    const currURL = req.session.returnTo;
    if (!currURL)
        currURL = "/offers";
    //console.log(currURL);
    res.redirect(`${currURL}`);
});


app.use('/offers', offersRoutes);
app.use('/company', companiesRoutes);
app.use('/user', usersRoutes);


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});
app.use((err, req, res, next) => {
    const {
        statusCode = 500
    } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', {
        err
    })
});
const port=process.env.PORT||3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});