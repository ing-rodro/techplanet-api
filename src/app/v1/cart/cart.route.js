import express from 'express';
import {
  addToCartController,
  countCartProducts,
  deleteCartProduct,
  getCartProducts,
  updateCartProduct,
} from './cart.controller';

import { TokenValidation } from 'Utils/authentication';

const router = express.Router();

router.post('/add-cart', TokenValidation, addToCartController);
router.get('/count-add', TokenValidation, countCartProducts);
router.get('/cart-products', TokenValidation, getCartProducts);
router.put('/update-cart-product', TokenValidation, updateCartProduct);
router.delete('/delete-cart-product', TokenValidation, deleteCartProduct);

export default router;
