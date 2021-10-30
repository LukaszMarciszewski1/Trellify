import axios from 'axios'

const url = 'http://localhost:5000/tasks'

// export const fetchTasks = () => axios.get(url)

const api = axios.create({
  baseURL: url,
  headers: {
    "Content-type": "application/json"
  }
});

export default api
