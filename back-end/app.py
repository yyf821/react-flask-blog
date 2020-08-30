from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import config

# Initializes app and database connection
app = Flask(__name__,
            template_folder='templates',
            instance_relative_config=True)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config.from_pyfile('config.py')
app.config.from_object('config')
app.config['JSON_AS_ASCII'] = False
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = app.config["DATABASE_URI"]
app.config['SQLALCHEMY_POOL_SIZE'] = 10
db = SQLAlchemy(app)
app.secret_key = app.config["SECRET_KEY"]

from routes.comments import main as comments_routes
from routes.posts import main as posts_routes
from routes.users import main as users_routes
from routes.errors import main as errors_routes
from routes.auth import main as auth_routes
app.register_blueprint(comments_routes)
app.register_blueprint(posts_routes)
app.register_blueprint(users_routes)
app.register_blueprint(errors_routes)
app.register_blueprint(auth_routes)

# Starts listening for requests...
if __name__ == '__main__':
    app.run(use_reloader=True)
