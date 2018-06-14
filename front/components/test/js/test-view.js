import {Class} from './const.js';
import dom from './dom.js';
import startFitty from './fitty.js';
import Accordion from './accordion.js';
import {MDCRipple} from '@material/ripple';
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

  _showRetakeBlock(message) {
    if (message) {

      this.dom.retakeMessage.innerHTML = message;
      toggleAbility(this.dom.retakeBtn, false);
    } else {
      this.dom.retakeBtn.addEventListener(`click`, () => {
        location.href = `?attempt=new`;
      });
    }

    this.dom.retakeBlock.classList.add(Class.RETAKE_BLOCK_VISIBLE);
  }

  _showSocial() {
    // ставим обработчики на соц кнопки в блоке test
    // обработчики повесятся асинхронно
    runIfEventFired(window.isfbApiInited, `fbApiInit`, initFbBtns, this.dom.testLikeFb, this.dom.testShareFb);

    this.dom.testSocial.classList.add(Class.TEST_SOCIAL_VISIBLE);
  }

  showFinalActions(retakeMessage) {
    this._showRetakeBlock(retakeMessage);
    this._showSocial();

    const accordion = new Accordion(this.dom.test, `accordion__title`);
    accordion.start();

    //   // почему то не срабатывает при перезагрузке страницы
    //   scrollToTop();
    // });


    // тут будет конец заглушки закгрузки результатов
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

  showSummary(html, awardShareData) {
    this.dom.testTag.innerHTML = `Результаты теста`;
    this.dom.testTitle.insertAdjacentHTML(`afterEnd`, html);

    this.dom.test.classList.add(Class.TEST_IS_CHECKED);

    const summary = document.querySelector(`.js-summary`);
    const summaryPercent = summary.querySelector(`.js-summary__percent`);

    startFitty(summaryPercent, {maxSize: 108});

    if (awardShareData) {
      const fbShareBtn = summary.querySelector(`.${Class.SUMMARY_SHARE_FB}`);

      fbShareBtn.addEventListener(`click`, () => {
        window.FB.ui(awardShareData);
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

    MDCRipple.attachTo(this.dom.resultBtn);
    MDCRipple.attachTo(this.dom.retakeBtn);
  }
}
