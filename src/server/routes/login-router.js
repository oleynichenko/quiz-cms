const express = require(`express`);
const controller = require(`../controllers/login-controller`);
const {async} = require(`../../libs/util`);

const loginRouter = new express.Router();
loginRouter.use(express.urlencoded({extended: false}));

loginRouter.get(`/`, controller.showForm);
loginRouter.post(`/`, async(controller.handleForm));

module.exports = loginRouter;
