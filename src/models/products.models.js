import { Schema, model } from "mongoose";

const productsSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    }
});

export const productsModel = model('products', productsSchema);