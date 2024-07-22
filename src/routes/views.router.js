import { Router } from "express";
import ProductManager from "../../archivos.js";
import { __dirname } from "../../utils.js";
const router = Router()

const manager = new ProductManager

const products = await manager.getProducts()

router.get('/', (req, res) => {
    res.render('home', {
        nombre: 'carlitos',
        username: 'mengueche',
        products,
        style: 'home.css'
    })
})

router.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', {
        products,
    })
})

router.get('/chat', (req, res) => {
    res.render('chat', {
        style: '/chat.css'
    })
})


export default router