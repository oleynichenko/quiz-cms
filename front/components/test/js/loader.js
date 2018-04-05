import {SERVER_URL_POST} from './const.js';

const sendPass = (data) => {
  const dataJSON = JSON.stringify(data);

  const requestSettings = {
    method: `POST`,
    body: dataJSON,
    headers: {
      'Content-Type': `application/json`
    },
    credentials: `include`
  };

  return fetch(`${SERVER_URL_POST}`, requestSettings)
      .then((res) => res.json());
};

export default {
  sendPass
};
