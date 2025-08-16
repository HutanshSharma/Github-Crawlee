from flask import request, jsonify
from backend import app

@app.route('/posts', methods=['GET','POST'])
def predict():
    data = request.get_json()
    

    return jsonify(data)