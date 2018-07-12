import Test from './test.js';
import loader from './loader.js';
import infoModule from './info.js';
import addSmoothOpacity from './smooth-opacity.js';
import {showPage} from './help-function';


class App {
  constructor() {
  }

  getTestResult(userAnswers) {
    const sendResultTime = Date.now();
    this.preloader.smoothOpacityOn();

    loader.sendPass(userAnswers)
        .then((data) => {
          // чтобы не появлялись результаты раньше чем прелоадер раскроется
          setTimeout(this.handleData.bind(this), 1000, data);
          const leftTime = sendResultTime + 4000 - Date.now();

          if (leftTime < 0) {
            this.preloader.smoothOpacityOff();
          } else {
            setTimeout(this.preloader.smoothOpacityOff.bind(this), leftTime);
          }
        });
  }

  handleData(data) {
    this.test.showTestResult(data);
  }

  get preloader() {
    if (!this._preloader) {
      this._preloader = document.querySelector(`.preloader`);
      addSmoothOpacity(this._preloader, `preloader--hidden`);
    }

    return this._preloader;
  }

  init(param) {
    this.test = new Test();
    const info = document.querySelector(`.js-info`);

    if (info) {
      infoModule.init(info);
    }

    if (param === `attempt=new`) {
      this.test.init();
      infoModule.show();
      showPage();
    } else {
      loader.sendPass({})
          .then((data) => {
            if (Object.keys(data).length === 0) {
              infoModule.show();
              this.test.init();
            } else {
              this.handleData(data);
            }

            showPage();
          });
    }
  }
}

export default new App();
