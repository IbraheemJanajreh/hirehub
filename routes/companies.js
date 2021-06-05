const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const companies=require('../controllers/companies');
const multer=require('multer');
const{storage}=require('../cloudinary/index.js');
const upload=multer({storage});
router.get('/register',companies.renderRegister);
router.post('/register',upload.single('image'), catchAsync(companies.register));
router.get('/login', companies.renderLogin)
router.get('/profile/:id', companies.renderProfile)
router.post('/login',companies.login);
router.put('/profile/:id/changePhoto',upload.single('image'),companies.changePhoto);
module.exports = router;