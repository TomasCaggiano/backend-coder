import ProductsManager from "../Productsmanagerdb.js"
const productsManager = new ProductsManager();

import { Router } from "express"
const router = Router();

router.get("/", async(req, res) => {
    let products;
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        if (limit && (!Number.isInteger(limit) || limit <= 0)) {
            return res.status(400).json({
                error: 'El parámetro "limit" debe ser un número entero positivo',
            });
        }

        if (limit !== undefined) {
            products = await productsManager.getProducts(limit);
        } else {
            products = await productsManager.getProducts();
        }
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

router.get("/:pid", async(req, res) => {
    const { pid } = req.params;
    try {
        const producto = await productsManager.getProductById(pid);
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ error: `Producto con ID ${pid} no encontrado` });
        }
    } catch (error) {
        console.log(error);
        res
            .status(400)
            .json({ error: "Error al obtener el producto, pid no válido" });
    }
});

router.post("/", async(req, res) => {
    try {
        const nuevoProducto = req.body;
        const camposObligatorios = [
            "title",
            "description",
            "code",
            "price",
            "stock",
            "category",
        ];
        for (const campo of camposObligatorios) {
            if (!nuevoProducto[campo]) {
                return res
                    .status(400)
                    .json({ error: `El campo '${campo}' es obligatorio` });
            }
        }
        if (isNaN(nuevoProducto.price)) {
            return res
                .status(400)
                .json({ error: `El campo price debe ser numérico` });
        }

        if (isNaN(nuevoProducto.stock)) {
            return res
                .status(400)
                .json({ error: `El campo stock debe ser numérico` });
        }
        if (await productsManager.validaCode(nuevoProducto.code)) {
            console.log(
                `Error: El código del producto ${nuevoProducto.code} ya existe`
            );
            return res
                .status(400)
                .json({
                    error: `El código del producto ${nuevoProducto.code} ya existe`,
                });
        }
        if (!nuevoProducto.thumbnails) {
            nuevoProducto.thumbnails = [];
        } else if (typeof nuevoProducto.thumbnails === "string") {
            nuevoProducto.thumbnails = [nuevoProducto.thumbnails];
        } else if (!Array.isArray(nuevoProducto.thumbnails)) {
            return res.status(400).json({
                error: "El campo 'thumbnails' debe ser un string o un array de strings",
            });
        } else {
            const invalidThumbnails = nuevoProducto.thumbnails.filter(
                (thumbnail) => typeof thumbnail !== "string"
            );
            if (invalidThumbnails.length > 0) {
                return res.status(400).json({
                    error: "Algunos elementos de 'thumbnails' no son cadenas de texto válidas.",
                });
            }
        }
        if (typeof nuevoProducto.status !== "boolean") {
            nuevoProducto.status = true;
        }
        const lastProductId = await productsManager.addProduct(nuevoProducto);
        const stringLastID = lastProductId._id.toString()
        console.log("Se agregó el producto con id: ", stringLastID);
        req.io.emit("Server:addProduct", {...nuevoProducto, _id: stringLastID });


        res.status(201).json({ mensaje: "Producto agregado correctamente" });
    } catch (error) {
        let mensaje = error.errmsg;
        console.error("Error al agregar el producto:", mensaje);
        res.status(400).json({ error: "Error al agregar el producto", mensaje });
    }
});

router.put("/:pid", async(req, res) => {
    const pid = req.params.pid;
    const updatedFields = req.body;
    try {
        const updateable = await productsManager.validaId(pid);
        if (!updateable) {
            console.log("No existe un producto con id:", pid);
            return res
                .status(400)
                .json({ error: `No existe un producto con id: ${pid}` });
        }
        if (!!updatedFields.thumbnails) {

            if (typeof updatedFields.thumbnails === "string") {
                updatedFields.thumbnails = [updatedFields.thumbnails];
            } else if (!Array.isArray(updatedFields.thumbnails)) {
                console.log(
                    "El campo 'thumbnails' debe ser un string o un array de strings"
                );
                console.log("El campo 'thumbnails' no se actualizará");
                delete updatedFields.thumbnails;
            } else {
                const invalidThumbnails = updatedFields.thumbnails.filter(
                    (thumbnail) => typeof thumbnail !== "string"
                );
                if (invalidThumbnails.length > 0) {
                    console.log(
                        "Algunos elementos de 'thumbnails' no son cadenas de texto válidas."
                    );
                    console.log("El campo 'thumbnails' no se actualizará");
                    delete updatedFields.thumbnails;
                }
            }
        }
        if (!!updatedFields.status && typeof updatedFields.status !== "boolean") {
            updatedFields.status = true;
        }
        if (!!updatedFields.price && isNaN(updatedFields.price)) {
            console.log("El valor del campo price debe ser numérico");
            console.log("El campo 'price' no se actualizará");
            delete updatedFields.price;
        }

        if (!!updatedFields.stock && isNaN(updatedFields.stock)) {
            console.log("El valor del campo stock debe ser numérico");
            console.log("El campo 'stock' no se actualizará");
            delete updatedFields.stock;
        }
        let product = await productsManager.getProductById(pid);
        const docKeys = Object.keys(product._doc);
        let updatedProduct = {}
        for (const key in updatedFields) {
            if (
                Object.hasOwnProperty.call(updatedFields, key) &&
                key != "_id" &&
                docKeys.includes(key)
            ) {
                updatedProduct[key] = updatedFields[key];
            } else {
                console.log(
                    `La propiedad '${key}' no es una propiedad válida y no se actualizará.`
                );
            }
        }

        await productsManager.updateProduct(pid, updatedProduct);
        product = await productsManager.getProductById(pid)
        req.io.emit("Server:productUpdate", product);
        res
            .status(200)
            .json({ mensaje: `Producto con ID ${pid} actualizado correctamente` });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});

router.delete("/:pid", async(req, res) => {
    try {
        const pid = req.params.pid;
        const existeId = await productsManager.validaId(pid);
        if (!existeId) {
            console.log("No existe un producto con id:", pid);
            return res
                .status(400)
                .json({ error: `No existe un producto con id: ${pid}` });
        }

        await productsManager.deleteProduct(pid);

        console.log("Se eliminó el producto con id:", pid);

        let products = await productsManager.getProducts();
        req.io.emit("Server:loadProducts", products);
        res
            .status(200)
            .json({ mensaje: `Producto con ID ${pid} eliminado correctamente` });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

module.exports = {
    router,
};