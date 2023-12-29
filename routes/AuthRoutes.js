const express = require('express');
const passport = require('passport');
const { createProduct, fetchAllProduct, fetchProductById, updateProduct } = require('../controller/ProductController');
const { createUser, loginUser, checkUser, checkAuth } = require('../controller/AuthController');


const router = express.Router();

router.post('/signup', createUser).post('/login', passport.authenticate('local'), loginUser).get('/check',passport.authenticate('jwt'), checkAuth)


exports.router = router