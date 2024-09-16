const GroupPermissionService = require('../services/groupPermission.services');

exports.getByGroupId = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const groupPermissions = await GroupPermissionService.getByGroupId(groupId);
        res.status(200).json({ groupPermissions });
    } catch (error) {
        next(error);
    }
}

exports.create = async (req, res, next) => {
    try {
        const { groupId, permissionId, controller, action } = req.body;
        const groupPermission = await GroupPermissionService.create(groupId, permissionId, controller, action);
        res.status(200).json({  success: "GroupPermission created successfully", groupPermission });
    } catch (error) {
        next(error);
    }
}

exports.delete = async (req, res, next) => {
    try {
        const { groupPermissionId } = req.params;
        const groupPermission = await GroupPermissionService.delete(groupPermissionId);
        res.status(200).json({ status: true, success: "GroupPermission deleted successfully", groupPermission });
    } catch (error) {
        next(error);
    }
}