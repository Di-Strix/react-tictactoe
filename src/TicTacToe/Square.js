import React from 'react'

export default function Square(props) {
    return (
        <button
            className={`square ${props.selected ? 'selected' : ''}`}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    )
}