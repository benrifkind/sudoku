


import React, { ChangeEvent, CSSProperties, Component } from 'react';
import './App.css';

interface TextBoxProps {
  value: string
}

interface TextBoxState {
  value: string
  text: string
}

class TextBox extends React.Component<TextBoxProps, TextBoxState> {
  constructor(props: TextBoxProps) {
    super(props)
    this.state = {
      value: props.value,
      text: 'text'
    };
  }
  
  handleChange(event: React.FormEvent<HTMLInputElement>) {
    this.setState({ text: event.currentTarget.value});
  } 

  render() {
    return (
      <form>
        <label>
          <input type="text" value={this.state.text} onChange={(event) => this.handleChange(event)} />
        </label>
      </form>
    );
  }


  // render() {
  //   // const property: CSSProperties = <border-left-color="black" />
  //   return (
  //     <input
  //       type="text"
  //       name="title"
  //       value={this.state.value}
  //       className="square"
  //     />
  //   )
  // }

}


export interface BoardState {
  squares: boolean[][]
  // onClick: (i: number) => void,
}

class Board extends Component<{}, BoardState> {
  numberRows = 10
  numberCols = 4

  constructor(props: any) {
    super(props);

    const s: boolean[][] = Array(this.numberRows).fill(false).map((x: boolean) => Array(this.numberCols).fill(false))
    this.state = {
      squares: s
    };
  }

  handleClick(i: number, j: number) {
    const squares = this.state.squares.slice()
    squares[i][j] = true
    this.setState({ squares: squares })
  }

  style(i: number, j: number) {
    if (!this.state.squares[i][j]) {
      return {}
    }
    var style: CSSProperties = { backgroundColor: "white" }
    if (this.state.squares[i][j]) {
      if (j < this.numberCols - 1) {
        style["borderRightColor"] = "white"
      }
      if (j > 0) {
        style["borderLeftColor"] = "white"
      }
      if (i < this.numberRows - 1) {
        style["borderBottomColor"] = "white"
      }
      if (i > 0) {
        style["borderTopColor"] = "white"
      }

    }
    return style
  }

  renderBox(i: number, j: number) {
    return (
      <TextBox 
      value="hello"
      />
    );
  }

  // renderBox(i: number, j: number) {
  //   return (
  //     <button
  //       className="square"
  //       onClick={() => this.handleClick(i, j)}
  //       style={this.style(i, j)}
  //       key={String(i) + "," + String(j)}>
  //     </button>
  //   );
  // }

  render() {
    var array: any[] = Array(this.numberRows)
    for (var i = 0; i < this.numberRows; i++) {
      var tempArray: any[] = Array(this.numberCols)
      for (var j = 0; j < this.numberCols; j++) {
        const textBox = this.renderBox(i, j)
        tempArray[j] = textBox
      }

      array[i] = <div className="board-row">{tempArray}</div>
    }

    return (
      <div className="App">
        {array}
      </div>
    )

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
