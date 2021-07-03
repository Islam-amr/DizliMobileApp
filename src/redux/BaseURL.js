import axios from 'axios';

axios.defaults.timeout = 10000;
axios.defaults.headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-localization': 'en',
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
  Expires: '0',
};

export default axios.create({
  baseURL: 'https://api.staging.dizli.net/',
});
