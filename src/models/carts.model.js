import { Schema, model } from "mongoose"
const CartSchema = new Schema({
    products: {
        type: [{
            products: {}
        }]
    }
})

CartSchema.pre('find', function() {
    this.populate('products.product')
})

export const cartsModel = model('carts', CartSchema)