require('dotenv').config()
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./blog_helper')
const config = require('../utils/config')

const api = supertest(app)

beforeAll(async () => {
   await mongoose.connect(config.MONGODB_URI);
},100000)

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  },100000)

describe('GET Tests', () => {
test('Blog length is correct', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
}, 100000)
test('Blogs returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
test('Blogs ID is ID', async () => {
    const result = await api
    .get(`/api/blogs/`)

  expect(result.body[0].id).toBeDefined()
}, 100000)
})

describe('POSTS Tests', () => {
test('A blog can be added', async () => {
    const newBlog = {
        "title": "Jared makes an app V2",
        "author": "Jared Klopstein",
        "url": "jaredklopstein.com/blog/example",
        "likes": 4
      }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  
    const title = blogsAtEnd.map(b => b.title)
    expect(title).toContain(
      'Jared makes an app V2'
    )
  })

test('A blog without likes is defaulted to 0', async () => {
    const newBlog = {
        "title": "Jared makes an app V2",
        "author": "Jared Klopstein",
        "url": "jaredklopstein.com/blog/example",
      }
      
        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      
        const blogsAtEnd = await helper.blogsInDb()
        const likes = blogsAtEnd.map(b => b.likes)
        expect(likes).toContain(0)
      })

test('Blog without URL or Title does not get added', async () => {
    const newBlog = {
        "author": "Jared Klopstein",
        "likes": 4
      }
      
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
      
        const blogsAtEnd = await helper.blogsInDb()
      
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
      })
})

describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
  
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
  
      const blogsAtEnd = await helper.blogsInDb()
  
      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
      )
  
      const title = blogsAtEnd.map(b => b.title)
  
      expect(title).not.toContain(blogToDelete.title)
    })
  })

describe('updating a note', () => {
    test('returns new note with updated likes ', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        
        blogToUpdate.likes = 100;

        await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .send(blogToUpdate)
          .expect(200)
    
        const blogLikes = blogToUpdate.likes
    
        expect(blogLikes).toBe(100)
    })
})

afterAll(async () => {
  await mongoose.connection.close()
})

