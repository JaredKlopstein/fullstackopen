import { useState } from "react";

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setURL] = useState('')
  
    const addBlog = (event) => {
        event.preventDefault();
        createBlog({
          title: title,
          author: author,
          url: url,
        });
        setTitle("");
        setAuthor("");
        setURL("");
    }

    return (
        <>
        <h2>Create new Blog</h2>
        <form onSubmit={addBlog}>
          <div>
          Title:<input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            />
            </div>
            <div>
          Author:<input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            />
            </div>
            <div>
          URL:<input
            value={url}
            onChange={({ target }) => setURL(target.value)}
            />
            </div>
          <button type="submit">Create</button>
        </form>  
            </>
    )
  }
  
  export default BlogForm