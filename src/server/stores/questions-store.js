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

  async getQuestionsByIds(ids, quantity) {
    const query = {"id": {$in: ids}};

    const pipeline = (quantity) ? [
      {
        $match: query
      },
      {
        $sample: {size: quantity}
      },
      {
        $sort: {"id": 1}
      }
    ] : [{$match: query}, {$sort: {"id": 1}}];

    return (await this.collection).aggregate(pipeline).toArray();
  }

  async getQuestionsByThemes(themes, quantity) {
    const pipeline = (quantity) ? [
      {
        $match:
          {"themes": {$in: themes}}
      },
      {
        $sample: {size: quantity}
      },
      {
        $sort: {"id": 1}
      }
    ] : [{$match: {"themes": {$in: themes}}}, {$sort: {"id": 1}}];

    return (await this.collection).aggregate(pipeline).toArray();
  }

  async saveQuestions(questions) {
    return (await this.collection).insertMany(questions, {ordered: false});
  }
}

module.exports = new QuestionsStore(setupCollection()
    .catch((error) => logger.error(`Failed to set up "questions"-collection`, error)));
