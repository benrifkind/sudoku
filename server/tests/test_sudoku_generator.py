from sudoku_generator import generate_sudoku_problem
from sudoku_solver import get_sudoku_solution


def test_sudoku_generator():
    # This just tests that this completes in a 'reasonable' amount of time
    generate_sudoku_problem(quadrant_dimension="3")


def test_sudoku_generator_is_solvable():
    board = generate_sudoku_problem(quadrant_dimension="3")
    solution = get_sudoku_solution(board)
    for i in range(len(board)):
        for j in range(len(board)):
            if board[i][j] != "":
                assert board[i][j] == solution[i][j]
