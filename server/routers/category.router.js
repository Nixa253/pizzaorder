const router = require('express').Router();
const CategoryController = require('../controller/category.controller');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

router.get('/getAllCategories', CategoryController.getAllCategories);
router.get('/getCategory/:categoryId', CategoryController.getCategoryById);

//Website Admin
router.get('/getCategories',authMiddleware, checkPermission('CategoryController', 'read'), CategoryController.getCategories);
//router.get('/getCategories', CategoryController.getCategories);
//router.get('/categories', CategoryController.getAllCategories);
router.get('/categories',authMiddleware, checkPermission('CategoryController', 'read'), CategoryController.getAllCategories);
router.get('/categories/:categoryId',authMiddleware, checkPermission('CategoryController', 'read'), CategoryController.getCategoryById);
router.post('/createCategory', authMiddleware, checkPermission('CategoryController', 'create'), CategoryController.createCategory);
// router.post('/createCategory', CategoryController.createCategory);
router.put('/updateCategory/:categoryId', authMiddleware, checkPermission('CategoryController', 'update'), CategoryController.updateCategoryById);
router.post('/bulkDeleteCategories', authMiddleware, checkPermission('CategoryController', 'delete'), CategoryController.bulkDeleteCategories);
router.delete('/deleteCategory/:categoryId', authMiddleware, checkPermission('CategoryController', 'delete'), CategoryController.deleteCategoryById);

module.exports = router;