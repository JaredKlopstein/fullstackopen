import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('some error happened...')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogOut = () => {
    setUser(null);
    window.localStorage.removeItem('loggedBlogappUser')
  };

  const blogForm = () => (
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

  const addBlog = (event) => {
    event.preventDefault();
    const blogObject = {
      title: title,
      author: author,
      url: url,
    };

    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
      setTitle("");
      setAuthor("");
      setURL("");
    });
  };

  return (
    <div>
    {!user && 
    <>
    <h1>Log into application</h1>
    {loginForm()}
    </>
    } 
    {user && 
      <div>
       <h2>Blogs</h2>
       <p>{user.name} logged in</p>
       {user && <button onClick={() => handleLogOut()}>
          Logout
        </button>}
        {blogForm()}
       {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </div>
    }
    </div>
  )
}

export default App