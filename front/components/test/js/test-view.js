import {Class} from './const.js';
import dom from './dom.js';
import startFitty from './fitty.js';
import Accordion from './accordion.js';
import {MDCRipple} from '@material/ripple';
import {
  toggleAbility,
  toggleVisibility,
  checkIfClassInMap,
  formatDate,
  Share
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

  _disableSelection(elem) {
    elem.classList.add(Class.TEST_QUESTIONS_DONE);
  }

  changePage(pass, retakeMessage) {
    this._disableSelection(this.dom.testQuestions);
    toggleVisibility(this.dom.resultBtn, false);
    this._changeTestTag(pass.date);
    this._showSocial();
    this._showRetakeBlock(retakeMessage);
    this._markWrongAnsweredQuestion(pass.result.wrongQuestionsIds);

    if (pass.answers) {
      this._markChosenOptions(pass.answers);
    }

    this._handleDisqus();
  }

  _changeTestTag(date) {
    this.dom.testTag.innerHTML = `Результаты теста от ${formatDate(date)}`;
  }

  _handleDisqus() {
    let disqusLoaded = window.disqusLoaded;

    if (disqusLoaded === false) {
      window.addEventListener(`scroll`, () => {
        if (!disqusLoaded && (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          this.dom.testDisqus.classList.add(Class.TEST_DISQUS_VISIBLE);

          window.startDisqus();
          disqusLoaded = true;
        }
      });
    }
  }

  _showRetakeBlock(message) {
    if (message) {

      this.dom.retakeMessage.innerHTML = message;
      toggleAbility(this.dom.retakeBtn, false);
    } else {
      this.dom.retakeBtn.addEventListener(`click`, () => {
        window.gtag(`event`, `retake`, {
          'event_category': `test`
        });

        location.href = `?attempt=new`;
      });
    }

    this.dom.retakeBlock.classList.add(Class.RETAKE_BLOCK_VISIBLE);
  }

  _showSocial() {
    // ставим обработчики на соц кнопки в блоке test
    // обработчики повесятся асинхронно
    // runIfEventFired(window.isfbApiInited, `fbApiInit`, initFbBtns, this.dom.testLikeFb, this.dom.testShareFb, `test`);
    this.dom.testSocial.classList.add(Class.TEST_SOCIAL_VISIBLE);
  }

  initAccordion() {
    const accordion = new Accordion(this.dom.test, `accordion__title`);
    accordion.start();
  }

  // data = {"1": ["a", "b"], ...}
  _markChosenOptions(answers) {
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

  showSummary(html, shareData) {
    this.dom.testTitle.insertAdjacentHTML(`afterEnd`, html);

    this.dom.test.classList.add(Class.TEST_IS_CHECKED);

    const summary = document.querySelector(`.js-summary`);
    const summaryPercent = summary.querySelector(`.js-summary__percent`);

    startFitty(summaryPercent, {maxSize: 108});

    if (shareData) {
      const fbShareBtn = summary.querySelector(`.${Class.SUMMARY_SHARE_FB}`);
      // const fbShareBtn2 = summary.querySelector(`.${Class.SUMMARY_SHARE_FB2}`);
      const vkShareBtn = summary.querySelector(`.${Class.SUMMARY_SHARE_VK}`);
      const twShareBtn = summary.querySelector(`.${Class.SUMMARY_SHARE_TW}`);

      fbShareBtn.addEventListener(`click`, () => {
        const fbShareData = {
          method: `share_open_graph`,
          hashtag: shareData.hashtag,
          action_type: `og.shares`,
          action_properties: JSON.stringify({
            object: shareData.passUrl
          })
        };

        window.FB.ui(fbShareData, function (response) {
          if (response) {
            window.gtag(`event`, `post`, {
              'event_category': `award`,
              'event_label': `FB`
            });
          }
        });

        window.gtag(`event`, `clickToShare`, {
          'event_category': `award`,
          'event_label': `FB`
        });
      });

      // fbShareBtn2.addEventListener(`click`, (event) => {
      //   event.preventDefault();
      //   Share.fb(passUrl);
      // });

      vkShareBtn.addEventListener(`click`, (event) => {
        event.preventDefault();
        Share.vkontakte(shareData.passUrl);

        window.gtag(`event`, `clickToShare`, {
          'event_category': `award`,
          'event_label': `VK`
        });
      });

      twShareBtn.addEventListener(`click`, (event) => {
        event.preventDefault();
        Share.twitter(shareData.passUrl);

        window.gtag(`event`, `clickToShare`, {
          'event_category': `award`,
          'event_label': `TW`
        });
      });

      if (shareData.isPassCurrent) {
        window.gtag(`event`, `receive`, {
          'event_category': `award`,
        });
      }
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

      const userAnswers = this.getUserAnswers(this.dom.questionsAndOptions);

      window.gtag(`event`, `pass`, {
        'event_category': `test`
      });

      this.handleUserAnswers(userAnswers);

    });

    MDCRipple.attachTo(this.dom.resultBtn);
    MDCRipple.attachTo(this.dom.retakeBtn);
  }
}
