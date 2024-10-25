const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const axios = require('axios'); 
const UserService = require('../services/user.services');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async (req, res, next) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub: googleId, name, email } = ticket.getPayload();

    let user = await UserService.checkUserEmail(email);
    let randomPassword;
    if (!user) {
      // Tạo mật khẩu ngẫu nhiên
      randomPassword = crypto.randomBytes(8).toString('hex');
      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await UserService.createUser({
        username: email,
        password: hashedPassword, 
        nameProfile: name || 'default_name',
        number: 'default_number',
        address: 'default_address',
        email: email,
        groupId: '66e3a2e0be2552e93df06aa9',
        googleId: googleId
      });
    } else {
      // Cập nhật googleId nếu chưa có
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    }

    let tokenData = { 
      _id: user._id, 
      username: user.username, 
      nameProfile: user.nameProfile, 
      address: user.address, 
      groupId: user.groupId 
    };

    const jwtToken = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Loại bỏ mật khẩu từ đối tượng user trước khi trả về phản hồi
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({ 
      status: 200, 
      token: jwtToken, 
      user: userWithoutPassword,
      randomPassword // Gửi mật khẩu ngẫu nhiên cho người dùng (chỉ để minh họa, không nên gửi mật khẩu qua API)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.facebookAuth = async (req, res, next) => {
  const { accessToken } = req.body;
  try {
    if (!accessToken) {
      return res.status(400).json({ message: 'Access token is missing' });
    }

    const response = await axios.get(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`);
    const { id: facebookId, name, email } = response.data;

    let user = await UserService.checkUserEmail(email);
    let randomPassword;
    if (!user) {
      // Tạo mật khẩu ngẫu nhiên
      randomPassword = crypto.randomBytes(8).toString('hex');
      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await UserService.createUser({
        username: email,
        password: hashedPassword, 
        nameProfile: name || 'default_name',
        number: 'default_number',
        address: 'default_address',
        email: email,
        groupId: '66e3a2e0be2552e93df06aa9',
        facebookId: facebookId
      });
    } else {
      // Cập nhật facebookId nếu chưa có
      if (!user.facebookId) {
        user.facebookId = facebookId;
        await user.save();
      }
    }

    const tokenData = { 
      _id: user._id, 
      username: user.username, 
      nameProfile: user.nameProfile, 
      address: user.address, 
      groupId: user.groupId 
    };

    const jwtToken = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Loại bỏ mật khẩu từ đối tượng user trước khi trả về phản hồi
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json({ token: jwtToken, user: userWithoutPassword, randomPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};