import CartsManagerDB from '../dao/mognoDB/cartManagerDB.js';

const cartService = new CartsManagerDB();

class CartController {
    static getAllCarts = async(req, res) => {
        try {
            const carts = await cartService.getCarts();
            res.send(carts);
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    }

    static getCartById = async(req, res) => {
        const { cid } = req.params;
        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) {
                return res.status(404).send({ status: 'error', error: 'Cart not found' });
            }
            res.send(cart);
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    }

    static createCart = async(req, res) => {
        try {
            const cart = await cartService.createCart();
            res.status(201).send(cart);
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    }

    static addProductToCart = async(req, res) => {
        const { cid, pid } = req.params;
        try {
            const cart = await cartService.addProduct(cid, pid);
            res.send(cart);
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    }

    static removeProductFromCart = async(req, res) => {
        const { cid, pid } = req.params;
        try {
            const cart = await cartService.removeProduct(cid, pid);
            res.send(cart);
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    }

    static clearCart = async(req, res) => {
        const { cid } = req.params;
        try {
            const cart = await cartService.clearCart(cid);
            res.send(cart);
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    }

    static updateCart = async(req, res) => {
        const { cid } = req.params;
        const { products } = req.body;
        try {
            const cart = await cartService.updateCart(cid, products);
            res.send(cart);
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    }

    static updateProductQuantity = async(req, res) => {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        try {
            const cart = await cartService.updateProductQuantity(cid, pid, quantity);
            res.send(cart);
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    }
}

export default CartController;