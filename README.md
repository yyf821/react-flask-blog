# react-flask-blog
基于React + Flask 的多人博客系统
## 使用方法
### 后端
    cd back-end
    python -m venv env
    env\Scripts\activate
    pip install -r requirements.txt
    flask run

### 前端
    cd front-end
    yarn install
    yarn run start

### 数据库
config.py中添加DATABASE_URI
如果和我一样使用sql server：
mssql+pyodbc://username:password@dsn（替换成自己的用户名，密码和dsn）
