const mainRouter = require(`./main-router`);
// const logoutRouter = require(`./logout-router`);
const loginRouter = require(`./login-router`);

const init = (app) => {
  app.use(`/`, mainRouter);
  app.use(`/login`, loginRouter);
  // app.use(`/logout`, logoutRouter);
};

module.exports = {
  init
};
