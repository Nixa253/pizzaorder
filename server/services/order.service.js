const OrderModel = require('../model/order.model')

class OrderService {
    static async addOrder(iduser, listorder, price, dateadded) {
        try {
            const createOrder = new OrderModel({ iduser, listorder, price, dateadded });
            return await createOrder.save();
        } catch (error) {
            throw error.message;
        }
    }

    static async getOrderByUserId(iduser) {
        try {
            return await OrderModel.find({ iduser });
        } catch (error) {
            throw error.message;
        }
    }

    static async getAllOrders() {
        try {
            return await OrderModel.find();
        } catch (error) {
            throw error.message;
        }
    }

    static async createOrder(orderData) {
        try {
            const newOrder = new OrderModel(orderData);
            return await newOrder.save();
        } catch (error) {
            throw error;
        }
    }

    static async getOrderById(orderId) {
        try {
            return await OrderModel.findById(orderId);
        } catch (error) {
            throw error.message;
        }
    }

    static async updateOrderById(orderId, updateData) {
        try {
            return await OrderModel.findByIdAndUpdate(orderId, updateData, { new: true });
        } catch (error) {
            throw error.message;
        }
    }

    static async deleteOrderById(orderId) {
        try {
            return await OrderModel.findByIdAndDelete(orderId);
        } catch (error) {
            throw error.message;
        }
    }

    static async bulkDeleteOrders(orderIds) {
        try {
            return await OrderModel.deleteMany({ _id: { $in: orderIds } });
        } catch (error) {
            throw error.message;
        }
    }
}

module.exports = OrderService;