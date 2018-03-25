const {MongoClient} = require(`mongodb`);
const logger = require(`../libs/logger`);

const DB_HOST = process.env.DB_HOST || `localhost:27017`;
const DB_NAME = process.env.DB_NAME || `test`;

const url = `mongodb://${DB_HOST}`;

module.exports = MongoClient.connect(url)
    .then((client) => {
      logger.info(`Connected with ${DB_HOST}`);
      return client.db(DB_NAME);
    })
    .catch((error) => {
      logger.error(`Failed to connect to MongoDB`, error);
      process.exit(1);
    });
