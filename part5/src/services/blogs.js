import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const request = axios.get(baseUrl)
  const response = await request
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (blog, newObject) => {
  const response = await axios.put(`${baseUrl}/${blog.id}`, newObject)
  return response.data
}

const remove = async (blog) => {
  const config =  {
    headers: { Authorization: token }
  }

  const response = await axios.delete(`${baseUrl}/${blog.id}`, config)
  return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, update, remove, setToken }