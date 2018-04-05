const showHomePage = (req, res) => {
  res.render(`index`, {title: `Tests for everyone!`, message: `Hello! There are a lot od tests!`});
};

const logOut = (req, res) => {
  req.session.destroy();
  res.redirect(`/`);
};

module.exports = {
  showHomePage,
  logOut
};

