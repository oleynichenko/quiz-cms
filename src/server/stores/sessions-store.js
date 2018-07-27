class SessionsStore {
  constructor() {
  }

  saveUseragent(session, useragent) {
    let shortUseragent = {};

    for (let key in useragent) {
      if (useragent[key] !== false) {
        shortUseragent[key] = useragent[key];
      }
    }

    delete shortUseragent.source;
    session.useragent = shortUseragent;
  }

  saveIp(session, ip) {
    if (session.ips === void 0) {
      session.ips = [ip];
    } else if (session.ips.indexOf(ip) === -1) {
      session.ips.push(ip);
    }
  }
}

module.exports = new SessionsStore();
