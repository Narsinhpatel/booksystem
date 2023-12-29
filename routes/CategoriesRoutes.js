const express=require('express');

const { fetchCategory, createCategory } = require('../controller/CategoryController');

const router=express.Router();
// /products id already added as base path
router.get('/',fetchCategory).post('/',createCategory)


exports.router=router