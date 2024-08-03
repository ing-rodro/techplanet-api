import express from 'express';
import productRoutes from './product/product.route';
import userRoutes from './user/user.route';
import cartRoutes from './cart/cart.route'

const router = express.Router();

router.use('/products', productRoutes);
router.use('/users', userRoutes);
router.use('/cart', cartRoutes)

export default router;
