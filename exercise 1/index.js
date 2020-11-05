import React from 'react'
import ReactDOM from 'react-dom'

const Header = (props) => {
  return(
    <>
    <h1>{props.course}</h1>
    </>
  )
}

const Part1 = (props) => {
  //i guess that the three different parts can be looped through somehow, this seems inefficient
  return(
    <>
    <p>{props.text} {props.nr}</p>
    </>
  )
}

const Part2 = (props) => {
  return(
    <>
    <p>{props.text} {props.nr}</p>
    </>
  )
}

const Part3 = (props) => {
  return(
    <>
    <p>{props.text} {props.nr}</p>
    </>
  )
}

const Content = (props) => {
  return(
    <>
    <Part1 text={props.part1} nr={props.exercises1}/>
    <Part2 text={props.part2} nr={props.exercises2}/>
    <Part3 text={props.part3} nr={props.exercises3}/>
    </>
  )
}

const Total = (props) => {
  return(
    <>
    <p>Number of exercises {props.exercises1 + props.exercises2 + props.exercises3}</p>
    </>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course}/>
      <Content part1={part1} exercises1={exercises1} part2={part2} exercises2={exercises2} part3={part3} exercises3={exercises3}/>
      <Total exercises1={exercises1} exercises2={exercises2} exercises3={exercises3}/>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))