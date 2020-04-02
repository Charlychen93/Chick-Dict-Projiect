const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()

//启动服务器的时候同时启动数据库
const db = require('./db/connect')

//post 数据的解析 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//静态资源路径
app.use('/public',express.static(path.join(__dirname,'./public')))

/*
  路由
  1、文件上传的路由
  2、食品操作路由
*/
let  uploadRouter = require('./router/uploadRouter')
let  dictRouter = require('./router/dictRouter')
let  userRouter = require("./router/userRouter")
let  hotRouter = require("./router/hotRouter")
//导出excel
let  xlsxRouter = require("./router/xlsx.js")
let  disRouter = require("./router/discussRouter")
app.use('/admin/dis',disRouter)
app.use('/admin',xlsxRouter) //需要加锁的
app.use('/admin/hot',hotRouter) //需要加锁的
app.use('/admin/dict',dictRouter) //需要加锁的
app.use('/admin/user',userRouter) //登录注册不需要加锁
app.use('/admin/upload',uploadRouter)
app.listen(3000,()=>{
  console.log(`/**
  *　　　　　　　 ┏┓　 ┏┓+ +
  *　　　　　　　┏┛┻━━━┛┻┓ + +
  *　　　　　　　┃　　　　　　┃ 　
  *　　　　　　　┃　　　━　　 ┃ ++ + + +
  *　　　　　　 ████━████  ┃+
  *　　　　　　　┃　　　　　　　┃ +
  *　　　　　　　┃　　　┻　　　┃
  *　　　　　　　┃　　　　　　┃ + +
  *　　　　　　　┗━┓　　　┏━┛
  *　　　　　　　　 ┃　　　┃　　　　　　　　　　　
  *　　　　　　　　 ┃　　　┃ + + + +
  *　　　　　　　　 ┃　　　┃　　　　Code is far away from bug with the animal protecting　　　　　　　
  *　　　　　　　　 ┃　　　┃ + 　　　　神兽保佑,代码无bug　　
  *　　　　　　　　 ┃　　　┃
  *　　　　　　　　 ┃　　　┃　　+　　　　　　　　　
  *　　　　　　　　 ┃　 　 ┗━━━┓ + +
  *　　　　　　　　 ┃ 　　　　   ┣┓
  *　　　　　　　　 ┃ 　　　　　 ┏┛
  *　　　　　　　　 ┗┓┓┏━┳┓┏┛ + + + +
  *　　　　　　　　  ┃┫┫ ┃┫┫
  *　　　　　　　　  ┗┻┛ ┗┻┛+ + + +
  */`)
})