import { cartsModel } from "../../models/carts.model.js";

class CartsManagerDB {
    constructor() {
        this.carts = cartsModel;
    }

    async getCarts() {
        return await this.carts.find().populate('products.product');
    }

    async getCartById(cid) {
        return await this.carts.findById(cid).populate('products.product');
    }

    async createCart() {
        return await this.carts.create({ products: [] });
    }

    async addProduct(cid, pid) {
        const cart = await this.carts.findById(cid);
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

    async removeProduct(cid, pid) {
        const cart = await this.carts.findById(cid);
        if (!cart) throw new Error('Cart not found');

        cart.products = cart.products.filter(product => product.product.toString() !== pid);

        await cart.save();
        return cart;
    }

    async clearCart(cid) {
        const cart = await this.carts.findById(cid);
        if (!cart) throw new Error('Cart not found');

        cart.products = [];

        await cart.save();
        return cart;
    }

    async updateCart(cid, products) {
        const cart = await this.carts.findByIdAndUpdate(cid, { products }, { new: true }).populate('products.product');
        if (!cart) throw new Error('Cart not found');

        return cart;
    }

    async updateProductQuantity(cid, pid, quantity) {
        const cart = await this.carts.findById(cid);
        if (!cart) throw new Error('Cart not found');

        const productIndex = cart.products.findIndex(product => product.product.toString() === pid);

        if (productIndex === -1) {
            throw new Error('Product not found in cart');
        } else {
            cart.products[productIndex].quantity = quantity;
        }

        await cart.save();
        return cart;
    }
}

export default CartsManagerDB;