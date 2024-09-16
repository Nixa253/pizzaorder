const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');

const productRouter = require('./routers/product.router');
const userRouter = require('./routers/user.router');
const orderRouter = require('./routers/order.router');
const searchRouter = require('./routers/search.router');
const paymentRouter = require('./routers/payment.router');
const couponRouter = require('./routers/coupon.router');
const categoryRouter = require('./routers/category.router');
const groupRouter = require('./routers/group.router');
const permissionRouter = require('./routers/permission.router');
const groupPermissionRouter = require('./routers/groupPermission.router');

const app = express();

// Sử dụng CORS middleware
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Sử dụng body-parser middleware
app.use(body_parser.json());

// Định nghĩa các route
app.use('/', userRouter);
app.use('/', productRouter);
app.use('/', orderRouter);
app.use('/', searchRouter);
app.use('/', paymentRouter);
app.use('/', couponRouter);
app.use('/', categoryRouter);
app.use('/', groupRouter);
app.use('/', permissionRouter);
app.use('/', groupPermissionRouter);

module.exports = app;
