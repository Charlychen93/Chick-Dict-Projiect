import axios from '../utils/axios'
class LoginApi {
    login(data){
        let url='/chick/admin/user/login'
        return axios.post(url,data)
    }
}
export default new LoginApi()