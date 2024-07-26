import { Router } from 'express';
import ProductManager from '../dao/mognoDB/productsManagerDB.js';
import ChatManager from '../dao/mognoDB/chatManager.js';
import { __dirname, uploader } from '../multer.js';

const router = Router();
const productManager = new ProductManager();
const chatManager = new ChatManager();

// Ruta para la página de inicio
router.get('/', async(req, res) => {
    const products = await productManager.getProducts();
    res.render('home', {
        nombre: 'carlitos',
        username: 'mengueche',
        products,
        style: 'home.css'
    });
});

// Ruta para productos en tiempo real
router.get('/realTimeProducts', uploader.single('myFile'), async(req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', {
        products,
    });
});

// Ruta para el chat
router.get('/chat', (req, res) => {
    res.render('chat', {
        style: '/chat.css'
    });
});

// Configuración de Socket.IO
export const setupSocketIO = (socketServer) => {
    socketServer.on('connection', (socket) => {
        console.log('Client connected', socket.id);

        // Emitir productos iniciales
        socket.on('getInitialProducts', async() => {
            const products = await productManager.getProducts();
            socket.emit('updateProducts', products);
        });

        // Manejar la adición de nuevos productos
        socket.on('addProduct', async(product) => {
            await productManager.addProduct(product);
            const products = await productManager.getProducts();
            socketServer.emit('updateProducts', products);
        });

        // Manejar los mensajes del chat
        socket.on('mensaje', async(data) => {
            console.log('message data', data);
            // Guardar el mensaje en MongoDB
            await chatManager.addMessage(data.user, data.message);
            // Obtener todos los mensajes y emitirlos a los clientes
            const messages = await chatManager.getMessages();
            socketServer.emit('mensajeLogs', messages);
        });
    });
};

export default router;