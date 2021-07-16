const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./blog_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const Blog = require('../models/blogs')
const User = require('../models/users')

// Starting the test database from scratch with initial blogs
beforeEach(async () => {

  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

})

describe('checking blog return and json format', () => {

  test('blogs are returned as json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const returnBlogs = await api.get('/api/blogs')

    expect(returnBlogs.body).toHaveLength(helper.initialBlogs.length)
  })

})

describe('check for presence of unique identifier - id', () => {

  test('should contain definition of id', async () => {
    const returnedBlogs = await api.get('/api/blogs')

    expect(returnedBlogs.body[0].id).toBeDefined()

  })

})

describe('POST requests work and create valid new blog post', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('something', 10)

    const user = new User({
      username : 'root',
      name : 'Sami',
      passwordHash
    })

    await user.save()

  })

  test('should add new blog post to database', async () => {
    const testUser = await helper.testUser()

    const newBlog = {
      title: 'Best photos ever',
      author: 'Aazreen',
      url: 'www.canva.com',
      likes: 2,
      user: testUser.user._id
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testUser.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain(`${newBlog.title}`)

  })

  test('should check if new blog post with no likes defaults to 0', async () => {
    const testUser = await helper.testUser()

    const newLikeBlog = {
      title: 'Best photos ever',
      author: 'Aazreen',
      url: 'www.canva.com',
      user: testUser.user._id
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testUser.token}`)
      .send(newLikeBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Check if initially likes is not defined
    expect(newLikeBlog.likes).not.toBeDefined()

    const newBlogsAtEnd = await helper.blogsInDb()
    expect(newBlogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const likeCheck = newBlogsAtEnd.find(blog => blog.title === newLikeBlog.title)
    expect(likeCheck.likes).toBe(0)

  })

  test('should receive 404 response if title is missing in blog post', async () => {
    const testUser = await helper.testUser()

    const titleBlog = {
      author: 'Aazreen',
      url: 'www.canva.com',
      likes: 20,
      user: testUser.user._id
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testUser.token}`)
      .send(titleBlog)
      .expect(400)

    const blogsCheck = await helper.blogsInDb()
    expect(blogsCheck).toHaveLength(helper.initialBlogs.length)

  })

  test('should receive 404 response if url is missing in blog post', async () => {
    const testUser = await helper.testUser()

    const urlBlog = {
      title: 'What is this blog',
      author: 'Aazreen',
      likes: 20,
      user: testUser.user._id
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testUser.token}`)
      .send(urlBlog)
      .expect(400)

    const urlCheck = await helper.blogsInDb()
    expect(urlCheck).toHaveLength(helper.initialBlogs.length)

  })

  test('should fail posting a blog if token is not given', async () => {
    const testUser = await helper.testUser()

    const newBlog = {
      title: 'Best photos ever',
      author: 'Aazreen',
      url: 'www.canva.com',
      likes: 2,
      user: testUser.user._id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(`${newBlog.title}`)

  })

})

describe('should handle delete functionality when given an id', () => {

  test('should return 204 and database should have 1 item less when author is deleting', async () => {
    const testUser = await helper.testUser()

    const newBlog = {
      title: 'Testing delete function',
      author: 'User',
      url: 'www.canva.com',
      likes: 10,
      user: testUser.user._id
    }

    const savedBlog = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testUser.token}`)
      .send(newBlog)

    const initialBlogs = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${savedBlog.body.id}`)
      .set('Authorization', `bearer ${testUser.token}`)
      .expect(204)

    const endBlogs = await helper.blogsInDb()
    expect(endBlogs).toHaveLength(initialBlogs.length - 1)

    const blogContents = endBlogs.map(blog => blog.title)
    expect(blogContents).not.toContain(newBlog.title)
  })

})

describe('should handle update functionality when given an id', () => {

  test('should update likes when sent to a valid id', async () => {
    const initialBlogs = await helper.blogsInDb()
    const updateBlog = initialBlogs[0]

    const update = { 'likes' : updateBlog.likes + 15 }

    await api
      .put(`/api/blogs/${updateBlog.id}`)
      .send(update)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const endBlog = await helper.blogsInDb()
    const updatedBlog = endBlog.find(blog => blog.id === updateBlog.id)

    expect(updatedBlog.likes).toBe(update.likes)
  })

})

describe('when there is 1 user in the db', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('something', 10)

    const user = new User({
      username : 'root',
      name : 'Sami',
      passwordHash
    })

    await user.save()

  })

  test('creation succeeds with a fresh username', async () => {

    const userAtStart = await helper.usersInDb()

    const newUser = {
      name: 'testing',
      username: 'testing',
      password : 'test'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await helper.usersInDb()
    expect(userAtEnd).toHaveLength(userAtStart.length + 1)

    const allUsername = userAtEnd.map(user => user.username)
    expect(allUsername).toContain(newUser.username)

  })

  test('creation fails with a repeated username', async () => {

    const userAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Sami2',
      username: 'root',
      password : 'test'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const userAtEnd = await helper.usersInDb()
    expect(userAtEnd).toHaveLength(userAtStart.length)

    const allName = userAtEnd.map(user => user.name)
    expect(allName).not.toContain(newUser.name)

  })

  test('creation fails with username missing with error message', async () => {

    const userAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Safi',
      password : 'test'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Username & Password both must be provided')

    const userAtEnd = await helper.usersInDb()
    expect(userAtEnd).toHaveLength(userAtStart.length)

    const allName = userAtEnd.map(user => user.name)
    expect(allName).not.toContain(newUser.name)

  })

  test('creation fails with password missing with error message', async () => {

    const userAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Safi',
      username : 'testing2'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Username & Password both must be provided')

    const userAtEnd = await helper.usersInDb()
    expect(userAtEnd).toHaveLength(userAtStart.length)

    const allName = userAtEnd.map(user => user.name)
    expect(allName).not.toContain(newUser.name)

  })

  test('creation fails with less than 3 character password with error message', async () => {

    const userAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Safi',
      username : 'testing2',
      password : '12'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Password must be atleast 3 characters long.')

    const userAtEnd = await helper.usersInDb()
    expect(userAtEnd).toHaveLength(userAtStart.length)

    const allName = userAtEnd.map(user => user.name)
    expect(allName).not.toContain(newUser.name)

  })

})

// Closing database connection after all tests done
afterAll(() => {
  mongoose.connection.close()
})