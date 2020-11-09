import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const MaxIndex = (arr) => {
  //returns the index of the maximum array entry
  let maxIndex = 0
  let max = 0
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
        maxIndex = i;
        max = arr[i];
    }
  }
  return maxIndex
}

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(6).fill(0))
  
  
  const Next = () => {
    const x = Math.round(Math.random() * 5)
    console.log(x)
    setSelected(x)
  }

  const Vote = (x, points) => {
    const copy = [...points] //update complex data structure stored in state by making a copy
    copy[x] += 1
    setPoints(copy)
  }

  return (
    <>
    <h1>Anecdote of the day</h1>
    <div>
      {props.anecdotes[selected]}
    </div>
    <div>has {points[selected]} votes</div>
    <button onClick={() => Vote(selected, points)}>vote</button>
    <button onClick={Next}>next anecdote</button> 
    <h1>Anecdote with the most votes</h1>
    <div>{props.anecdotes[MaxIndex(points)]}</div>
    <div>has {points[MaxIndex(points)]} votes</div>
    </>
  )
  //onClick={Next} Next only called on click IF Next has no paramters.
  //if it has paramters, event handler becomes () => Next(paramter) 
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)