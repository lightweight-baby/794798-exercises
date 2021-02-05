import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
)

const Statistic = ({text, number}) => (
  <tbody>
    <tr>
      <td>{text}</td> 
      <td>{number}</td>
    </tr>
  </tbody>
)


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  var all=good+neutral+bad

  const incGood = () => {
    setGood(good+1)
  }

  const incNeutral = () => {
    setNeutral(neutral+1)
  }

  const incBad = () => {
    setBad(bad+1)
  }

  if (all === 0) {
    return (
      <div>
        <h1>give feedback</h1>
        <Button handleClick={incGood} text="good" />
        <Button handleClick={incNeutral} text="neutral" />
        <Button handleClick={incBad} text="bad" />
        <h1>statistics</h1>
        <div>No feedback given</div>
      </div>
    )
  }
  else {
    return (
      <div>
        <h1>give feedback</h1>
        <Button handleClick={incGood} text="good" />
        <Button handleClick={incNeutral} text="neutral" />
        <Button handleClick={incBad} text="bad" />
        <h1>statistics</h1>
        <table>
          <Statistic text="good" number={good}/>
          <Statistic text="neutral" number={neutral}/>
          <Statistic text="bad" number={bad}/>
          <Statistic text="all" number={all}/>
          <Statistic text="average" number={(good-bad)/all}/>
          <Statistic text="positive" number={100*good/all + "%"}/>
        </table>
      </div>
    )
  }
  
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)