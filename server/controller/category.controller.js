const CategoryService = require('../services/category.services');
require('dotenv').config();

exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await CategoryService.getAllCategories();
        if (!categories) {
            throw new Error('Categories not found');
        }
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

exports.getCategoryById = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await CategoryService.getCategoryById(categoryId);
        if (!category) {
            throw new Error('Category not found');
        }
        res.json(category);
    } catch (error) {
        next(error);
    }
};

// -----ADMIN-----
exports.createCategory = async (req, res, next) => {
    try {
        const categoryData = req.body;
        const category = await CategoryService.createCategory(categoryData);
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};

exports.updateCategoryById = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;
        const categoryData = req.body;
        const updatedCategory = await CategoryService.updateCategoryById(categoryId, categoryData);
        if (!updatedCategory) {
            throw new Error('Category not found');
        }
        res.json(updatedCategory);
    } catch (error) {
        next(error);
    }
};

exports.bulkDeleteCategories = async (req, res, next) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Invalid input: ids should be a non-empty array' });
        }
        const result = await CategoryService.bulkDeleteCategories(ids);
        res.status(200).json({ message: 'Categories deleted successfully', deletedCount: result.deletedCount });
    } catch (error) {
        next(error);
    }
};

exports.deleteCategoryById = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;
        await CategoryService.deleteCategoryById(categoryId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};