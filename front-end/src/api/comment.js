import Api from './api'

class CommentApi extends Api {
    add(data) {
        let path = '/comments'
        return this.post(path, data)
    }

    delete(commentId) {
        let path = '/comments/delete/' + String(commentId)
        return this.get(path)
    }
}

export default CommentApi