import { Router } from "express";
import productsController from "../controllers/products.controller.js";
const router = Router();
const { getProducts, createProduct, updateProduct, deleteProduct } = new productsController();


router.get('/', getProducts);

router.post('/', createProduct);

router.put('/:pid', updateProduct);

router.delete('/:pid', deleteProduct);

export default router;