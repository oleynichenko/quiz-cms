const showHomePage = (req, res) => {
  res.render(`index`, {title: `Tests for everyone!`, message: `Hello! There are a lot od tests!`});
};

const showAdminPanel = (req, res) => {
  res.render(`admin`, {title: `Admin page`, message: `Hello Admin!`});
};

const logOut = (req, res) => {
  req.session.destroy();
  res.redirect(`/`);
};

module.exports = {
  showHomePage,
  showAdminPanel,
  logOut
};

