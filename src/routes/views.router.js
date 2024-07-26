import { Router } from 'express';
import ProductManager from '../dao/mognoDB/productsManagerDB.js';
import ChatManager from '../dao/mognoDB/chatManager.js';
import { uploader } from '../multer.js';

const router = Router();
const productManager = new ProductManager();
const chatManager = new ChatManager();

router.get('/', async(req, res) => {
    const products = await productManager.getProducts();
    res.render('home', {
        nombre: 'carlitos',
        username: 'mengueche',
        products,
        style: 'home.css'
    });
});

router.get('/realTimeProducts', uploader.single('myFile'), async(req, res) => {
    const products = await productManager.getProducts();
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

        // Emit initial messages
        socket.on('getInitialMessages', async() => {
            const messages = await chatManager.getMessages();
            socket.emit('mensajeLogs', messages);
        });

        // Handle new chat messages
        socket.on('mensaje', async(data) => {
            console.log('message data', data);
            await chatManager.addMessage(data.user, data.message);
            const messages = await chatManager.getMessages();
            socketServer.emit('mensajeLogs', messages);
        });
    });
};

export default router;