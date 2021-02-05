import React from 'react'
import ReactDOM from 'react-dom'

const Header = (props) => {
  return(
    <>
    <h1>{props.course.name}</h1>
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
  console.log(props)
  return(
    <>
    <Part1 text={props.course.parts[0].name} nr={props.course.parts[0].exercises}/>
    <Part2 text={props.course.parts[1].name} nr={props.course.parts[1].exercises}/>
    <Part3 text={props.course.parts[2].name} nr={props.course.parts[2].exercises}/>
    </>
  )
}

const Total = (props) => {
  return(
    <>
    <p>Number of exercises {props.course.parts[0].exercises + props.course.parts[1].exercises + props.course.parts[2].exercises}</p>
    </>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))