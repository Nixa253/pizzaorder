const GroupService = require('../services/group.service')

require('dotenv').config();

exports.create = async (req, res, next) => {
    try {
        const { name} = req.body;
        const group = await GroupService.create( name);
        res.status(200).json({ status: true, success: "Group created successfully", group });
    } catch (error) {
        next(error);
    }
}