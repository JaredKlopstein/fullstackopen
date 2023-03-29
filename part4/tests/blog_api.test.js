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

afterAll(async () => {
  await mongoose.connection.close()
})