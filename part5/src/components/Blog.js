import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [toggle, setToggle] = useState(true)

  const blogStyle = {
    padding: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    borderRadius: 10,
  }
  const handleToggle = () => {
    setToggle(!toggle)
  }

  return (
    (toggle) ?
      <>
        <div style={blogStyle} className='shortBlog'>
          <div>
            {blog.title} {blog.author} <button onClick={handleToggle}>View</button>
          </div>
        </div>
      </>
      : <>
        <div style={blogStyle} className="fullBlog">
          <p>{blog.title} {blog.author} <button onClick={handleToggle}>Hide</button></p>
          <p>{blog.url}</p>
          <p className='likes'>likes {blog.likes} <button onClick={handleLike}>Like</button></p>
          <p>{blog.user.name}</p>
          {blog.user.username === user.username
      && <button onClick={handleDelete}>Delete</button>
          }
        </div>
      </>
  )
}
export default Blog