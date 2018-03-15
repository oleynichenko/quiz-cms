const serverCommand = require(`./commands/serverCommand`);


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
  [helpCommand.name]: helpCommand
};

const handleCommand = (command) => {
  let userCommand = commands[command];

  if (typeof userCommand === `undefined`) {
    console.log(`Неизвестная команда "${command}"`);

    userCommand = helpCommand;
  }

  userCommand.execute();
};

module.exports = {
  handleCommand
};
