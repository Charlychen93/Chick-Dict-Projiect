// 用户相关的数据模型

const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
   user  : { type:String ,required:true},
   pass : { type:String ,required:true},
   img  : {type:String ,required:false},
   leavel: {type:String,required:false},
   token :{ type:String ,required:false}
})

let userModel = mongoose.model('users',userSchema)

module.exports = userModel