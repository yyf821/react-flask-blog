from flask import jsonify
from .. import app


@app.errorhandler(Exception)
def all_exception_handler(e):
    return jsonify(msg="error")
