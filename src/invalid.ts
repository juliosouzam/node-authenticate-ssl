import axios from 'axios';
import agent from './agent';

const serverUrl = 'https://localhost:4433/authenticate';
const opts = { httpsAgent: agent('bob') };

axios
  .get(serverUrl, opts)
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => {
    console.error(err.response.data);
  });
