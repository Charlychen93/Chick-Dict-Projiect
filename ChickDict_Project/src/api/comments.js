import axios from '../utils/axios'
class Comments {
  findSecondList(payload){
    let url='/chick/admin/discuss/infoSecond'
    return axios.post(url,payload)
  }
  delSecond(payload){
    let url='/chick/admin/discuss/delsecondry'
    return axios.post(url,payload)
  }
  //添加
  addSecond(payload){
    let url='/chick/admin/discuss/addSecond'
    return axios.post(url,payload)
  }
  //编辑
  updateSecond(payload){
    let url='/chick/admin/discuss/updateSecond'
    return axios.post(url,payload)
  }
  //根据id获取数据
  getData(payload){
    let url='/chick/admin/discuss/getSecond '
    return axios.post(url,payload)
  }
  //getDataByFirst根据一级评论id获取所有二级评论
  getDataByFirst(payload){
    let url='/chick/admin/discuss/infoByFirst '
    return axios.post(url,payload)
  }
  //根据id获取数据(一级)
  getData1(payload){
    let url='/chick/admin/discuss/getFirst'
    return axios.post(url,payload)
  }
  //添加1级
  add(payload){
    let url='/chick/admin/discuss/add'
    return axios.post(url,payload)
  }
  //编辑1级
  updateOne(payload){
    let url='/chick/admin/discuss/updateOne'
    return axios.post(url,payload)
  }
}

export default  new Comments()