const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const offers = require('../controllers/offers');
const {
    isLoggedIn,
    isCompany,
    isAuthor,
    validateOffer,
    isApplierAuthor
} = require('../middleware');

router.route('/')
    .get(catchAsync(offers.index))
    .post(isLoggedIn, isCompany,validateOffer, catchAsync(offers.createOffer));
    

    
router.get('/new', isLoggedIn, isCompany, offers.renderNewForm);
router.post('/citysearch',catchAsync(offers.cityOffers));
router.route('/:id')
    .get(catchAsync(offers.showOffer))
    .put(isLoggedIn, isAuthor, validateOffer, catchAsync(offers.updateOffer))
    .delete(isLoggedIn, isAuthor, catchAsync(offers.deleteOffer));



router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(offers.renderEditForm));


router.post('/:id/appliers', isLoggedIn, catchAsync(offers.createApplier));
router.delete('/:id/appliers/:applierId', isLoggedIn, isApplierAuthor, catchAsync(offers.deleteApplier));



module.exports = router;