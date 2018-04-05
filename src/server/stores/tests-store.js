const db = require(`../../database`);
const logger = require(`../../libs/logger`);
// const ObjectId = require(`mongodb`).ObjectId;

const setupCollection = async () => {
  const dBase = await db;
  const collection = dBase.collection(`tests`);
  collection.createIndex({id: -1}, {unique: true});

  return collection;
};

class TestsStore {
  constructor(collection) {
    this.collection = collection;
  }

  // async getQuestionById(id) {
  //   return (await this.collection).findOne({id});
  // }

  async getTestInfoById(id) {
    return (await this.collection).findOne({id});
  }

  async saveTest(data) {
    return (await this.collection).insertOne(data);
  }
}

module.exports = new TestsStore(setupCollection()
    .catch((error) => logger.error(`Failed to set up "tests"-collection`, error)));
