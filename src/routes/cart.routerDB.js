import { Router } from 'express'
import CartsManagerDB from '../dao/mognoDB/cartManagerDB.js'


const router = Router()
const cartService = new CartsManagerDB()

router.get('/', async(req, res) => {
    const carts = await cartService.getCarts()
    res.send(carts)
})
router.post('/', async(req, res) => {
    const carts = await cartService.createCart()
    res.send(carts)
})
router.post('/:cid/products/:pid', async(req, res) => {
    const { cid, pid } = req.params

    const result = await cartService.addProduct(cid, pid)
    res.send(result)
})

export default router