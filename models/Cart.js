const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    name: {type: String, required:true,  unique: true},
    img: {type: String, required:true},
    amount: {type: Number, required:true},
    price: {type: Number, required:true},
});

module.exports = mongoose.model('Cart',CartSchema)