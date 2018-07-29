const sessionsStore = require(`../stores/sessions-store`);

module.exports = (req, res, next) => {
  const session = req.session;
  const header = `x-forwarded-for`;
  const ips = req.headers[header];

  if (ips !== void 0) {
    const ip = ips.split(`,`)[0];

    sessionsStore.saveIp(session, ip);
  }

  if (session.useragent === void 0 && req.useragent) {
    sessionsStore.saveUseragent(session, req.useragent);
  }

  next();
};
