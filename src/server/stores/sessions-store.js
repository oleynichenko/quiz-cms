const db = require(`../../database`);
const logger = require(`../../libs/logger`);

const setupCollection = async () => {
  const dBase = await db;
  const collection = dBase.collection(`sessions`);

  return collection;
};

class SessionsStore {
  constructor(collection) {
    this.collection = collection;
  }

  async addUseragentToSession(sessionId, useragent, ip) {
    let shortUseragent = {ip};

    for (let key in useragent) {
      if (useragent[key] !== false) {
        shortUseragent[key] = useragent[key];
      }
    }

    return (await this.collection).updateOne(
        {"_id": sessionId},
        {$set: {useragent: shortUseragent}}
    );
  }
}

module.exports = new SessionsStore(setupCollection()
    .catch((error) => logger.error(`Failed to set up "sessions"-collection`, error)));
