import dom from './dom.js';
import {initFbBtns, runIfEventFired, scrollToTop} from './help-function';
import {MDCRipple} from '@material/ripple';

let infoContainer;

const init = (info, secondBlock = dom.test) => {
  infoContainer = info.parentElement;

  const infoBtn = infoContainer.querySelector(`.js-info__btn`);
  const infoStartTest = info.querySelector(`.js-info__start-test`);
  const fbShareBtn = info.querySelector(`.js-info__share-fb`);
  const fbLikeBtn = info.querySelector(`.js-info__like-fb`);

  infoContainer.classList.add(`js-info__container`);
  secondBlock.classList.add(`info__second-block`);

  infoBtn.addEventListener(`click`, () => {
    infoContainer.classList.toggle(`info__container--on`);
    scrollToTop();
  });

  infoStartTest.addEventListener(`click`, () => {
    infoContainer.classList.toggle(`info__container--on`);
    scrollToTop();
  });

  runIfEventFired(window.isfbApiInited, `fbApiInit`, initFbBtns, fbLikeBtn, fbShareBtn, `info`);

  MDCRipple.attachTo(infoStartTest);
};

const show = () => {
  infoContainer.classList.add(`info__container--on`);
};

export default {
  show,
  init
};
