const db = require(`../../database`);
const logger = require(`../../libs/logger`);
// const ObjectId = require(`mongodb`).ObjectId;

const setupCollection = async () => {
  const dBase = await db;
  const collection = dBase.collection(`questions`);
  collection.createIndex({id: -1}, {unique: true});

  return collection;
};

class QuestionsStore {
  constructor(collection) {
    this.collection = collection;
  }

  async getQuestionsByIds(ids) {
    const query = {"id": {$in: ids}};

    const projection = {
      "_id": 0,
      "themes": 0
    };

    return (await this.collection).find(query).project(projection).toArray();
  }

  async saveQuestion(data) {
    return (await this.collection).insertOne(data);
  }
}

module.exports = new QuestionsStore(setupCollection()
    .catch((error) => logger.error(`Failed to set up "questions"-collection`, error)));
