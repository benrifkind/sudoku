import json
import os

import sudoku_generator
import sudoku_solver
from flask import Flask, jsonify, request
from flask_cors import CORS

# The browser is running on the host at the port exposed by the docker container which is running
# the react app
# The request to this server originates from that browser and not the react container
# See docker-compose.yml for how this port is set
access_url: str = f'http://{os.getenv("FRONTEND_HOST")}:{os.getenv("FRONTEND_PORT")}'

app = Flask(__name__)
CORS(
    app,
    resources={
        r"/solve": {"origins": access_url},
        r"/generate/*": {"origins": access_url},
    },
)
quadrant_dimension = 3


@app.route("/")
def hello():
    return "Hello World"


@app.route("/solve", methods=["POST"])
def solve():
    board = json.loads(request.data)
    solution = sudoku_solver.get_sudoku_solution(board=board)
    if solution is None:
        return jsonify(board)
    return jsonify(solution)


@app.route("/generate/<string:dimension>")
def generate(dimension: str):
    return jsonify(sudoku_generator.generate_sudoku_problem(quadrant_dimension=dimension))
