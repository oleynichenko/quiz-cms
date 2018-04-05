const pug = require(`pug`);
const questionsStore = require(`../stores/questions-store`);
const linksStore = require(`../stores/links-store`);
const passesStore = require(`../stores/passes-store`);
const testsStore = require(`../stores/tests-store`);

const getQuestionsIds = (obj) => {
  return Object.keys(obj);
};

const calcOptionCost = (questionCost, optionsQuantity, correctOptionsQuantity) => {
  return {
    wrong: questionCost / (optionsQuantity - correctOptionsQuantity),
    right: questionCost / correctOptionsQuantity
  };
};

const countAnswerScore = (rightAnswer, userAnswer, optionCost) => {
  let score = 0;

  userAnswer.forEach((elem) => {
    if (rightAnswer.indexOf(elem) === -1) {
      score -= optionCost.wrong;
    } else {
      score += optionCost.right;
    }
  });

  return (score < 0) ? 0 : score;
};

// userAnswer {`1`: [`a`, `b`], `2`: [`a`, `b`]}
// rightAnswer [{ id: '3', pointsAvailable: 1, correctOptions: [ 'b' ], options: {} }]

const getTestResult = (userData, rightData) => {
  let result = {
    questionsQuantity: rightData.length,
    rightAnswersQuantity: 0,
    possibleScore: 0,
    pointsScored: 0,
    wrongQuestionsIds: [],
  };

  rightData.forEach((item) => {
    const pointsAvailable = item.pointsAvailable;
    const optionsQuantity = Object.keys(item.options).length;
    const correctOptionsQuantity = item.correctOptions.length;

    const optionCost = calcOptionCost(pointsAvailable, optionsQuantity, correctOptionsQuantity);
    const correctOptions = item.correctOptions;
    const chosenOptions = userData[item.id];

    const answerScore = countAnswerScore(correctOptions, chosenOptions, optionCost);

    result.pointsScored += answerScore;
    result.possibleScore += pointsAvailable;

    // правильный ответ - считаем в количество правильных,
    // нет - ID в массив на отметку красным

    if (answerScore === pointsAvailable) {
      result.rightAnswersQuantity += 1;
    } else {
      result.wrongQuestionsIds.push(item.id);
    }
  });

  return result;
};

const getTestPass = async (req, res) => {
  const userData = req.body;
  const linkName = req.params.linkName;
  const sessionId = req.sessionID;

  if (!(Object.keys(userData).length === 0)) {
    const questionsIds = getQuestionsIds(userData);
    const rightData = await questionsStore.getQuestionsByIds(questionsIds);
    const testResult = getTestResult(userData, rightData);

    await passesStore.savePass(linkName, sessionId, testResult, userData);
  }

  const pass = await passesStore.getPass(linkName, sessionId);

  let result = {};

  if (pass) {
    const link = await linksStore.getLinkByPermalink(linkName);
    const retakesOpportunity = (pass.usedAttempts < link.attempts);

    const summaryOptions = {
      pointsScored: pass.pointsScored,
      permalink: link.permalink,
      retakesOpportunity
    };

    result.summary = pug.renderFile(`./src/server/templates/summary.pug`, summaryOptions);
    result.pass = pass;
  }

  res.send(result);
};

const showTest = async (req, res) => {
  const sessionId = req.sessionID;
  const linkName = req.params.linkName;
  const attempt = req.query.attempt;

  const link = await linksStore.getLinkByPermalink(linkName);
  const pass = await passesStore.getPass(linkName, sessionId) || {};

  const canPass = (usedAttempts, attempts) => {
    return (usedAttempts === void 0) || (usedAttempts === void 0) || usedAttempts < attempts;
  };

  if ((attempt === `new`) && !canPass(pass.usedAttempts, link.attempts)) {
    res.redirect(`/links/${linkName}`);
  } else {
    const test = await testsStore.getTestInfoById(link.testId);
    const questions = await questionsStore.getQuestionsByIds(test.questions);

    const renderOptions = {
      pageTitle: link.name,
      testTitle: test.title,
      questions,
    };

    res.render(`test`, renderOptions);
  }

};

module.exports = {
  getTestPass,
  showTest
};
