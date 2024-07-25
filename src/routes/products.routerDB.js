import { Router } from "express";
import { productsModel } from "../models/products.models.js";

const router = Router()

router.get('/', async(req, res) => {
    const products = await productsModel.find({})
    res.send(products)
})

router.post('/', async(req, res) => {
    const { tiitle, price, code, stock, thumbnail } = req.body
    if (!tiitle, !price, !code, !stock, !thumbnail) return res.send({ status: 'error', error: 'faltan campos' })

    const newProduct = {
        tiitle,
        price,
        code,
        stock,
        thumbnail
    }

    const result = await productsModel.create(newProduct)
    res.status(200).send({ status: 'success', payload: result })
})

router.put('/:pid', async(req, res) => {
    const { pid } = req.params;
    const { title, price, code, stock, thumbnail } = req.body;

    const result = await productsModel.findByIdAndUpdate({ _id: pid }, { title, price, code, stock, thumbnail })

    res.send({ status: 'succes', payload: result })
})


router.delete('/:uid', async(req, res) => {
    const { uid } = req.params

    const result = await productsModel.deleteOne({ _id: uid })
})

export default router;