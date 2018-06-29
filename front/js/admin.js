import logout from './logout';
import drawerInit from './drawer';

const logoutLink = document.querySelector(`.js-logout`);
const drawerBlock = document.querySelector(`.mdc-drawer`);

if (drawerBlock) {
  const drawerBtn = document.querySelector(`.demo-menu`);
  drawerInit(drawerBlock, drawerBtn);
}

if (logoutLink) {
  logout(logoutLink);
}
