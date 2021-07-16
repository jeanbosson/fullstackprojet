const usersRouter = require('express').Router()
const User = require('../models/users')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => { // eslint-disable-line no-unused-vars
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const initialInfo = request.body

  if (!(initialInfo.username && initialInfo.password)) {
    return response.status(400).send({ error : 'Username & Password both must be provided' })
  } else if (initialInfo.password.length < 3) {
    return response.status(400).send({ error : 'Password must be atleast 3 characters long.' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(initialInfo.password, saltRounds)

  const newUser = new User({
    username : initialInfo.username,
    name : initialInfo.name,
    passwordHash
  })

  const savedUser = await newUser.save()

  response.json(savedUser)
})

module.exports = usersRouter