const bindEvents = function () {
    let selector = '.tag'
    bindAll(selector, 'click', function (event) {
        // 之前被点击的菜单的类先删除类 active，取消效果
        let tag = e('.active')
        tag.classList.remove('active')
        let self = event.target
        self.classList.add('active')
        let old = e('.show')
        old.classList.remove('show')
        let cid = self.dataset.id
        let current = e(cid)
        current.classList.add('show')
    })
}

const apiLogin = (data, callback) => {
    let request = {
        method: 'POST',
        path: '/api/user/login',
        data: data,
        callback: callback,
    }
    ajax(request)
}

const PostData = () => {
    let data = {
        username: signinform.username.value,
        password: signinform.password.value
    }
    apiLogin(data, (r) => {
        let res = JSON.parse(r)
        if (res.data) {
            localStorage.setItem('token-key', JSON.stringify(res.data));
            window.location.href="/"
        }
    })
    return false;
}

const __main = function () {
    bindEvents()
}

__main()