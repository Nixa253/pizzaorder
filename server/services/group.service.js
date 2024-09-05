const GroupModel = require('../model/group'); 

class GroupService {
    static async checkGroup(groupId) {
        try {
            const group = await GroupModel.findById(groupId);
            return !!group; // Trả về true nếu nhóm tồn tại, ngược lại là false
        } catch (error) {
            throw error;
        }
    }

    static async create( name) {
        try {
            const createGroup = new GroupModel({  name });
            return await createGroup.save();
        } catch (error) {
            throw error.message;
        }
    }
}

module.exports = GroupService;
