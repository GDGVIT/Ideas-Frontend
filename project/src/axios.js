import axios from 'axios'
const instance = axios.create({ baseURL: 'https://ideas-backend-production.up.railway.app' })
export default instance
