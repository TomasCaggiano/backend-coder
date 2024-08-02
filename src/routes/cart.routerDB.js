import { Router } from 'express';
import CartController from '../controllers/carts.controller.js';

const router = Router();

router.get('/', CartController.getAllCarts);
router.get('/:cid', CartController.getCartById);
router.post('/', CartController.createCart);
router.post('/:cid/products/:pid', CartController.addProductToCart);
router.delete('/:cid/products/:pid', CartController.removeProductFromCart);
router.delete('/:cid', CartController.clearCart);
router.put('/:cid', CartController.updateCart);
router.put('/:cid/products/:pid', CartController.updateProductQuantity);

export default router;