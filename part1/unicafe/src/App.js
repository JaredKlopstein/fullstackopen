import { useState } from 'react'

const Header = () => (
  <h1>Give Feedback Below</h1>
)

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Statistics = (props) => (
  <>
  <h2>Statistics</h2>
  <p>Good: {props.good}</p>
  <p>Neutral: {props.neutral}</p>
  <p>Bad: {props.bad}</p>
  </>
)



const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const goodClick = () => setGood(good + 1)
  const neutralClick = () => setNeutral(neutral + 1)
  const badClick = () => setBad(bad + 1)

  return (
    <div>
      <Header />
      <Button handleClick={(goodClick)} text='Good'/>
      <Button handleClick={neutralClick} text='Neutral'/>
      <Button handleClick={badClick} text='Bad'/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App
