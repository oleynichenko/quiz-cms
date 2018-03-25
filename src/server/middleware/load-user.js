const userStore = require(`../stores/users-store`);

module.exports = async (req, res, next) => {
  res.locals.user = null;

  const userId = req.session.user;
  console.log(`Зашел user: ${userId} по адресу ${req.url} методом ${req.method}`);
  if (!userId) {
    next();
  } else {
    res.locals.user = await userStore.getUserById(userId);
    next();
  }
};
