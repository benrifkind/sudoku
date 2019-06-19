import React, { Component } from 'react';
import './App.css';

interface TextBoxProps {
  value: string
  readOnly: boolean
  handleChange: (event: React.FormEvent<HTMLInputElement>) => void
  setFocus: () => void
}


const TextBox = (props: TextBoxProps) => (
  <div className="square">
    <input className="squareInput"
      value={props.value}
      onChange={event => props.handleChange(event)}
      onFocus={() => props.setFocus()}
      readOnly={props.readOnly}
    />
  </div>
)


// Buttons that control whether to reveal answer
interface RevealerProps {
  handleClick: (event: React.MouseEvent) => void
}
export const Revealer = (props: RevealerProps) => (
  <div className="reveal">
    <button className="revealSquare" onClick={props.handleClick}>Reveal Square</button>
    <button className="revealBoard">Reveal Board</button>
  </div>
)

export interface BoardState {
  squares: string[][]
  originalSquares: string[][]
  solvedSquares: string[][]
  focusSquare: [number, number]
}

class Board extends Component<{}, BoardState> {
  quadrantDimension = 3
  boardQuadrantDimension = 3

  originalSquares: string[][] = [
    ['9', '', '', '', '', '8', '', '7', ''],
    ['5', '', '', '6', '7', '9', '2', '3', ''],
    ['1', '', '', '', '', '5', '9', '6', ''],
    ['8', '5', '', '7', '', '2', '6', '', ''],
    ['', '', '9', '8', '', '', '7', '', '2'],
    ['3', '7', '', '1', '', '', '', '', ''],
    ['', '', '4', '', '3', '', '5', '8', '6'],
    ['', '8', '3', '', '6', '', '', '', '4'],
    ['', '1', '5', '', '8', '', '', '', '']
  ]

  constructor(props: any) {
    super(props);

    var solvedSquares: string[][] = JSON.parse(JSON.stringify(this.originalSquares));
    for (let i = 0; i < solvedSquares.length; i++) {
      for (let j = 0; j < solvedSquares[i].length; j++) {
        if (!Boolean(solvedSquares[i][j])) {
          solvedSquares[i][j] = "*"
        }
      }
    }
    var squares: string[][] = JSON.parse(JSON.stringify(this.originalSquares))

    this.state = {
      originalSquares: this.originalSquares,
      squares: squares,
      focusSquare: [0, 0],
      solvedSquares: solvedSquares,
    };

  }


  componentDidMount() {
    let fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      mode: 'cors',
      body: JSON.stringify(this.state.originalSquares),
    }
    
    var response = fetch(`http://localhost:5001/solve`, fetchOptions)
    response.then(res => res.json())
    .then(result => this.setState({ solvedSquares: result }))
  }

  
  quadrantToBoard(quadrant: number, iQ: number, jQ: number){
    var i = Math.floor(quadrant / this.boardQuadrantDimension) * this.quadrantDimension + iQ
    var j = (quadrant % this.boardQuadrantDimension) * this.quadrantDimension + jQ

    return [i, j]
  }

  boardToQuadrant(i: number, j: number){
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

  handleRevealSquareClick(event: React.MouseEvent) {
    var squares = this.state.squares.slice()
    var [i, j] = this.state.focusSquare
    squares[i][j] = this.state.solvedSquares[i][j]
    this.setState({ squares: squares })
  }


  render() {
    const quadrantDim = this.quadrantDimension
    const numQuadrants = this.boardQuadrantDimension * this.boardQuadrantDimension

    var board: JSX.Element[] = [];
    var style = { gridTemplateColumns: `repeat(${quadrantDim}, 1fr)` };

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
          var box = (
            <TextBox
              value={squares[i][j]}
              handleChange={(event: React.FormEvent<HTMLInputElement>) => this.handleInput(event, i, j)}
              setFocus={() => this.handleFocus(i, j)}
              key={`$${i}${j}`}
              readOnly={Boolean(this.state.originalSquares[i][j])}
            />
          )
          quadrant.push(box)
        }
      }

      board.push(
        <div className="quadrant" style={style} key={`${q}`} >
          {quadrant}
        </div>
      )

    }

    var grid = (
      <div className="wrapper">
        <div className="board" style={style}>
          {board}
        </div>
        <Revealer handleClick={(event) => this.handleRevealSquareClick(event)} />
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
