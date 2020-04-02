const express = require('express')
const router = express.Router()
const {findDictByKw,
     findDictByType,
     insertDict,
     findDict,
     delDict,
     updateDict,
     findDictByPage} = require('../controls/dictControl')
const tokenMiddleWare = require('../middleware/tokenMiddleWare')
const authPermissions = require('../middleware/authPermissions')


/**
 * @api {post} /admin/dict/add   添加词典
 * @apiName add
 * @apiGroup Dict
 *
 * @apiParam {String} name 词典名称.
 * @apiParam {String} desc 词典内容.
 * @apiParam {String} img 图片.
 * @apiParam {String} topic 话题.
 * @apiParam {Number} comments 评论数(非必须).
 * @apiParam {Number} likes 点赞数(非必须).
 * @apiParam {String} creator 创建者.
 * @apiParam {String} ctime 创建时间(不用写).
 *
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 */
router.post('/add',tokenMiddleWare,authPermissions,(req,res)=>{
  // 接受数据
  let {name,img,desc,topic,creator} = req.body 
  let comments = req.body.comments || 0
  let likes = req.body.likes || 0
  let ctime = (new Date()).getTime()
  // 处理数据 插入数据库
  insertDict({name,img,desc,topic,creator,comments,likes,ctime})
  .then(()=>{res.send({err:0,msg:'插入成功'})})
  .catch((err)=>{
    res.send({err:-1,msg:'插入失败请重试'})})
  // 返回数据
})
/**
 * @api {post} /admin/dict/info  词典id查询
 * @apiName info
 * @apiGroup Dict
 *
 *@apiParam {String} _id 主键id. 

 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 * @apiSuccess {Array} list  查询到的数据.
 */
// 根据id获取商品 
router.post('/info',tokenMiddleWare,authPermissions,(req,res)=>{
  let  {_id} = req.body
  findDict(_id)
  .then((infos)=>{res.send({list:infos,err:0,msg:'查询成功'})})
  .catch((err)=>{res.send({err:-1,msg:'查询失败请重试'})})
})
/**
 * @api {post} /admin/dict/del  词典删除
 * @apiName del
 * @apiGroup Dict
 *
 * @apiParam   {String} _id  词典主键id
 * 
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 * @apiSuccess {Array} list  查询到的数据.
 */
// 2. 删除词典
router.post('/del',tokenMiddleWare,authPermissions,(req,res)=>{
  // 获取要删除数据的id
  let {_id} = req.body
  delDict(_id)
  .then(()=>{res.send({err:0,msg:'删除成功'})})
  .catch((err)=>{res.send({err:-1,msg:'删除失败请重试'})})

})

/**
 * @api {post} /admin/dict/update   词典修改
 * @apiName update
 * @apiGroup Dict
 *
 * @apiParam {String} _id  词典主键id
 * @apiParam {String} name 词典名字.
 * @apiParam {String} desc 词典内容.
 * @apiParam {String} img 词典图片.
 * @apiParam {Number} topic 词典话题.
 * @apiParam {Number} comments 评论数(非必须).
 * @apiParam {Number} likes 点赞数(非必须).
 * @apiParam {String} creator 创建者.
 * @apiParam {String} ctime 创建时间(不用写).
 *
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 */

router.post('/update',tokenMiddleWare,authPermissions,(req,res)=>{
  // 获取修改数据的参数
  let {_id,name,img,desc,topic,creator} = req.body 
  let comments = req.body.comments || 0
  let likes = req.body.likes || 0

  updateDict(_id,{name,img,desc,topic,creator,comments,likes})
  .then(()=>{res.send({err:0,msg:'修改成功'})})
  .catch((err)=>{res.send({err:-1,msg:'修改失败请重试'})})
})
/**
 * @api {post} /admin/dict/infopage   分页查询
 * @apiName infopage
 * @apiGroup Dict
 *
 * @apiParam {String} page 查询页码数.
 * @apiParam {String} pageSize 每页的数据条数.
 *
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 */
router.post('/infopage',tokenMiddleWare,(req,res)=>{
  let page = req.body.page||1 //查询的第几页数据
  let pageSize = req.body.pageSize ||2 //每页几条数据
  findDictByPage(page,pageSize)
  .then((data)=>{
     let {result,allCount}=data 
    res.send({err:0,msg:'查询成功',list:result,allCount})
  })
  .catch((err)=>{res.send({err:-1,msg:'查询失败请重试'})})
})

// 话题查询  
// 话题查询的数据也可能很多 需要和分页查询做关联
/**
 * @api {post} /admin/dict/topicinfo   话题查询
 * @apiName topicinfo
 * @apiGroup Dict
 *
 * @apiParam {String} topic 话题.
 *
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 */
router.post('/topicinfo',tokenMiddleWare,authPermissions,(req,res)=>{
  let {topic} = req.body 
  findDictByType(topic)
  .then((data)=>{
   res.send({err:0,msg:'查询成功',list:data})
 })
 .catch((err)=>{res.send({err:-1,msg:'查询失败请重试'})})

})
// 模糊查询 关键字查询带分页功能
// 也要和分页做关联
/**
 * @api {post} /admin/dict/kwinfo   关键字查询
 * @apiName kwinfo
 * @apiGroup Dict
 *
 * @apiParam {String} kw 关键字 
 * @apiParam {String} page 页码数 
 * @apiParam {String} pageSize 每页条数.
 *
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 */
router.post('/kwinfo',tokenMiddleWare,authPermissions,(req,res)=>{
  let kw = req.body.kw ||''
  let page = req.body.page||1
  let pageSize = req.body.pageSize||2
  findDictByKw(kw,page,pageSize)
  .then((data)=>{
    res.send({err:0,msg:'查询成功',list:data.result,allCount:data.allCount})
  })
  .catch((err)=>{res.send({err:-1,msg:'查询失败请重试'})})
})
module.exports = router