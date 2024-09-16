const PermissionModel = require('../model/permissions');

class PermissionService {
    static async create(controller, action) {
        try {
            const createPermission = new PermissionModel({ controller, action });
            return await createPermission.save();
        } catch (error) {
            throw error.message;
        }
    }

    static async update(permissionId, controller, action) {
        try {
            const updatedPermission = await PermissionModel.findByIdAndUpdate(permissionId, { controller, action }, { new: true });
            return updatedPermission;
        } catch (error) {
            throw error.message;
        }
    }

    static async readAll() {
        try {
            const permissions = await PermissionModel.find();
            return permissions;
        } catch (error) {
            throw error.message;
        }
    }

    static async read(permissionId) {
        try {
            const permission = await PermissionModel.findById(permissionId);
            return permission;
        } catch (error) {
            throw error.message;
        }
    }

    static async delete(permissionId) {
        try {
            const deletedPermission = await PermissionModel.findByIdAndDelete(permissionId);
            return deletedPermission;
        } catch (error) {
            throw error.message;
        }
    }
}

module.exports = PermissionService;