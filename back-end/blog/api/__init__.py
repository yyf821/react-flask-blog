from . import auth, posts, users, comments, errors
from flask import Blueprint

api = Blueprint('api', __name__)
