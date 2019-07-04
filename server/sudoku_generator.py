import math
import random
from copy import deepcopy
from typing import List, Optional, Tuple

from sudoku_solver import SudokuSolver

Board = List[List[str]]


class SudokuUnSolver:
    """From a solved Sudoku board generate possible Sudoku problems.
    These are boards with some of the entries of the solution erased that have a unique
    solution.
    The randomness comes from randomly choosing which squares to erase and from permuting
    the labels (numbers 1..9) of the generated Sudoku problem

    If I understood group theory better I could actually generate a uniformly random
    Sudoku problem instead of using this hacky crap :)
    """

    def __init__(self, solved_board: Board):
        self.solved_board = solved_board
        self.length = len(solved_board)
        self.quadrant_dimension = int(math.sqrt(self.length))

    def _get_next_coords(self) -> Optional[Tuple[int, int]]:
        while True:
            i, j = (
                random.randint(0, self.length - 1),
                random.randint(0, self.length - 1),
            )
            if self.solved_board[i][j] != "":
                return i, j

    def _erase(self, board: Board) -> Board:
        while True:
            i, j = self._get_next_coords()

            board_c = deepcopy(board)
            board_c[i][j] = ""
            sudoku = SudokuSolver(board=board_c)
            if len([_ for _ in sudoku.solve_all()]) > 1:
                return board

            board = board_c

    def _permute(self, board: Board) -> Board:
        digits = [str(i) for i in range(1, self.length + 1)]
        choices = set(digits)

        permutations = {"": ""}
        for i in digits:
            permutation = random.choice(list(choices))
            permutations[i] = permutation
            choices = choices - {permutation}

        perms = [[permutations[k] for k in row] for row in board]
        return perms

    def unsolve(self):
        return self._permute(self._erase(self.solved_board))


def generate_sudoku_problem(quadrant_dimension: str) -> Board:
    solutions = {
        "2": [
            ["1", "2", "3", "4"],
            ["3", "4", "1", "2"],
            ["2", "1", "4", "3"],
            ["4", "3", "2", "1"],
        ],
        "3": [
            ["9", "2", "6", "3", "1", "8", "4", "7", "5"],
            ["5", "4", "8", "6", "7", "9", "2", "3", "1"],
            ["1", "3", "7", "4", "2", "5", "9", "6", "8"],
            ["8", "5", "1", "7", "9", "2", "6", "4", "3"],
            ["4", "6", "9", "8", "5", "3", "7", "1", "2"],
            ["3", "7", "2", "1", "4", "6", "8", "5", "9"],
            ["7", "9", "4", "2", "3", "1", "5", "8", "6"],
            ["2", "8", "3", "5", "6", "7", "1", "9", "4"],
            ["6", "1", "5", "9", "8", "4", "3", "2", "7"],
        ],
    }
    unsolver = SudokuUnSolver(solved_board=solutions[quadrant_dimension])
    return unsolver.unsolve()
