(function () {
'use strict';

const Class = Object.freeze({
  HEADER: `js-header`,
  TEST: `js-test`,
  TEST_TAG: `js-test__tag`,
  TEST_TITLE: `js-test__title`,
  TEST_QUESTIONS: `js-test__questions`,
  TEST_SOCIAL: `js-test__social`,
  SUMMARY_SHARE_FB: `js-summary__share-fb`,
  TEST_SOCIAL_VISIBLE: `test__social--visible`,
  TEST_QUESTIONS_DONE: `test__questions--done`,
  RETAKE_BTN: `js-test__retake-btn`,
  RESULT_BTN: `js-test__result-btn`,
  RETAKE_BTN_VISIBLE: `test__retake-btn--visible`,
  RESULT_BTN_VISIBLE: `test__result-btn--visible`,
  QUESTION: `js-question`,
  QUESTION_OPTIONS: `js-question__options`,
  QUESTION_OPTION: `js-question__option`,
  QUESTION_OPTION_IS_CHECKED: `question__option--is-checked`,
  QUESTION_WRONG: `question--wrong`,
  TEST_SHARE_FB: `js-test__share-fb`,
  TEST_LIKE_FB: `js-test__like-fb`,
});

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
  testQuestions: document.querySelector(`.${Class.TEST_QUESTIONS}`),
  testSocial: document.querySelector(`.${Class.TEST_SOCIAL}`),
  questionsAndOptions: getQuestionsAndOptions(),
  resultBtn: document.querySelector(`.${Class.RESULT_BTN}`),
  retakeBtn: document.querySelector(`.${Class.RETAKE_BTN}`),
  testShareFb: document.querySelector(`.${Class.TEST_SHARE_FB}`),
  testLikeFb: document.querySelector(`.${Class.TEST_LIKE_FB}`),
};

const toggleAbility = (elem, condition) => {
  elem.disabled = condition ? false : true;
};

const toggleVisibility = (elem, condition) => {
  elem.style.display = condition ? `block` : `none`;
};

const _checkIfClassInArr = (arr, className) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].classList.contains(className)) {
      return true;
    }
  }

  return false;
};

const runIfEventFired = (status, event, callback, ...args) => {
  if (status) {
    callback(args[0], args[1]);
  } else {
    document.addEventListener(event, () => {
      callback(args[0], args[1]);
    });
  }
};

const initFbBtns = (likeBtn, shareBtn) => {
  if (likeBtn) {
    likeBtn.addEventListener(`click`, () => {
      window.FB.ui({
        method: `share_open_graph`,
        action_type: `og.likes`,
        action_properties: JSON.stringify({
          object: window.location.href,
        })
      });
    });

    window.FB.api(
        `/`,
        {
          "id": window.location.href,
          "fields": `engagement`,
          "access_token": `1749739928442230|6c993bd89f7f20c463971b1582ad7cc0`
        },
        function (response) {
          if (response && !response.error) {
            const engagement = response.engagement;

            if (engagement && engagement.share_count > 0) {
              const likesQuantity = likeBtn.querySelector(`.likes-quantity`);

              likesQuantity.innerHTML = engagement.share_count;
            }
          }
        }
    );
  }

  if (likeBtn) {
    shareBtn.addEventListener(`click`, () => {
      window.FB.ui({
        method: `share`,
        href: window.location.href
      });
    });
  }
};

const checkIfClassInMap = (map, className) => {

  for (let arr of map.values()) {
    if (!_checkIfClassInArr(arr, className)) {
      return false;
    }
  }

  return true;
};

const showPage = () => {
  document.body.classList.remove(`body__unvisible`);
};

const scrollToTop = () => {
  window.scrollTo(0, 0);
};

class TestView {
  constructor() {
    this.dom = dom;
  }

  _markWrongAnsweredQuestion(ids) {
    ids.forEach((id) => {
      for (let key of this.dom.questionsAndOptions.keys()) {
        if (key.id === `${id}`) {
          key.classList.add(Class.QUESTION_WRONG);
          break;
        }
      }
    });
  }

  getUserAnswers(questionsAndOptions) {
    let obj = {};

    for (let entry of questionsAndOptions) {
      let id = entry[0].id;
      let answers = this._getUserAnswer(entry[1]);

      obj[id] = answers;
    }

    return obj;
  }

  _getUserAnswer(arr) {
    let chosenOptions = [];

    arr.forEach((elem) => {
      if (elem.classList.contains(Class.QUESTION_OPTION_IS_CHECKED)) {
        const optionId = elem.id.substr(-1);

        chosenOptions.push(optionId);
      }
    });

    return chosenOptions;
  }

  disableSelection(elem) {
    elem.classList.add(Class.TEST_QUESTIONS_DONE);
  }

  checkPass(data) {
    toggleVisibility(this.dom.resultBtn, false);
    this.disableSelection(this.dom.testQuestions);
    this._markWrongAnsweredQuestion(data.wrongQuestionsIds);
  }

