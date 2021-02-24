const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const { product, phone, address } = ctx.request.body;
  const { user } = ctx;
  const productObj = await Product.findById(product);

  if (!user) {
    ctx.throw(401, 'Необходимо авторизоваться.');
  }

  const order = await Order.create({
    user,
    product,
    phone,
    address,
  });

  await sendMail({
    template: 'order-confirmation',
    to: user.email,
    subject: 'Подтвердите почту',
    locals: {id: product, product: { productObj }},
  });
  
  ctx.body = { order: order._id };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const { user } = ctx;

  if (!user) {
    ctx.throw(401, 'Необходимо авторизоваться.');
  }
  const orders = await Order.find({user: user._id})
  ctx.body = { orders };
};
