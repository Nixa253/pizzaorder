const router = require('express').Router();
const ProductController = require('../controller/product.controller');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');
const mongoose = require('mongoose');

router.get('/getAllProduct', ProductController.getAllProduct);
router.get('/getNewestProduct', ProductController.getNewestProduct);
router.get('/getProduct/:categoryId', ProductController.getProductByCategory);
router.get('/product/:id', ProductController.getProductById);

// Website Admin
router.get('/getProducts', authMiddleware, checkPermission('ProductController', 'read'), ProductController.getProducts);
router.post('/createProduct', authMiddleware, checkPermission('ProductController', 'create'), ProductController.createProduct);
router.put('/updateProduct/:id', authMiddleware, checkPermission('ProductController', 'update'), ProductController.updateProductById);
router.post('/bulkDeleteProducts', authMiddleware, checkPermission('ProductController', 'delete'), ProductController.bulkDeleteProducts);
router.delete('/deleteProduct/:id', authMiddleware, checkPermission('ProductController', 'delete'), ProductController.deleteProductById);

module.exports = router;