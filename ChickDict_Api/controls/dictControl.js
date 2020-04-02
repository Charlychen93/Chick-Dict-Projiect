// 将数据库相关的操作抽离处理
const dictModel = require('../db/model/dictModel')
// 插入词典
let insertDict = async (obj)=>{
  // 调用数据模型插入方法
  let result = await dictModel.insertMany(obj)
  return result
}
// 查询某条词典
let findDict  = async (_id)=>{
  
  let result = await dictModel.find({_id})
  return result
}
// 删除词典 
let delDict = async (_id)=>{
    // _id 就是要删除的词典主键id
   let result = await dictModel.deleteOne({_id})
   return result
}
// 修改数据
let updateDict = async (_id,updateInfo)=>{
  // _id 要修改的主键id  updateInfo 修改的目标数据
  let result = await dictModel.updateOne({_id},updateInfo)
  return  result
}
// 分页查询
let findDictByPage = async (page,pageSize)=>{
  let  allDict = await dictModel.find() 
  // 总数据条数
  let  allCount = allDict.length
  // 每一页的数据
  let result =await dictModel.find().skip((Number(page)-1)*pageSize).limit(Number(pageSize))
  return {result,allCount}
}
//  分类查询
let  findDictByType = async (topic) =>{
  let result = await dictModel.find({topic})
  return result
}
// 关键字查询
let findDictByKw = async (kw,page,pageSize)=>{
  // 通过正则表达式匹配关键字
  let regex = new RegExp(kw)
  // 满足条件的所有数据
  let allDict =await  dictModel.find({$or:[{desc:{$regex:regex}},{name:{$regex:regex}},{creator:{$regex:regex}}] })
  let allCount= allDict.length
  // 分页后满足关键字的数据
  let result= await dictModel.find({$or:[{desc:{$regex:regex}},{name:{$regex:regex}}] })
  .skip(Number((page-1)*pageSize)).limit(Number(pageSize))
  return  {result,allCount}
}
module.exports={
  findDictByKw,
  findDictByType,
  findDictByPage,
  insertDict,
  findDict,
  delDict,
  updateDict}