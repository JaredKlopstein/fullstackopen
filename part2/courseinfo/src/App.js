const Course = ({course}) => {
  const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)
  
  return (
    <>  
  <h1>{course.name}</h1>
    {course.parts.map(part => 
      <p key={part.id}> {part.name} {part.exercises}</p>
      )}
    <b>There are a total of {total} exercises</b>
  </>
)}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  // const total = parts.reduce((s, p) => someMagicHere)


  return (
    <>
    <Course course={course} />
    </>
  )
  
}

export default App