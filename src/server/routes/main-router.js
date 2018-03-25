const {Router} = require(`express`);
const checkAuth = require(`../middleware/check-auth`);
const controller = require(`../controllers/main-controller`);

const mainRouter = new Router();

mainRouter.get(`/`, controller.showHomePage);
mainRouter.get(`/admin`, checkAuth, controller.showAdminPanel);
mainRouter.post(`/logout`, controller.logOut);

module.exports = mainRouter;
