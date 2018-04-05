import logout from './logout';

const logoutLink = document.querySelector(`.js-logout`);

if (logoutLink) {
  logout(logoutLink);
}
