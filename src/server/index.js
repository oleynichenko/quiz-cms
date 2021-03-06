const express = require(`express`);
const session = require(`express-session`);
const MongoStore = require(`connect-mongo`)(session);
const useragent = require(`express-useragent`);
const logger = require(`../libs/logger`);
const templatesUtil = require(`../libs/util/templates-util`);
const config = require(`./config`);
const routes = require(`./routes`);
const db = require(`../database`);

const loadUser = require(`./middleware/load-user`);
const useragentF = require(`./middleware/useragent`);

const app = express();

app.set(`views`, `${__dirname}/templates`);
app.set(`view engine`, `pug`);
templatesUtil.init(app);

app.use(session({
  cookie: {
    maxAge: 10 * 365 * 24 * 60 * 60 * 1000
  },
  secret: config.SESSION_SECRET,
  name: config.SESSION_NAME,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    dbPromise: db,
  })
}));

app.use(express.static(`static`));

app.use(useragent.express());
app.use(useragentF);

app.use(loadUser);
routes.init(app);

app.use((req, res) => {
  res.status(404).send(`Sorry can't find that!`);
});

app.use((err, req, res, next) => {
  logger.error(err.message, err);
  console.log(err.stack);
  res.status(500).send(`Something broke!`);
  next();
});

module.exports = {
  run() {
    const server = app.listen(config.PORT, (err) => {
      if (err) {
        return logger.error(`Ошибка при запуске сервера`, err.message);
      }
      const port = server.address().port;
      return logger.info(`Сервер запущен на порту ${port}`);
    });
  }
};
