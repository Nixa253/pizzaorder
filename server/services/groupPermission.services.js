const GroupPermissionModel = require('../model/groupPermission');

class GroupPermissionService {
    static async getByGroupId(groupId) {
        try {
            const groupPermissions = await GroupPermissionModel.find({ groupId });
            return groupPermissions;
        } catch (error) {
            throw error.message;
        }
    }
    
    static async create(groupId, permissionId, controller, action) {
        try {
            const createGroupPermission = new GroupPermissionModel({ groupId, permissionId, controller, action });
            return await createGroupPermission.save();
        } catch (error) {
            throw error.message;
        }
    }

    static async delete(groupPermissionId) {
        try {
            const deletedGroupPermission = await GroupPermissionModel.findByIdAndDelete(groupPermissionId);
            return deletedGroupPermission;
        } catch (error) {
            throw error.message;
        }
    }
}

module.exports = GroupPermissionService;