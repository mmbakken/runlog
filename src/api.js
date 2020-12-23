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

export { APIv1 }
