const ToppingModel = require('../model/topping.model');

class ToppingService {
    static async getAllToppings() {
        try {
            return await ToppingModel.find();
        } catch (error) {
            throw error.message;
        }
    }

    static async getToppingById(id) {
        try {
            const topping = await ToppingModel.findById(id).exec();
            return topping;
        } catch (error) {
            throw error.message;
        }
    }

    static async getToppingCategories() {
        try {
            return await ToppingModel.distinct('category');
        } catch (error) {
            throw error.message;
        }
    }

    static async createTopping(toppingData) {
        try {
            const topping = new ToppingModel(toppingData);
            return await topping.save();
        } catch (error) {
            throw error.message;
        }
    }

    static async updateToppingById(toppingId, toppingData) {
        try {
            return await ToppingModel.findByIdAndUpdate(toppingId, toppingData, { new: true });
        } catch (error) {
            throw error.message;
        }
    }

    static async bulkDeleteToppings(ids) {
        try {
            const result = await ToppingModel.deleteMany({ _id: { $in: ids } });
            return result;
        } catch (error) {
            throw error.message;
        }
    }

    static async deleteToppingById(toppingId) {
        try {
            return await ToppingModel.findByIdAndDelete(toppingId);
        } catch (error) {
            throw error.message;
        }
    }
}

module.exports = ToppingService;