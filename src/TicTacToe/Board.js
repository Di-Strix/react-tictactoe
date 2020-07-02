import React from 'react'
import Square from './Square'

export default class Board extends React.Component {
    renderSquare(i) {
        return (<Square
            key={i}
            value={this.props.squares[i]}
            selected={this.props.selected.includes(i) ? true : false}
            onClick={() => this.props.onClick(i)}
        />)
    }

    render() {
        return (
            <div>
                {genBoard.call(this, 3)}
            </div>
        )
    }
}

function genBoard(size) {
    const localCounter = counter()

    const cols = Array(3).fill(null)
    return (
        cols.map((_, i) => (
            <div className="board-row" key={i}>
                {
                    cols.map(() => (
                        this.renderSquare(localCounter())
                    ))
                }
            </div>
        ))
    )
}

function counter() {
    let counter = 0
    return () => {
        return counter++
    }
}
