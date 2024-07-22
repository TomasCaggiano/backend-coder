import express from 'express';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import { __dirname, uploader } from '../utils.js';
import handlebars from 'express-handlebars';
import viewsRouter, { setupSocketIO } from './routes/views.router.js';
import { Server } from 'socket.io';

const app = express();
const PORT = process.env.PORT || 8000;

// Create HTTP server
const httpServer = app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
});

// Initialize Socket.IO
const socketServer = new Server(httpServer);

// Apply socket middleware
const socketMiddleware = (socketServer) => (req, res, next) => {
    req.socketServer = socketServer;
    next();
};

app.use(socketMiddleware(socketServer));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/src/public'));

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}));

app.set('views', __dirname + '/src/views');
app.set('view engine', 'hbs');

// Use routers
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);

// Handle file upload
app.use('/subir-archivo', uploader.single('file'), (req, res) => {
    if (!req.file) {
        return res.send('Upload failed');
    } else {
        return res.send('Upload succeeded');
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send('Error 500');
});

// Set up Socket.IO connections using the setup function from views.router.js
setupSocketIO(socketServer);