const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Goods = require('../models/goods');
const Users = require('../models/users');

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall');

mongoose.connection.on('connected',function(){
   console.log('MongoDB connected success.');
});

mongoose.connection.on('error',function(){
   console.log('MongoDB connected fail.')
});

mongoose.connection.on('disconnected',function(){
   console.log('MongoDB connected disconnected.')
});

//查询商品列表数据
exports.goodsList = (req,res,next) =>{
    let page = parseInt(req.param("page"));//页码
    let pageSize = parseInt(req.param('pageSize'));//页数
    let startPrice = req.param('startPrice');
    let endPrice = req.param('endPrice');
    let sort = req.param("sort") || 1;//升降序
    let skip = (page - 1) * pageSize;//跳过的数量
    let params = {};
    if(startPrice !== 'all' && endPrice !== 'all'){
       params = {
          salePrice:{
             $gt:startPrice,
             $lte:endPrice
          }
       }
    }
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
    goodsModel.sort({'salePrice':sort});
    goodsModel.exec(function(err,doc){
        if(err){
            res.json({
                status:'0',
                msg:err.message
            })
        }else{
            res.json({
                status:'1',
                msg:'',
                result:{
                    count:doc.length,
                    list:doc
                }
            })
        }
    })
};

//加入购物车
exports.goodsAddCart = (req,res) =>{
   let userId = '100000077';//用户id
   let productId = req.body.productId;//商品id
   //查找人员信息
   Users.findOne({userId:userId},(userErr,userDoc) =>{
      if(userErr){
         res.json({
             status:'0',
             msg:userErr.message
         })
      }else{
         //查找商品信息
         Goods.findOne({productId:productId},(productErr,productDoc) =>{
            if(productErr){
               res.json({
                   status:'0',
                   msg:productErr.message
               })
            }else{
               if(productDoc){
                   let goodsItem = false;
                   userDoc.cartList.forEach((item)=>{
                      if(item.productId === productId){
                         item.productNum ++;
                         goodsItem = true;
                      }
                   });
                   if(goodsItem){//已经存在
                      userDoc.save((saveErr) =>{
                         if(saveErr){
                            res.json({
                                status:'0',
                                msg:saveErr.message
                            })
                         }else{
                            res.json({
                                status:'1',
                                msg:'',
                                result:'success'
                            })
                         }
                      })
                   }else{
                       productDoc.productNum = 1;
                       productDoc.checked = 1;
                       userDoc.cartList.push(productDoc);
                       userDoc.save((saveErr,saveDoc) =>{
                           if(saveErr){
                               res.json({
                                   status:'0',
                                   msg:saveErr.message
                               })
                           }else{
                               res.json({
                                   status:'1',
                                   msg:'',
                                   result:'success'
                               })
                           }
                       })
                   }
               }
            }
         })
      }
   })
};
