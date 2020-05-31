from flask import jsonify, request
from .. import db, app
from ..models import Post, Comment
import html
from .auth import *


def extract_comments(row):
    comments = {
        'id': row.id,
        'user': row.author.username,
        'date': str(row.timestamp)[:19],
        'content': html.escape(row.body),
    }
    return comments


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
    comment = Comment(body=content, user_id=user.id, post_id=id)
    db.session.add(comment)
    db.session.commit()
    data = extract_comments(comment)
    return jsonify(data=data, msg='评论成功')
