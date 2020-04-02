// 将数据库相关的操作抽离处理
const {discussOneModel,discussTwoModel} =require('../db/model/discussModel')

//插入一级评论
let insertDiscussOne=async (obj)=>{
    let result =await discussOneModel.insertMany(obj)
    return result
}

//查询所有一级评论
let findDiscussOne=async (from_id)=>{
    let result =await discussOneModel.find({from_id})
    return result
}

//删除主词典下面的一级评论
let delDiscussMain=async({from_id})=>{
    let result=await discussOneModel.deleteMany({from_id})
    return result
}
//删除单条一级评论
let delDiscussOne=async(_id)=>{
    let resultOne=await discussOneModel.deleteOne({_id})
    return (resultOne)
}
//删除一级评论下面的子评论
let delDiscussTwo=async(from_id)=>{
    let resultTwo=await discussTwoModel.deleteMany({from_id})
    return resultTwo
}
//删除单条二级评论
let delDiscussSecond=async(_id)=>{
    let result=await discussTwoModel.deleteOne({_id})
    return result
}

//插入二级评论
let insertDiscussTwo =async(obj)=>{
    let result =await discussTwoModel.insertMany(obj)
    return result
}
//查询所有二级评论
let findDiscussTwo =async(_id)=>{
    let result =await discussTwoModel.find({_id})
}

module.exports={
    insertDiscussOne,
    findDiscussOne,
    delDiscussMain,
    delDiscussOne,
    delDiscussTwo,
    delDiscussSecond,
    insertDiscussTwo,
    findDiscussTwo
}