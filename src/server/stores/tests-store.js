const db = require(`../../database`);
const logger = require(`../../libs/logger`);
// const ObjectId = require(`mongodb`).ObjectId;

const setupCollection = async () => {
  const dBase = await db;
  const collection = dBase.collection(`tests`);
  // collection.createIndex({id: -1}, {unique: true});

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

  async getTestData(permalink) {
    const query = {"links.permalink": permalink};
    const projection = {
      _id: 0,
      id: 1,
      links: 1,
      stat: 1
    };

    return (await this.collection).findOne(query, projection);
  }

  async getTestForShowing(permalink) {
    const pipeline = [
      {$match: {"links.permalink": permalink}},
      {$unwind: `$links`},
      {$match: {"links.permalink": permalink}},
      {
        $project: {
          _id: 0,
          levels: 0
        }
      }
    ];

    const result = (await (await this.collection).aggregate(pipeline).toArray())[0];

    return result;
  }

  async getTestForSummary(permalink, percentScored) {
    const pipeline = [
      {
        $match: {
          "links.permalink": permalink,
        }
      },
      {
        $unwind: `$levels`
      },
      {
        $unwind: `$links`
      },
      {
        $match: {
          "links.permalink": permalink,
          "levels.score.min": {$lte: percentScored},
          "levels.score.max": {$gt: percentScored}
        }
      }
    ];

    return (await (await this.collection).aggregate(pipeline).toArray())[0];
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

  async saveTestStat(id, statReport) {
    (await this.collection).updateOne({id}, {$set: {"stat.report": statReport}});
  }
}

module.exports = new TestsStore(setupCollection()
    .catch((error) => logger.error(`Failed to set up "tests"-collection`, error)));
