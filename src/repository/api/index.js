import axios from 'axios';

const baseDomain = 'http://localhost:5000/dicom-viewer-dac76/asia-east2';
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
