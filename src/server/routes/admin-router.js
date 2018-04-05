const express = require(`express`);
const controller = require(`../controllers/admin-controller`);
const checkAuth = require(`../middleware/check-auth`);
const {async} = require(`../../libs/util`);

const adminRouter = new express.Router();

adminRouter.get(`/`, checkAuth, async(controller.showAdminPanel));
adminRouter.get(`/:testId`, checkAuth, controller.showStat);

module.exports = adminRouter;
