import { Router } from "express";
import pruebasRouter from './pruebas.router.js'
import productsRouterDB from './products.routerDB.js'
import CartsRouterDB from './cart.routerDB.js'
import viewsRouter, { setupSocketIO } from './views.router.js';
import usersRouter from './users.routerDB.js'
import productsRouter from './products.routerFS.js';
import cartRouter from './cart.routerFS.js';
import sessionsRouter from "./sessions.router.js";
import { uploader } from "../multer.js";
const router = Router()

// Use routers
router.use('/', viewsRouter);
router.use('/api/products', productsRouter);
router.use('/api/productsDB', productsRouterDB);
router.use('/api/carts', cartRouter);
router.use('/api/cartsDB', CartsRouterDB);
router.use('/api/users', usersRouter);
router.use('/pruebas', pruebasRouter);
router.use('/api/sessions', sessionsRouter)

// Handle file upload
router.use('/subir-archivo', uploader.single('file'), (req, res) => {
    if (!req.file) {
        return res.send('Upload failed');
    } else {
        return res.send('Upload succeeded');
    }
});

export default router