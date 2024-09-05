const router = require('express').Router();
const CategoryController = require('../controller/category.controller');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/getAllCategories', CategoryController.getAllCategories);
router.get('/getCategory/:categoryId', CategoryController.getCategoryById);
router.get('/listCategories', authMiddleware, CategoryController.listCategories);

module.exports = router;