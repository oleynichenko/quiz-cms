const db = require(`../../database`);
const logger = require(`../../libs/logger`);
// const ObjectId = require(`mongodb`).ObjectId;

const setupCollection = async () => {
  const dBase = await db;
  const collection = dBase.collection(`links`);
  collection.createIndex({id: -1}, {unique: true});

  return collection;
};

class LinksStore {
  constructor(collection) {
    this.collection = collection;
  }

  async saveLink(data) {
    return (await this.collection).insertOne(data);
  }

  async getLinkByPermalink(permalink) {
    return (await this.collection).findOne({permalink});
  }
}

module.exports = new LinksStore(setupCollection()
    .catch((error) => logger.error(`Failed to set up "links"-collection`, error)));
