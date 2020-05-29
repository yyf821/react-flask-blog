import Api from './api'

class UserApi extends Api {
    login(data) {
        let path = '/user/login'
        return this.post(path, data)
    }
    getInfo() {
        let path = '/user/detail'
        return this.get(path)
    }
}

export default UserApi