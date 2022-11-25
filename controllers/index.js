const { connect } = require('mongoose');
const FS = require('../firebase');
const { db } = FS;
const Cart = require('../models/Cart');
const Product = require('../models/Product');

//Primer Endpoint: Obtener Productos
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.send({ products });
    } catch (error) {
        res.send({
            Warning: "There is no products"
        })
    }
}
//Segundo Endpoint: Obtener Productos del Carrito
const getProductsCart = async (req, res) => {
    try {
        const productsCart = await Cart.find();
        res.send({ productsCart });
    } catch (error) {
        res.send({
            Warning: "There is no products in the cart"
        })
    }
}

//Tercer Endpoint: Agregar Producto al Carrito
const addProductCart = async (req, res) => {
    try {
        //Se solicita que se ingresa el nombre la imagen y el precio
        const { name, img, price } = req.body;
        // se busca si ya existe el producto
        const productExist = await Product.findOne({ name })
        // Se verifica que vengan todos los datos
        const isNotEmpty = name !== "" && img !== "" && price !== "";
        // se verifica si este esta en el carrito
        const productInCart = await Cart.findOne({ name })

        //Si no existe el producto
        if (!productExist) {
            res.send({
                status: 404,
                Error: "This product isnt found"
            })
        }

        //si se envia un producto no vacio y no esta en el carrito se agrega
        else if (isNotEmpty && !productInCart) {
            const newProductCart = new Cart({ name, img, price, amount: 1 });
            await Product.findByIdAndUpdate(
                productExist?._id,
                { inCart: true, name, img, price },
                { new: true }
            )
                .then((product) => {
                    newProductCart.save();
                    res.send({
                        status: 200,
                        Message: 'The product was added succesfully',
                        product,
                    });
                })
                .catch((error) => console.error(error));
            //Si el producto esta en el carrito
        } else if (productInCart) {
            res.send({
                status: 400,
                Message: 'The product is alredy in the cart',
            });
        }
    } catch (error) {
        res.send("An error ocurred")
    }
}

//Cuarto endpoint, agregar un producto
const addProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { query } = req.query;
        const body = req.body;

        //Se busca el producto en el carrito
        const productSearch = await Cart.findById(productId);

        if (!query) {
            res.send({
                status: 404,
                Message: 'You must send a query',
            });
        } else if (productSearch && query === "add") {
            body.amount = body.amount + 1;
            await Cart.findByIdAndUpdate(productId, body, {
                new: true,
            }).then((product) => {
                res.send({
                    status: 200,
                    Message: `The product ${product.name} was succesfully updated`,
                    product,
                });
            });
        } else if (productSearch && query === "del") {
            body.amount = body.amount - 1;
            await Cart.findByIdAndUpdate(productId, body, {
                new: true,
            }).then((product) => {
                res.send({
                    status: 200,
                    Message: `The product ${product.name} was succesfully updated`,
                    product,
                });
            });
        }
    }
    catch (error) {
        res.send("An error ocurred")
    }
}


const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        //Buscar en el carrito
        const productInCart = await Cart.findById(productId);

        //Se busca en la base de datos atraves del nombre
        const { name, img, price, _id } = await Product.findOne({
            name: productInCart.name,
        });

        //Se busca y se eliminael producto con dicha id
        await Cart.findByIdAndDelete(productId);
        await Product.findByIdAndUpdate(_id,
            { inCart: false, name, img, price },
            { new: true }
        ).then((product) => {
            res.send({
                status: 200,
                Message: `The product ${product.name} was succesfully deleted of the cart`,
                product,
            });
        });
    } catch {
        res.send("An error ocurred")
    }

}

module.exports = {
    getProducts,
    getProductsCart,
    addProductCart,
    addProduct,
    deleteProduct
}