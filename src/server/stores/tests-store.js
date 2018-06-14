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

  async getTestById(id) {
    const query = {id};
    return (await this.collection).findOne(query);
  }

  async getTestByPermalink(permalink) {
    const aggregation = [
      {$match: {"links.permalink": permalink}},
      {$unwind: `$links`},
      {$match: {"links.permalink": permalink}},
    ];

    const result = (await (await this.collection).aggregate(aggregation).toArray())[0];

    return result;
  }

  async getTests(ids) {
    const query = (ids) ? {id: {$in: ids}} : {};
    return (await this.collection).find(query).toArray();
  }

  async saveTest(data) {
    return (await this.collection).insertOne(data);
  }

  async getLinks(id) {
    const query = {id};
    const projection = {"id": 0, "links.name": 1, "links.permalink": 1};

    const result = (await this.collection).findOne(query, projection);

    return (await result).links;
  }
}

module.exports = new TestsStore(setupCollection()
    .catch((error) => logger.error(`Failed to set up "tests"-collection`, error)));
