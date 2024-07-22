import express from 'express';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js'
import { __dirname, uploader } from '../utils.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.router.js'
import { Server } from 'socket.io';
import ProductManager from '../archivos.js';

const manager = new ProductManager
const app = express();

const PORT = process.env.PORT || 8000


const httpServer = app.listen(PORT, () => {
    console.log('Listening at port ');
});

const socketServer = new Server(httpServer)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/src/public'))

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}))

app.set('views', __dirname + '/src/views')
app.set('view engine', 'hbs')

app.use('/', viewsRouter)

app.use('/api/products', productsRouter)

app.use('/api/carts', cartRouter)

app.use('/subir-archivo', uploader.single('file'), (req, res) => {
    if (!req.file) {
        return res.send('not possible')
    } else {
        return res.send('upload succeded')
    }
})


app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).send('error 500')
})







let mensajes = []


socketServer.on('connection', socket => {
    console.log('client connected', socket.id);

    (async() => {
        const products = await manager.getProducts()
        socket.emit('updateProducts', products)
    })
    socket.on('addProduct', async(product) => {
        await manager.addProduct(product);
        const products = await manager.getProducts();
        socketServer.emit('updateProducts', products)
    })


    //chat

    socket.on('mensaje', data => {
        console.log('message data ', data)

        mensajes.push(data)

        socketServer.emit('mensajeLogs', mensajes)
    })
})