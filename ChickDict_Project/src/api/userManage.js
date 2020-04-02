import axios from '../utils/axios'
class UserManage {
    userDel(payload){
        let url= '/chick/admin/user/del'
        return axios.post(url,payload)
    }
    userQuery(payload){
        let url = '/chick/admin/user/infopage'
        return axios.post(url,payload)
    }
    // UserAdd(payload){
    //     let url= '/chick/admin/user/reg'
    //     return axios.post(url,payload)
    // }
    userEdit(payload){
        let url='/chick/admin/user/update'
        return axios.post(url,payload)
    }
}

export default new UserManage()