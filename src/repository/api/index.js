import axios from 'axios';

const baseDomain = process.env.REACT_APP_API_DOMAIN;
const baseURL = `${baseDomain}`;

const api = axios.create({
  baseURL,
  headers: {
    // "Authorization": "Bearer xxxxx"
  },
  transformResponse: [
    (response) => {
      // Do whatever you want to transform the data
      return JSON.parse(response);
    },
  ],
});

export default api;
