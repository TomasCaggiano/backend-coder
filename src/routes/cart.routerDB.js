import { Router } from 'express';
import CartsManagerDB from '../dao/mognoDB/cartManagerDB.js';
const router = Router();
const cartService = new CartsManagerDB();

router.get('/', async(req, res) => {
    try {
        const carts = await cartService.getCarts();
        res.send(carts);
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.post('/', async(req, res) => {
    try {
        const cart = await cartService.createCart();
        res.status(201).send(cart);
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.post('/:cid/products/:pid', async(req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await cartService.addProduct(cid, pid);
        res.send(cart);
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

export default router;