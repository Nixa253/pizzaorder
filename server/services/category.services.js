const CategoryModel = require('../model/category.model');

class CategoryService {
    static async getAllCategories() {
        try {
            return await CategoryModel.find();
        } catch (error) {
            throw error.message;
        }
    }

    static async getCategoryById(categoryId) {
        try {
            const category = await CategoryModel.findById(categoryId);
            return category;
        } catch (error) {
            throw error.message;
        }
    }

    // -----ADMIN-----
    static async createCategory(categoryData) {
        try {
            const category = new CategoryModel(categoryData);
            return await category.save();
        } catch (error) {
            throw error.message;
        }
    }

    static async updateCategoryById(categoryId, categoryData) {
        try {
            return await CategoryModel.findByIdAndUpdate(categoryId, categoryData, { new: true });
        } catch (error) {
            throw error.message;
        }
    }

    static async bulkDeleteCategories(ids) {
        try {
            const result = await CategoryModel.deleteMany({ _id: { $in: ids } });
            return result;
        } catch (error) {
            throw error.message;
        }
    }

    static async deleteCategoryById(categoryId) {
        try {
            return await CategoryModel.findByIdAndDelete(categoryId);
        } catch (error) {
            throw error.message;
        }
    }

}

module.exports = CategoryService;