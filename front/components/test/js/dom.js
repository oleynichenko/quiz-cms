import {Class} from './const.js';

const getQuestionsAndOptions = () => {
  const questions = document.querySelectorAll(`.${Class.QUESTION}`);
  let map = new Map();

  [].forEach.call(questions, function (elem) {
    map.set(elem, Array.from(elem.querySelectorAll(`.${Class.QUESTION_OPTION}`)));
  });

  return map;
};

const dom = {
  test: document.querySelector(`.${Class.TEST}`),
  testQuestions: document.querySelector(`.${Class.TEST_QUESTIONS}`),
  questionsAndOptions: getQuestionsAndOptions(),
  resultButton: document.querySelector(`.${Class.RESULT_BUTTON}`),
};


export default dom;
