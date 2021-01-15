import React from 'react';

const Course = ({course}) => (
    <>
    <Header text={course.name} />
    <Content parts={course.parts} />
    </>
  )

const Header = ({text}) => (
    <h1>{text}</h1>
)

const Content = ({parts}) => (
    <div>
      {parts.map(part =>
        <Part key={part.id} part={part} />
      )}
      <Total parts={parts} />
    </div>
)

const Part = ({part}) => (
    <p>
      {part.name} {part.exercises}
    </p>
)

const Total = ({parts}) => {
  console.log("total props is", parts)
  let initialValue = 0;
  //in an array of objects, initial value is needed for reduce function
  const reducer = (acc, curr) => {
    console.log("reducer acc:", acc, " curr:", curr)
    return acc + curr.exercises;
  }
  return(
    <p><b>Number of exercises {parts.reduce(reducer, initialValue)}</b></p>
  ) 
}

export default Course




