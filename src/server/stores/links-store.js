const db = require(`../../database`);
const logger = require(`../../libs/logger`);
// const ObjectId = require(`mongodb`).ObjectId;

const setupCollection = async () => {
  const dBase = await db;
  const collection = dBase.collection(`tests`);
  // collection.createIndex({id: -1}, {unique: true});

  return collection;
};

class LinksStore {
  constructor(collection) {
    this.collection = collection;
  }

  async getLinkByPermalink(permalink) {
    const aggregation = [
      {$match: {"links.permalink": permalink}},
      {$unwind: `$links`},
      {$match: {"links.permalink": permalink}},
      {$project: {
        _id: 0,
        links: 1,
      }
      }
    ];

    const result = (await this.collection).aggregate(aggregation).toArray();

    return (await result)[0].links;
  }
}

module.exports = new LinksStore(setupCollection()
    .catch((error) => logger.error(`Failed to set up "links"-collection`, error)));
