// 词典相关的数据模型

const mongoose = require('mongoose')

let hotSchema = new mongoose.Schema({
   name  : { type:String ,required:true},
   desc  : { type:String ,required:true},
   hot   : { type:String,required:true},
   ctime : {type:String,required:false}
})

let hotModel = mongoose.model('hots',hotSchema)

module.exports = hotModel