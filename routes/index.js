const express = require('express');
const{getProducts} = require ('../controllers');
const{getProductsCart} = require ('../controllers');
const{deleteProduct} = require ('../controllers');
const{addProduct} = require ('../controllers');
const{addProductCart} = require ('../controllers');

    const router = express.Router();

    router.get('/products', getProducts);
    router.get('/products-cart', getProductsCart);
    router.post('/products-cart', addProductCart);
    router.put('/products-cart/:productId', addProduct);
    router.delete('/products-cart/:productId', deleteProduct);
    
  
    

    module.exports = {
        router
    }