import TestView from './test-view.js';
import app from './app.js';

export default class Test {
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
