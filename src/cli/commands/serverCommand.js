const server = require(`../../server`);

module.exports = {
  name: `--server`,
  description: `запускает сервер`,
  execute() {
    server.run();
  }
};
