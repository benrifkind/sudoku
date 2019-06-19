import json

from flask import Flask, request, jsonify
from flask_cors import CORS

import sudoku

app = Flask(__name__)
CORS(app,
     resources={
         r"/solve": {
             "origins": "http://localhost:3001"
         }
     }
)


@app.route('/')
def hello():
    return "Hello World"


@app.route('/solve', methods=['POST'])
def solve():
    data = json.loads(request.data)
    solution = sudoku.solve(data, quad_dimension=3, max_number=9)
    return jsonify(solution)
