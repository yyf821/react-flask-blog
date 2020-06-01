import Api from './api'

class PostApi extends Api {
    add(data) {
        let path = '/article'
        return this.post(path, data)
    }

    delete(todoId) {
        let path = '/delete/' + String(todoId)
        return this.get(path)
    }

    update(todoId, data) {
        let path = '/update/' + String(todoId)
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
