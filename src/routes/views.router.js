import { Router } from 'express';
import MainController from '../controllers/main.controller.js';
import { middlewares } from '../middlewares/auth.middleware.js';
import { uploader } from '../multer.js';
import ChatManager from '../dao/mognoDB/chatManager.js';

const chatManager = new ChatManager();

const router = Router();

router.get('/login', MainController.login);
router.get('/register', MainController.register);

router.get('/realTimeProducts', uploader.single('myFile'), MainController.realTimeProducts);
router.get('/chat', MainController.chat);

router.get('/products', middlewares.auth, MainController.products);
router.get('/products/:pid', MainController.productDetail);
router.get('/carts/:cid', MainController.cart);

export default router;
export const setupSocketIO = (socketServer) => {
    socketServer.on('connection', async(socket) => {
        console.log('Client connected', socket.id);

        socket.on('getInitialMessages', async() => {
            const messages = await chatManager.getMessages();
            socket.emit('mensajeLogs', messages);
        });

        socket.on('mensaje', async(data) => {
            console.log('message data', data);
            await chatManager.addMessage(data.user, data.message);
            const messages = await chatManager.getMessages();
            socketServer.emit('mensajeLogs', messages);
        });
    });
};