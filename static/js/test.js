(function () {
'use strict';

const SERVER_URL_POST = `http://localhost:3000/links/md-fb`;

const Class = Object.freeze({
  TEST: `js-test`,
  TEST_QUESTIONS: `js-test__questions`,
  TEST_QUESTIONS_DONE: `test__questions--done`,
  RESULT_BUTTON: `js-test__btn--result`,
  QUESTION: `js-question`,
  QUESTION_OPTIONS: `js-question__options`,
  QUESTION_OPTION: `js-question__option`,
  QUESTION_OPTION_IS_CHECKED: `question__option--is-checked`,
  QUESTION_WRONG: `question--wrong`,
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
  testQuestions: document.querySelector(`.${Class.TEST_QUESTIONS}`),
  questionsAndOptions: getQuestionsAndOptions(),
  resultButton: document.querySelector(`.${Class.RESULT_BUTTON}`),
};

const toggleAccessibility = (elem, condition) => {
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

class TestView {
  constructor() {
    this.dom = dom;
  }

  _markWrongAnsweredQuestion(ids) {
    ids.forEach((id) => {
      for (let key of this.dom.questionsAndOptions.keys()) {
        if (key.id === id) {
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
    this.disableSelection(this.dom.testQuestions);
    this._markWrongAnsweredQuestion(data.wrongQuestionsIds);
    toggleVisibility(this.dom.resultButton, false);
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

  showSummary(html) {
    this.dom.test.insertAdjacentHTML(`afterBegin`, html);
  }

  bind() {
    this.dom.testQuestions.addEventListener(`click`, (evt) => {
      const elem = evt.target;

      if (elem.classList.contains(Class.QUESTION_OPTION)) {
        elem.classList.toggle(Class.QUESTION_OPTION_IS_CHECKED);

        const areAllQuestionsAnswered = checkIfClassInMap(this.dom.questionsAndOptions, Class.QUESTION_OPTION_IS_CHECKED);
        toggleAccessibility(this.dom.resultButton, areAllQuestionsAnswered);
      }
    });

    this.dom.resultButton.addEventListener(`click`, () => {
      toggleAccessibility(this.dom.resultButton, false);
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
    this._view.showSummary(data.summary);

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

  return fetch(`${SERVER_URL_POST}`, requestSettings)
      .then((res) => res.json());
};

var loader = {
  sendPass
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
            }
            showPage();
          });
    }

  }
}

var app = new App();

const param = location.search.replace(`?`, ``);

app.init(param);

}());
