const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  })

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    if (!request.user) {
      return response.status(401).json({ error: 'token is missing or invalid' })
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = request.user;

    if(!blog.title || !blog.url) {
        response.status(400).end()
    }
    else {
        if (!blog.likes) {
        blog.likes = 0;
        }
        blog.user = user.id;
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        const resultWithUser = await savedBlog.populate('user', { username: 1, name: 1 })
        response.status(201).json(resultWithUser)
    }
  })

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if ( blog.user.toString() === user.id.toString() ) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }
  else {
    return response.status(401).json({ error: 'You are not allowed to delete this.' }).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    const blog = {
      user: body.user.id,
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
  })

module.exports = blogsRouter