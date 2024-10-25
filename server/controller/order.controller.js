const OrderService = require('../services/order.service');
require('dotenv').config();

exports.addOrder = async (req, res, next) => {
    try {
        const { iduser, listorder, price, dateadded } = req.body;
        const order = await OrderService.addOrder(iduser, listorder, price, dateadded);
        res.status(200).json({ status: true, success: "Add order success", order });
    } catch (error) {
        next(error);
    }
};

exports.getOrderByUserId = async (req, res, next) => {
    try {
        const { iduser } = req.params;
        const orders = await OrderService.getOrderByUserId(iduser);
        if (!orders) {
            throw new Error('No orders found for this user');
        }
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

exports.createOrder = async (req, res, next) => {
    try {
        const orderData = req.body;
        
        // Validate orderData
        if (!orderData.iduser || !orderData.listorder || !orderData.price) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Add dateadded if not provided
        if (!orderData.dateadded) {
            orderData.dateadded = new Date();
        }

        const newOrder = await OrderService.createOrder(orderData);
        res.status(201).json({
            status: true,
            message: "Order created successfully",
            order: newOrder
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
};

exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await OrderService.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await OrderService.getOrderById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

exports.updateOrderById = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const updateData = req.body;
        const updatedOrder = await OrderService.updateOrderById(orderId, updateData);
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        next(error);
    }
};

exports.deleteOrderById = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const deletedOrder = await OrderService.deleteOrderById(orderId);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.bulkDeleteOrders = async (req, res, next) => {
    try {
        const { orderIds } = req.body;
        const result = await OrderService.bulkDeleteOrders(orderIds);
        res.status(200).json({ message: `${result.deletedCount} orders deleted successfully` });
    } catch (error) {
        next(error);
    }
};

