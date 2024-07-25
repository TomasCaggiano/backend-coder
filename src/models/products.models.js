import { Schema, model } from "mongoose";

const products = 'products'

const productsSchema = new Schema({
    title: {
        type: String,
        require: true,
        unique: true
    },
    code: {
        type: Number,
        require: true,
        unique: true
    },
    stock: {

        type: Number,
        require: true,
        unique: true
    },
    price: {
        type: Number,
        require: true,
        unique: true
    },
    thumbnail: {
        type: String,
        require: true,
        unique: true
    }

})

export const productsModel = model(products, productsSchema)