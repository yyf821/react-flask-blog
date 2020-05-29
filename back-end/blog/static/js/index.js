const apiPostAll = (callback, page) => {
    let request = {
        method: 'GET',
        path: "/api/article?page=" + page,
        data: '',
        callback: callback,
    }
    ajax(request)
}

const templatePost = (post) => {
    let { id, title, date } = post
    let t = `
    <li>
        <a href="/articles/${id}">${title}</a><span class="list-date">${date}</span>
    </li>
    `
    return t
}

const insertPost = (post) => {
    let container = e('.blog-list')
    let html = templatePost(post)
    appendHtml(container, html)
}

const insertPosts = (posts) => {
    for (let p of posts) {
        insertPost(p)
    }
}

const loadPost = (page) => {
    e('.blog-list').innerHTML = ''
    apiPostAll((r) => {
        let posts = JSON.parse(r)
        insertPosts(posts.posts)
        countPage(page, posts.totalPosts)
    }, page)
}

//分页
const countPage = (page, total) => {
    let pageSize = 5
    let totalPage = Math.ceil(total / pageSize)
    e('.current-page').innerHTML = page
    e('.total-page').innerHTML = totalPage
}

const bindEventPaginate = function (page) {
    let selector = '.pagination-button'
    bindAll(selector, 'click', function (event) {
        let self = event.target
        let offset = Number(self.dataset.offset)
        let totalPage = Number(e('.total-page').innerHTML)
        if (page === 1 && offset === -1) {
            return
        }
        if (page === totalPage && offset === 1) {
            return
        }
        page += offset
        loadPost(page)
    })
}

const apiPostAdd = (data, callback) => {
    let request = {
        method: 'POST',
        path: '/api/article',
        data: data,
        callback: callback,
    }
    ajax(request)
}

const bindEventAdd = () => {
    let btn = e(".btn");
    btn.addEventListener('click', (event) => {
        editPage((result) => {
            if (result.value) {
                apiPostAdd(result.value, (r) => {
                    let p = JSON.parse(r)
                    if (p.id) {
                        Swal.fire(
                            'Success',
                            'Successfully Added',
                            'success'
                        )
                        let page = 1
                        loadPost(page)
                    } else if (p.error) {
                        Swal.fire("error!")
                    }
                })
            }
        })
    })

}

const __main = () => {
    let page = 1
    getUserInfo((user) => {
        loadUserInfo(user)
    })
    loadPost(page)
    bindEventAdd()
    bindEventPaginate(page)
    
}

__main()

