import axios from 'axios';

const API_BASE_URL = 'https://api.mixerai.app';

const serverInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default serverInstance;
