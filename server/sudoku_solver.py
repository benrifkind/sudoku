import math
from copy import deepcopy
from queue import LifoQueue
from typing import Dict, Generator, List, Optional, Set, Tuple

Board = List[List[str]]


class SudokuSolver:
    def __init__(self, board: Board):
        assert (
            len(set([len(board)] + [len(row) for row in board])) == 1
        ), "Board dimensions must be square"

        self.board = board
        self.length = len(board)
        self.quadrant_dimension = int(math.sqrt(self.length))

        self.numbers = (
            self.quadrant_dimension ** 2
        )  # number of different numbers in a quadrant

        self._rows: Dict[int, Set[str]] = {
            i: {v for v in self.board[i] if v != ""} for i in range(len(board))
        }

        self._columns: Dict[int, Set[str]] = {
            j: {row[j] for row in self.board if row[j] != ""} for j in range(len(board))
        }

        dim: int = self.quadrant_dimension
        self._quandrant: Dict[Tuple[int, int], Set[str]] = {
            (i, j): set(
                v
                for row in board[i * dim : (i + 1) * dim]
                for v in row[j * dim : (j + 1) * dim]
            )
            for i in range(dim)
            for j in range(dim)
        }

    def __str__(self) -> str:
        return "\n".join(["|".join(row) for row in self.board])

    def get_row(self, i: int) -> Set[str]:
        """ Get the values already set in this row """
        return self._rows.get(i)

    def get_col(self, j: int) -> Set[str]:
        """ Get the values already set in this column """
        return self._columns.get(j)

    def get_quadrant(self, i: int, j: int) -> Set[str]:
        """ Get the values already set in this quadrant """
        i_quad = i // self.quadrant_dimension
        j_quad = j // self.quadrant_dimension

        return self._quandrant[(i_quad, j_quad)]

    def next_square(self) -> Optional[Tuple[int, int]]:
        """
        Get the next coordinates to be filled in. Optimizes by picking the squares
        with minimal choices
        """
        if self.is_solution:
            return None

        coordinates = None
        min_choices: Optional[int] = None
        for i in range(len(self.board)):
            for j in range(len(self.board)):
                if self.board[i][j] == "":
                    choices = self.moves(i=i, j=j)
                    # Exit early if board is unsolvable
                    if len(choices) is None:
                        print("Dead End")
                        return None
                    if len(choices) == 1:
                        return i, j
                    if min_choices is None or (len(choices) < min_choices):
                        coordinates = i, j
                        min_choices = len(choices)

        return coordinates

    @property
    def is_solution(self) -> bool:
        return all(v != "" for row in self.board for v in row)

    def moves(self, i: int, j: int) -> List[str]:
        row = self.get_row(i)
        col = self.get_col(j)
        quadrant = self.get_quadrant(i, j)

        return sorted(
            {str(n) for n in range(1, self.numbers + 1)} - (row | col | quadrant)
        )

    @property
    def descendants(self) -> Optional[Generator["SudokuSolver", None, None]]:
        """
        Descendants are all legal boards that can be gotten to from this board in one step.
        There are two cases where the board may not have descendants.
         - Differentiate these cases by returning different values
        1. It is itself a solution. In this case we raise since a solution.
        2. It has no legal descendants. In this case return None.
        :return:
        """
        if self.is_solution:
            raise ValueError("Solved Board has no descendants")

        ij = self.next_square()
        if ij is None:
            return None

        i, j = self.next_square()

        choices = self.moves(i=i, j=j)

        for choice in choices:
            board_c = deepcopy(self.board)
            board_c[i][j] = choice

            yield self.__class__(board=board_c)

    def solve(self) -> Optional["SudokuSolver"]:
        queue: LifoQueue["SudokuSolver"] = LifoQueue()
        queue.put(self)

        while not queue.empty():
            board = queue.get()
            if board.is_solution:
                return board
            for board in board.descendants:
                queue.put(board)

    def solve_all(self) -> Generator["SudokuSolver", None, None]:
        queue: LifoQueue["SudokuSolver"] = LifoQueue()
        queue.put(self)

        while not queue.empty():
            board = queue.get()
            if board.is_solution:
                yield board
            else:
                for board in board.descendants:
                    queue.put(board)


def get_sudoku_solution(board: Board):
    return SudokuSolver(board=board).solve().board


def get_sudoku_solutions(board: Board) -> Generator[Board, None, None]:
    solutions = SudokuSolver(board=board).solve_all()
    for solution in solutions:
        yield solution.board
