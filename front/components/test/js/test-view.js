import {Class} from './const.js';
import dom from './dom.js';
import {
  toggleAbility,
  toggleVisibility,
  checkIfClassInMap,
  scrollToTop,
  initFbBtns,
  runIfEventFired
} from './help-function';

export default class TestView {
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
        window.FB.ui({
          method: `share_open_graph`,
          hashtag: `#JavaScript_Ninja #JS_MASTER_OF_FUNCTIONS`,
          action_type: `og.shares`,
          action_properties: JSON.stringify(ogData)
        });
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
