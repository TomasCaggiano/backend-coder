import ProductManager from '../dao/mognoDB/productsManagerDB.js';
import CartManager from '../dao/mognoDB/cartManagerDB.js';
import ChatManager from '../dao/mognoDB/chatManager.js';
import { uploader } from '../multer.js';

const productManager = new ProductManager();
const cartManager = new CartManager();
const chatManager = new ChatManager();

class MainController {
    static login = (req, res) => {
        res.render('login');
    }

    static register = (req, res) => {
        res.render('register');
    }

    static realTimeProducts = async(req, res) => {
        try {
            const products = await productManager.getProducts();
            res.render('realTimeProducts', { products });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    }

    static chat = (req, res) => {
        res.render('chat', { style: '/chat.css' });
    }

    static products = async(req, res) => {
        try {
            const { limit = 10, numPage = 1, sort = '', query = '' } = req.query;
            const filter = query ? { title: new RegExp(query, 'i') } : {};

            const products = await productManager.getProducts({ filter, limit, numPage, sort });
            const totalProducts = await productManager.getTotalProductsCount(filter);
            const totalPages = Math.ceil(totalProducts / limit);

            res.render('products', {
                products,
                currentPage: parseInt(numPage, 10),
                totalPages,
                style: 'products.css'
            });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
            console.log(error);
        }
    }

    static productDetail = async(req, res) => {
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
    }

    static cart = async(req, res) => {
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
    }
}

export default MainController;