import axios from 'axios'

let url = 'https://www.runlog.dev/api'

if (import.meta.env.DEV) {
  url = 'http://localhost:4000/api'
}

const APIv1 = axios.create({
  baseURL: `${url}/v1`,
  timeout: 10000,
  withCredentials: false,
})

// Once the JWT is determined, we need to add it to all requests made to the API
const setAuthHeader = (token) => {
  APIv1.defaults.headers.post['Authorization'] = token
  APIv1.defaults.headers.put['Authorization'] = token
  APIv1.defaults.headers.get['Authorization'] = token
  APIv1.defaults.headers.delete['Authorization'] = token
}

export { APIv1, setAuthHeader }
