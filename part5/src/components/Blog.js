import { useState } from "react"

const Blog = ({ blog }) => {
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
  };
  
  return (
    (toggle) ? 
      <>
      <div style={blogStyle}>
      <div>
      {blog.title} {blog.author} <button onClick={handleToggle}>View</button>
      </div>
      </div>
      </>
    : <>
    <div style={blogStyle}>
    <p>{blog.title} {blog.author} <button onClick={handleToggle}>Hide</button></p>
    <p>{blog.url}</p>
    <p>likes {blog.likes} <button>Like</button></p> 
    <p>{blog.author}</p>
    </div>
    </>
      )
}
export default Blog