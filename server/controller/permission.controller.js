const PermissionService = require('../services/permission.service');

require('dotenv').config();

exports.create = async (req, res, next) => {
    try {
        const {  controller, action } = req.body;
        const permission = await PermissionService.create( controller, action);
        res.status(200).json({ status: true, success: "Permission created successfully", permission });
    } catch (error) {
        next(error);
    }
}

exports.update = async (req, res, next) => {
    try {
        const { controller, action } = req.body;
        const { permissionId } = req.params;
        const permission = await PermissionService.update(permissionId, controller, action);
        res.status(200).json({ status: true, success: "Permission updated successfully", permission });
    } catch (error) {
        next(error);
    }
}

exports.readAll = async (req, res, next) => {
    try {
        const permissions = await PermissionService.readAll();
        res.status(200).json({ status: true, permissions });
    } catch (error) {
        next(error);
    }
}

exports.read = async (req, res, next) => {
    try {
        const { permissionId } = req.params;
        const permission = await PermissionService.read(permissionId);
        res.status(200).json({ status: true, permission });
    } catch (error) {
        next(error);
    }
}

exports.delete = async (req, res, next) => {
    try {
        const { permissionId } = req.params;
        const permission = await PermissionService.delete(permissionId);
        res.status(200).json({ status: true, success: "Permission deleted successfully", permission });
    } catch (error) {
        next(error);
    }
}