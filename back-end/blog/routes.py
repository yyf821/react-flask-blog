from blog import app
from blog import db
import html
from flask import Flask, request, url_for, jsonify, render_template, current_app, send_from_directory
from functools import wraps
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from blog.models import User, Post, Comment
from werkzeug.utils import secure_filename
import os


def create_token(api_user):
    '''
    生成token
    :param api_user:用户id
    :return: token
    '''

    # 第一个参数是内部的私钥，这里写在共用的配置信息里了，如果只是测试可以写死
    # 第二个参数是有效期(秒)
    s = Serializer(current_app.config["SECRET_KEY"], expires_in=3600)
    # 接收用户id转换与编码
    token = s.dumps({"id": api_user}).decode("ascii")
    return token


def verify_token(token):
    '''
    校验token
    :param token:
    :return: 用户信息 or None
    '''

    # 参数为私有秘钥，跟上面方法的秘钥保持一致
    s = Serializer(current_app.config["SECRET_KEY"])
    try:
        # 转换为字典
        data = s.loads(token)
    except Exception:
        return None
    # 拿到转换后的数据，根据模型类去数据库查询用户信息
    user = User.query.get(data["id"])
    return user


def login_required(view_func):
    @wraps(view_func)
    def verify_token(*args, **kwargs):
        try:
            # 在请求头上拿到token
            token = request.headers["token-key"]

        except Exception:
            # 没接收的到token,给前端抛出错误
            return jsonify(msg='缺少参数token')

        s = Serializer(current_app.config["SECRET_KEY"])
        try:
            s.loads(token)
        except Exception:
            return jsonify(msg="登录已过期")

        return view_func(*args, **kwargs)

    return verify_token


@app.errorhandler(404)
def error_404(e):
    return render_template('error.html', message='404 error'), 404

# Function to handle the root path '/'
@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html')


@app.route('/api/user/login', methods=['POST'])
def user_login():
    user = request.get_json()
    name = user['username']
    pwd = user['password']
    try:
        user = User.query.filter_by(username=name).first()
    except Exception:
        return jsonify(msg="获取信息失败")

    if user is None or not user.check_password(pwd):
        return jsonify(code=4103, msg="手机号或密码错误")
    # 获取用户id，传入生成token的方法，并接收返回的token
    token = create_token(user.id)
    # 把token返回给前端
    return jsonify(msg="成功", data=token)


# @app.route('/api/user/register', methods=['POST'])
# def create_user():
#     """Create a user."""
#     user = request.get_json()
#     name = user['username']
#     pwd = user['password']
#     email = user['email']
#     if name and pwd and email:
#         new_user = User(username=name, email=email)
#         new_user.set_password(pwd)
#         db.session.add(new_user)  # Adds new User record to database
#         db.session.commit()  # Commits all changes
#         return jsonify(msg="successfully created!")
#     return jsonify(msg="注册失败")


@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/articles/<id>')
def get_a_post(id):
    return render_template('articles_detail.html')


@app.route('/user/<id>')
def get_user(id):
    return render_template('profile.html')


@app.route("/api/user/detail")
@login_required  # 必须登录的装饰器校验
def userInfo():
    '''
    用户信息
    :return:data
    '''
    token = request.headers["token-key"]

    # 拿到token，去换取用户信息
    user = verify_token(token)
    data = {
        "id": user.id,
        "username": user.username,
    }

    return jsonify(msg="成功", data=data)

# given a result row, extracts and returns the data


def extract_posts(p):
    post = {
        'id': p.id,
        'user_id': p.user_id,
        'author': p.author.username,
        'title': html.escape(p.title),
        'body': html.escape(p.body),
        'date': p.timestamp,
    }
    return post


def extract_user(u):
    user = {
        'id': u.id,
        'username': u.username,
        'email': u.email,
        'created': u.created,
    }
    if u.about_me:
        user['about_me'] = u.about_me
    else:
        user['about_me'] = ''
    return user


