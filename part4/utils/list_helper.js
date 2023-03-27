const dummy = (blogs) => {
    return 1
  }

const total = (array) => {
    const reducer = (sum, item) => {
      return sum + item.likes
    }
  
    return array.length === 0
      ? 0
      : array.reduce(reducer, 0)
  }

  const favoriteBlog = (blogs) => {
    const favorite = blogs.reduce((favorite, blog) => favorite = favorite.likes > blog.likes ? favorite : blog, 0)
    
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
      }
  }


  
  module.exports = {
    dummy,
    total,
    favoriteBlog
  }

