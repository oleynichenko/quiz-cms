import Test from './test.js';
import loader from './loader.js';
import info from './info.js';
import {showPage} from './help-function';


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

export default new App();
