// 将数据库相关的操作抽离处理
const HotModel = require('../db/model/hotModel')
// 插入词典
let insertHot = async (obj)=>{
  // 调用数据模型插入方法
  let result = await HotModel.insertMany(obj)
  return result
}
// 查询某条词典
let findHot  = async (_id)=>{
  
  let result = await HotModel.find({_id})
  return result
}
// 删除词典 
let delHot = async (_id)=>{
    // _id 就是要删除的词典主键id
   let result = await HotModel.deleteOne({_id})
   return result
}
// 修改数据
let updateHot = async (_id,updateInfo)=>{
  // _id 要修改的主键id  updateInfo 修改的目标数据
  let result = await HotModel.updateOne({_id},updateInfo)
  return  result
}
// 分页查询
let findHotByPage = async (page,pageSize)=>{
  let  allHot = await HotModel.find() 
  // 总数据条数
  let  allCount = allHot.length
  // 每一页的数据
  let result =await HotModel.find().skip((Number(page)-1)*pageSize).limit(Number(pageSize))
  return {result,allCount}
}
// 关键字查询
let findHotByKw = async (kw,page,pageSize)=>{
  // 通过正则表达式匹配关键字
  let regex = new RegExp(kw)
  // 满足条件的所有数据
  let allHot =await  HotModel.find({$or:[{desc:{$regex:regex}},{name:{$regex:regex}}] })
  let allCount= allHot.length
  // 分页后满足关键字的数据
  let result= await HotModel.find({$or:[{desc:{$regex:regex}},{name:{$regex:regex}}] })
  .skip(Number((page-1)*pageSize)).limit(Number(pageSize))
  return  {result,allCount}
}
module.exports={
  findHotByKw,
  findHotByPage,
  insertHot,
  findHot,
  delHot,
  updateHot}