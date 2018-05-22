const db = require(`../../database`);
const logger = require(`../../libs/logger`);

const setupCollection = async () => {
  const dBase = await db;
  const collection = dBase.collection(`questions`);

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

    return (await this.collection).find(query).project(projection).sort({"id": 1}).toArray();
  }

  async saveQuestions(questions) {
    return (await this.collection).insertMany(questions, {ordered: false});
  }
}

module.exports = new QuestionsStore(setupCollection()
    .catch((error) => logger.error(`Failed to set up "questions"-collection`, error)));
