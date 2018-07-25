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
  header: document.querySelector(`.${Class.HEADER}`),
  testTag: document.querySelector(`.${Class.TEST_TAG}`),
  testTitle: document.querySelector(`.${Class.TEST_TITLE}`),
  testLeadText: document.querySelector(`.${Class.TEST_LEAD_TEXT}`),
  testQuestions: document.querySelector(`.${Class.TEST_QUESTIONS}`),
  testSocial: document.querySelector(`.${Class.TEST_SOCIAL}`),
  questionsAndOptions: getQuestionsAndOptions(),
  resultBtn: document.querySelector(`.${Class.RESULT_BTN}`),
  retakeBtn: document.querySelector(`.${Class.RETAKE_BTN}`),
  retakeBlock: document.querySelector(`.${Class.RETAKE_BLOCK}`),
  retakeMessage: document.querySelector(`.${Class.RETAKE_MESSAGE}`),
  testShareFb: document.querySelector(`.${Class.TEST_SHARE_FB}`),
  testLikeFb: document.querySelector(`.${Class.TEST_LIKE_FB}`),
  testDisqus: document.querySelector(`.${Class.TEST_DISQUS}`),
};


export default dom;
