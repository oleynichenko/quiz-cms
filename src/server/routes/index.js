const mainRouter = require(`./main-router`);
const loginRouter = require(`./login-router`);
const adminRouter = require(`./admin-router`);
const linksRouter = require(`./links-router`);

const init = (app) => {
  app.use(`/`, mainRouter);
  app.use(`/login`, loginRouter);
  app.use(`/admin`, adminRouter);
  app.use(`/links`, linksRouter);
};

module.exports = {
  init
};
