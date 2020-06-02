from flask import jsonify
from .. import app
from werkzeug.exceptions import HTTPException


@app.errorhandler(HTTPException)
def handle_http_error(exc):
    return jsonify({'status': 'error', 'description': exc.description}), exc.code
