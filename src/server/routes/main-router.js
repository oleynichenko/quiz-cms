const {Router} = require(`express`);
const controller = require(`../controllers/main-controller`);

const mainRouter = new Router();

mainRouter.get(`/`, controller.showHomePage);
mainRouter.post(`/logout`, controller.logOut);
mainRouter.get(`/privacy`, controller.privacy);

module.exports = mainRouter;
