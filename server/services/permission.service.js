const PermissionModel = require('../model/permissions');

class PermissionService {
    static async create( controller, action) {
        try {
            const createPermission = new PermissionModel({ controller, action });
            return await createPermission.save();
        } catch (error) {
            throw error.message;
        }
    }
}

module.exports = PermissionService;