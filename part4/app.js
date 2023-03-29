const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')

const blogsRouter = require('./controllers/blogs')

const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const config = require('./utils/config')

const app = express()
mongoose.set('strictQuery', false)

console.log('connecting to', config.MONGODB_URI)


process.env.NODE_ENV === 'test' 
  ? ''
  : connect();

function connect() {
    mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
});
}

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app