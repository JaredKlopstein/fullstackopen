import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
    })
    setTitle('')
    setAuthor('')
    setURL('')
  }

  return (
    <>
      <h2>Create new Blog</h2>
      <form onSubmit={addBlog}>
        <div>
          Title:<input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            className="title"
          />
        </div>
        <div>
          Author:<input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            className="author"
          />
        </div>
        <div>
          URL:<input
            value={url}
            onChange={({ target }) => setURL(target.value)}
            className="url"
          />
        </div>
        <button type="submit" className="create-button">Create</button>
      </form>
    </>
  )
}

export default BlogForm