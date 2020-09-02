from models.post import Post
from models.comment import Comment
from .auth import *
from flask import jsonify, request, Blueprint
from app import db, app
main = Blueprint('posts', __name__)


def extract_posts(p):
    post = {
        'id': p.id,
        'user_id': p.user_id,
        'author': p.author.username,
        'title': p.title,
        'body': p.body,
        'date': p.timestamp,
    }
    return post


def extract_comments(row):
    comments = {
        'id': row.id,
        'user': row.author.username,
        'date': row.timestamp,
        'user_id': row.user_id,
        'content': row.body,
    }
    return comments


@main.route('/api/article/<id>')
def articles(id):
    post = Post.query.get_or_404(id, description='对不起文章未找到，请返回首页')
    p = extract_posts(post)
    comments = post.comments.all()
    all_comments = []
    for row in comments:
        data = extract_comments(row)
        all_comments.append(data)
    p['comments'] = all_comments
    try:
        token = request.headers["token-key"]
        user = verify_token(token)
        if user.id == p['user_id']:
            p['current'] = True
        else:
            p['current'] = False
    except Exception:
        p['current'] = False
        return jsonify(p)
    return jsonify(p)


@main.route('/api/article', methods=['GET'])
def get_articles():
    page = request.args.get('page', type=int)
    posts = Post.query.order_by(Post.timestamp.desc())
    count = posts.count()
    pagination = posts.paginate(page, app.config['POSTS_PER_PAGE'], False)
    items = pagination.items
    all_posts = []
    for p in items:
        data = extract_posts(p)
        all_posts.append(data)
    page = {'totalPosts': count, 'posts': all_posts}
    return jsonify(page)


@main.route('/api/article', methods=['POST'])
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
    data = {'id': post.id, 'date': post.timestamp, 'title': post.title}
    return jsonify(data)


@main.route('/api/article/delete/<id>', methods=['GET'])
@login_required
def delete_article(id):
    db.session.query(Comment).filter(Comment.post_id == id).delete()
    post = Post.query.get(id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({'result': True})


@main.route('/api/article/update/<id>', methods=['POST'])
@login_required
def edit_article(id):
    article = request.get_json()
    title = article['title']
    content = article['content']
    post = Post.query.get(id)
    post.title = title
    post.body = content
    db.session.commit()
    data = {'title': title, 'content': content}
    return jsonify(data)
