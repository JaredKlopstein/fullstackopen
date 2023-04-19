import { useDispatch, useSelector } from 'react-redux'  
import { vote } from '../reducers/anecdoteReducer'
import { setAndRemoveNotification } from '../reducers/notificationReducer'

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
    const handleClick = (anecdote) => {
        dispatch(vote(anecdote.id))
        dispatch(setAndRemoveNotification(`You voted ${anecdote.content}`));
}
  return(
    <>
    {anecdotes.map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => handleClick(anecdote)}>vote</button>
        </div>
      </div>
    )}
    </>
  )
}

export default Anecdotes