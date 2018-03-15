const server = require(`../../server`);
const config = require(`../../server/config`);

module.exports = {
  name: `--server`,
  description: `запускает сервер на ${config.HOSTNAME}:${config.PORT}`,
  execute() {
    server.run();
  }
};
