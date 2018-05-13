const testsStore = require(`../../stores/tests-store`);
const passesStore = require(`../../stores/passes-store`);
const getSumLinksReportData = require(`./showTestSettings-methods`);

const showAdminPanel = async (req, res) => {
  const title = `Admin page`;
  const template = `admin/index`;
  const pageTitle = `Панель управления`;
  const pathname = `/admin`;

  res.render(template, {title, pageTitle, pathname});
};

const showTests = async (req, res) => {
  let testsIds;

  if (!req.session.isAdmin) {
    testsIds = req.session.availableTests;
  }

  const tests = await testsStore.getTests(testsIds);

  const title = `Тесты`;
  const pageTitle = `Доступные тесты`;
  const template = `admin/tests`;
  const pathname = `/admin${req.path}`;

  res.render(template, {title, pageTitle, tests, pathname});
};

const showTestSettings = async (req, res, next) => {
  const testId = req.params.testId;

  const test = await testsStore.getTestById(testId);

  if (test) {
    const title = `Тест ${test.title}`;
    const template = `admin/test`;
    const pageTitle = test.title;
    const profiScore = test.levels.profi;
    const expertScore = test.levels.expert;

    const linksReportData = await passesStore.getLinksPassesStat(testId, profiScore, expertScore);

    const sumLinksReportData = getSumLinksReportData(linksReportData);

    res.render(template, {title, pageTitle, linksReportData, sumLinksReportData});
  } else {
    next();
  }
};

module.exports = {
  showTestSettings,
  showAdminPanel,
  showTests
};
