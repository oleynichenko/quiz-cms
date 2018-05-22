const {MongoClient} = require(`mongodb`);
const logger = require(`../libs/logger`);
const config = require(`../server/config`);

module.exports = MongoClient.connect(config.DB_HOST)
    .then((client) => {
      logger.info(`Connected with database`);
      return client.db(config.DB_NAME);
    })
    .catch((error) => {
      logger.error(`Failed to connect to database`, error);
      process.exit(1);
    });
