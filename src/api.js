import axios from 'axios'

let url = 'https://www.runlog.dev/api'

if (process.env.REACT_APP_ENV === 'dev') {
  url = 'http://localhost:4000/api'
}

const APIv1 = axios.create({
  baseURL: `${url}/v1`,
  timeout: 10000,
  withCredentials: false,
})

// Once the JWT is determined, we need to add it to all requests made to the API
const setAuthHeader = (token) => {
  APIv1.defaults.headers.post['authorization'] = token
  APIv1.defaults.headers.get['authorization'] = token
}

export { APIv1, setAuthHeader }
