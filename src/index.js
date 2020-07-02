import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {

  return (
    <button
      className={`square ${props.selected ? 'selected' : ''}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (<Square
      key={i}
      value={this.props.squares[i]}
      selected={this.props.selected.includes(i) ? true : false}
      onClick={() => this.props.onClick(i)}
    />)
  }

  render() {
    const cols = Array(3).fill(null)
    const localCounter = counter()

    return (
      <div>
        {
          cols.map((_, i) => (
            <div className="board-row" key={i}>
              {
                cols.map(() => (
                  this.renderSquare(localCounter())
                ))
              }
            </div>
          ))
        }
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(...props) {
    super(...props)

    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      ascendingSort: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()

    if (calculateWinner(squares) || squares[i]) return

    squares[i] = this.state.xIsNext ? 'X' : 'O'

    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)
    let diff

    const moves = history.map((_, move) => {

      const prev = history[move - 1] || []
      const next = history[move]
      diff = calculateDifference(next.squares, prev ? prev.squares : [])

      const desc = move
        ? `Перейти к ходу ${move % 2 ? 'X' : 'O'} (${diff.col}:${diff.row})`
        : 'К началу игры'

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })
    if(!this.state.ascendingSort) moves.reverse()

    const prev = history[this.state.stepNumber - 1] || []
    const next = history[this.state.stepNumber]

    diff = calculateDifference(next.squares, prev ? prev.squares : [])

    let selected = []

    let status
    if (winner) {
      status = 'Выиграл ' + winner.character
      selected = winner.line
    } else if (current.squares.indexOf(null) < 0) {
      status = 'Ничья'
    } else {
      status = 'Следующий ход ' + (this.state.xIsNext ? 'X' : 'O')
      selected = [(diff.col - 1) * 3 + (diff.row - 1)]
    }


    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            selected={selected}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick={() => this.setState({ascendingSort: !this.state.ascendingSort})}>{`Сортировать по ${this.state.ascendingSort ? 'возрастанию' : 'убыванию'}`}</button>
        </div>
      </div>
    )
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
)


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let i
  for (i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        character: squares[a],
        line: lines[i],
        noMoreCells: false
      }
    }
  }
  return null
}

function calculateDifference(current, prev) {
  if (!current || !prev) {
    return {}
  }

  let res = {}

  prev.every((element, i) => {
    if (current[i] !== element) {
      res = {
        col: Math.floor(i / 3) + 1,
        row: Math.floor(i % 3) + 1
      }
      return false
    }
    return true
  })

  return res
}

function counter() {
  let counter = 0
  return () => {
    return counter++
  }
}