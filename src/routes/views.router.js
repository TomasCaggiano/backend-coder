import { Router } from 'express';
import ProductManager from '../dao/mognoDB/productsManagerDB.js';
import CartManager from '../dao/mognoDB/cartManagerDB.js';
import ChatManager from '../dao/mognoDB/chatManager.js';
import { uploader } from '../multer.js';
import auth from '../middlewares/auth.middleware.js'
const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();
const chatManager = new ChatManager();


router.get('/login', (req, res) => {
    res.render('login')
})
router.get('/register', (req, res) => {
    res.render('register')
})


router.get('/', async(req, res) => {
    try {
        const products = await productManager.getProductsPaginated();
        res.render('home', {
            nombre: 'carlitos',
            username: 'mengueche',
            products,
            style: 'home.css'
        });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

// Ruta para productos en tiempo real
router.get('/realTimeProducts', uploader.single('myFile'), async(req, res) => {
    try {
        const products = await productManager.getProductsPaginated();
        res.render('realTimeProducts', {
            products,
        });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

// Ruta para el chat
router.get('/chat', (req, res) => {
    res.render('chat', {
        style: '/chat.css'
    });
});

// Ruta para visualizar todos los productos con paginación
router.get('/products', auth, async(req, res) => {
    try {
        const { limit = 10, page = 1, sort = '', query = '' } = req.query;
        const filter = query ? { title: new RegExp(query, 'i') } : {};
        const products = await productManager.getProductsPaginated({ filter, limit, page, sort });
        const totalProducts = await productManager.getTotalProductsCount(filter);
        const totalPages = Math.ceil(totalProducts / limit);
        res.render('products', {
            products,
            currentPage: parseInt(page, 10),
            totalPages,
            style: 'products.css'
        });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

// Ruta para visualizar los detalles de un producto
router.get('/products/:pid', async(req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).send({ status: 'error', error: 'Product not found' });
        }
        res.render('productDetail', {
            product,
            style: 'productDetail.css'
        });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

// Ruta para visualizar un carrito específico
router.get('/carts/:cid', async(req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid).populate('products.product');
        if (!cart) {
            return res.status(404).send({ status: 'error', error: 'Cart not found' });
        }
        res.render('cart', {
            cart,
            style: 'cart.css'
        });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});
















// Configuración de Socket.IO
export const setupSocketIO = (socketServer) => {
    socketServer.on('connection', async(socket) => {
        console.log('Client connected', socket.id);

        // Emitir mensajes iniciales
        socket.on('getInitialMessages', async() => {
            const messages = await chatManager.getMessages();
            socket.emit('mensajeLogs', messages);
        });

        // Manejar nuevos mensajes de chat
        socket.on('mensaje', async(data) => {
            console.log('message data', data);
            await chatManager.addMessage(data.user, data.message);
            const messages = await chatManager.getMessages();
            socketServer.emit('mensajeLogs', messages);
        });
    });
};

export default router;