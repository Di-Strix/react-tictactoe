import React from 'react'
import Board from './Board'
import { calculateWinner, calculateDifference, getStatus, renderMoves } from './GameUtils'

export default class Game extends React.Component {
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
        const stepNumber = this.state.stepNumber

        const moves = renderMoves(history, this.jumpTo.bind(this))

        if (!this.state.ascendingSort) moves.reverse()

        const prev = history[stepNumber - 1] || {}
        const current = history[stepNumber]
        const next = history[stepNumber]

        const { status, selected } = getStatus({
            winner: calculateWinner(current.squares),
            diff: calculateDifference(next.squares, prev.squares),
            xIsNext: this.state.xIsNext,
            current
        })

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
                    <button
                        onClick={() => this.setState({ ascendingSort: !this.state.ascendingSort })}
                    >
                        {`Сортировать по ${this.state.ascendingSort ? 'возрастанию' : 'убыванию'}`}
                    </button>
                </div>
            </div>
        )
    }
}