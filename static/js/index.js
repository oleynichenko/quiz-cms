(function () {
'use strict';

const logout = (elem) => {
  elem.addEventListener(`click`, (event) => {
    event.preventDefault();
    const options = {
      method: `POST`,
      credentials: `include`
    };

    fetch(`/logout`, options)
        .then((res) => {
          window.location.href = res.url;
        });
  });
};

const logoutLink = document.querySelector(`.js-logout`);
console.log(`пока человечек`);

if (logoutLink) {
  logout(logoutLink);
}

}());
