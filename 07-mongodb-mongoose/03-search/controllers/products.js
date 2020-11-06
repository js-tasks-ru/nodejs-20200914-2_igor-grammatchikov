const Product = require('../models/Product');

const mapping = (obj) => ({
  id: obj._id,
  title: obj.title,
  images: obj.images,
  category: obj.category,
  subcategory: obj.subcategory,
  price: obj.price,
  description: obj.description,
});

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const product = await Product.find({$text: {$search: ctx.query.query}});
  if (product) {
    ctx.body = {products: product.map(mapping)};
  } else {
    ctx.body = [];
  }
};
