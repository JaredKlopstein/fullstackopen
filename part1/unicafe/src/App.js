import { useState } from 'react'

const Header = () => (
  <h1>Give Feedback Below</h1>
)

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine = ({ text, value }) => {
    return (
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
      )
}

const Statistics = (props) => {
  let count =  props.good + props.neutral +props.bad
  let average = (props.good - props.bad) / count
  let positive = (props.good / count) * 100

  if(props.bad + props.good + props.neutral !== 0) {
    return <>
    <table>
      <tbody>
        <StatisticLine text='Good' value={props.good} />
        <StatisticLine text='Neutral' value={props.neutral} />
        <StatisticLine text='Bad' value={props.bad} />
        <StatisticLine text='All' value={count} />
        <StatisticLine text='Average' value={average} />
        <StatisticLine text='Positive' value={positive} />
      </tbody>
    </table>
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
