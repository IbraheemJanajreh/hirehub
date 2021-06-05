const User = require('../models/user');
const passport = require('passport');
module.exports.renderRegister = (req, res) => {
    if (req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        return res.redirect('/offers');
    }
    res.render('users/register');
};




module.exports.register = async (req, res) => {

    try {
        const {
            email,
            username,
            password,
            phone,
            company = false,
            image,
            profession,
            skill,
            fullName
        } = req.body;

        const skills = skill.split(',')

        const user = new User({
            email,
            username,
            password,
            phone,
            company,
            image,
            profession,
            skills,
            fullName
        });
        user.image.url = req.file.path;
        user.image.filename = req.file.filename;
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if (err)
                return next(err);
            req.flash('success', 'Welcome to HireHub!');
            return res.redirect('/offers');
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/user/register');
    }

};
module.exports.renderLogin = (req, res) => {
    if (req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        return res.redirect('/offers');
    }
    res.render('users/login');
};

module.exports.renderProfile = async (req, res) => {
    if (req.isAuthenticated()) {
        
        req.session.returnTo = req.originalUrl;
        const u = await User.findById(req.params.id);
        if (u.company)
        {
            return res.redirect('/offers');
        }
        //console.log(u)
        return res.render('users/profile', { u });
    }
    res.render('users/login');
};

module.exports.renderedit = async (req, res) => {
    if (req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        const u = await User.findById(req.params.id, {});
        let skill = "";

        for (let s of u.skills) {
            skill += s;
            skill += ',';
        }

        //console.log(u)
        return res.render('users/edit', { u, skill });
    }
    res.render('users/login');
};

module.exports.editprofile = async (req, res) => {
    const {
        fullName,
        phone,
        profession,
        skill
    } = req.body;
    //console.log(req.body);
    const skills = skill.split(',')
    req.flash('success', 'Successfully Updated Your Profile');
    const u = await User.findByIdAndUpdate(req.params.id, { phone: phone, fullName:fullName, skills:skills,profession:profession}, { new: true })
    res.redirect(`/user/profile/${u._id}`);

};


module.exports.login = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err)
            return next(err);
        if (!user || user.company) {
            req.flash('error', 'Password or username is incorrect');
            return res.redirect('/user/login');
        }
        req.logIn(user, function (err) {
            if (err)
                return next(err);
            return res.redirect('/offers');

        });
    })(req, res, next);
};
module.exports.changePhoto=async(req,res)=>{
    //console.log(req.params.id);
    const user=await User.findById(req.params.id);
    user.image.url = req.file.path;
    user.image.filename = req.file.filename;
    await user.save();
    res.render('users/profile',{u:user});
}