var _ = require('lodash')

const dummy = (blogs) => { // eslint-disable-line no-unused-vars
  return 1
}

const totalLikes = (blogs) => {
  return blogs.map(blog => blog.likes).reduce((a, b) => a + b, 0)
}

const favoriteBlog = (blogs) => {
  const allLikes = blogs.map(blog => blog.likes)
  const indexMax = _.indexOf(allLikes, _.max(allLikes))

  return blogs.length === 0 ?
    null
    :
    {
      'title' : blogs[indexMax].title,
      'author' : blogs[indexMax].author,
      'likes' : blogs[indexMax].likes,
    }
}

const mostBlogs = (blogs) => {
  // Getting a collectiong of author name and number of repetition
  const results = _.countBy(blogs, (item) => item.author)
  // Getting the author with the highest blogs
  const author = _.maxBy(_.keys(results), (o) => results[o])

  return blogs.length === 0 ?
    null
    :
    {
      'author' : author,
      'blogs' : results[author]
    }
}

const mostLikes = (blogs) => {
  const most_likes = {}

  // Creating collection of author with total likes
  blogs.forEach(blog => most_likes[blog.author] = most_likes[blog.author] ? most_likes[blog.author] + blog.likes : blog.likes)
  // Finding author with most likes
  const author = _.maxBy(_.keys(most_likes), (name) => most_likes[name])

  return blogs.length === 0 ?
    null
    :
    {
      'author' : author,
      'likes' : most_likes[author]
    }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}