import axios from '../utils/axios'
class Dicmanage {
  findByKw(kw, page, pageSize) {
    let url = '/chick/admin/dict/kwinfo'
    return axios.post(url, { kw, page, pageSize })
  }
  findByTopic(topic, page, pageSize) {
    let url = '/chick/admin/dict/topicinfo'
    return axios.post(url, { topic, page, pageSize })
  }
 
  findById(_id){
    let url='/chick/admin/dict/info'
    return axios.post(url,{_id})
  }
  findByPage(page,pageSize){
    let url='/chick/admin/dict/infopage'
    return axios.post(url,{page,pageSize})
  }
  dicAdd(payload) {
    let url = '/chick/admin/dict/add'
    return axios.post(url, payload)
  }
  dicDel(_id) {
    let url = '/chick/admin/dict/del'
    return axios.post(url, { _id })
  }
  dicUpdate(payload) {
    let url = '/chick/admin/dict/update'
    return axios.post(url, payload)
  }
  getDataId(payload) {
    let url = '/chick/admin/dict/info'
    return axios.post(url, payload)
  }
  img(payload) {
    let url = '/chick/admin/upload/img'
    return axios.post(url, payload)
  }
}

export default new Dicmanage()