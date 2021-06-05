const {
    offerSchema
} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Offer = require('./models/offer');
const Applier = require('./models/applier');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in');
        return res.redirect('/user/login');
    }
    next();
};
module.exports.isCompany=(req,res,next)=>{
    if (!req.user.company){
        return res.redirect('/company/login');
    }
    next();
}
module.exports.validateOffer = (req, res, next) => {
    const {
        error
    } = offerSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
module.exports.isAuthor = async (req, res, next) => {
    const {
        id
    } = req.params;
    let offer = await Offer.findById(id);
    if (!offer.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/offers/${id}`);
    }
    next();
}
module.exports.isApplierAuthor = async (req, res, next) => {
    const {
        id,applierId
    } = req.params;
    let apply = await Applier.findById(applierId);
    //console.log(applierId)
    if (!apply.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/offers/${id}`);
    }
    next();
}