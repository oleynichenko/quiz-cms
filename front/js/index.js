import logout from './logout';

const logoutLink = document.querySelector(`.js-logout`);
console.log(`пока человечек`);

if (logoutLink) {
  logout(logoutLink);
}
