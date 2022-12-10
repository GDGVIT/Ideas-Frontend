import axios from 'axios'
const instance = axios.create({ baseURL: 'https://ideas-backend.fly.dev' })
export default instance
