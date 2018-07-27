const sessionsStore = require(`../stores/sessions-store`);

module.exports = (req, res, next) => {
  const session = req.session;
  const header = `x-forwarded-for`;
  const ip = req.headers[header];

  if (ip !== void 0) {
    sessionsStore.saveIp(session, ip);
  }

  if (session.useragent === void 0 && req.useragent) {
    sessionsStore.saveUseragent(session, req.useragent);
  }

  next();
};
