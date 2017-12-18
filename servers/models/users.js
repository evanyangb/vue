const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
   "userId":String,
   "userName":String,
   "userPwd":String,
   "orderList":Array,
   "cartList":[
       {
           "productId":String,
           "productName":String,
           "salePrice":Number,
           "checked":String,
           "productNum":Number,
           "productImage":String
       }
   ],
   "addressList":Array
});

module.exports = mongoose.model('User',userSchema);