require(`dotenv`).config();
const cli = require(`./src/cli`);

const argv = process.argv.slice(2);
const flag = argv[0];

cli.handleCommand(flag);
