const dummy = (blogs) => {
  return 1;
};

const total = (array) => {
  const reducer = (sum, item) => {
    return sum + item.likes;
  };

  return array.length === 0 ? 0 : array.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce(
    (favorite, blog) =>
      (favorite = favorite.likes > blog.likes ? favorite : blog),
    0
  );

  return blogs.length === 0
    ? "No blogs"
    : {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes,
      };
};

const mostBlogs = (blogs) => {
  const authors = {};
  const topAuthor = {
    author: "",
    blogs: 0,
  };

  blogs.forEach((blog) => {
    authors[blog.author] = authors[blog.author] ? authors[blog.author] + 1 : 1;
  });

  for (const [author, blogs] of Object.entries(authors)) {
    if (blogs > topAuthor.blogs) {
      topAuthor.author = author;
      topAuthor.blogs = blogs;
    }
  }

  return topAuthor;
};

module.exports = {
  dummy,
  total,
  favoriteBlog,
  mostBlogs,
};
