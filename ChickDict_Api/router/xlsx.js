const express = require('express')
const router = express.Router()
const fs = require('fs')
const XLSX = require('xlsx')
const  path = require('path')

const authPermissions = require('../middleware/authPermissions')
const tokenMiddleWare = require('../middleware/tokenMiddleWare')

/**
 * @api {post} /xlsx   导出excel
 * @apiName xlsx
 * @apiGroup xlsx
 *
 * @apiParam {Array} arr 数组.
 *
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 */
router.post('/getxlsx',(req,res)=>{
  console.log(req.body.arr)
  let arr = JSON.parse(req.body.arr)
  let sheet = XLSX.utils.aoa_to_sheet(arr)
  let book = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(book,sheet)
  XLSX.writeFile(book,`./public/xlsx/hehe.xlsx`)
  let file = fs.readFileSync(`./public/xlsx/hehe.xlsx`)
  // 默认名字
  res.attachment('信息.xlsx')
  res.send(file)
})
module.exports = router