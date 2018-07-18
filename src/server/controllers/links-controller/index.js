const questionsStore = require(`../../stores/questions-store`);
const {getTestLinkUrl, getImageUrl, getTestLinkRef, FB_APP_ID, VK_APP_ID, getPassUrl} = require(`../../config`);
const objectId = require(`mongodb`).ObjectId;

const {
  getSummaryTemplate,
  checkPassAvailability,
  getRetakeMessage,
  getAwardImageName,
  getTestResult,
  getAwardShareData,
  recountTestStat,
  checkAward,
  getAwardImageTwName
} = require(`./getCheckedTest-methods`);

const {
  canPass,
  getQuestionsFromPass,
  getQuestionsFromTest,
  formatDate
} = require(`./getTest-methods`);

const passesStore = require(`../../stores/passes-store`);
const testsStore = require(`../../stores/tests-store`);

const getCheckedTest = async (req, res) => {
  const userData = req.body;
  const permalink = req.params.permalink;
  const sessionId = req.sessionID;
  const averagePassesLevel = req.session.averageLevel;
  let isPassCurrent = false;
  let test;

  if (!(Object.keys(userData).length === 0)) {
    const questionsIds = Object.keys(userData).map((item) => Number(item));
    const rightData = await questionsStore.getQuestionsByIds(questionsIds);

    test = await testsStore.getTestByPermalink(permalink);

    const testResult = getTestResult(userData, rightData);
    const testId = test.id;

    isPassCurrent = true;

    await passesStore.savePass(testId, permalink, sessionId, testResult, userData);

    recountTestStat(testId, permalink, test.links, test.levels);
  }

  const pass = await passesStore.getPassBySessionId(permalink, sessionId);

  if (pass) {
    if (!test) {
      test = await testsStore.getTestByPermalink(permalink);
    }

    const link = test.links;

    // const retakesDate = (pass.usedAttempts < link.attempts) ? link.interval + pass.date : 0;
    const isAward = checkAward(pass.result.percentScored, averagePassesLevel);

    const summaryTemplate = getSummaryTemplate(pass, test, isAward, averagePassesLevel, req.app.locals.temp);

    const data = {
      summaryTemplate,
      pass
    };

    if (isAward) {
      data.awardShareData = getAwardShareData(test, pass.result.percentScored, pass.permalink, pass._id);
      data.isPassCurrent = isPassCurrent;
      data.passUrl = getPassUrl(pass.permalink, pass._id);
    }
    // должно быть в link "retakes": {attempts: 2, interval: time, message: "Возможно по решению преподавателя"}
    if (link.attempts) {
      const interval = 7 * 24 * 60 * 60 * 1000;
      const retakeDate = pass.date + interval;
      const isPassAllowed = checkPassAvailability(link.attempts, pass.usedAttempts, retakeDate);

      if (!isPassAllowed) {
        data.retakeMessage = getRetakeMessage(link.retakeMessage, retakeDate);
      }
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
      const link = test.links.find((elem) => elem.permalink === permalink);

      if (link.enable || link.permalink === test.canonLink) {
        const sessionId = req.sessionID;
        const attempt = req.query.attempt;
        const isAttemptNew = (attempt === `new`);

        const pass = await passesStore.getPassBySessionId(permalink, sessionId) || {};

        // если заходит на ?new-attempt но сдавать нельзя показываются результаты прошлой сдачи
        if ((isAttemptNew) && !canPass(pass.usedAttempts, link.attempts)) {
          res.redirect(getTestLinkRef(permalink));
        } else {
          let questions;

          if (!isAttemptNew && pass.answers) {
            questions = await getQuestionsFromPass(pass.answers);
          } else {
            questions = await getQuestionsFromTest(test.questions, link.questionsQuantity);
          }

          const canonicalUrl = getTestLinkUrl(test.canonLink);

          const renderOptions = {
            title: `Тест «${test.title}»`,
            header: test.title,
            imageURL: getImageUrl(test.images.main),
            twitterImageUrl: getImageUrl(test.images.mainTw),
            description: test.description,
            updateDate: formatDate(test.updateDate),
            benefit: test.benefit,
            canonicalUrl,
            authorInfo: test.introText,
            time: link.time,
            enabledInfo: link.enabledInfo,
            interval: link.interval,
            questions,
            fbAppId: FB_APP_ID,
            vkAppId: VK_APP_ID,
            canonLink: test.canonLink
          };

          if (test.stat && test.stat.total > 5) {
            renderOptions.stat = test.stat;

            renderOptions.stat.profiLevel = test.levels.profi;
            renderOptions.stat.expertLevel = test.levels.expert;

            req.session.averageLevel = test.stat.average;
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
  // const host = req.hostname;

  if (objectId.isValid(passId)) {
    const passData = await passesStore.getPassById(objectId(passId));

    if (passData) {
      const test = await testsStore.getTestById(passData.testId);

      const result = passData.result;
      const percentScored = result.percentScored;
      const redirectLink = getTestLinkUrl(test.canonLink);
      const title = `${percentScored}% по тесту «${test.title}»!`;
      const imageFileName = getAwardImageName(percentScored, test.levels, test.stat.average, test.images);
      const imageTwFileName = getAwardImageTwName(percentScored, test.levels, test.stat.average, test.images);

      const renderOptions = {
        title,
        description: test.benefit,
        imageURL: getImageUrl(imageFileName),
        twitterImageUrl: getImageUrl(imageTwFileName),
        fbAppId: FB_APP_ID,
        redirectLink
      };

      res.render(`pass.pug`, renderOptions);
    } else {
      res.redirect(getTestLinkRef(permalink));
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
