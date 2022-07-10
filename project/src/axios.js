import axios from 'axios'
const instance = axios.create({ baseURL: 'https://ideas-backend-v2.herokuapp.com' })
export default instance
