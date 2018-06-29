const questionsStore = require(`../../stores/questions-store`);

const canPass = (usedAttempts, attempts) => {
  return (usedAttempts === void 0) || (attempts === void 0) || usedAttempts < attempts;
};

const getQuestionsFromPass = async (answers) => {
  const ids = Object.keys(answers).map((item) => Number(item));

  return await questionsStore.getQuestionsByIds(ids);
};

const getQuestionsFromTest = async (questions) => {
  if (questions.ids) {
    return await questionsStore.getQuestionsByIds(questions.ids);
  } else {
    return await questionsStore.getQuestionsByThemes(questions.themes, questions.quantity);
  }
};


module.exports = {
  canPass,
  getQuestionsFromPass,
  getQuestionsFromTest
};
