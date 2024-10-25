const UserModel = require('../model/user.model')
const jwt = require('jsonwebtoken');


class UserService {
    static async registerUser(username, password, nameProfile, number, address, email, groupId) {
        try {
            const createUser = new UserModel({ username, password, nameProfile, number, address, email, groupId });
            return await createUser.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }
    static async checkUser(username) {
        try {
            return await UserModel.findOne({ username })
        } catch (error) {
            throw error;
        }
    }
    static async checkUserEmail(email) {
        try {
            return await UserModel.findOne({ email })
        } catch (error) {
            throw error;
        }
    }
    static async generateToken(tokenData, secretKey, jwt_expire) {
        return jwt.sign(tokenData, secretKey, { expiresIn: jwt_expire });
    }

    static async updateUserAddress(iduser, newAddress) {
        try {
            const updatedUser = await UserModel.findOneAndUpdate(
                { _id: iduser },
                { $set: { address: newAddress } },
                { new: true, runValidators: true, omitUndefined: true }
            );

            if (!updatedUser) {
                throw new Error('User not found');
            }

            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    static async updateUser(userId, userData) {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                { $set: userData },
                { new: true } // Trả về thông tin người dùng đã được cập nhật
            );
        } catch (error) {
            console.error('Error in updateUser service:', error);
            throw error;
        }
    }

    //Website Admin
    static async users() {
        try {
            return await UserModel.find()
        } catch (error) {
            throw error.message;
        }
    }

    static async getUserById(userId) {
        try {
            return await UserModel.findById(userId).select('-password');
        } catch (error) {
            throw error;
        }
    }
   
    static async createUser(userData) {
        try {
            const newUser = new UserModel(userData);
            return await newUser.save();
        } catch (error) {
            throw error;
        }
    }

    static async updateUserById(userId, updateData) {
        try {
            if (updateData.password) {
                updateData.password = await bcrypt.hash(updateData.password, 10);
            }
            return await UserModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
        } catch (error) {
            throw error;
        }
    }

    static async deleteUserById(userId) {
        try {
            return await UserModel.findByIdAndDelete(userId);
        } catch (error) {
            throw error;
        }
    }

    static async bulkDeleteUsers(userIds) {
        try {
            return await UserModel.deleteMany({ _id: { $in: userIds } });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserService;