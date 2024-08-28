const AdminModel = require('../model/admin');
const jwt = require('jsonwebtoken');

class AdminService {
    static async login(email, password) {
        try {
          // Kiểm tra xem admin có tồn tại không
          const admin = await AdminModel.findOne({ email });
          if (!admin) {
            throw new Error('admin not found');
          }
      
          // Kiểm tra mật khẩu
          const isMatch = await bcrypt.compare(password, admin.password);
          if (!isMatch) {
            throw new Error('Invalid password');
          }
      
          // Lấy danh sách nhóm và quyền của admin
          const adminGroups = await adminGroup.find({ admin_id: admin._id }).populate('gr_id');
          const groupPermissions = await GroupPermission.find({ gr_id: { $in: adminGroups.map(ug => ug.gr_id) } }).populate('pe_id');
      
          const permissions = groupPermissions.map(gp => ({
            gr_id: gp.gr_id._id,
            pe_id: gp.pe_id._id,
            controller: gp.pe_id.controller,
            action: gp.pe_id.action
          }));
      
          // Sinh JWT và lưu thông tin vào token
          const token = jwt.sign({
            adminId: admin._id,
            permissions
          }, SECRET_KEY, { expiresIn: '1h' });
      
          return { token };
      
        } catch (error) {
          throw error;
        }
      }}

module.exports = AdminService;