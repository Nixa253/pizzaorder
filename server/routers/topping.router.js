const router = require('express').Router();
const ToppingController = require('../controller/topping.controller');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

router.get('/getAllToppings', ToppingController.getAllToppings);
router.get('/topping/:id', ToppingController.getToppingById);
router.get('/topping/categories', ToppingController.getToppingCategories);

// Website Admin
router.post('/createTopping', authMiddleware, checkPermission('ToppingController', 'create'), ToppingController.createTopping);
router.put('/updateTopping/:id', authMiddleware, checkPermission('ToppingController', 'update'), ToppingController.updateToppingById);
router.post('/bulkDeleteToppings', authMiddleware, checkPermission('ToppingController', 'delete'), ToppingController.bulkDeleteToppings);
router.delete('/deleteTopping/:id', authMiddleware, checkPermission('ToppingController', 'delete'), ToppingController.deleteToppingById);

module.exports = router;