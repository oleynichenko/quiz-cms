const questionsStore = require(`../../stores/questions-store`);
const {getTestLinkUrl, getImageUrl, getTestLinkRef, FB_APP_ID, VK_APP_ID, getPassUrl} = require(`../../config`);
const objectId = require(`mongodb`).ObjectId;
const {getDataIfFunction, isEmpty} = require(`../../../libs/util`);

const {
  getSummaryTemplate,
  checkPassAvailability,
  getRetakeMessage,
  getTestResult,
  recountTestStat,
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
  let isPassCurrent = false;

  if (!(Object.keys(userData).length === 0)) {
    const questionsIds = Object.keys(userData).map((item) => Number(item));
    const rightData = await questionsStore.getQuestionsByIds(questionsIds);

    const testResult = getTestResult(userData, rightData);

    const testData = await testsStore.getTestForChecking(permalink);
    const testId = testData.id;

    // testId вообщето не нужно сохранять. достаточно permalink
    await passesStore.savePass(testId, permalink, sessionId, testResult, userData);

    await recountTestStat(testId, permalink, testData.links, testData.stat.levels);

    isPassCurrent = true;
  }

  const pass = await passesStore.getPassBySessionId(permalink, sessionId);

  if (pass) {
    const test = await testsStore.getTestForSummary(permalink, pass.result.percentScored);

    // const link = test.links.find((elem) => elem.permalink === permalink);
    const link = test.links;
    const level = test.levels;

    // const retakesDate = (pass.usedAttempts < link.attempts) ? link.interval + pass.date : 0;
    const shareData = (level.sharing)
      ? getDataIfFunction(pass, test, level.sharing)
      : {};

    const recommendationName = (level.recommendation)
      ? getDataIfFunction(pass, test, level.recommendation)
      : {};

    const summaryTemplate = getSummaryTemplate(pass, test, shareData.imageName, recommendationName, req.app.locals.temp);

    const data = {
      summaryTemplate,
      pass
    };

    if (!isEmpty(recommendationName)) {
      data.recommendation = {
        name: recommendationName,
        levelName: level.name,
        isFirstSeen: isPassCurrent
      };
    }

    if (!isEmpty(shareData)) {
      shareData.passUrl = getPassUrl(pass.permalink, pass._id);
      data.shareData = shareData;
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
  const test = await testsStore.getTestForShowing(permalink);

  if (test) {
    if (test.enable) {
      const link = test.links;

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

          const renderOptions = {
            title: `Тест «${test.title}»`,
            header: test.title,
            imageURL: getImageUrl(test.images.main),
            twitterImageUrl: getImageUrl(test.images.mainTw),
            description: test.description,
            updateDate: formatDate(test.updateDate),
            benefit: test.benefit,
            canonicalUrl: getTestLinkUrl(test.canonLink),
            authorInfo: test.introText,
            time: link.time,
            enabledInfo: link.enabledInfo,
            interval: link.interval,
            questions,
            fbAppId: FB_APP_ID,
            vkAppId: VK_APP_ID,
            canonLink: test.canonLink,
            isDisqus: link.isDisqus
          };

          const stat = test.stat;
          if (stat.report && stat.report.total > 5) {
            renderOptions.statReport = stat.report;
            renderOptions.statLevels = stat.levels;

            req.session.averageLevel = stat.report.average;
          }

          res.render(`test/index.pug`, renderOptions);
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
    const pass = await passesStore.getPassById(objectId(passId));

    if (pass) {
      const percentScored = pass.result.percentScored;

      const test = await testsStore.getTestForPassLink(permalink, percentScored);
      const level = test.levels;
      const shareData = (level.sharing)
        ? getDataIfFunction(pass, test.stat, level.sharing)
        : {};

      const renderOptions = {
        title: `${percentScored}% по тесту «${test.title}»!`,
        description: test.benefit,
        imageURL: getImageUrl(shareData.imageName),
        twitterImageUrl: getImageUrl(shareData.imageNameTw),
        fbAppId: FB_APP_ID,
        redirectLink: getTestLinkUrl(test.canonLink)
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
