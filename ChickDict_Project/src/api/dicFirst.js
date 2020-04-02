import axios from '../utils/axios'
class dicFirst {
    addFirst(payload){
        let url = "/chick/admin/discuss/add"
        return axios.post(url,payload)
    }
    delFirst(payload){
        let url = '/chick/admin/discuss/delPrimary'
        return axios.post(url,payload)
    }
    findFirst(payload){
        let url='/chick/admin/discuss/info'
        return axios.post(url,payload)
    }
    //根据词条id查询
    getDataById(payload){
        let url='/chick/admin/discuss/infoByDict'
        return axios.post(url,payload)
    }
    //根据词条id查询
    updateOne(payload){
        let url='/chick/admin/discuss/updateOne'
        return axios.post(url,payload)
    }
}

export default new dicFirst()