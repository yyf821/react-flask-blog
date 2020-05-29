const log = console.log.bind(console)

const e = selector => document.querySelector(selector)
const es = selector => document.querySelectorAll(selector)

const appendHtml = (element, html) => element.insertAdjacentHTML('beforeend', html)

const bindEvent = function (element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

const bindAll = function (selector, eventName, callback) {
    let elements = es(selector)
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i]
        bindEvent(e, eventName, callback)
    }
}

const getLogin = function () {
    let user = localStorage.getItem('token-key')
    return user ? JSON.parse(user) : null
}

const ajax = (request) => {
    let { method, path, data, callback } = request
    let r = new XMLHttpRequest()
    r.open(method, path, true)
    r.setRequestHeader('Content-Type', 'application/json')
    let user = getLogin()
    r.setRequestHeader('token-key', user)
    r.onreadystatechange = () => {
        if (r.readyState === 4) {
            callback(r.response)
        }
    }
    if (method === 'POST') {
        data = JSON.stringify(data)
    }
    r.send(data)
}

const editPage = function (callback, title = '', content = '') {
    Swal.fire({
        title: 'Add a new post',
        html:
            `
            <input id="input-title" class="swal2-input" placeholder="title" value=${title}>
            <textarea id="input-textarea" class="swal2-textarea" placeholder="content">${content}</textarea>
            <div id="alert-message"></div>
            `,
        focusConfirm: false,
        preConfirm: () => {
            let title = document.getElementById('input-title').value
            let content = document.getElementById('input-textarea').value
            if (title && content) {
                return {
                    title: title,
                    content: content
                }
            } else {
                e('#alert-message').innerHTML = 'The title and the content can not be empty!'
                return false
            }
        }
    }).then(callback)
}

const apiUserInfo = (callback) => {
    let request = {
        method: 'GET',
        path: "/api/user/detail",
        data: '',
        callback: callback,
    }
    ajax(request)
}

const getUserInfo = (callback) => {
    apiUserInfo((r) => {
        let user = JSON.parse(r)
        let data = user.data
        if (data) {
            callback(data)
        }
    })
}

const loadUserInfo = (user) => {
    let { id, username } = user
    e('#user-info').innerHTML = `Hello, <a href="/user/${id}">${username}</a>`
}

const upload = (url, fd, callback) => {
    let r = new XMLHttpRequest();
    r.open('POST', url);
    // 上传完成后的回调函数
    let user = getLogin()
    r.setRequestHeader('token-key', user)
    r.onreadystatechange = () => {
        if (r.readyState === 4) {
            if (r.status === 200) {
                callback(r.response)
            } else {
                console.log('上传出错');
            }
        }
    }
    r.send(fd);
}