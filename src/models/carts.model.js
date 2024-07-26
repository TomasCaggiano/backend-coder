import { Schema, model } from "mongoose";

const CartSchema = new Schema({
    products: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 }
    }]
});

CartSchema.pre('find', function() {
    this.populate('products.product');
});

export const cartsModel = model('Cart', CartSchema);