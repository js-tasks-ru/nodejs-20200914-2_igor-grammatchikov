const Product = require('../models/Product');
const mongoose = require('mongoose');

const mapping = (obj) => ({
  id: obj._id,
  title: obj.title,
  images: obj.images,
  category: obj.category,
  subcategory: obj.subcategory,
  price: obj.price,
  description: obj.description,
});

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  ctx.searchParams = {};
  if (!ctx.request.query.subcategory) {
    return next();
  }
  ctx.searchParams.subcategory = ctx.request.query.subcategory;
  return next();
};

module.exports.productList = async function productList(ctx, next) {
  const product = await Product.find(ctx.searchParams);
  if (product) {
    ctx.body = {products: product.map(mapping)};
  } else {
    ctx.body = [];
  }
};

module.exports.productById = async function productById(ctx, next) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
    ctx.status = 400;
    return;
  }

  const product = await Product.findById(ctx.params.id);

  if (product) {
    ctx.body = {product: mapping(product)};
  } else {
    ctx.status = 404;
  }
};

