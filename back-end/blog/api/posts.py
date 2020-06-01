import html
from ..models import Post, Comment
from .auth import *
from flask import jsonify, request
from .. import db, app


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


def extract_comments(row):
    comments = {
        'id': row.id,
        'user': row.author.username,
        'date': str(row.timestamp)[:19],
        'content': html.escape(row.body),
    }
    return comments


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
    try:
        token = request.headers["token-key"]
        user = verify_token(token)
    except Exception:
        return jsonify(p)
    if user.id == p['user_id']:
        p['current'] = True
    else:
        p['current'] = False
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
