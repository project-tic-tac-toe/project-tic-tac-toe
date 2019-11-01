import React from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Game />
    </div>
  );
}

// =================== SQUARE ===================

function Square(props) {
  return (
    <button
      className="square"
      style={{ color: props.color }}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    if (this.props.winner)
      return (
        <Square
          key={i}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          color={this.props.winner.includes(i) ? "red" : "black"}
        />
      );
    else
      return (
        <Square
          key={i}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          color="black"
        />
      );
  }
  renderSquaresFor(n) {
    let squares = [];
    for (let i = n; i < n + 3; i++) {
      squares.push(this.renderSquare(i));
    }
    return squares;
  }
  renderRows(i) {
    return <div className="board-row">{this.renderSquaresFor(i)}</div>;
  }
  render() {
    return (
      <div>
        {this.renderRows(0)}
        {this.renderRows(3)}
        {this.renderRows(6)}
      </div>
    );
  }
}

// =================== GAME ===================
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          location: null
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      sortHistory: false
    };
  }

  handleClick(i) {
    const locations = [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3]
    ];
    let history,current;
    if (this.state.sortHistory) {
      history = this.state.history.slice(this.state.stepNumber);
      current = history[0];
    } else {
      history = this.state.history.slice(0, this.state.stepNumber + 1);
      current = history[history.length - 1];
    }
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    if (this.state.sortHistory)
      this.setState({
        history: [
          {
            squares: squares,
            location: locations[i]
          }
        ].concat(history),
        stepNumber:0,
        xIsNext: !this.state.xIsNext
      });
    else
      this.setState({
        history: history.concat([
          {
            squares: squares,
            location: locations[i]
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = this.state.sortHistory
        ? move !== history.length - 1
          ? "Go to move #" +
            (history.length - move - 1) +
            ` ( ~ ${history[move].location})`
          : "Go to game start"
        : move
        ? "Go to move #" + move + ` ( ~ ${history[move].location})`
        : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner.win;
    } else {
      if (!current.squares.includes(null)) status = "Draw";
      else status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winner={winner ? winner.line : null}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <button
          className="toogle"
          onClick={() =>
            this.setState({
              sortHistory: !this.state.sortHistory,
              history: this.state.history.sort().reverse()
            })
          }
        >
          Sort
        </button>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { line: lines[i], win: squares[a] };
    }
  }
  return null;
}

export default App;
