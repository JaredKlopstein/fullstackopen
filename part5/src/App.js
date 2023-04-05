import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Toggable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()

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
      setNotification('Incorrect username or password')
      setTimeout(() => {
        setNotification(null)
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
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog))
      setNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    })
  }

  const blogForm = () => (
    <>
      <Togglable buttonLabel='New Blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
    </>
  )

  const handleLike = async (blog) => {
    const changedBlog = { ...blog, likes: blog.likes + 1 }
    await blogService.update(blog, changedBlog)
    setBlogs(blogs.map(blog => blog.id !== changedBlog.id ? blog : changedBlog))
  }

  const handleDelete = async (blog) => {
    if(window.confirm(`Remove ${blog.title} by ${blog.author}`)) {
      await blogService
        .remove(blog)
      setBlogs(blogs.filter(currnetBlog => currnetBlog.id !== blog.id))
    }
  }

  return (
    <div>
      {!user &&
    <>
      <h1>Log into application</h1>
      {notification !== null && <Notification message={notification}/>}
      {loginForm()}
    </>
      }
      {user &&
      <div>
        <h2>Blogs</h2>
        {notification !== null && <Notification message={notification}/>}
        <p>{user.name} logged in</p>
        {user && <button onClick={() => handleLogOut()}>
          Logout
        </button>}
        {blogForm()}
        {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
          <Blog key={blog.id}
            blog={blog}
            user={user}
            handleLike={() => handleLike(blog)}
            handleDelete={() => handleDelete(blog)}/>
        )}
      </div>
      }
    </div>
  )
}

export default App