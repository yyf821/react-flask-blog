const apiUser = (callback) => {
    let url = window.location.href;
    let arr = url.split("/user/")
    let id = arr[1]
    let request = {
        method: 'GET',
        path: `/api/user/${id}`,
        data: '',
        callback: callback,
    }
    ajax(request)
}

const templateUser = (user) => {
    let { id, username, email, created, about_me } = user
    let t = `
    <div class="user-profile">
        <h2 class="username">${username}</h2>
        <p class="user-about-me">${about_me}</p>
        <p class="user-id">id: ${id}</p>
        <p class="user-email">email: ${email}</p>
        <p class="user-created">created at: ${created}</p>
    </div>
    `
    return t
}

const insertUser = (user) => {
    let container = e('.page')
    let html = templateUser(user)
    appendHtml(container, html)
}

const loadUser = () => {
    apiUser((r) => {
        let user = JSON.parse(r)
        insertUser(user)
    })
}


const uploadAvatar = () => {
    e('#upload').addEventListener('click', function () {
        async function u() {
            const { value: file } = await Swal.fire({
                title: 'Select image',
                input: 'file',
                inputAttributes: {
                    'accept': 'image/*',
                    'aria-label': 'Upload your profile picture'
                }
            })

            if (file) {
                const reader = new FileReader()
                reader.onload = (e) => {
                    Swal.fire({
                        title: 'Your uploaded picture',
                        imageUrl: e.target.result,
                        imageAlt: 'The uploaded picture'
                    })
                }
                reader.readAsDataURL(file)
            }
        }
        u().then(() => {
            let url = "/api/upload"
            let file = e('.swal2-file').files[0]
            let fd = new FormData();
            fd.append('avatar', file)
            upload(url, fd, (r) => {
                let url = JSON.parse(r)
                document.getElementById('show-img').src = url.result
            })
        });
    })

}


const __main = () => {
    uploadAvatar()
    loadUser()
    getUserInfo((user) => {
        loadUserInfo(user)
    })
}

__main()