import TestView from './test-view.js';
import app from './app.js';
import {
  scrollToTop,
} from './help-function';

export default class Test {
  constructor() {
    this._view = new TestView();
  }

  showTestResult(data) {
    this._view.changePage(data.pass);
    this._view.showSummary(data.summaryTemplate, data.awardShareData);
    this._view.initAccordion();
    scrollToTop();
  }

  init() {
    this._view.handleUserAnswers = function (userAnswers) {
      app.getTestResult(userAnswers);
    };

    this._view.bind();

  }
}
