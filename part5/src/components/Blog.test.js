import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from './Blog'

test('blog\'s title and author, but does not render its URL or number of likes', () => {
  const blog = {
    title: 'Blogs rendering',
    author: 'Jared Klopstein',
    url: 'jaredklopstein.com/blog/example',
    likes: 4,
    userId: '642aefae383895510fe20285'
  }

  render(<Blog blog={blog} />)


  const element = screen.getByText('Blogs rendering Jared Klopstein')
  expect(element).not.toHaveTextContent('jaredklopstein.com/blog/example')
  expect(element).not.toHaveTextContent('4')
})

test('checks that the blog\'s URL and number of likes are shown when the button controlling the shown details has been clicked.', async () => {
  const loggedUser = {
    name: 'user'
  }

  const blog = {
    title: 'Blogs rendering',
    author: 'Jared Klopstein',
    url: 'jaredklopstein.com/blog/example',
    likes: 4,
    userId: '642aefae383895510fe20285',
    user: ''
  }

  const mockHandler = jest.fn()
  const deleteBlog = jest.fn()

  const component = render(
    <Blog blog={blog} handleLike={mockHandler} user={loggedUser} handleDelete ={deleteBlog}/>
  )
  const user = userEvent.setup()
  const viewButton = screen.getByText('View')
  await user.click(viewButton)

  expect(component.container).toHaveTextContent('jaredklopstein.com/blog/example')
  expect(component.container).toHaveTextContent('4')
})

test('if the like button is clicked twice, the event handler the component received as props is called twice.', async () => {
  const loggedUser = {
    name: 'user'
  }

  const blog = {
    title: 'Blogs rendering',
    author: 'Jared Klopstein',
    url: 'jaredklopstein.com/blog/example',
    likes: 4,
    userId: '642aefae383895510fe20285',
    user: ''
  }

  const mockHandler = jest.fn()
  const deleteBlog = jest.fn()

  render(
    <Blog blog={blog} handleLike={mockHandler} user={loggedUser} handleDelete ={deleteBlog}/>
  )

  const user = userEvent.setup()
  const viewButton = screen.getByText('View')
  await user.click(viewButton)
  const likeButton = screen.getByText('Like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})