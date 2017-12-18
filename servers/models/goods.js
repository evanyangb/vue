const mongoose = require('mongoose');
const produtSchema = new mongoose.Schema({
   "productId":{type:String},
   "productName":String,
   "salePrice":Number,
   "checked":String,
   "productNum":Number,
   "productImage":String
});

module.exports = mongoose.model('Good',produtSchema);