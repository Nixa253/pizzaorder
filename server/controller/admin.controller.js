const AdminService = require('../services/admin.services')
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const { token } = await AdminService.login(email, password);
      res.json({ token });
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

exports.protected = async (req, res) => {
    res.send('This is a protected route');
  };
  

