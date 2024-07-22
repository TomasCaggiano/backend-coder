import { Router } from 'express';
import ProductManager from '../../archivos.js';
import { __dirname } from '../../utils.js';

const router = Router();
const manager = new ProductManager();

router.get('/', async(req, res) => {
    const products = await manager.getProducts();
    res.render('home', {
        nombre: 'carlitos',
        username: 'mengueche',
        products,
        style: 'home.css'
    });
});

router.get('/realTimeProducts', async(req, res) => {
    const products = await manager.getProducts();
    res.render('realTimeProducts', {
        products,
    });
});

router.get('/chat', (req, res) => {
    res.render('chat', {
        style: '/chat.css'
    });
});

export const setupSocketIO = (socketServer) => {
    socketServer.on('connection', async(socket) => {
        console.log('Client connected', socket.id);

        // Emit initial products
        socket.on('getInitialProducts', async() => {
            const products = await manager.getProducts();
            socket.emit('updateProducts', products);
        });

        // Handle adding a new product
        socket.on('addProduct', async(product) => {
            await manager.addProduct(product);
            const products = await manager.getProducts();
            socketServer.emit('updateProducts', products);
        });

        // Handle chat messages
        let mensajes = [];
        socket.on('mensaje', (data) => {
            console.log('message data', data);
            mensajes.push(data);
            socketServer.emit('mensajeLogs', mensajes);
        });
    });
};

export default router;