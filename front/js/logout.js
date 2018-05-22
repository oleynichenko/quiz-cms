const logout = (elem) => {
  elem.addEventListener(`click`, (event) => {
    event.preventDefault();
    const options = {
      method: `POST`,
      credentials: `include`
    };

    fetch(`/logout`, options);
        // .then((res) => {
        //   window.location.href = res.url;
        // });
  });
};

export default logout;
