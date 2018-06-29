(function () {
'use strict';

let drawer = new mdc.drawer.MDCPersistentDrawer(document.querySelector('.mdc-drawer--persistent'));
document.querySelector('.demo-menu').addEventListener('click', () => {
  if (drawer.open) {
    drawer.open = false;
  } else {
    drawer.open = true;
  }
});

}());
