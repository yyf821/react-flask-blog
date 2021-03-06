const _ajax = (method, url, data) => {
    let p = new Promise((resolve, reject) => {
        let r = new XMLHttpRequest()
        r.open(method, url, true)
        r.setRequestHeader('Content-Type', 'application/json')
        let key = localStorage.getItem('token-key')
        if (key) {
            r.setRequestHeader('token-key', JSON.parse(key))
        }
        r.onreadystatechange = () => {
            if (r.readyState === 4) {
                if (r.status === 200) {
                    resolve(JSON.parse(r.response))
                } else {
                    reject(JSON.parse(r.response))
                }
            }
        }
        if (method === 'POST') {
            data = JSON.stringify(data)
        }
        r.send(data)
    })
    return p
}


class Api {
    constructor(baseUrl) {
        this.baseUrl = baseUrl || 'http://localhost:5000/api'
    }

    get(path) {
        let method = 'GET'
        let url = this.baseUrl + path
        return _ajax(method, url, '')
    }

    post(path, data) {
        let url = this.baseUrl + path
        return _ajax('POST', url, data)
    }

    upload(path, fd) {
        let url = this.baseUrl + path
        let p = new Promise((resolve, reject) => {
            let r = new XMLHttpRequest()
            r.open('post', url)
            let key = localStorage.getItem('token-key')
            if (key) {
                r.setRequestHeader('token-key', JSON.parse(key))
            }
            r.onreadystatechange = () => {
                if (r.readyState === 4) {
                    if (r.status === 200) {
                        resolve(JSON.parse(r.response))
                    } else {
                        reject(JSON.parse(r.response))
                    }
                }
            }
            r.send(fd)
        })
        return p
    }
    
}

export default Api
