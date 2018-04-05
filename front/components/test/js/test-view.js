import {Class} from './const.js';
import dom from './dom.js';
import {
  toggleAccessibility,
  toggleVisibility,
  checkIfClassInMap,
} from './help-function';

export default class TestView {
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
