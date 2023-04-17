import { useDispatch, useSelector } from 'react-redux'  
import { vote } from '../reducers/anecdoteReducer'

const Anecdotes = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(({ filter, anecdotes }) => {
      if ( filter === '' ) {
        return anecdotes
      }
      else {
        return anecdotes.filter((anecdote) => 
        anecdote.content
          .toLowerCase()
          .includes(filter.toLowerCase()))
      }
    })
  

  return(
    <>
    {anecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => dispatch(vote(anecdote.id))}>vote</button>
        </div>
      </div>
    )}
    </>
  )
}

export default Anecdotes