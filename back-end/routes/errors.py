from flask import jsonify, Blueprint
from app import app
from werkzeug.exceptions import HTTPException
main = Blueprint('errors', __name__)


@app.errorhandler(HTTPException)
def handle_http_error(exc):
    return jsonify({
        'code': exc.code,
        'description': exc.description,
        'name': exc.name
    }), exc.code
