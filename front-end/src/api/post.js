import Api from './api'

class PostApi extends Api {
    add(data) {
        let path = '/article'
        return this.post(path, data)
    }

    delete(postId) {
        let path = '/article/delete/' + String(postId)
        return this.get(path)
    }

    update(postId, data) {
        let path = '/article/update/' + String(postId)
        return this.post(path, data)
    }

    all() {
        let path = '/article'
        return this.get(path)
    }

    detail(postId) {
        let path = '/article/' + String(postId)
        return this.get(path)
    }
}

export default PostApi
