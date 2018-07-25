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

  saveIp(ips = [], ip) {
    if (ips.indexOf(ip) === -1) {
      ips.push(ip);
    }
  }
}

module.exports = new SessionsStore();
