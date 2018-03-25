const db = require(`../../database`);
const logger = require(`../../libs/logger`);
const ObjectId = require(`mongodb`).ObjectId;

const setupCollection = async () => {
  const dBase = await db;
  const collection = dBase.collection(`users`);
  collection.createIndex({login: -1}, {unique: true});

  return collection;
};

class UserStore {
  constructor(collection) {
    this.collection = collection;
  }

  async getUserByLogin(login) {
    const lowCaseLogin = login.toLowerCase();
    return (await this.collection).findOne({login: lowCaseLogin});
  }

  async getUserById(id) {
    return (await this.collection).findOne({_id: new ObjectId(id)});
  }

  async saveUser(user) {
    const customizedUser = {
      login: user.login.toLowerCase(),
      password: user.password
    };

    return (await this.collection).insertOne(customizedUser);
  }
}

module.exports = new UserStore(setupCollection()
    .catch((error) => logger.error(`Failed to set up "users"-collection`, error)));
