const db = require(`../../database`);
const logger = require(`../../libs/logger`);
// const ObjectId = require(`mongodb`).ObjectId;

const setupCollection = async () => {
  const dBase = await db;
  const collection = dBase.collection(`passes`);
  // collection.createIndex({id: -1}, {unique: true});

  return collection;
};

class PassesStore {
  constructor(collection) {
    this.collection = collection;
  }

  async getPass(address, sessionId) {
    return (await this.collection).findOne(
        {"address": address, "sessionId": sessionId});
  }

  async deletePass(address, sessionId) {
    return (await this.collection).deleteOne(
        {"address": address, "sessionId": sessionId});
  }

  async savePass(address, sessionId, result, answers) {
    const pass = {
      address,
      sessionId,
      date: Date.now(),
      result,
      answers,
      usedAttempts: 1
    };

    const previousPass = (await (await this.collection).findOne(
        {"address": address, "sessionId": sessionId},
    ));

    if (previousPass) {
      pass.previousResult = previousPass.result;
      pass.usedAttempts = previousPass.usedAttempts + 1;

      await (await this.collection).deleteOne(
          {"address": address, "sessionId": sessionId}
      );
    }

    return (await this.collection).insertOne(pass);
  }
}

module.exports = new PassesStore(setupCollection()
    .catch((error) => logger.error(`Failed to set up "passes"-collection`, error)));
