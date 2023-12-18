// 路由模块

const express = require('express');
const read = require('./read');

// 调用路由方法，获取路由对象
var router = express.Router();

// 设置get/post请求的监听
//客户端发起的请求事件
router
    // 请求首页数据
    .get('/', read.getAll)
    // 请求查询员工信息数据
    .get('/getone', read.getOne)
    // 请求打开修改员工信息界面   
    .get('/update_get', read.update_get)
    // 请求删除员工信息数据
    .get('/delone', read.delOne)
    // 请求打开添加员工数据界面
    .get('/adduser_get', read.adduser_get)
    // 请求打开查询员工信息界面
    .get('/find_get', read.getFind)
    // 请求打开删除员工信息界面
    .get('/del_get', read.delUser)
    //提交修改员工信息的数据
    .post('/update_post', read.update_post)
    //提交添加员工信息的数据
    .post('/adduser_post', read.adduser_post)
    //提交所查询员工的信息
    .post('/find_post', read.postFind)
    //提交所需要删除员工的信息
    .post('/del_post', read.delUser_post)
    
    //打开管理员注册界面
    .get('/reguser_get', read.reguser_get)
    //注册新管理员用户
    .post('/reguser_post', read.reguser_post)
    //打开管理员登录界面
    .get('/login_get', read.login_get)
    //登录管理员系统
    .post('/login_post', read.login_post)
     //打开员工注册界面
    .get('/reguser2_get', read.reguser2_get)
    //注册新员工用户
    .post('/reguser2_post', read.reguser2_post)
 //打开员工登录界面
 .get('/login2_get', read.login2_get)
 //登录员工系统
 .post('/login2_post', read.login2_post)
  //打开登录界面
  .get('/first_get', read.first_get)
  
//打开商品信息界面
 .get('/commodity_get', read.commodity_get)

 // 请求打开修改商品信息界面   
 .get('/updatecommodity_get', read.updatecommodity_get)
 // 请求删除商品信息数据
 .get('/delOnecommodity', read.delOnecommodity)
 // 请求打开添加商品数据界面
 .get('/addcommodity_get', read.addcommodity_get)
 // 请求打开删除商品信息界面
 .get('/delcommodity_get', read.delUser)
 //提交修改商品信息的数据
 .post('/updatecommodity_post', read.updatecommodity_post)
 //提交添加商品信息的数据
 .post('/addcommodity_post', read.addcommodity_post)
 //提交所需要删除商品的信息
 .post('/delcommodity_post', read.delcommodity_post)


//11.28 剩一个删除的后端还没修改

//打开商品信息界面
.get('/demo_get', read.demo_get)




// 导出路由
module.exports = router;