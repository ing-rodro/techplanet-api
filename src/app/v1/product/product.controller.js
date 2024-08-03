import fs from 'fs-extra';
import productModel from './product.model';
import { deleteFile, uploadImages } from '../../../Utils/cloudFile';
import userModel from '../user/user.model';

export const getAllProducts = async (req, res) => {
  try {
    const allProduct = await productModel.find().sort({ createdAt: -1 });

    res.json({
      message: 'All Product',
      success: true,
      error: false,
      data: allProduct,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export const createProduct = async (req, res) => {
  const {
    productName,
    brandName,
    category,
    productImages,
    description,
    price,
    sellingPrice,
  } = req.body;
  const { userId } = req;

  const sessionUser = await userModel.findOne(userId);

  if (sessionUser?.role === 'admin') {
    if (productImages.lenght > 0) {
      return res.status(400).json({
        message: 'Not file uploaded',
      });
    }

    try {
      const result = await uploadImages(productImages, 'techplanet/products');

      const product = await productModel.create({
        productName,
        brandName,
        category,
        description,
        price,
        sellingPrice,
        productImages: result,
      });
      return res
        .status(201)
        .json({ data: product, error: false, success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Error creating product',
        error: true,
        success: false,
      });
    }
  } else {
    return res.status(401).json({
      message: 'No estas autorizado para realizar esa accion',
      error: true,
      success: false,
    });
  }
};

export const updateProduct = async (req, res) => {
  const { idProduct } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: 'All fields are required',
    });
  }

  if (!req.files?.image) {
    const data = await productModel.findOneAndUpdate(
      { _id: idProduct },
      {
        name,
      },
    );
    return res.status(200).json(data);
  }

  try {
    let image = {};
    const actualData = await productModel.findById(idProduct);
    await deleteFile(actualData.image.public_id);
    const result = await uploadOneFile(
      req.files.image.tempFilePath,
      'products',
    );
    image = {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };
    await fs.unlink(req.files.image.tempFilePath);
    const data = await productModel.findOneAndUpdate(
      { _id: idProduct },
      {
        name,
        image,
      },
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Error updating product',
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const productCategory = await productModel.distinct('category');

    const productByCategory = [];

    for (const category of productCategory) {
      const product = await productModel.findOne({ category });

      if (product) {
        productByCategory.push(product);
      }
    }

    res.json({
      data: productByCategory,
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export const getProductByCategory = async (req, res) => {
  try {
    const { category } = req?.body || req?.query;
    const product = await productModel.find({ category });

    res.json({
      data: product,
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await productModel.findById(productId);

    res.json({
      data: product,
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err?.message || err,
      error: true,
      success: false,
    });
  }
};

export const filterProducts = async (req, res) => {
  try {
    const categoryList = req?.body?.category || [];

    const product = await productModel.find({
      category: {
        $in: categoryList,
      },
    });

    res.json({
      data: product,
      message: 'product',
      error: false,
      success: true,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const query = req.query.q;

    const regex = new RegExp(query, 'i', 'g');

    const product = await productModel.find({
      $or: [
        {
          productName: regex,
        },
        {
          category: regex,
        },
      ],
    });

    res.json({
      data: product,
      message: 'Search Product list',
      error: false,
      success: true,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};
