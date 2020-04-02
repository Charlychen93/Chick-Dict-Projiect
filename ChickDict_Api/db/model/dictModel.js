// 词典相关的数据模型

const mongoose = require('mongoose')

let dictSchema = new mongoose.Schema({
   name  : { type:String ,required:true},
   desc  : { type:String ,required:true},
   img   : { type:String ,required:false},
   topic : { type:String ,required:false}, 
   comments : {type:Number,required:false},
   likes : {type:Number,required:false},
   creator : {type:String,required:true},
   ctime : {type:String,required:false}
})

let dictModel = mongoose.model('dicts',dictSchema)

module.exports = dictModel