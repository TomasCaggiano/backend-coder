import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const products = 'products'

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

productsSchema.plugin(mongoosePaginate)

export const productsModel = model(products, productsSchema);