const express = require(`express`);
const logger = require(`../libs/logger`);
const config = require(`./config`);

const app = express();

module.exports = {
  run() {
    app.listen(config.PORT, config.HOSTNAME, () => {
      logger.info(`Server is running at ${config.HOSTNAME}:${config.PORT}`);
    });
  }
};
