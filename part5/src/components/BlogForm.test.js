import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BlogForm from './BlogForm'

test('the form calls the event handler it received as props with the right details when a new blog is created.', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  render(<BlogForm createBlog={createBlog} />)
  screen.debug()
  const inputs = screen.getAllByRole('textbox')
  const createButton = screen.getByText('Create')

  await user.type(inputs[0], 'Jared dislikes tests')
  await user.type(inputs[1], 'Jared Klopstein')
  await user.type(inputs[2], 'example.com')
  await user.click(createButton)


  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Jared dislikes tests')
  expect(createBlog.mock.calls[0][0].author).toBe('Jared Klopstein')
  expect(createBlog.mock.calls[0][0].url).toBe('example.com')
})