def extract_comments(row):
    comments = {
        'id': row.id,
        'user': row.author.username,
        'date': str(row.timestamp)[:19],
        'content': html.escape(row.body),
    }
    return comments


@app.route('/api/user/<id>')
def user(id):
    user = User.query.get(id)
    u = extract_user(user)
    return jsonify(u)

# Function to handle the articles path '/articles'
@app.route('/api/article/<id>')
def articles(id):

    post = Post.query.get(id)
    p = extract_posts(post)
    comments = post.comments.all()
    all_comments = []
    for row in comments:
        data = extract_comments(row)
        all_comments.append(data)
    p['comments'] = all_comments
    return jsonify(p)


@app.route('/api/article', methods=['GET'])
def get_articles():
    page = request.args.get('page', type=int)
    posts = Post.query.order_by(Post.timestamp.desc())
    count = posts.count()
    pagination = posts.paginate(
        page, app.config['POSTS_PER_PAGE'], False)
    items = pagination.items
    all_posts = []
    for p in items:
        data = extract_posts(p)
        all_posts.append(data)
    page = {
        'totalPosts': count,
        'posts': all_posts
    }
    return jsonify(page)


@app.route('/api/article', methods=['POST'])
@login_required
def add_post():
    post = request.get_json()
    title = post['title']
    content = post['content']
    token = request.headers["token-key"]
    user = verify_token(token)
    post = Post(title=title, body=content, user_id=user.id)
    db.session.add(post)
    db.session.commit()
    data = {
        'id': post.id,
        'date': str(post.timestamp)[:19],
        'title': html.escape(post.title)
    }
    return jsonify(data)


@app.route('/api/article/<id>/comments', methods=['GET'])
def get_comments(id):
    post = Post.query.get(id)
    comments = post.comments.all()
    all_comments = []
    for row in comments:
        data = extract_comments(row)
        all_comments.append(data)
    return jsonify(data=all_comments)


@app.route('/api/article/<id>/comments', methods=['POST'])
@login_required
def add_new_comment(id):
    comment = request.get_json()
    content = comment['content']
    token = request.headers["token-key"]
    user = verify_token(token)
    post = Post.query.get(id)
    comment = Comment(body=content, user_id=user.id, post_id=id)
    db.session.add(comment)
    db.session.commit()
    data = extract_comments(comment)
    return jsonify(data=data, msg='评论成功')


@app.route('/api/article/<id>', methods=['DELETE'])
def delete_article(id):
    db.session.query(Comment).filter(Comment.post_id == id).delete()
    post = Post.query.get(id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({'result': True})


@app.route('/api/article/edit/<id>', methods=['POST'])
def edit_article(id):
    article = request.get_json()
    title = article['title']
    content = article['content']
    post = Post.query.get(id)
    post.title = title
    post.body = content
    db.session.commit()
    data = {
        'title': html.escape(title),
        'content': html.escape(content)
    }
    return jsonify(data)


# 设置允许的文件格式
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'JPG', 'PNG', 'bmp'])


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


@app.route('/api/upload', methods=['POST'])
@login_required
def upload():
    token = request.headers["token-key"]
    user = verify_token(token)
    f = request.files['avatar']
    if not (f and allowed_file(f.filename)):
        return jsonify({"error": 1001, "msg": "请检查上传的图片类型，仅限于png、PNG、jpg、JPG、bmp"})
    basepath = os.path.dirname(__file__)  # 当前文件所在路径
    # 注意：没有的文件夹一定要先创建，不然会提示没有该路径
    filename = secure_filename(f.filename)
    upload_path = os.path.join(basepath, 'static/images', filename)
    show_path = '/static/images'
    # upload_path = os.path.join(basepath, 'static/images','test.jpg')  #注意：没有的文件夹一定要先创建，不然会提示没有该路径
    img_url = os.path.join(show_path, filename)
    f.save(upload_path)
    u = User.query.get(user.id)
    u.avatar_url = img_url
    db.session.commit()
    return jsonify({'result': img_url})
