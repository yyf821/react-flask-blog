from flask import jsonify
from .. import app


@app.errorhandler(404)
def error_404(e):
    return jsonify(msg="404 error"), 404