  showFinalActions(retakeMessage) {
    if (retakeMessage) {
      const html = `<em>${retakeMessage}</em>`;

      toggleAbility(this.dom.retakeBtn, false);
      this.dom.retakeBtn.insertAdjacentHTML(`afterEnd`, html);
    } else {
      this.dom.retakeBtn.addEventListener(`click`, () => {
        location.href = `?attempt=new`;
      });
    }

    this.dom.retakeBtn.classList.add(Class.RETAKE_BTN_VISIBLE);
    this.dom.testSocial.classList.add(Class.TEST_SOCIAL_VISIBLE);
  }

  // data = {"1": ["a", "b"], ...}
  markChosenOptions(answers) {
    this.dom.questionsAndOptions.forEach((options, question) => {
      const chosenOptions = answers[question.id];

      if (chosenOptions) {
        chosenOptions.forEach((option) => {
          const optionId = `${question.id}_${option}`;

          for (let i = 0; i <= options.length; i++) {
            if (options[i].id === optionId) {
              options[i].classList.add(Class.QUESTION_OPTION_IS_CHECKED);
              break;
            }
          }
        });
      }
    });
  }

  showSummary(html, ogData) {
    scrollToTop();
    this.dom.testTag.innerHTML = `Результаты теста`;
    this.dom.testTitle.insertAdjacentHTML(`afterEnd`, html);

    runIfEventFired(window.isfbApiInited, `fbApiInit`, initFbBtns, this.dom.testLikeFb, this.dom.testShareFb);
    if (ogData) {
      const fbShareBtn = document.querySelector(`.${Class.SUMMARY_SHARE_FB}`);

      fbShareBtn.addEventListener(`click`, () => {
        window.FB.ui(ogData);
      });
    }
  }

  bind() {
    for (let questionOptions of this.dom.questionsAndOptions.values()) {
      questionOptions.forEach((option) => {
        option.addEventListener(`click`, (evt) => {
          const elem = evt.currentTarget;

          elem.classList.toggle(Class.QUESTION_OPTION_IS_CHECKED);

          const areAllQuestionsAnswered = checkIfClassInMap(this.dom.questionsAndOptions, Class.QUESTION_OPTION_IS_CHECKED);

          toggleAbility(this.dom.resultBtn, areAllQuestionsAnswered);
        });
      });
    }

    this.dom.resultBtn.addEventListener(`click`, () => {
      toggleAbility(this.dom.resultBtn, false);
      this.disableSelection(this.dom.testQuestions);

      const userAnswers = this.getUserAnswers(this.dom.questionsAndOptions);

      this.handleUserAnswers(userAnswers);
    });
  }
}

class Test {
  constructor() {
    this._view = new TestView();
  }

  showTestResult(data) {
    this._view.checkPass(data.pass.result);
    this._view.showSummary(data.summaryTemplate, data.awardShareData);
    this._view.showFinalActions(data.retakeMessage);

    if (data.pass.answers) {
      this._view.markChosenOptions(data.pass.answers);
    }
  }

  init() {
    this._view.handleUserAnswers = function (userAnswers) {
      app.getTestResult(userAnswers);
    };

    this._view.bind();
  }
}

const sendPass = (data) => {
  const dataJSON = JSON.stringify(data);

  const requestSettings = {
    method: `POST`,
    body: dataJSON,
    headers: {
      'Content-Type': `application/json`
    },
    credentials: `include`
  };

  return fetch(location.href, requestSettings)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return {};
        }
      });
};

var loader = {
  sendPass
};

let infoContainer;

const init = (info, secondBlock = dom.test) => {
  infoContainer = info.parentElement;

  const infoBtn = infoContainer.querySelector(`.js-info__btn`);
  const infoStartTest = info.querySelector(`.js-info__start-test`);
  const fbShareBtn = info.querySelector(`.js-info__share-fb`);
  const fbLikeBtn = info.querySelector(`.js-info__like-fb`);

  infoContainer.classList.add(`js-info__container`, `info__container--on`);
  secondBlock.classList.add(`info__second-block`);

  infoBtn.addEventListener(`click`, () => {
    infoContainer.classList.toggle(`info__container--on`);
  });

  infoStartTest.addEventListener(`click`, () => {
    infoContainer.classList.toggle(`info__container--on`);
  });

  runIfEventFired(window.isfbApiInited, `fbApiInit`, initFbBtns, fbLikeBtn, fbShareBtn);
};

const hide = () => {
  infoContainer.classList.remove(`info__container--on`);
};

var info = {
  hide,
  init
};

class App {
  constructor() {

  }

  getTestResult(userAnswers) {
    loader.sendPass(userAnswers)
        .then((data) => this.handleData(data));
  }

  handleData(data) {
    this.test.showTestResult(data);
  }

  init(param) {
    this.test = new Test();

    if (param === `attempt=new`) {
      this.test.init();
      showPage();
    } else {
      loader.sendPass({})
          .then((data) => {
            if (Object.keys(data).length === 0) {
              this.test.init();
            } else {
              this.handleData(data);
              info.hide();
            }

            showPage();
          });
    }

  }
}

var app = new App();

const param = location.search.replace(`?`, ``);
const info$1 = document.querySelector(`.js-info`);

if (info$1) {
  info.init(info$1);
}

app.init(param);

}());
