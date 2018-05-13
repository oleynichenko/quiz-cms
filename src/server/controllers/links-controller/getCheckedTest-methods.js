const pug = require(`pug`);
const {getPercent, getDate, roundUp, ceilUp} = require(`../../../libs/util`);

const getRewardImage = (score, levels, images) => {
  if (score >= levels.profi) {
    return (score >= levels.expert) ? images.expert : images.profi;
  }

  return void 0;
};

const getSummaryTemplate = (pass, test, temp) => {
  const percentScored = getPercent(pass.result.pointsScored, test.possibleScore);
  const levels = test.levels;
  const image = getRewardImage(percentScored, levels, test.images);
  const passId = pass._id.str;

  const summaryOptions = {
    pointsScored: pass.result.pointsScored,
    possibleScore: test.possibleScore,
    rightAnswersQuantity: pass.result.rightAnswersQuantity,
    questionsQuantity: Object.keys(pass.answers).length,
    percentScored,
    profiLevel: levels.profi,
    expertLevel: levels.expert,
    recommendText: test.recommendText,
    infoSources: test.infoSources,
    event: test.event,
    passId,
    image,
    temp
  };

  const previousResult = pass.previousResult;

  if (previousResult) {
    summaryOptions.previousPercentScored = getPercent(previousResult.pointsScored, test.possibleScore);
  }

  return pug.renderFile(`./src/server/templates/summary.pug`, summaryOptions);
};

// пересдать можно если есть неиспользованные попытки или 7 дней с момента последней сдачи уже прошло
const checkPassAvailability = (attempts, usedAttempts, retakeDate) => {
  if ((usedAttempts < attempts) || (retakeDate <= Date.now())) {
    return true;
  } else {
    return false;
  }
};

const getRetakeMessage = (retakeMessage, retakeDate) => {
  if (retakeMessage) {
    return retakeMessage;
  } else {
    const date = new Date(retakeDate);

    return `Пересдать тест можно ${getDate(date)}`;
  }
};

const _calcOptionCost = (pointsAvailable, optionsQuantity, correctOptionsQuantity) => {
  const wrongOptionsQuantity = optionsQuantity - correctOptionsQuantity;

  const wrongOptionsCost = (wrongOptionsQuantity === 0)
    ? 0
    : pointsAvailable / wrongOptionsQuantity;

  const correctOptionsCost = pointsAvailable / correctOptionsQuantity;

  return {
    wrong: ceilUp(wrongOptionsCost, 4),
    right: ceilUp(correctOptionsCost, 4)
  };
};

const _countAnswerScore = (rightAnswer, userAnswer, optionCost, pointsAvailable) => {
  let score = 0;

  userAnswer.forEach((elem) => {
    if (rightAnswer.indexOf(elem) === -1) {
      score -= optionCost.wrong;
    } else {
      score += optionCost.right;
    }
  });

  if (score < 0) {
    return 0;
  } else if (score > pointsAvailable) {
    return pointsAvailable;
  } else {
    return score;
  }
};

// userAnswer {`1`: [`a`, `b`], `2`: [`a`, `b`]}
// rightAnswer [{ id: '3', pointsAvailable: 1, correctOptions: [ 'b' ], options: {} }]

const getTestResult = (userData, rightData, possibleScore) => {

  let rightAnswersQuantity = 0;
  let pointsScored = 0;
  let wrongQuestionsIds = [];


  rightData.forEach((item) => {
    const pointsAvailable = item.pointsAvailable;
    const optionsQuantity = Object.keys(item.options).length;
    const correctOptionsQuantity = item.correctOptions.length;

    const optionCost = _calcOptionCost(pointsAvailable, optionsQuantity, correctOptionsQuantity);

    const correctOptions = item.correctOptions;
    const chosenOptions = userData[item.id];

    const answerScore = _countAnswerScore(correctOptions, chosenOptions, optionCost, pointsAvailable);

    pointsScored += answerScore;

    // правильный ответ - считаем в количество правильных,
    // нет - ID в массив на отметку красным

    if (answerScore === pointsAvailable) {
      rightAnswersQuantity += 1;
    } else {
      wrongQuestionsIds.push(item.id);
    }
  });

  return {
    rightAnswersQuantity,
    percentScored: getPercent(pointsScored, possibleScore),
    pointsScored: roundUp(pointsScored, 2),
    wrongQuestionsIds
  };
};

module.exports = {
  getSummaryTemplate,
  checkPassAvailability,
  getRetakeMessage,
  getRewardImage,
  getTestResult
};
