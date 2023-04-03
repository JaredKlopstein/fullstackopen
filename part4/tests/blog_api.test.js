require("dotenv").config();
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./blog_helper");
const config = require("../utils/config");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const api = supertest(app);

beforeAll(async () => {
  await mongoose.connect(config.MONGODB_URI);
}, 100000);

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
}, 100000);

describe("GET Tests", () => {
  test("Blog length is correct", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  }, 100000);
  test("Blogs returned as JSON", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  test("Blogs ID is ID", async () => {
    const result = await api.get(`/api/blogs/`);

    expect(result.body[0].id).toBeDefined();
  }, 100000);
});

describe("POSTS Tests", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const rootUser = new User({ username: "root", password: "password" });

    const savedUser = await rootUser.save();
  }, 20000);

  test("A blog can be added", async () => {
    const user = await User.findOne({ username: "root" });
    const userForToken = { username: "root", id: user._id };
    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60,
    });

    const newBlog = {
      title: "Jared makes an app V2",
      author: "Jared Klopstein",
      url: "jaredklopstein.com/blog/example",
      likes: 4,
    };

    await api
      .post("/api/blogs")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const title = blogsAtEnd.map((b) => b.title);
    expect(title).toContain("Jared makes an app V2");
  });

  test("A blog without likes is defaulted to 0", async () => {
    const user = await User.findOne({ username: "root" });
    const userForToken = { username: "root", id: user._id };
    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60,
    });
    const newBlog = {
      title: "Jared makes an app V2",
      author: "Jared Klopstein",
      url: "jaredklopstein.com/blog/example",
    };

    await api
      .post("/api/blogs")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const likes = blogsAtEnd.map((b) => b.likes);
    expect(likes).toContain(0);
  });

  test("no token", async () => {
    const user = await User.findOne({ username: "root" });
    const userForToken = { username: "root", id: user._id };
    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60,
    });
    const newBlog = {
      title: "Testing is hard",
      author: "Jared Klopstein",
      url: "example.com",
    };

    const blogsAtStart = await helper.blogsInDb();

    const result = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("content-type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
  }, 20000);

  test("Blog without URL or Title does not get added", async () => {
    const newBlog = {
      author: "Jared Klopstein",
      likes: 4,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("deletion of a note", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const user = await User.findOne({ username: "root" });
    const userForToken = { username: "root", id: user._id };
    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60,
    });
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set({
      Authorization: `Bearer ${token}`,
    })
    .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const title = blogsAtEnd.map((b) => b.title);

    expect(title).not.toContain(blogToDelete.title);
  });
});

describe("updating a note", () => {
  test("returns new note with updated likes ", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    blogToUpdate.likes = 100;

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200);

    const blogLikes = blogToUpdate.likes;

    expect(blogLikes).toBe(100);
  });
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "BillyC",
      name: "Bill Cosby",
      password: "puddin",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "password",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("expected `username` to be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test("if username is less than or equal to 3 characters", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "rt1",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "username must be longer than 3 characters"
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test("if password is less than or equal to 3 characters", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root11",
      name: "Superuser",
      password: "sal",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "password must be longer than 3 characters"
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
  test("username is missing", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "Superuser",
      password: "sal",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("username and password are required");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
  test("password is missing", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      user: "Jared",
      name: "Superuser",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("username and password are required");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
