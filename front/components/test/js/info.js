import dom from './dom.js';

const infoContainer = dom.header;
const secondBlock = dom.test;

const init = (infoBtn) => {
  infoContainer.classList.add(`js-info__container`, `info__container--on`);
  secondBlock.classList.add(`info__second-block`);

  const infoStartTest = document.querySelector(`.js-info__start-test`);

  infoBtn.addEventListener(`click`, () => {
    infoContainer.classList.toggle(`info__container--on`);
  });

  infoStartTest.addEventListener(`click`, () => {
    infoContainer.classList.toggle(`info__container--on`);
  });
};

const hide = () => {
  infoContainer.classList.remove(`info__container--on`);
};

export default {
  hide,
  init
};
