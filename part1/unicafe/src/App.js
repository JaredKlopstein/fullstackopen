import { useState } from 'react'

const Header = () => (
  <h1>Give Feedback Below</h1>
)

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Statistics = (props) => {
  if(props.bad + props.good + props.neutral !== 0) {
    return <>
    <h2>Statistics</h2>
    <p>Good: {props.good}</p>
    <p>Neutral: {props.neutral}</p>
    <p>Bad: {props.bad}</p>
    <p>Total: {props.bad + props.good + props.neutral}</p>
    <p>Average: {(props.good - props.bad) / (props.bad + props.good + props.neutral)}</p>
    <p>Positive Ratings: {(props.good) / (props.bad + props.good + props.neutral) * 100}%</p>
    </>
  }
  return  (
    <>
    <h2>Statistics</h2>
    <p>No feedback Given</p>
    </>
  )


}



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
