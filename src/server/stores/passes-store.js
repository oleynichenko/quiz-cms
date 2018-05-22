const db = require(`../../database`);
const logger = require(`../../libs/logger`);

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

  async getPassBySessionId(permalink, sessionId) {
    return (await this.collection).findOne(
        {"permalink": permalink, "sessionId": sessionId}
    );
  }

  async getPassById(_id) {
    return (await this.collection).findOne({_id});
  }

  async deletePass(permalink, sessionId) {
    return (await this.collection).deleteOne(
        {"permalink": permalink, "sessionId": sessionId});
  }

  async savePass(testId, permalink, sessionId, result, answers) {
    const pass = {
      testId,
      permalink,
      sessionId,
      date: Date.now(),
      result,
      answers,
      usedAttempts: 1
    };

    const previousPass = (await (await this.collection).findOne(
        {"permalink": permalink, "sessionId": sessionId},
    ));

    if (previousPass) {
      pass.previousResult = previousPass.result;
      pass.usedAttempts = previousPass.usedAttempts + 1;

      await (await this.collection).deleteOne(
          {"permalink": permalink, "sessionId": sessionId}
      );
    }

    return (await this.collection).insertOne(pass);
  }

  async getLinksPassesStat(id, profiScore, expertScore) {
    const aggregation = [
      {$match: {"testId": id}},
      {$group: {
        _id: `$permalink`,
        total: {$sum: 1},
        average: {$avg: `$result.percentScored`},
        scores: {$push: `$result.percentScored`},
      }},
      {$project: {
        permalink: `$_id`,
        total: 1,
        average: {
          $divide: [
            {$ceil: {$multiply: [`$average`, 100]}}, 100
          ]
        },
        profies: {$size: {$filter: {
          input: `$scores`,
          as: `score`,
          cond: {$and: [
            {$gte: [`$$score`, profiScore]},
            {$lt: [`$$score`, expertScore]},
          ]}}
        }},
        experts: {$size: {$filter: {
          input: `$scores`,
          as: `score`,
          cond: {$gte: [`$$score`, expertScore]}
        }}}
      }}
    ];

    return (await this.collection).aggregate(aggregation).toArray();
  }

  async getPassesStat(id, number1, number2) {
    const stub = {
      total: 11,
      average: 46,
      profies: 2,
      experts: 1,
      best: 97.3,
      bestQuantity: 1
    };

    const query = {
      testId: id
    };

    const projection = {
      result: 1,
      _id: 0
    };

    const cursor = (await this.collection).find(query);
    cursor.project(projection);

    const passesStat = {
      total: 0,
      profies: 0,
      experts: 0,
      best: 0,
      bestQuantity: 0
    };

    let pointsScoredTotal = 0;

    await cursor.forEach(
        (doc) => {
          const pointsScored = doc.pointsScored;
          passesStat.total++;
          pointsScoredTotal = pointsScoredTotal + pointsScored;

          if (pointsScored > passesStat.best) {
            passesStat.best = pointsScored;
            passesStat.bestQuantity = 1;
          }

          if (pointsScored === passesStat.best) {
            passesStat.bestQuantity++;
          }

          if (pointsScored > number1) {
            passesStat.profies++;

            if (pointsScored > number2) {
              passesStat.experts++;
            }
          }


        },
        (err) => {
          if (err) {
            throw new Error(`ошибка выборки статистики по тесту`);
          }

          const total = passesStat.total;

          if (total > 0) {
            passesStat.averageScore = pointsScoredTotal / total;
          }
        }
    );

    return (passesStat.total > 10) ? passesStat : stub;
  }
}

module.exports = new PassesStore(setupCollection()
    .catch((error) => logger.error(`Failed to set up "passes"-collection`, error)));
