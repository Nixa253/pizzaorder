const ToppingService = require('../services/topping.services');
const mongoose = require('mongoose');
require('dotenv').config();

exports.getAllToppings = async (req, res, next) => {
    try {
        const listTopping = await ToppingService.getAllToppings();
        if (!listTopping) {
            throw new Error('Topping not found');
        }
        res.json(listTopping);
    } catch (error) {
        next(error);
    }
};

exports.getToppingById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: 'Topping ID is required' });
        }
        
        const topping = await ToppingService.getToppingById(id);

        if (!topping) {
            return res.status(404).json({ message: 'Topping not found' });
        }

        res.json(topping);
    } catch (error) {
        next(error);
    }
};

exports.getToppingCategories = async (req, res, next) => {
    try {
        const categories = await ToppingService.getToppingCategories();
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

exports.createTopping = async (req, res, next) => {
    try {
        const toppingData = {
            ...req.body,
            _id: new mongoose.Types.ObjectId()
        };
        const topping = await ToppingService.createTopping(toppingData);
        res.status(201).json(topping);
    } catch (error) {
        next(error);
    }
};

exports.updateToppingById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedTopping = await ToppingService.updateToppingById(id, req.body);
        if (!updatedTopping) {
            return res.status(404).json({ message: 'Topping not found' });
        }
        res.json(updatedTopping);
    } catch (error) {
        next(error);
    }
};

exports.bulkDeleteToppings = async (req, res, next) => {
    try {
        const { ids } = req.body;
        const result = await ToppingService.bulkDeleteToppings(ids);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.deleteToppingById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedTopping = await ToppingService.deleteToppingById(id);
        if (!deletedTopping) {
            return res.status(404).json({ message: 'Topping not found' });
        }
        res.json({ message: 'Topping deleted successfully' });
    } catch (error) {
        next(error);
    }
};