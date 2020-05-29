const apiCommentAll = (callback) => {
    let url = window.location.href;
    let arr = url.split("/articles/")
    let id = arr[1]
    let request = {
        method: 'GET',
        path: `/api/article/${id}/comments`,
        data: '',
        callback: callback,
    }
    ajax(request)
}

const apiPost = (callback) => {
    let url = window.location.href;
    let arr = url.split("/articles/")
    let id = arr[1]
    let request = {
        method: 'GET',
        path: `/api/article/${id}`,
        data: '',
        callback: callback,
    }
    ajax(request)
}

const templateComment = (comment) => {
    let { id, user, date, content } = comment
    let t = `
    <div data-id="${id}" class="comment-item">
        <h3>${user}</h2>
        <h5>${date}</h5>
        <p>${content}</p>
    </div>
    `
    return t
}

const templateBlog = function(blog) {
    let id = blog.id
    let title = blog.title
    let content = blog.content
    let author = blog.author
    let d = new Date(blog.created_time * 1000)
    let time = d.toLocaleString()
    let t = `
        <div class="blog-cell">
            <div class="">
                <a class="blog-title" href="/blog/${id}" data-id="${id}">
                    ${title}
                </a>
            </div>
            <div class="">
                <span>${author}</span> @ <time>${time}</time>
            </div>
            <div class="">
                ${content}
            </div>
            <div class="">
                <h3>评论区</h3>
                <div id="id-div-blog-comments"></div>
            </div>
        </div>
    `
    return t
}

const templatePost = (post) => {
    let { author, date, title, content, user_id } = post
    e('.blog-author').innerHTML = `<a href="/user/${user_id}">${author}</a>`
    e('.blog-author').setAttribute("data-id", user_id)
    let p = `
    <h1 id="blog-title">${title}</h1>
    <div class="post-info">
        <div class="blog-date">${date}</div>
        <div class="user-control"></div>
    </div>
    <hr>
    <p id="blog-content">${content}</p>
    
    `
    return p

}

const insertPost = (post) => {
    let container = e('.blog-article')
    let html = templatePost(post)
    appendHtml(container, html)
}

const insertControl = (user) => {
    e('.blog-article').addEventListener("mouseenter", function (event) {
        let postId = e('.blog-author').dataset.id
        if (Number(postId) === user.id) {
            let html = `<span class="delete">delete</span> | <span class="edit">edit</span>`
            e('.user-control').innerHTML = html
        }
    })
    e('.blog-article').addEventListener("mouseleave", function (event) {
        e('.user-control').innerHTML = ""
    })

}

const loadPost = () => {
    apiPost((r) => {
        let post = JSON.parse(r)
        insertPost(post)
    })
}



const insertComment = (comment) => {
    let container = e('#comment-list')
    let html = templateComment(comment)
    appendHtml(container, html)
}

const insertComments = (comments) => {
    for (let c of comments.data) {
        insertComment(c)
    }
}

const loadComment = () => {
    apiCommentAll((r) => {
        let comments = JSON.parse(r)
        insertComments(comments)
    })
}

const apiCommentAdd = (data, callback) => {
    let url = window.location.href;
    let arr = url.split("/articles/")
    let id = arr[1]
    let request = {
        method: 'POST',
        path: `/api/article/${id}/comments`,
        data: data,
        callback: callback,
    }
    ajax(request)
}

const bindEventAdd = () => {
    let btn = e(".btn");
    btn.addEventListener('click', (event) => {
        let content = document.getElementById('comment-textarea').value
        let data = {
            content: content
        }
        apiCommentAdd(data, (r) => {
            let c = JSON.parse(r)
            if (c.data) {
                Swal.fire(
                    'Success',
                    c.msg,
                    'success'
                )
                e('#comment-list').insertAdjacentHTML('afterbegin', templateComment(c.data))
            } else {
                Swal.fire(
                    'error',
                    c.msg,
                    'error'
                )
            }
        })
    })
}

const apiPostDelete = (id, callback) => {
    let request = {
        method: 'DELETE',
        path: '/api/article/' + String(id),
        data: '',
        callback: callback,
    }
    ajax(request)
}

const apiPostUpdate = (id, data, callback) => {
    let request = {
        method: 'POST',
        path: '/api/article/edit/' + String(id),
        data: data,
        callback: callback,
    }
    ajax(request)
}

const bindEventDelete = () => {
    let container = e('.blog-article')
    container.addEventListener('click', (event) => {
        let self = event.target
        if (self.classList.contains('delete')) {
            let url = window.location.href;
            let arr = url.split("/articles/")
            let id = arr[1]
            Swal.fire({
                type: 'warning',
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.value) {
                    apiPostDelete(id, () => {
                        window.location.href = '/'
                    })
                }
            })
        }

    })
}

const bindEventUpdate = () => {
    let container = e('.blog-article')
    container.addEventListener('click', (event) => {
        let self = event.target
        if (self.classList.contains('edit')) {
            let title = e('#blog-title').innerHTML
            let content = e('#blog-content').innerHTML
            let url = window.location.href;
            let arr = url.split("/articles/")
            let id = arr[1]
            editPage((result) => {
                if (result.value) {
                    apiPostUpdate(id, result.value, (r) => {
                        let article = JSON.parse(r)
                        e('#blog-title').innerHTML = article.title
                        e('#blog-content').innerHTML = article.content
                    })
                }
            }, title, content)
        }
    })
}

const __main = () => {
    loadPost()
    getUserInfo((user) => {
        loadUserInfo(user)
        insertControl(user)
    })
    loadComment()
    bindEventAdd()
    bindEventDelete()
    bindEventUpdate()
}

__main()