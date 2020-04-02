const {verifyToken} = require('../utils/jwt')
const { tokenCheck } = require('../controls/userControl')
let tokenMiddlWare = (req,res,next)=>{
  if(!req.headers.authorization || req.headers.authorization === "Bearer "){
    return res.send({err:-997,msg:'token丢失'})
  }
  let token = req.headers.authorization.split("Bearer ")[1]
  //验证用户有没有传token

  // if(!token){return res.send({err:-997,msg:'token丢失'})} 
  //获取验证token的状态
  let tokenState = verifyToken(token)
  if(tokenState){
     //判断一下数据库token 和用户传递的token 是否一致
     tokenCheck(tokenState._id,token)
     .then(()=>{
      req.state=tokenState
       next()
     })
     .catch((err)=>{
       console.log(err)
      res.send({err:-999,msg:err})
     })
  }else{
    res.send({err:-998,msg:'token失效'})
  }
}
module.exports = tokenMiddlWare