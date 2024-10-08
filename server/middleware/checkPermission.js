const GroupPermission = require('../model/groupPermission'); 
const UserModel = require('../model/user.model');

const checkPermission = ( controller, action, requiredGroupNames) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user._id) {
                return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
            }

            const userId = req.user._id;
            const user = await UserModel.findById(userId).populate('groupId'); 

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!user.groupId || !user.groupId._id) {
                return res.status(400).json({ message: 'User does not belong to any group' });
            }

             // Check if the user's groupId matches the special groupId that has full permissions
             const specialGroupId = '66d94d28c11c24619def8cd7';
             if (user.groupId._id.toString() === specialGroupId) {
                 return next(); // Grant full access without further checks
             }  

            // Kiểm tra groupId.name
            if (requiredGroupNames && !requiredGroupNames.some(name => user.groupId.name.includes(name))) {
                return res.status(403).json({ message: `Access denied: User's group does not match any of ${requiredGroupNames.join(', ')}` });
            }

            const groupId = user.groupId._id; 

            // Tìm tất cả các bản ghi trong GroupPermission dựa trên groupId
            const permissions = await GroupPermission.find({ groupId: groupId });

            if (!permissions || permissions.length === 0) {
                return res.status(403).json({ message: 'Access denied: No permissions found for this group' });
            }

            // Kiểm tra xem có quyền phù hợp với controller và action hay không
            const hasPermission = permissions.some(permission => 
                permission.controller === controller && permission.action === action
            );

            if (!hasPermission) {
                return res.status(403).json({ message: 'Access denied: You do not have the required permissions' });
            }

            next(); // Cho phép truy cập nếu có quyền
        } catch (error) {
            next(error); 
        }
    };
};

module.exports = checkPermission;