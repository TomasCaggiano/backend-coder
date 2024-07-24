import ProductsManager from '../../mongoDB/productsManagerDB.js';

const productsManager = new ProductsManager();


const { Router } = require("express");
const router = Router();

const userAdmin = {
    username: "tomas",
    nombre: "tomas ",
    apellido: "Rcaggiano",
    role: "admin",
};
const userUser = {
    username: "Gago",
    nombre: "Ruben",
    apellido: "Roldan",
    role: "user",
};


router.get("/", async(req, res) => {
    try {
        const user = userUser;
        const products = await productsManager.getProducts();
        if (products.length > 0) {
            formatearProductos(products);
        }
        res.render("home", {
            username: user.username,
            nombre: user.nombre,
            apellido: user.apellido,
            admin: user.role === "admin",
            title: "compunentes",
            products,
            styles: "homeStyles.css",
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

router.get("/realtimeproducts", async(req, res) => {
    try {
        const user = userAdmin;
        const products = await productsManager.getProducts();

        if (products.length > 0) {
            formatearProductos(products);

            req.io.on("connection", (socket) => {
                req.io.emit("Server:loadProducts", products);
            });

            res.render("realTimeProducts", {
                username: user.username,
                nombre: user.nombre,
                apellido: user.apellido,
                admin: user.role === "admin",
                title: "Edit compunentes",
                products,
                styles: "homeStyles.css",
            });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

router.get("/chat", async(req, res) => {
    res.render("chat", {
        title: "Chat compunentes",
        styles: "chat.css",
    });
});

module.exports = {
    router,
};