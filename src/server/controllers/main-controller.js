const showHomePage = (req, res) => {
  res.render(`login`, {title: `Tests for everyone!`});
};

const privacy = (req, res) => {
  res.render(`privacy`);
};

const logOut = (req, res) => {
  req.session.destroy();
  res.redirect(`/`);
};

module.exports = {
  showHomePage,
  logOut,
  privacy
};

