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
        {permalink, sessionId}
    );
  }

  async getPassById(_id) {
    return (await this.collection).findOne({_id});
  }

  async deletePass(permalink, sessionId) {
    return (await this.collection).deleteOne(
        {permalink, sessionId}
    );
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
        {permalink, sessionId}
    ));

    if (previousPass) {
      pass.previousResult = previousPass.result;
      pass.usedAttempts = previousPass.usedAttempts + 1;

      await (await this.collection).replaceOne(
          {"_id": previousPass._id},
          pass
      );
    } else {
      await (await this.collection).insertOne(pass);
    }

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

  async getPassesStat(id, num1, num2) {
    const pipeline = [
      {
        $match: {
          "testId": id,
        }
      },
      {
        $group: {
          _id: null,
          total: {$sum: 1},
          averagePercentScore: {$avg: `$result.percentScored`},
          profies: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {$gte: [`$result.percentScored`, num1]},
                    {$lt: [`$result.percentScored`, num2]}]
                }, 1, 0]
            }
          },
          experts: {
            $sum: {
              $cond: [{$gte: [`$result.percentScored`, num2]}, 1, 0]
            }
          },
          best: {$max: `$result.percentScored`},
          bestQuantity: {
            $sum: {
              $cond: [{$eq: [`$result.percentScored`, 100]}, 1, 0]
            }
          }
        },
      },
      {
        $addFields: {
          average: {
            $divide: [
              {$ceil: {
                $multiply: [{$avg: `$averagePercentScore`}, 10]
              }},
              10
            ]
          }
        }
      },
      {
        $project: {
          _id: 0
        }
      },
    ];

    const passesStat = (await (await this.collection).aggregate(pipeline).toArray())[0];

    return passesStat;
  }
}

module.exports = new PassesStore(setupCollection()
    .catch((error) => logger.error(`Failed to set up passes-collection`, error)));
