import axios from 'axios'

const APIv1 = axios.create({
  baseURL: 'http://localhost:4000', // Temporary location of Runlog API
  timeout: 10000,
  withCredentials: false,
})

export { APIv1 }
