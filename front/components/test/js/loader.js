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

  return fetch(location.href, requestSettings)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return {};
        }
      });
};

export default {
  sendPass
};
