const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    id:{
        type:Number,
        required:true,
        unquie:true
    },
    img:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    price:{
         type:String,
         required:true
    },
    path:{
        type:String,
        required:true
    }
});

const Product = mongoose.model('Product', productSchema, 'Product');

module.exports = Product;
