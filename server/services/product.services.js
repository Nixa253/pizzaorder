const ProductModel = require('../model/product.model')
const ToppingModel = require('../model/topping.model');

class ProductService {
    static async getAllProduct() {
        try {
            return await ProductModel.find()
        } catch (error) {
            throw error.message;
        }
    }
    static async getNewestProduct() {
        var today = new Date();
        var fiveDaysAgo = new Date(today);
        fiveDaysAgo.setDate(today.getDate() - 5);

        console.log('Five days ago:', fiveDaysAgo);
        console.log('Today:', today);

        try {
            return await ProductModel.find().where('dateadded').gte(fiveDaysAgo)
                .lte(today);
        } catch (error) {
            throw error.message;
        }
    }

    static async getProductByCategory(categoryId) {
        try {
            const products = await ProductModel.find({ categoryId: categoryId });
            return products;
        } catch (error) {
            throw error.message;
        }
    }

    static async getProductById(id) {
        try {
            const products = await ProductModel.findById(id).exec();
            return products;
        } catch (error) {
            throw error.message;
        }
    }
    static async createProduct(productData) {
        try {
            const product = new ProductModel(productData);
            return await product.save();
        } catch (error) {
            throw error.message;
        }
    }

    static async updateProductById(productId, productData) {
        try {
            return await ProductModel.findByIdAndUpdate(productId, productData, { new: true });
        } catch (error) {
            throw error.message;
        }
    }

    static async bulkDeleteProducts(ids) {
        try {
            const result = await ProductModel.deleteMany({ _id: { $in: ids } });
            return result;
        } catch (error) {
            throw error.message;
        }
    }

    static async deleteProductById(productId) {
        try {
            return await ProductModel.findByIdAndDelete(productId);
        } catch (error) {
            throw error.message;
        }
    }

    static async getProducts() {
        try {
            return await ProductModel.find().populate('category').populate('defaultToppings');
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProductService;