from copy import deepcopy
from typing import List, Tuple, Set, Optional


def solve(
        board: List[List[str]],
        quad_dimension: int,
        max_number: int,
):
    ij = get_next(board)
    if ij is None:
        return board

    i, j = ij

    row = get_row(i, board)
    col = get_col(j, board)
    quadrant = get_quadrant(i, j, quad_dimension, board)

    choices = {str(n) for n in range(1, max_number + 1)} - (row | col | quadrant)
    if len(choices) == 0:
        return None

    for choice in choices:
        board_c = deepcopy(board)
        board_c[i][j] = choice

        attempt = solve(board_c, quad_dimension, max_number)
        if attempt is not None:
            return attempt

    return None


def get_next(board: List[List[str]]) -> Optional[Tuple[int, int]]:
    for i in range(len(board)):
        for j in range(len(board)):
            if board[i][j] == '':
                return i, j

    return None


def get_row(i: int, board: List[List[str]]) -> Set[str]:
    return {v for v in board[i] if v != ''}


def get_col(j: int, board: List[List[str]]) -> Set[str]:
    return {row[j] for row in board if row[j] != ''}


def get_quadrant(i: int, j: int, quad_dimension: int, board: List[List[str]]) -> Set[str]:
    i_quad = (i // quad_dimension) * quad_dimension
    j_quad = (j // quad_dimension) * quad_dimension

    # subset the rows and then the columns
    subset_rows = board[i_quad:i_quad + quad_dimension]
    quadrant = [row[j_quad: j_quad + quad_dimension] for row in subset_rows]
    return {v for row in quadrant for v in row if v != ''}
