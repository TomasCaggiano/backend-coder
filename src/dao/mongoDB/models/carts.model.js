import mongoose, { Schema, model } from 'mongoose';


const cartCollection = 'carts';

const cartItemSchema = new Schema({
    pid: { type: Schema.Types.ObjectId, ref: 'products', required: false },
    quantity: { type: Number, required: false }
});

const cartSchema = new Schema({
    products: [cartItemSchema],
});


const cart = mongoose.model(cartCollection, cartSchema);

export default cart