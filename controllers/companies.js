const User = require('../models/user');
const Offer = require('../models/offer');
const passport = require('passport');
const Notification = require('../models/notification')

module.exports.renderRegister = (req, res) => {
    if (req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        return res.redirect('/offers');
    }
    res.render('companies/register');
};



module.exports.register = async (req, res) => {

    try {
        const {
            email,
            username,
            password,
            phone,
            company = true,
            image,
            profession = "*",
            skill = "*",
            fullName,
        } = req.body;

        const skills = skill.split(',')

        const newCompany = new User({
            email,
            username,
            password,
            phone,
            company,
            image,
            profession,
            skills,
            fullName,
        });
        newCompany.image.url = req.file.path;
        newCompany.image.filename = req.file.filename;
        //console.log(email);
        const registerCompany = await User.register(newCompany, password);
        // console.log(companyy);
        req.login(registerCompany, err => {
            if (err)
                return next(err);
            req.flash('success', 'Welcome to HireHub!');
            res.redirect('/offers');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/company/register');
    }

};
module.exports.renderLogin = (req, res) => {
    if (req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        return res.redirect('/offers');
    }
    res.render('companies/login');
};

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

module.exports.renderProfile = async (req, res) => {
    const alloffer = await Offer.find({}).populate('author').populate('appliers');
    const allNotifications = await Notification.find({}).sort({ postDate: -1 }).populate('where').populate('from').populate('to');
    // console.log(allNotifications)
    for (let offer of alloffer) {
        offer.dateAgo = fixDate(offer.postDate);
        await offer.save();

    }

    if (req.isAuthenticated()) {
        
        req.session.returnTo = req.originalUrl;
        const u = await User.findById(req.params.id);
        if (!u.company)
        {
            return res.redirect('/offers');
        }
        //console.log(allNotifications)
        return res.render('companies/profile', { u, allNotifications, alloffer });
    }
    res.render('companies/login');
};
module.exports.changePhoto=async(req,res)=>{
    //console.log(req.params.id);
    const user=await User.findById(req.params.id);
    user.image.url = req.file.path;
    user.image.filename = req.file.filename;
    await user.save();
    const alloffer = await Offer.find({}).populate('author').populate('appliers');
    res.render('companies/profile',{u:user,alloffer});
}
module.exports.login = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err)
            return next(err);
        if (!user || !user.company) {
            req.flash('error', 'Password or username is incorrect');
            return res.redirect('/company/login');
        }
        req.logIn(user, function (err) {
            if (err)
                return next(err);
            return res.redirect('/offers');

        });
    })(req, res, next);
};