const router = require('express').Router();
const CategoryController = require('../controller/category.controller');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

router.get('/getAllCategories', CategoryController.getAllCategories);
router.get('/getCategory/:categoryId', CategoryController.getCategoryById);

//Website Admin
router.get('/categories',authMiddleware, CategoryController.getAllCategories);
router.get('/categories/:categoryId',authMiddleware, CategoryController.getCategoryById);
router.post('/createCategory', authMiddleware, CategoryController.createCategory);
router.put('/updateCategory/:categoryId', authMiddleware, CategoryController.updateCategoryById);
router.post('/bulkDeleteCategories', authMiddleware, CategoryController.bulkDeleteCategories);
router.delete('/deleteCategory/:categoryId', authMiddleware, CategoryController.deleteCategoryById);

module.exports = router;