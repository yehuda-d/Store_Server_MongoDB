const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { 
        type: Number, 
        required: true, 
        min: [0, 'Price must be positive'] 
    },
    stock: { 
        type: Number, 
        required: true, 
        min: [0, 'Stock cannot be negative'] 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    }
});

module.exports = mongoose.model('Product', productSchema, 'products');