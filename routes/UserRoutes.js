const express=require('express');
const { fetchUserById, updateUser } = require('../controller/UserController');



const router=express.Router();
// /products id already added as base path
router.get('/own',fetchUserById).patch('/:id',updateUser)


exports.router=router