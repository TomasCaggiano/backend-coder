import { cartsModel } from "../../models/carts.model.js";

class CartsManagerDB {
    constructor() {
        this.model = cartsModel;
    }

    async getCarts() {
        return await this.model.find();
    }

    async createCart() {
        return await this.model.create({ products: [] });
    }

    async addProduct(cid, pid) {
        const cart = await this.model.findById(cid);
        if (!cart) throw new Error('Cart not found');

        const productIndex = cart.products.findIndex(product => product.product.toString() === pid);

        if (productIndex === -1) {
            cart.products.push({ product: pid, quantity: 1 });
        } else {
            cart.products[productIndex].quantity++;
        }

        await cart.save();
        return cart;
    }
}

export default CartsManagerDB;