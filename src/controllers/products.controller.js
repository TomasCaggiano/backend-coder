import ProductManagerDB from "../dao/mognoDB/productsManagerDB.js";
import { Router } from "express";
const productManager = new ProductManagerDB();

const router = Router()

class productsController {
    constructor() {}
    getProducts = async(req, res) => {
        const { limit = 10, numPage = 1, sort = 1, category = '' } = req.query;

        try {
            const products = await productManager.get({ limit, page: numPage, category, sort });
            res.send(products);
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };
    createProduct = async(req, res) => {
        const { title, price, code, stock, thumbnail } = req.body;
        if (!title || !price || !code || !stock || !thumbnail) {
            return res.status(400).send({ status: 'error', error: 'Missing fields' });
        }

        try {
            const newProduct = { title, price, code, stock, thumbnail };
            const result = await productManager.create(newProduct);
            res.status(201).send({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    }
    updateProduct = async(req, res) => {
        const { pid } = req.params;
        const { title, price, code, stock, thumbnail } = req.body;

        try {
            const updatedProduct = { title, price, code, stock, thumbnail };
            const result = await productManager.update(pid, updatedProduct);
            if (!result) return res.status(404).send({ status: 'error', error: 'Product not found' });
            res.send({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    }
    deleteProduct = async(req, res) => {
        const { pid } = req.params;

        try {
            const result = await productManager.remove(pid);
            if (!result) return res.status(404).send({ status: 'error', error: 'Product not found' });
            res.send({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    }
}

export default productsController