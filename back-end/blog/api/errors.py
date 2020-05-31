from flask import jsonify
from .. import app


@app.errorhandler(Exception)
def all_exception_handler(e):
    return jsonify(code=e.code, name=e.name, msg=e.description)
