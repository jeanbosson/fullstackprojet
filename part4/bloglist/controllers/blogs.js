const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const userExtractor = require('../utils/middleware').userExtractor

// Route configurations
blogsRouter.get('/test', (request, response) => {
  response.send('<h1>Hello</h1>')
})

blogsRouter.get('/', async (request, response) => {
  const returnedBlogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(returnedBlogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {

  const blog = request.body
  const user = request.user

  if (!(blog.title && blog.url)) {
    return response.status(400).end()
  }

  const newBlog = new Blog({
    title : blog.title,
    author : blog.author,
    url : blog.url,
    likes : blog.likes || 0,
    user : user._id
  })

  const savedBlog = await newBlog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {

  const user = request.user

  const blog = await Blog.findById(request.params.id)

  if (user.id !== blog.user.toString()) {
    return response.status(401).json({ error: 'You are not allowed to delete blogs that you did not create.' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const toUpdate = { 'likes' : request.body.likes }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, toUpdate, { 'new': true })
  response.json(updatedBlog)
})

module.exports = blogsRouter