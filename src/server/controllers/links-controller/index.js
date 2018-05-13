const questionsStore = require(`../../stores/questions-store`);
const {getPercent} = require(`../../../libs/util`);
const {
  getSummaryTemplate,
  checkPassAvailability,
  getRetakeMessage,
  getRewardImage,
  getTestResult
} = require(`./getCheckedTest-methods`);

const {canPass} = require(`./getTest-methods`);

const objectId = require(`mongodb`).ObjectId;

const passesStore = require(`../../stores/passes-store`);
const testsStore = require(`../../stores/tests-store`);

const getCheckedTest = async (req, res) => {
  const userData = req.body;
  const permalink = req.params.permalink;
  const sessionId = req.sessionID;

  if (!(Object.keys(userData).length === 0)) {
    const questionsIds = Object.keys(userData);
    const rightData = await questionsStore.getQuestionsByIds(questionsIds);
    const test = await testsStore.getTestByPermalink(permalink);
    const testResult = getTestResult(userData, rightData, test.possibleScore);
    const testId = test.id;

    await passesStore.savePass(testId, permalink, sessionId, testResult, userData);
  }

  const pass = await passesStore.getPassBySessionId(permalink, sessionId);

  if (pass) {
    const test = await testsStore.getTestByPermalink(permalink);
    const link = test.links;

    // const retakesDate = (pass.usedAttempts < link.attempts) ? link.interval + pass.date : 0;

    const summaryTemplate = getSummaryTemplate(pass, test, req.app.locals.temp);

    const data = {
      summaryTemplate,
      pass
    };

    const interval = 7 * 24 * 60 * 60 * 1000;
    const retakeDate = pass.date + interval;
    const isPassAllowed = checkPassAvailability(link.attempts, pass.usedAttempts, retakeDate);

    if (!isPassAllowed) {
      data.retakeMessage = getRetakeMessage(link.retakeMessage, retakeDate);
    }

    res.send(data);
  } else {
    res.send({});
  }
};

const getTest = async (req, res, next) => {
  const permalink = req.params.permalink;
  const test = await testsStore.getTestByPermalink(permalink);

  if (test) {
    if (test.enable) {
      const link = test.links;

      if (link.enable || link.permalink === test.canonLink) {
        const sessionId = req.sessionID;
        const attempt = req.query.attempt;

        const pass = await passesStore.getPassBySessionId(permalink, sessionId) || {};

        // если заходит на ?new-attempt но сдавать нельзя показываются результаты прошлой сдачи
        if ((attempt === `new`) && !canPass(pass.usedAttempts, link.attempts)) {
          res.redirect(`/links/${permalink}`);
        } else {

          const questionsIds = (pass.answers)
            ? Object.keys(pass.answers)
            : test.questions;

          const questions = await questionsStore.getQuestionsByIds(questionsIds);

          const canonicalUrl = `http://${process.env.SERVER_URL}/links/${test.canonLink}`;

          const renderOptions = {
            title: test.title,
            image: test.images.main,
            description: test.description,
            canonicalUrl,
            introText: test.introText,
            time: link.time,
            enabledInfo: link.enabledInfo,
            interval: link.interval,
            questions,
          };

          const passesStat = await passesStore.getPassesStat(test.testId);

          if (passesStat.total > 0) {

            const additionalStat = {
              profiLevel: test.levels.profi,
              expertLevel: test.levels.expert,
              averagePercent: passesStat.averageScore / test.possibleScore
            };

            renderOptions.stat = Object.assign({}, passesStat, additionalStat);
          }
          res.render(`test`, renderOptions);
        }
      } else {
        res.redirect(`/links/${test.canonLink}`);
      }
    } else {
      res.redirect(`test-unavailable`);
    }
  } else {
    next();
  }
};

const getPassData = async (req, res, next) => {
  const passId = req.params.passId;
  const permalink = req.params.permalink;

  if (objectId.isValid(passId)) {
    const passData = await passesStore.getPassById(objectId(passId));

    if (passData) {
      const test = await testsStore.getTestById(passData.testId);
      const result = passData.result;
      const percentScored = getPercent(result.pointsScored, result.possibleScore);

      const redirectLink = `http://${process.env.SERVER_URL}/links/${permalink}`;
      const canonicalUrl = `http://${process.env.SERVER_URL}/links/${test.canonLink}`;
      const title = `${test.title} - ${percentScored}%!`;
      const image = getRewardImage(percentScored, test.levels, test.images);

      const renderOptions = {
        canonicalUrl,
        title,
        description: test.description,
        image,
        redirectLink
      };

      res.render(`pass.pug`, renderOptions);
    } else {
      res.redirect(`/links/${permalink}`);
    }
  } else {
    next();
  }
};

module.exports = {
  getCheckedTest,
  getTest,
  getPassData
};
