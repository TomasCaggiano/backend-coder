import { Router } from 'express';
import ProductManager from '../dao/fIleSystem/archivos.js';
import { __dirname, uploader } from '../multer.js';

const router = Router();
const manager = new ProductManager();

router.get('/', async(req, res) => {
    // const product = await productMangagerMongo.getPRoducts()
    res.render('index', { products })
})


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