const questionsStore = require(`../../stores/questions-store`);

const canPass = (usedAttempts, attempts) => {
  return (usedAttempts === void 0) || (attempts === void 0) || usedAttempts < attempts;
};

const getQuestionsFromPass = async (answers) => {
  const ids = Object.keys(answers).map((item) => Number(item));

  return await questionsStore.getQuestionsByIds(ids);
};

const getQuestionsFromTest = async (questions, quantity) => {
  if (questions.ids) {
    return await questionsStore.getQuestionsByIds(questions.ids, quantity);
  } else {
    return await questionsStore.getQuestionsByThemes(questions.themes, quantity);
  }
};

const getPermalinks = (links) => {
  const result = links.reduce(function (permalinks, link) {
    if (link.goInStat) {
      permalinks.push(link.permalink);
    }

    return permalinks;
  }, []);

  return result;
};

function formatDate(date) {
  let dd = date.getDate();

  if (dd < 10) {
    dd = `0${dd}`;
  }

  let mm = date.getMonth() + 1;

  if (mm < 10) {
    mm = `0${mm}`;
  }

  let yy = date.getFullYear() % 100;

  if (yy < 10) {
    yy = `0${yy}`;
  }

  return `${dd}.${mm}.${yy}`;
}

module.exports = {
  canPass,
  getQuestionsFromPass,
  getQuestionsFromTest,
  getPermalinks,
  formatDate
};
