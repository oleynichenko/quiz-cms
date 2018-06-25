const sessionsStore = require(`../stores/sessions-store`);

module.exports = (req, res, next) => {
  if (!req.session.useragent) {
    sessionsStore.addUseragentToSession(req.sessionID, req.useragent, req.ip);
  }

  next();
};
