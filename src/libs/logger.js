const {createLogger, format, transports} = require(`winston`);
const {combine, timestamp, simple, colorize} = format;

const logger = createLogger({
  level: `info`,
  format: combine(
      timestamp(),
      simple(),
  ),
  transports: [
    new transports.File({filename: `src/libs/error.log`, level: `error`}),
    new transports.File({filename: `src/libs/combined.log`})
  ]
});

if (process.env.NODE_ENV !== `production`) {
  logger.add(new transports.Console({
    level: `silly`,
    format: combine(
        colorize(),
        timestamp(),
        simple()
    )
  }));
}

module.exports = logger;
