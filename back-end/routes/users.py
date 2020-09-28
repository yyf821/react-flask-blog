from models.user import User
from flask import jsonify, Blueprint
from werkzeug.utils import secure_filename
import os
from app import db, app
from flask import request
from .auth import *
main = Blueprint('users', __name__)


def extract_user(u):
    user = {
        'id': u.id,
        'username': u.username,
        'email': u.email,
        'created': u.created,
    }
    if u.avatar_url:
        user['avatar_url'] = u.avatar_url
    else:
        user['avatar_url'] = ''
    return user


@main.route('/api/user/<id>')
def user(id):
    user = User.query.get_or_404(id, description='对不起用户未找到，请返回首页')
    u = extract_user(user)
    return jsonify(u)


# 设置允许的文件格式
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'JPG', 'PNG', 'bmp'])


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


@main.route('/api/upload', methods=['POST'])
@login_required
def upload():
    token = request.headers["token-key"]
    user = verify_token(token)
    f = request.files['avatar']
    if not (f and allowed_file(f.filename)):
        return jsonify({
            "error": 1001,
            "msg": "请检查上传的图片类型，仅限于png、PNG、jpg、JPG、bmp"
        })
    basepath = os.path.dirname(os.path.dirname(__file__))  # 当前文件所在路径
    # 注意：没有的文件夹一定要先创建，不然会提示没有该路径
    filename = secure_filename(f.filename)
    upload_path = os.path.join(basepath, 'static/images', filename)
    show_path = '/static/images'
    img_url = os.path.join(show_path, filename)
    f.save(upload_path)
    u = User.query.get(user.id)
    u.avatar_url = img_url
    db.session.commit()
    return jsonify({'result': img_url})
