const express = require(`express`);
const controller = require(`../controllers/links-controller`);
const {async} = require(`../../libs/util`);

const linksRouter = new express.Router();
linksRouter.use(express.json({extended: false}));

linksRouter.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `http://localhost:3001`);
  res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
  res.header(`Access-Control-Allow-Credentials`, true);
  next();
});

linksRouter.get(`/:permalink`, async(controller.getTest));
// linksRouter.get(`/:permalink/:passId`, async(controller.getPassData));
linksRouter.post(`/:permalink`, async(controller.getCheckedTest));

module.exports = linksRouter;
