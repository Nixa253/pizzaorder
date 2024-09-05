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