import dom from './dom.js';
import {initFbBtns, runIfEventFired} from './help-function';

let infoContainer;

const init = (info, secondBlock = dom.test) => {
  infoContainer = info.parentElement;

  const infoBtn = infoContainer.querySelector(`.js-info__btn`);
  const infoStartTest = info.querySelector(`.js-info__start-test`);
  const fbShareBtn = info.querySelector(`.js-info__share-fb`);
  const fbLikeBtn = info.querySelector(`.js-info__like-fb`);

  infoContainer.classList.add(`js-info__container`, `info__container--on`);
  secondBlock.classList.add(`info__second-block`);

  infoBtn.addEventListener(`click`, () => {
    infoContainer.classList.toggle(`info__container--on`);
  });

  infoStartTest.addEventListener(`click`, () => {
    infoContainer.classList.toggle(`info__container--on`);
  });

  runIfEventFired(window.isfbApiInited, `fbApiInit`, initFbBtns, fbLikeBtn, fbShareBtn);
};

const hide = () => {
  infoContainer.classList.remove(`info__container--on`);
};

export default {
  hide,
  init
};
