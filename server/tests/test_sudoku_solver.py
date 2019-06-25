from sudoku_solver import SudokuSolver


def test_simple_solver():
    board = [
        ["1", "", "2", "3"],
        ["2", "", "1", "4"],
        ["4", "", "3", "1"],
        ["3", "", "4", ""],
    ]
    solution = [list("1423"), list("2314"), list("4231"), list("3142")]

    sudoku = SudokuSolver(board=board)
    solutions = [_ for _ in sudoku.solve_all()]
    assert len(solutions) == 1
    assert solutions[0].board == solution
    assert sudoku.solve().board == solution


def test_no_solution():
    board = [
        ["1", "4", "2", "3"],
        ["2", "", "1", "4"],
        ["4", "", "3", "1"],
        ["3", "2", "4", ""],
    ]
    sudoku = SudokuSolver(board=board)
    solution = [_ for _ in sudoku.solve_all()]
    assert len(solution) == 0

    assert sudoku.solve() is None


def test_multiple_solutions():
    board = [
        ["", "4", "", "1"],
        ["1", "", "4", ""],
        ["", "1", "", "4"],
        ["4", "", "1", ""],
    ]
    solutions = [
        [
            ["2", "4", "3", "1"],
            ["1", "3", "4", "2"],
            ["3", "1", "2", "4"],
            ["4", "2", "1", "3"],
        ],
        [
            ["3", "4", "2", "1"],
            ["1", "2", "4", "3"],
            ["2", "1", "3", "4"],
            ["4", "3", "1", "2"],
        ],
    ]
    sudoku = SudokuSolver(board=board)

    sudoku_solutions = [_ for _ in sudoku.solve_all()]
    assert len(solutions) == 2
    assert [s.board for s in sudoku_solutions] == solutions

    assert sudoku.solve().board == solutions[0]


def test_solver():
    board = [
        ["9", "", "", "", "", "8", "", "7", ""],
        ["5", "", "", "6", "7", "9", "2", "3", ""],
        ["1", "", "", "", "", "5", "9", "6", ""],
        ["8", "5", "", "7", "", "2", "6", "", ""],
        ["", "", "9", "8", "", "", "7", "", "2"],
        ["3", "7", "", "1", "", "", "", "", ""],
        ["", "", "4", "", "3", "", "5", "8", "6"],
        ["", "8", "3", "", "6", "", "", "", "4"],
        ["", "1", "5", "", "8", "", "", "", ""],
    ]
    solution = [
        ["9", "2", "6", "3", "1", "8", "4", "7", "5"],
        ["5", "4", "8", "6", "7", "9", "2", "3", "1"],
        ["1", "3", "7", "4", "2", "5", "9", "6", "8"],
        ["8", "5", "1", "7", "9", "2", "6", "4", "3"],
        ["4", "6", "9", "8", "5", "3", "7", "1", "2"],
        ["3", "7", "2", "1", "4", "6", "8", "5", "9"],
        ["7", "9", "4", "2", "3", "1", "5", "8", "6"],
        ["2", "8", "3", "5", "6", "7", "1", "9", "4"],
        ["6", "1", "5", "9", "8", "4", "3", "2", "7"],
    ]

    sudoku = SudokuSolver(board=board)
    solutions = [_ for _ in sudoku.solve_all()]
    assert len(solutions) == 1
    assert solutions[0].board == solution
    assert sudoku.solve().board == solution


def test_getters():
    board = [list("abcd"), list("efgh"), list("ijkl"), list("mnop")]
    sudoku = SudokuSolver(board=board)
    assert sudoku.get_row(0) == set(list("abcd"))
    assert sudoku.get_row(1) == set(list("efgh"))
    assert sudoku.get_row(2) == set(list("ijkl"))
    assert sudoku.get_row(3) == set(list("mnop"))

    assert sudoku.get_col(0) == set(list("aeim"))
    assert sudoku.get_col(1) == set(list("bfjn"))
    assert sudoku.get_col(2) == set(list("cgko"))
    assert sudoku.get_col(3) == set(list("dhlp"))

    assert sudoku.get_quadrant(0, 0) == set(list("abef"))
    assert sudoku.get_quadrant(0, 1) == set(list("abef"))
    assert sudoku.get_quadrant(1, 0) == set(list("abef"))
    assert sudoku.get_quadrant(1, 1) == set(list("abef"))

    assert sudoku.get_quadrant(0, 2) == set(list("cdgh"))
    assert sudoku.get_quadrant(0, 3) == set(list("cdgh"))
    assert sudoku.get_quadrant(1, 2) == set(list("cdgh"))
    assert sudoku.get_quadrant(1, 3) == set(list("cdgh"))

    assert sudoku.get_quadrant(2, 0) == set(list("ijmn"))
    assert sudoku.get_quadrant(2, 1) == set(list("ijmn"))
    assert sudoku.get_quadrant(3, 0) == set(list("ijmn"))
    assert sudoku.get_quadrant(3, 1) == set(list("ijmn"))

    assert sudoku.get_quadrant(2, 2) == set(list("klop"))
    assert sudoku.get_quadrant(2, 3) == set(list("klop"))
    assert sudoku.get_quadrant(3, 2) == set(list("klop"))
    assert sudoku.get_quadrant(3, 3) == set(list("klop"))
