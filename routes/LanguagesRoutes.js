const express=require('express');
const { fetchLanguage, createLanguage } = require('../controller/LanguageController');

const router=express.Router();
// /products id already added as base path
router.get('/',fetchLanguage).post('/',createLanguage)


exports.router=router