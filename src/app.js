import express from 'express';
import productsRouter from './routes/products.routerFS.js';
import cartRouter from './routes/cart.routerFS.js';
import { __dirname, uploader } from './multer.js';
import handlebars from 'express-handlebars';
import viewsRouter, { setupSocketIO } from './routes/views.router.js';
import usersRouter from './routes/users.routerDB.js'
import { Server } from 'socket.io';
import productsRouterDB from './routes/products.routerDB.js'
import CartsRouterDB from './routes/cart.routerDB.js'

import mongoose from 'mongoose';

const app = express();
const PORT = 8080;

// Create HTTP server
const httpServer = app.listen(PORT, () => {
    console.log(`Listening at port 8080`);
});

//coneccion mongo    localhost=127.0.0.1
//mongoose.connect('mongodb://127.0.0.1:27017/backcoder')

mongoose.connect('mongodb+srv://tomas:nagualpete777@cluster0.qmf3jac.mongodb.net/ecommerce?retryWrites=true&w=majority')
console.log('base de datos conectada')


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
app.use(express.static(__dirname + '/public'));


app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');



// Use routers
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/productsDB', productsRouterDB);
app.use('/api/carts', cartRouter);
app.use('/api/cartsDB', CartsRouterDB);
app.use('/api/users', usersRouter);

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




//mongodb+srv://tomas:<password>@cluster0.qmf3jac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0