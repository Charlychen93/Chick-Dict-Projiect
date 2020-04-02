// const permissionList =require('../config/permissions')
module.exports = async function(ctx,res,next){
  // 根据资源和方法验证权限
  let {path,state} = ctx  

  let {leavel} = state
  // 判断是否满足权限
  let boolean = true 
  
  if(path !== '/infopage' && leavel !== 'root'){
    boolean = false
  }
  
  if(boolean){ return  await next()}
  res.send({err:403,msg:'权限不足，无法访问'})
}
