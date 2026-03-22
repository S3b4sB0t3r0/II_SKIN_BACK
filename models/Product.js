const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
    color: {
        name: { type: String, required: true },
        hex: { type: String }, // para pintar el circulito
        image: { type: String } // imagen específica por color
    },
    size: {
        type: String,
        required: true,
        enum: ["XS", "S", "M", "L", "XL", "XXL"]
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    sku: {
        type: String,
        required: true,
        unique: true
    }
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    slug: {
        type: String,
        unique: true
    },

    category: {
        type: String,
        required: true
    },

    collection: {
        type: String // Ej: "Vivir al Máximo – Julio 2025"
    },

    gender: {
        type: String,
        enum: ["Hombre", "Mujer", "Unisex"]
    },

    price: {
        retail: { type: Number, required: true },   // al detal
        wholesale: { type: Number }                 // al mayor
    },

    discountPercentage: {
        type: Number,
        default: 0
    },

    description: {
        type: String
    },

    material: {
        type: String
    },

    features: [{
        type: String
    }],

    variants: [variantSchema],

    images: [{
        type: String
    }],

    isOnSale: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);