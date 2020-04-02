const mongoose = require('mongoose')
//一级评论（父子评论）
let discussOneSchema = new mongoose.Schema({
    from_id: {type:String,require:true},
   desc  : { type:String ,required:true},
   likes : { type:Number,require:true},
   comments : {type:Number,required:false},
   img   : { type:String ,required:false},
   name : {type:String,required:true},
   ctime : {type:String,required:false}
})
//二级评论(子孙评论或子孙兄弟评论)
let discussTwoSchema =new mongoose.Schema({
    // from_id:{type:String ,require:true},
    from_id:{type:String,require:true},
    name  : { type:String ,required:true},
    from_name:  {type:String,require:true},
    desc  : { type:String ,required:true},
    img   : { type:String ,required:false},
    comments : {type:Number,required:false},
    likes : {type:Number,required:false},
    ctime : {type:String,required:false}
 })


let discussOneModel = mongoose.model('discussOne',discussOneSchema)
let discussTwoModel = mongoose.model('discussTwo',discussTwoSchema)

module.exports = {
    discussOneModel,
    discussTwoModel
}