const morgan = require('morgan')
const logger = require('./logger')
const User = require('../models/users')
const jwt = require('jsonwebtoken')

// Custom token to get content body for POST method
morgan.token('content', function (req, res) { // eslint-disable-line no-unused-vars

  if (req.method === 'POST') {
    const logging = req.body

    return JSON.stringify(logging)
  }
  return ''
})

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }

  next()
}

const userExtractor = async (request, response, next) => {
  const token = request.token

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  request.user = await User.findById(decodedToken.id)

  next()
}

module.exports = {
  'morgan' : morgan(':method :url :status :res[content-length] - :response-time ms :content'),
  errorHandler,
  tokenExtractor,
  userExtractor
}
