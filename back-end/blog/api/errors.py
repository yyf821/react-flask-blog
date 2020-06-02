from flask import jsonify
from .. import app
from werkzeug.exceptions import HTTPException


@app.errorhandler(HTTPException)
def handle_http_error(exc):
    return jsonify({'code': exc.code, 'description': exc.description, 'name': exc.name}), exc.code
