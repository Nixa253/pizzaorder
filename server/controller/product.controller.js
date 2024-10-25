const ProductService = require('../services/product.services');
const mongoose = require('mongoose');
require('dotenv').config();

exports.getAllProduct = async (req, res, next) => {
    try {
        const listProduct = await ProductService.getAllProduct();
        if (!listProduct) {
            throw new Error('Product not found');
        }
        res.json(listProduct);
    } catch (error) {
        next(error);
    }
};

exports.getProductByCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;
        const products = await ProductService.getProductByCategory(categoryId);
        if (!products || products.length === 0) {
            throw new Error('No products found for this category');
        }
        res.json(products);
    } catch (error) {
        next(error);
    }
};

exports.getNewestProduct = async (req, res, next) => {
    try {
        const listProduct = await ProductService.getNewestProduct();
        if (!listProduct || listProduct.length === 0) {
            return res.status(404).json({ message: 'Product newest not found' });
        }
        console.log(listProduct.length);
        res.json(listProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const id = req.params.id; // Make sure your route uses 'id' as the parameter name
        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        
        const product = await ProductService.getProductById(id); // Assuming ProductService handles fetching

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        next(error);
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const productData = {
            ...req.body,
            _id: new mongoose.Types.ObjectId(),
            dateadded: new Date()
        };
        const product = await ProductService.createProduct(productData);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

exports.updateProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedProduct = await ProductService.updateProductById(id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (error) {
        next(error);
    }
};

exports.bulkDeleteProducts = async (req, res, next) => {
    try {
        const { ids } = req.body;
        const result = await ProductService.bulkDeleteProducts(ids);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.deleteProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedProduct = await ProductService.deleteProductById(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
      const products = await ProductService.getProducts();
      res.json(products);
    } catch (error) {
      next(error);
    }
  };



