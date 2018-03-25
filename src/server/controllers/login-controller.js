const userStore = require(`../stores/users-store`);
// const logger = require(`../../libs/logger`);

const PAGE_TITLE = `Вход`;

const ErrMessage = {
  LOGIN: `Пользователя с таким логином не существует`,
  PASSWORD: `Неверный пароль`,
};

const showForm = async (req, res) => {
  res.render(`login`, {title: `Вход`});
};

const handleForm = async (req, res) => {
  const userLogin = req.body.login;
  const userPassword = req.body.password;

  const user = await userStore.getUserByLogin(userLogin);

  if (user) {
    if (user.password === userPassword) {
      req.session.user = user._id;
      res.redirect(`/admin`);
    } else {
      res.render(`login`, {title: PAGE_TITLE, error: ErrMessage.PASSWORD});
    }
  } else {
    res.render(`login`, {title: PAGE_TITLE, error: ErrMessage.LOGIN});
  }
};

module.exports = {
  showForm,
  handleForm
};
