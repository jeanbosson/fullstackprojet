const listHelper = require('../utils/list_helper')

// Dummy blogs data
const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

test('dummy returns one', () => {
  const blogs1 = []

  const result = listHelper.dummy(blogs1)
  expect(result).toBe(1)
})

describe('total likes', () => {

  test('of empty list is zero', () => {
    const blogs1 = []

    const result = listHelper.totalLikes(blogs1)
    expect(result).toBe(0)
  })

  test('when list has only 1 blog then total likes equal to that', () => {
    const blogs1 = blogs.filter(blog => blog._id === blogs[0]._id)

    const result = listHelper.totalLikes(blogs1)
    expect(result).toBe(7)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {

  test('of empty list is zero', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toBe(null)
  })

  test('if large list is given', () => {
    const result = listHelper.favoriteBlog(blogs)
    const ideal = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    }

    expect(result).toEqual(ideal)
  })

  test('if large list is given with 2 equal high likes', () => {
    const blogs2 = JSON.parse(JSON.stringify(blogs))
    blogs2[0].likes = 12
    const result = listHelper.favoriteBlog(blogs2)

    expect(result.likes).toEqual(12)
  })

})

describe('most blogs', () => {

  test('of empty list is zero', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toBe(null)
  })

  test('if large list is given', () => {
    const result = listHelper.mostBlogs(blogs)
    const ideal = {
      author: 'Robert C. Martin',
      blogs: 3
    }

    expect(result).toEqual(ideal)
  })

  test('if large list is given with 2 equal authors', () => {
    const blog = blogs.slice(0, -1)
    const result = listHelper.mostBlogs(blog)

    expect(result.blogs).toBe(2)
  })

  test('if 1 item in list is given', () => {
    const blog = blogs.slice(-1)
    const result = listHelper.mostBlogs(blog)

    expect(result.blogs).toBe(1)
  })

})

describe('most likes', () => {

  test('of empty list is zero ', () => {
    const result = listHelper.mostLikes([])

    expect(result).toBe(null)
  })

  test('if large list is given then gives correct result', () => {
    const result = listHelper.mostLikes(blogs)
    const ideal = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }

    expect(result).toEqual(ideal)
  })

  test('if large list with 2 top is given then gives correct result', () => {
    // Creating deep copy
    const items = JSON.parse(JSON.stringify(blogs))
    items[items.length - 1].likes = 7
    const result = listHelper.mostLikes(items)

    expect(result.likes).toBe(17)
  })

})
