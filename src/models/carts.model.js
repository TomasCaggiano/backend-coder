import { Schema, model } from "mongoose";

const carts = 'carts'

const cartsSchema = new Schema({
    products: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
    }]
});

export const cartsModel = model(carts, cartsSchema);