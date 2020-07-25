from flask import request, jsonify, current_app, Blueprint
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from models.user import User
from app import app
from functools import wraps
main = Blueprint('auth', __name__)


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


@main.route('/api/user/login', methods=['POST'])
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


@main.route("/api/user/detail")
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
