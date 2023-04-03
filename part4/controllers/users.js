const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  const saltRounds = 10
  
  if(!username || !password) {
    response.status(400).json({
      error: 'username and password are required'
    }).end()
  }
  else {
    if (username.length<= 3) {
      response.status(400).json({
        error: 'username must be longer than 3 characters'
      }).end()
    }
    if (password.length <= 3) {
      response.status(400).json({
        error: 'password must be longer than 3 characters'
      }).end()
    }
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
      username,
      name,
      passwordHash,
    })
  
    const savedUser = await user.save()
  
    response.status(201).json(savedUser)
}
  
})

usersRouter.get('/', async (request, response) => {
  const users = await User
  .find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1 })
    response.json(users)
  })

module.exports = usersRouter