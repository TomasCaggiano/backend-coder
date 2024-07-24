import { Router } from "express";
import fs from 'fs';
import { __dirname } from "../multer.js";
import path from 'path'

const router = Router()


const cartsFilePath = path.join(__dirname, 'Carts.json');
let carts = [];



async function loadCarts() {
    try {
        const data = await fs.promises.readFile(cartsFilePath, 'utf-8');
        carts = JSON.parse(data);
    } catch (error) {
        console.log(error);
        carts = [];
    }
}

function idIncrementable() {
    return carts.length ? carts[carts.length - 1].id + 1 : 1;
}

async function saveCarts() {
    try {
        await fs.promises.writeFile(cartsFilePath, JSON.stringify(carts, null, 2))
    } catch (error) {
        console.log(error)
    }
}


router.post('/', async(req, res) => {
    await loadCarts();
    const newCart = {
        id: idIncrementable(),
        products: []
    };
    carts.push(newCart);
    await saveCarts();
    res.status(201).send(newCart)
})

loadCarts();

router.get('/:cid', async(req, res) => {
    const { cid } = req.params
    try {
        await loadCarts();
        const cart = carts.find((cart) => cart.id === parseInt(cid));
        if (!cart) return res.status(404).send({ status: 'error', message: 'Cart does not exist' });
        return res.status(200).send(cart);
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
})


router.post('/:cid/product/:pid', async(req, res) => {
    const { cid, pid } = req.params;

    try {
        await loadCarts();
        const cart = carts.find((cart) => cart.id === parseInt(cid));
        if (!cart) return res.status(404).send('cart not found');
        const product = cart.products.find((product) => product.product === parseInt(pid))
        if (product) return product.quantity += 1;
        cart.products.push({ product: pid, quantity: 1 });

        await saveCarts();
        return res.status(200).send(cart)
    } catch (error) {
        return res.status(500).send({ status: 'error', message: 'server internal error' })
    }
})
export default router;