const GroupService = require('../services/group.service')

require('dotenv').config();

exports.create = async (req, res, next) => {
    try {
        const { name} = req.body;
        const group = await GroupService.create( name);
        res.status(200).json({ status: true, success: "Group created successfully", group });
    } catch (error) {
        next(error);
    }
}

exports.update = async (req, res, next) => {
    try {
        const { name } = req.body;
        const { groupId } = req.params;
        const group = await GroupService.update(groupId, name);
        res.status(200).json({ status: true, success: "Group updated successfully", group });
    } catch (error) {
        next(error);
    }
}

exports.readAll = async (req, res, next) => {
    try {
        const group = await GroupService.readAll();
        res.status(200).json({ group });
    } catch (error) {
        next(error);
    }
}

exports.read = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const group = await GroupService.read(groupId);
        res.status(200).json({ status: true, group });
    } catch (error) {
        next(error);
    }
}

exports.delete = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const group = await GroupService.delete(groupId);
        res.status(200).json({ status: true, success: "Group deleted successfully", group });
    } catch (error) {
        next(error);
    }
}