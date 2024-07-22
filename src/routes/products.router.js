import { Router } from "express";
import ProductManager from '../../archivos.js';

const router = Router()

const products = new ProductManager();


router.get('/', async(req, res) => {
    try {
        // Obtén el parámetro 'limit' de la consulta (query)
        const { limit } = req.query;

        // Obtén todos los productos
        const productsList = await products.getProducts();

        // Verifica si el parámetro 'limit' es un número válido
        if (limit && !isNaN(limit)) {
            const parsedLimit = parseInt(limit, 10); // Convierte el límite a un número entero
            // Limita la lista de productos si el parámetro 'limit' es válido
            const limitedProductsList = productsList.slice(0, parsedLimit);
            return res.send(limitedProductsList);
        }

        // Si no hay límite o no es válido, devuelve todos los productos
        res.send(productsList);
    } catch (error) {
        // Manejo de errores
        res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
});

router.post('/', async(req, res) => {
    const productData = req.body;

    if (!productData || Object.keys(productData).length === 0) {
        return res.status(400).send({ status: 'error', message: 'Faltan campos' });
    }

    try {
        const newProduct = await products.addProduct(productData);
        res.send({ status: 'success', payload: newProduct });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
});

router.put('/:pid', async(req, res) => {
    const { pid } = req.params;
    const productToUpdate = req.body;

    try {
        await products.updateProduct(parseInt(pid), productToUpdate);
        res.send({ status: 'success', payload: productToUpdate });
    } catch (error) {
        res.status(404).send({ status: 'error', message: 'Product not found' });
    }
});


router.delete('/:pid', async(req, res) => {
    const { pid } = req.params;

    try {
        await products.deleteProduct(parseInt(pid));
        res.send({ status: 'success', message: 'Product deleted' });
    } catch (error) {
        res.status(404).send({ status: 'error', message: 'Product not found' });
    }
});



router.get('/:pid', async(req, res) => {
    const { pid } = req.params;

    try {
        const product = await products.getProductById(parseInt(pid));
        if (!product) {
            return res.status(404).send({ status: 'error', message: 'Product not found' });
        }
        res.send(product);
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
});

export default router