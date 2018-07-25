const pug = require(`pug`);
const {getPercent, getDate, roundUp, getDataIfFunction, isEmpty} = require(`../../../libs/util`);
const {getImageRef} = require(`../../config`);
const testsStore = require(`../../stores/tests-store`);
const passesStore = require(`../../stores/passes-store`);

const getAwardImageTwName = (score, levels, averageLevel, images) => {
  if (score >= levels.profi) {
    return (score >= levels.expert)
      ? images.expertTw
      : images.profiTw;
  } else {
    return images.mainTw;
  }
};

const getAwardImageName = (score, levels, averageLevel, images) => {
  if (score >= levels.profi) {
    return (score >= levels.expert)
      ? images.expert
      : images.profi;
  } else {
    return images.main;
  }
};

// const _getAwardOgData = (test, image, percent) => {
//   return {
//     object: {
//       'og:url': getTestLinkUrl(test.canonLink),
//       'og:title': `${percent}% по тесту «${test.title}»!`,
//       'og:description': test.benefit,
//       'og:image': getImageUrl(image),
//       'og:image:width': `1200`,
//       'og:image:height': `630`
//     }
//   };
// };

// const _getAwardHashtag = (percentScored, levels, testHashtag) => {
//   if (percentScored >= levels.profi) {
//     const awardLevel = (percentScored >= levels.expert)
//       ? `expert`
//       : `profi`;

//     return `#${testHashtag}_${awardLevel}`;
//   }

//   return null;
// };

// const getAwardShareData = (test, percentScored, permalink, id) => {
//   // const awardOgData = _getAwardOgData(test, image, percentScored);

//   return {
//     method: `share_open_graph`,
//     hashtag: _getAwardHashtag(percentScored, test.levels, test.hashtag),
//     action_type: `og.shares`,
//     action_properties: JSON.stringify({
//       // object: `${getTestLinkUrl(permalink)}/${id}`
//       object: `${getPassUrl(permalink, id)}`
//     })
//   };
// };

const getSummaryTemplate = (pass, test, imageName, temp) => {
  const passResult = pass.result;
  const level = test.levels;
  // const passId = pass._id.str;

  const summaryOptions = {
    isMarked: level.marked,
    conclusionPhrase: level.conclusionPhrase,
    rightAnswersQuantity: passResult.rightAnswersQuantity,
    percentScored: passResult.percentScored,
    questionsQuantity: Object.keys(pass.answers).length,
    pointsScored: passResult.pointsScored,
    possibleScore: passResult.possibleScore,
    recommendText: level.recommendation || test.recommendation,
    temp,
  };

  const previousResult = pass.previousResult;
  if (previousResult) {
    summaryOptions.previousPercentScored = previousResult.percentScored;
  }

  if (imageName) {
    summaryOptions.awardImageRef = getImageRef(imageName);
  }

  const feedback = (level.feedback)
    ? getDataIfFunction(pass, test.stat, level.feedback)
    : {};

  if (!isEmpty(feedback)) {
    summaryOptions.feedback = feedback;
  }

  return pug.renderFile(`./src/server/templates/summary/index.pug`, summaryOptions);
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

const getTestResult = (userData, rightData) => {

  let possibleScore = 0;
  let rightAnswersQuantity = 0;
  let pointsScored = 0;
  let wrongQuestionsIds = [];


  rightData.forEach((item) => {
    const pointsAvailable = item.pointsAvailable;
    const optionCost = item.optionCost;
    const correctOptions = item.correctOptions;
    const chosenOptions = userData[item.id];

    const answerScore = _countAnswerScore(correctOptions, chosenOptions, optionCost, pointsAvailable);

    pointsScored += answerScore;
    possibleScore += pointsAvailable;
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
    possibleScore: roundUp(possibleScore, 2),
    pointsScored: roundUp(pointsScored, 2),
    wrongQuestionsIds
  };
};

// получаем ссылки для отбора статистики
const _getPermalinks = (links) => {
  const result = links.reduce(function (permalinks, link) {
    if (link.goInStat) {
      permalinks.push(link.permalink);
    }

    return permalinks;
  }, []);

  return result;
};

const recountTestStat = async (id, permalink, links, levels) => {
  const permalinks = _getPermalinks(links);

  // если в ссылке отключено goInStat то test/stat.report не обновляется
  if (permalinks.indexOf(permalink) !== -1) {
    const passesStat = await passesStore.getPassesStat(permalinks, levels.profi, levels.expert);

    await testsStore.saveTestStat(id, passesStat);
  }
};

module.exports = {
  getSummaryTemplate,
  checkPassAvailability,
  getRetakeMessage,
  getAwardImageName,
  getTestResult,
  recountTestStat,
  getAwardImageTwName
};
