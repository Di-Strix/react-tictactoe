import React from 'react'

export function calculateWinner(squares) {
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
    for (let i = 0; i < lines.length; i++) {
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

export function calculateDifference(current, prev) {
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

export function getStatus({ winner, diff, xIsNext, current }) {
    if (winner) {
        return {
            status: 'Выиграл ' + winner.character,
            selected: winner.line
        }
    } else if (current.squares.indexOf(null) < 0) {
        return {
            status: 'Ничья',
            selected: []
        }
    } else {
        return {
            status: 'Следующий ход ' + (xIsNext ? 'X' : 'O'),
            selected: [(diff.col - 1) * 3 + (diff.row - 1)]
        }
    }
}

export function renderMoves(history, clickHandler) {
    return history.map((_, move) => {

        const prev = history[move - 1] || {}
        const next = history[move]
        const diff = calculateDifference(next.squares, prev.squares)

        const desc = move
            ? `Перейти к ходу ${move % 2 ? 'X' : 'O'} (${diff.row}:${diff.col})`
            : 'Перейти к началу игры'

        return (
            <li key={move}>
                <button onClick={() => clickHandler(move)}>{desc}</button>
            </li>
        )
    })
}