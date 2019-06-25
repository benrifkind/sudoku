import React, { Component } from 'react';
import Revealer from './Revealer'
import TextBox from './TextBox'

// This url is the one exposed to the host from the docker containerwhich is running the server 
// This is different than the port and network of the actual docker container. 
// I think this is because the request actually comes from the browser on this host which only
// has access to the exposed port on the docker container.
// To actually run this we would have to expose the server url and allow any origin domain to call it
// See docker-compose.yml for the port configuration
const SERVER_HOST = process.env.REACT_APP_SERVER_HOST
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT
const DIMENSION = 3
const SOLVE_URL = `http://${SERVER_HOST}:${SERVER_PORT}/solve`
const GENERATE_URL = `http://${SERVER_HOST}:${SERVER_PORT}/generate/${DIMENSION}`

function nullBoard(dimension: number) {
  // create empty board
  var squares: string[][] = []
  for (let i = 0; i < dimension; i++) {
    var row: string[] = []
    for (let j = 0; j < dimension; j++) {
      row.push("")
    }
    squares.push(row)
  }
  return squares
}

export interface BoardState {
  squares: string[][]
  originalSquares: null | string[][]
  solvedSquares: null | string[][]
  focusSquare: [number, number]
}

class Board extends Component<{}, BoardState> {
  quadrantDimension = DIMENSION // quadrantDimension x quadrantDimension is number of squares per quadrant
  boardQuadrantDimension = DIMENSION // boardQuadrantDimension x boardQuadrantDimension is number of quadrants per board
  dimension = DIMENSION * DIMENSION

  constructor(props: any) {
    super(props);

    const squares = nullBoard(this.dimension)
    this.state = {
      solvedSquares: null,
      originalSquares: null,
      squares: squares,
      focusSquare: [0, 0],
    };

  }


  quadrantToBoard(quadrant: number, iQ: number, jQ: number) {
    // transform from quadrant coordinates to regular coordinates
    var i = Math.floor(quadrant / this.boardQuadrantDimension) * this.quadrantDimension + iQ
    var j = (quadrant % this.boardQuadrantDimension) * this.quadrantDimension + jQ

    return [i, j]
  }

  boardToQuadrant(i: number, j: number) {
    // transform from regular coordinates to quadrant coordinates
    const quadDim = this.boardQuadrantDimension

    var q = Math.floor(i / quadDim) * quadDim + Math.floor(j / quadDim)
    var iQ = i % quadDim
    var jQ = j % quadDim

    return [q, iQ, jQ]

  }

  handleFocus(i: number, j: number) {
    this.setState({ focusSquare: [i, j] });
  }

  handleInput(event: React.FormEvent<HTMLInputElement>, i: number, j: number) {
    let value = event.currentTarget.value
    if (this.validateInput(value)) {
      var squares = this.state.squares.slice()
      squares[i][j] = value
      this.setState({ squares: squares });
    }
  }

  validateInput(value: string) {
    return value.match('^$') || (value.match('^\\d+$') && 0 < parseInt(value) && parseInt(value) <= 9)
  }

  handleRevealSquareClick() {
    if (this.state.solvedSquares != null) {
      var squares = this.state.squares.slice()
      var [i, j] = this.state.focusSquare
      squares[i][j] = this.state.solvedSquares[i][j]
      this.setState({ squares: squares })
    }

  }

  handleRevealBoardClick() {
    if (this.state.solvedSquares != null) {
      var squares = this.state.solvedSquares.slice()
      this.setState({ squares: squares })
    }
  }

  handleCreateBoardClick() {
    var squares = JSON.parse(JSON.stringify(this.state.squares))
    this.setState({ originalSquares: squares })
  }

  handleClearBoardClick() {
    this.setState({
      solvedSquares: null,
      originalSquares: null,
      squares: nullBoard(this.dimension),
      focusSquare: [0, 0],
    });
  }


  handleGenerateBoardClick() {
    let fetchOptions: RequestInit = {
      method: 'GET',
    }

    if (!Boolean(SERVER_HOST && SERVER_PORT)) {
      console.log(`Unable to fetch board from ${GENERATE_URL}`)
      return
    }

    var response = fetch(GENERATE_URL, fetchOptions)
    response.then(res => res.json())
      .then(result => this.setState({ originalSquares: result, squares: JSON.parse(JSON.stringify(result)) }))
  }

  componentDidUpdate(_: {}, prevState: BoardState) {
    if (!Boolean(SERVER_HOST && SERVER_PORT)) {
      console.log(`Unable to fetch solution from ${SOLVE_URL}`)
      return
    }

    if (
      (prevState.originalSquares !== this.state.originalSquares) &&
      (this.state.originalSquares != null)
    ) {
      let fetchOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        mode: 'cors',
        body: JSON.stringify(this.state.originalSquares),
      }

      var response = fetch(SOLVE_URL, fetchOptions)
      response.then(res => res.json())
        .then(result => this.setState({ solvedSquares: result }))
    }
  }


  render() {
    const quadrantDim = this.quadrantDimension
    const numQuadrants = this.boardQuadrantDimension * this.boardQuadrantDimension

    var board: JSX.Element[] = [];
    var quadrantStyle = { gridTemplateColumns: `repeat(${quadrantDim}, 1fr)` };

    // This lines up the board by creating a list of grids
    // Each grid itself is a list of squares
    // The display is taken care of via the flex display
    // Example: [[*, *, *], [*, *, *], [*, *, *]]
    // The elements of each sublist are displayed in a grid 
    // and then the sublists themselves are displayed in a grid. 
    // In this case the sublists are the quadrants of numbers 1..9. 
    // The elements of the sublist are the squares 1..9
    const squares = this.state.squares.slice()
    for (let q = 0; q < numQuadrants; q++) {
      var quadrant: JSX.Element[] = []
      for (let iQ = 0; iQ < quadrantDim; iQ++) {
        for (let jQ = 0; jQ < quadrantDim; jQ++) {
          let [i, j] = this.quadrantToBoard(q, iQ, jQ)
          var readOnly = false;
          if ((this.state.originalSquares != null) && Boolean(this.state.originalSquares[i][j])) {
            readOnly = true;
          }
          var box = (
            <TextBox
              value={squares[i][j]}
              handleChange={(event: React.FormEvent<HTMLInputElement>) => this.handleInput(event, i, j)}
              setFocus={() => this.handleFocus(i, j)}
              key={`$${i}${j}`}
              readOnly={readOnly}
            />
          )
          quadrant.push(box)
        }
      }

      board.push(
        <div className="quadrant" style={quadrantStyle} key={`${q}`} >
          {quadrant}
        </div>
      )

    }

    const boardStyle = { gridTemplateColumns: `repeat(${this.boardQuadrantDimension}, 1fr)` };
    var grid = (
      <div className="wrapper">
        <div className="board" style={boardStyle}>
          {board}
        </div>
        <Revealer
          handleRevealSquareClick={() => this.handleRevealSquareClick()}
          handleRevealBoardClick={() => this.handleRevealBoardClick()}
          handleCreateBoardClick={() => this.handleCreateBoardClick()}
          handleGenerateBoardClick={() => this.handleGenerateBoardClick()}
          handleClearBoardClick={() => this.handleClearBoardClick()}
        />
      </div>
    )
    return grid
  }
}

const App: React.FC = () => {

  return (
    <div className="App">
      <Board />
    </div>
  );
}

export default App;
