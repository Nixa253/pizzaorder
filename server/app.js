const express = require('express');
const body_parser = require('body-parser')
const productRouter = require('./routers/product.router')
const userRouter = require('./routers/user.router')
const adminRouter = require('./routers/admin.router')
const orderRouter = require('./routers/order.router');
const searchRouter = require('./routers/search.router');
const paymentRouter = require('./routers/payment.router');
const couponRouter = require('./routers/coupon.router');
const categoryRouter = require('./routers/category.router');
const mongoose = require('mongoose');
const app = express();

app.use(body_parser.json());
app.use('/', userRouter);
app.use('/', adminRouter);
app.use('/', productRouter);
app.use('/', orderRouter);
app.use('/', searchRouter);
app.use('/', paymentRouter);
app.use('/', couponRouter);
app.use('/', categoryRouter);

module.exports = app;