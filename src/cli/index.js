const serverCommand = require(`./commands/serverCommand`);
const generateCommand = require(`./commands/generateCommand`);
const logger = require(`../libs/logger`);


const helpCommand = {
  name: `--help`,
  description: `список доступных команд`,
  execute() {
    const COMMAND_LINE_LENGTH = 15;

    console.log(`\nДоступные команды:`);

    for (const key in commands) {
      if (commands.hasOwnProperty(key)) {
        const commandName = commands[key].name.padEnd(COMMAND_LINE_LENGTH);

        console.log(`${commandName} - ${commands[key].description}`);
      }
    }
  }
};

const commands = {
  [serverCommand.name]: serverCommand,
  [generateCommand.name]: generateCommand,
  [helpCommand.name]: helpCommand
};

const handleCommand = (command) => {
  let userCommand = commands[command];

  if (typeof userCommand === `undefined`) {
    console.log(`Неизвестная команда "${command}"`);

    userCommand = helpCommand;
  }

  const promise = userCommand.execute();

  if (promise instanceof Promise) {
    promise.catch((err) => {
      logger.error(err.message, err);
      process.exit(1);
    });
  }
};

module.exports = {
  handleCommand
};
