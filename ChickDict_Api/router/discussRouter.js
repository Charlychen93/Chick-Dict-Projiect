const express=require('express')
const router = express.Router()
const{
    insertDiscussOne,
    findDiscussOne,
    delDiscussMain,
    delDiscussOne,
    delDiscussTwo,
    delDiscussSecond,
    insertDiscussTwo,
    findDiscussTwo
} = require('../controls/discussControl')
const tokenMiddleWare = require('../middleware/tokenMiddleWare')
const authPermissions = require('../middleware/authPermissions')



/**
 * @api {post} /admin/discuss/add   添加一级评论
 * @apiName add
 * @apiGroup Discuss
 *
 * @apiParam {String} name 评论创建者.
 * @apiParam {String} desc 评论内容.
 * @apiParam {String} img 头像.
 * @apiParam {Number} comments 评论数(非必须).
 * @apiParam {Number} likes 点赞数(非必须).
 * @apiParam {String} from_id 主词条的_id.
 * @apiParam {String} ctime 创建时间(非必须).
 *
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 */

 router.post('/add',(req,res)=>{
    //接收数据
    let {name,desc,img,from_id}=req.body
    let comments = req.body.comments || 0
    let likes = req.body.likes || 0
    let ctime = (new Date()).getTime()
    insertDiscussOne({name,desc,img,from_id,comments,likes,ctime})
    .then(()=>{res.send({err:0,msg:'插入成功'})})
    .catch((err)=>{
        res.send({err:-1,msg:'插入失败请重试'})
    })
})

/**
 * @api {post} /admin/discuss/info   查询所有一级评论
 * @apiName info
 * @apiGroup Discuss
 *
 * @apiParam {String} from_id  主词条的id.

 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 * @apiSuccess {Array} list  查询到的数据.
 */
router.post('/info',(req,res)=>{
    let  {from_id} = req.body
    findDiscussOne(from_id)
    .then((infos)=>{res.send({list:infos,err:0,msg:'查询成功'})})
    .catch((err)=>{res.send({err:-1,msg:'查询失败请重试'})})
  })

  /**
 * @api {post} /admin/discuss/delmain   删除主词典下面的一级评论
 * @apiName delmain
 * @apiGroup Discuss
 *
 * @apiParam {String} from_id  主词条的_id.

 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 * @apiSuccess {Array} list  查询到的数据.
 */
router.post('/delmain',tokenMiddleWare,authPermissions,(req,res)=>{
    // 获取要删除数据的id
    let {from_id} = req.body
    delDiscussMain(from_id)
    .then(()=>{res.send({err:0,msg:'删除成功'})})
    .catch((err)=>{res.send({err:-1,msg:'删除失败请重试'})})
  })
  
    /**
 * @api {post} /admin/discuss/delPrimary   删除单条一级评论
 * @apiName delpriamry
 * @apiGroup Discuss
 *
 * @apiParam {String} id  一级评论的_id.
 * 
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 * @apiSuccess {Array} list  查询到的数据.
 */
router.post('/delPrimary',tokenMiddleWare,authPermissions,(req,res)=>{
    let {_id} =req.body
    delDiscussOne(_id)
    .then(()=>{res.send({err:0,msg:'删除成功'})})
    .catch((err)=>{res.send({err:-1,msg:'删除失败请重试'})})
})

/**
 * @api {post} /admin/discuss/delSeconderyAll   跟随一级评论删除所有二级评论
 * @apiName delSeconderyAll
 * @apiGroup Discuss
 *
 * @apiParam {String} from_id  一级评论的_id.
 * 
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 * @apiSuccess {Array} list  查询到的数据.
 */
router.post('/delSeconderyAll',tokenMiddleWare,authPermissions,(req,res)=>{
    let {from_id} =req.body
    delDiscussTwo(from_id)
    .then(()=>{res.send({err:0,msg:'删除成功'})})
    .catch((err)=>{res.send({err:-1,msg:'删除失败请重试'})})
})

/**
 * @api {post} /admin/discuss/delsecondry   删除单条二级评论
 * @apiName delsecondry
 * @apiGroup Discuss
 *
 * @apiParam {String} _id  二级评论的_id.
 * 
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 * @apiSuccess {Array} list  查询到的数据.
 */
router.post('/delsecondry',tokenMiddleWare,authPermissions,(req,res)=>{
    let {_id} =req.body
    delDiscussSecond(_id)
    .then(()=>{res.send({err:0,msg:'删除成功'})})
    .catch((err)=>{res.send({err:-1,msg:'删除失败请重试'})})
})

/**
 * @api {post} /admin/discuss/addSecond   添加二级评论
 * @apiName addSecond
 * @apiGroup Discuss
 *
 * @apiParam {String} name 评论创建者.
 * @apiParam {String} desc 评论内容.
 * @apiParam {String} img 头像.
 * @apiParam {Number} comments 评论数(非必须).
 * @apiParam {Number} likes 点赞数(非必须).
 * @apiParam {String} from_id 一级评论的_id.
 * @apiParam {String} from_name 一级评论的name.
 * @apiParam {String} ctime 创建时间(非必须).
 *
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 */
router.post('/addSecond',tokenMiddleWare,(req,res)=>{
    //接收数据
    let {name,desc,img,from_id,from_name}=req.body
    let comments = req.body.comments || 0
    let likes = req.body.likes || 0
    let ctime = (new Date()).getTime()
    insertDiscussTwo({name,dec,img,from_id,from_name,comments,likes,ctime})
    .then(()=>{res.send({err:0,msg:'插入成功'})})
    .catch((err)=>{
        res.send({err:-1,msg:'插入失败请重试'})
    })
})

/**
 * @api {post} /admin/discuss/infoSecond   查询所有二级评论
 * @apiName infoSecond
 * @apiGroup Discuss
 *
 * @apiParam {String} from_id  一级评论的id.

 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 * @apiSuccess {Array} list  查询到的数据.
 */
router.post('/infoSecond',tokenMiddleWare,(req,res)=>{
    let  {from_id} = req.body
    findDiscussOne(from_id)
    .then((infos)=>{res.send({list:infos,err:0,msg:'查询成功'})})
    .catch((err)=>{res.send({err:-1,msg:'查询失败请重试'})})
  })
  module.exports = router