import { Router } from "express";
import ProductManagerDB from "../dao/mognoDB/productsManagerDB.js";
const router = Router();
const productManager = new ProductManagerDB();

router.get('/', async(req, res) => {
    const { limit = 10, numPage = 1, sort = '', ...filter } = req.query;

    try {
        const products = await productManager.getProducts({
            filter,
            limit,
            numPage,
            sort
        });
        res.send(products);
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.post('/', async(req, res) => {
    const { title, price, code, stock, thumbnail } = req.body;
    if (!title || !price || !code || !stock || !thumbnail) {
        return res.status(400).send({ status: 'error', error: 'Missing fields' });
    }

    try {
        const newProduct = { title, price, code, stock, thumbnail };
        const result = await productManager.createProduct(newProduct);
        res.status(201).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.put('/:pid', async(req, res) => {
    const { pid } = req.params;
    const { title, price, code, stock, thumbnail } = req.body;

    try {
        const updatedProduct = { title, price, code, stock, thumbnail };
        const result = await productManager.updateProduct(pid, updatedProduct);
        if (!result) return res.status(404).send({ status: 'error', error: 'Product not found' });
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });

    }
});

router.delete('/:pid', async(req, res) => {
    const { pid } = req.params;

    try {
        const result = await productManager.deleteProduct(pid);
        if (!result) return res.status(404).send({ status: 'error', error: 'Product not found' });
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

export default router;