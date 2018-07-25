const sessionsStore = require(`../stores/sessions-store`);

module.exports = (req, res, next) => {

  if (req.session.useragent === void 0 && req.useragent) {
    const ip = req.headers[`x-forwarded-for`];

    if (ip === void 0) {
      sessionsStore.saveIp(req.session.ips, ip);
    }

    sessionsStore.saveUseragent(req.session, req.useragent);
  }

  next();
};
