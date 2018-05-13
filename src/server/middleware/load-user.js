module.exports = async (req, res, next) => {
  const userId = req.session.userId;
  // console.log(`Зашел user: ${user} по адресу ${req.url} методом ${req.method}`);
  if (userId) {
    res.locals.userId = userId;
  }

  next();
};
