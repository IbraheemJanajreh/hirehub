const Offer = require('../models/offer');
const Applier = require('../models/applier');
const User = require('../models/user');
const Notification = require('../models/notification');

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

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
module.exports.index = async (req, res) => {
    req.session.returnTo = req.originalUrl;
    const offers = await Offer.find().sort({
        postDate: -1
    }).populate('author');
    for (let offer of offers) {
        offer.dateAgo = fixDate(offer.postDate);
    }
    res.render('offers/index', {
        offers
    })
};
module.exports.renderNewForm = (req, res) => {
    req.session.returnTo = req.originalUrl;
    res.render('offers/new');

};
module.exports.createOffer = async (req, res, next) => {
    const offer = new Offer(req.body.offer);
    offer.author = req.user._id;
    //console.log(offer);
    offer.postDate = Date.now();
    await offer.save();
    //console.log(offer);
    req.flash('success', 'Successfully made a new Offer');
    res.redirect(`/offers/${offer._id}`)
};




module.exports.showOffer = async (req, res) => {
    const offer = await Offer.findById(req.params.id).populate({
        path: 'appliers',
        populate: {
            path: 'author'
        }
    }).populate('author');
    //console.log(offer);
    if (!offer) {
        req.flash('error', 'Cannot find that Offer');
        return res.redirect('/offers');
    }
    //console.log(offer, req.user)
    req.session.returnTo = req.originalUrl;
    let isApplay = false,
        applierId = 2;
    for (let applaier of offer.appliers) {
        if (applaier.author.equals(req.user)) {
            isApplay = true;
            applierId = applaier._id;
        }
    }
    //console.log(isApplay)
    offer.dateAgo = fixDate(offer.postDate);
    for (let applier of offer.appliers) {
        let when = new Date(applier.postDate);
        applier.dateAgo = (monthNames[when.getMonth()]) + ', ' + when.getDate() + '  ' + when.getFullYear();
    };

    res.render('offers/show', {
        offer,
        isApplay,
        applierId
    });
};
module.exports.renderEditForm = async (req, res) => {

    const offer = await Offer.findById(req.params.id);
    if (!offer) {
        req.flash('error', 'Cannot find that Offer');
        return res.redirect('/offers');
    }
    req.session.returnTo = req.originalUrl;
    res.render('offers/edit', {
        offer
    });
};
module.exports.updateOffer = async (req, res) => {
    const {
        id
    } = req.params;
    await Offer.findByIdAndUpdate(id, {
        ...req.body.offer
    });
    req.flash('success', 'Successfully updated offer');
    res.redirect(`/offers/${id}`)
};
module.exports.deleteOffer = async (req, res) => {
    const {
        id
    } = req.params;

    //const notifications = await Notification.find({});
    
    await Notification.deleteMany({
        where: id
    });

    await Offer.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted offer');
    res.redirect('/offers');
};


module.exports.createApplier = async (req, res) => {
    const offer = await Offer.findById(req.params.id);

    const apply = new Applier({
        author: req.user,
        postDate: Date.now(),
        dateAgo: 0

    });

    let alreadyApply = 0;

    let theOffer = await Offer.findById(req.params.id).populate({
        path: 'appliers',
        populate: {
            path: 'author'
        }
    }).populate('author');
    for (let applier of theOffer.appliers) {
        if (applier.author._id.equals(apply.author._id))
            alreadyApply = 1;
    }
    if (alreadyApply) {
        req.flash('error', 'Already applied');
        return res.redirect(`/offers/${offer._id}`);
    } else {
        offer.appliers.push(apply);
        await apply.save();
        await offer.save();

        const n = new Notification({
            from: req.user,
            where: offer,
            to: theOffer.author,
            postDate: Date.now(),
            dateAgo: 0,
            isRead: false
        })
        //await Notification.deleteMany({});
        //.then(data => console.log(data));
        await n.save();
        //const it = await Notification.find({});
        // console.log(it);
        res.redirect(`/offers/${offer._id}`);
    }
};
module.exports.deleteApplier = async (req, res) => {
    const {
        id,
        applierId
    } = req.params;
    const curoffer = await Offer.findByIdAndUpdate(id, {
        $pull: {
            appliers: applierId
        }
    });
    let authorOffer = await User.findById(curoffer.author);
    await Notification.deleteOne({
        from: req.user._id,
        to: authorOffer._id,
        where: curoffer._id
    });
    //.then(data => console.log(data));

    await Applier.findByIdAndDelete(applierId);
    res.redirect(`/offers/${id}`);
};
module.exports.cityOffers = async (req, res) => {
    const City = req.body.city.charAt(0).toUpperCase() + req.body.city.slice(1).toLowerCase();
    const cityOffer = await Offer.find({
        location: City
    }).sort({
        postDate: -1
    }).populate('author');
    for (let offer of cityOffer) {
        offer.dateAgo = fixDate(offer.postDate);
    }
    res.render('offers/query', {
        cityOffer
    });
}