var express = require('express');
var router = express.Router();
var Users = require('../models/users');

//登录接口
exports.login = (req,res) =>{
    const param = {
        userName : req.body.userName,
        userPwd : req.body.userPwd
    };
    Users.findOne(param,(err,doc) =>{
        if(err){
            res.json({
                status:'0',
                msg:err.message
            })
        }else{
            if(doc){
                res.cookie("userId",doc.userId,{
                    path:'/',
                    maxAge:1000*60*60
                });
                res.cookie('userName',doc.userName,{
                    path:'/',
                    maxAge:1000*60*60
                });
                res.json({
                    status:'1',
                    msg:'',
                    result:{
                        userName:doc.userName
                    }
                })
            }else{
                res.json({
                    status:'0',
                    msg:'',
                    result:null
                })
            }
        }
    })
};

//登出接口
exports.logout = (req,res) =>{
   res.cookie('userId','',{
       path:'/',
       maxAge:-1
   });
   res.json({
       status:'1',
       msg:'',
       result:null
   })
};

//检测登录
exports.checkLogin = (req,res) =>{
    if(req.cookies.userId){
        res.json({
            status:'1',
            msg:'',
            result:req.cookies.userName || ''
        })
    }else{
        res.json({
            status:'0',
            msg:'未登录',
            result:null
        })
    }
};
