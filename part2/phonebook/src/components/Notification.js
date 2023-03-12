import React from 'react'

const Notification = ({ message, type }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className={type === 'notification' ? 'notification' : 'error'}>
        {message}
      </div>
    )
  }

export default Notification