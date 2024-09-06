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
    
    static async update(groupId, name) {
        try {
            const updatedGroup = await GroupModel.findByIdAndUpdate(groupId, { name }, { new: true });
            return updatedGroup;
        } catch (error) {
            throw error.message;
        }
    }

    static async readAll() {
        try {
            const group = await GroupModel.find();
            return group;
        } catch (error) {
            throw error.message;
        }
    }
    
    static async read(groupId) {
        try {
            const group = await GroupModel.findById(groupId);
            return group;
        } catch (error) {
            throw error.message;
        }
    }

    static async delete(groupId) {
        try {
            const deletedGroup = await GroupModel.findByIdAndDelete(groupId);
            return deletedGroup;
        } catch (error) {
            throw error.message;
        }
    }
}

module.exports = GroupService;
