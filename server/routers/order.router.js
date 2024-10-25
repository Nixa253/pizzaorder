const router = require('express').Router();
const OrderController = require('../controller/order.controller');
const authenticateJWT = require('../middleware/authenticationJwt');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

router.post('/addorder', authenticateJWT, OrderController.addOrder);
router.get('/user_orders/:iduser', authenticateJWT, OrderController.getOrderByUserId);

// New admin routes
router.get('/orders', authMiddleware, checkPermission('OrderController', 'read'), OrderController.getAllOrders);
router.get('/orders/:orderId', authMiddleware, checkPermission('OrderController', 'read'), OrderController.getOrderById);
router.post('/createOrder', authMiddleware, checkPermission('OrderController', 'create'), OrderController.createOrder); 
router.put('/updateOrder/:orderId', authMiddleware, checkPermission('OrderController', 'update'), OrderController.updateOrderById);
router.delete('/deleteOrder/:orderId', authMiddleware, checkPermission('OrderController', 'delete'), OrderController.deleteOrderById);
router.post('/bulkDeleteOrders', authMiddleware, checkPermission('OrderController', 'delete'), OrderController.bulkDeleteOrders);

module.exports = router;