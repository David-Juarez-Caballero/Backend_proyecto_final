const express = require('express');
const{signUpAcount} = require ('../controllers');
const{signInAcount} = require ('../controllers');
const{addfundsAcount} = require ('../controllers');
const{addingProductsToCart} = require ('../controllers');
const{addDataAcount} = require ('../controllers');
const router = express.Router();

    router.post('/signup-acount', signUpAcount);
    router.get('/signin-acount', signInAcount);
    router.put('/add-funds/:id', addfundsAcount);;
    router.post('/add-cart/:id', addingProductsToCart);
    router.post('/add-data', addDataAcount);
 

    module.exports = {
        router
    }