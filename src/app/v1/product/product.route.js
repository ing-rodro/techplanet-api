import express from 'express';
import fileUpload from 'express-fileupload';
import {
  createProduct,
  updateProduct,
  getAllProducts,
  getCategories,
  getProductByCategory,
  getProductDetails,
  filterProducts,
  searchProducts
} from './product.controller';
import { TokenValidation } from 'Utils/authentication';

const router = express.Router();

router.get('/get-products', getAllProducts);
router.post(
  '/upload-product',
  TokenValidation,
  fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads',
  }),
  createProduct,
);
router.put(
  '/:idProduct',
  fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads',
  }),
  updateProduct,
);
router.get("/get-categories", getCategories)
router.post("/products-by-category",getProductByCategory)
router.post("/get-details", getProductDetails)
router.post("/filter-products", filterProducts)
router.get("/search-products", searchProducts)

export default router;
