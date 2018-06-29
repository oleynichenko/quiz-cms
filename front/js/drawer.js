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

export default init;
