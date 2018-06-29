(function () {
'use strict';

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

const init = (elem, btn) => {
  const drawer = new window.mdc.drawer.MDCPersistentDrawer(elem);

  btn.addEventListener(`click`, () => {
    if (drawer.open) {
      drawer.open = false;
    } else {
      drawer.open = true;
    }
  });
};

const logoutLink = document.querySelector(`.js-logout`);
const drawerBlock = document.querySelector(`.mdc-drawer`);

if (drawerBlock) {
  const drawerBtn = document.querySelector(`.demo-menu`);
  init(drawerBlock, drawerBtn);
}

if (logoutLink) {
  logout(logoutLink);
}

}());
