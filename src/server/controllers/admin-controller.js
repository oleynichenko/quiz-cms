const testsStore = require(`../stores/tests-store`);

const showAdminPanel = async (req, res) => {
  const testsIds = req.session.tests;

  let tests = [];
  const title = `Admin page`;
  const template = `admin`;

  if (testsIds && testsIds.length > 0) {
    for (let i = 0; i < testsIds.length; i++) {
      const test = await testsStore.getTestInfoById(testsIds[i]);

      tests.push(test);
    }
  }

  res.render(template, {title, tests});
};

const showStat = (req, res) => {
  const testId = req.params.testId;
  console.log(`Id теста ${testId}`);

  res.render(`index`, {title: `Links`, message: `Вы обратились за статистикой по ссылкам теста ${testId}`});
};

module.exports = {
  showStat,
  showAdminPanel
};

