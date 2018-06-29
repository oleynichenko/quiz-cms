(function () {
'use strict';

class Accordion {
  constructor(parent, accordionClass) {
    this.accordionClass = accordionClass;
    this.accordionClassActive = `${this.accordionClass}--active`;
    this.elems = parent.querySelectorAll(`.${accordionClass}`);
    this.init(this.elems);
  }

  // находит первый активный элемент и убирает в у него класс
  _switchOffActiveElem(elems) {
    for (let i = 0; i < elems.length; i++) {
      const elem = elems[i];

      if (this._isElemActive(elem)) {
        elem.classList.remove(this.accordionClassActive);
        elem.nextElementSibling.style.maxHeight = `0px`;
        return;
      }
    }
  }
  _isElemActive(elem) {
    return elem.classList.contains(this.accordionClassActive);
  }

  _turnOnActiveElem(elem) {
    elem.classList.add(this.accordionClassActive);

    const panel = elem.nextElementSibling;
    panel.style.maxHeight = `${panel.scrollHeight}px`;
  }

  _initActiveElem() {
    console.log(this);
    for (let i = 0; i < this.elems.length; i++) {
      const elem = this.elems[i];

      if (this._isElemActive(elem)) {
        const panel = elem.nextElementSibling;

        panel.style.maxHeight = `${panel.scrollHeight}px`;

        return;
      }
    }

    return;
  }

  init() {
    const _initActiveElem = this._initActiveElem.bind(this);
    setTimeout(_initActiveElem, 500);

    for (let i = 0; i < this.elems.length; i++) {
      const elem = this.elems[i];

      elem.addEventListener(`click`, () => {
        if (!this._isElemActive(elem)) {
          this._switchOffActiveElem(this.elems);
          this._turnOnActiveElem(elem);
        }
      });
    }

  }
}

const parent = document.querySelector(`.section`);
const accordion = new Accordion(parent, `accordion__title`);

}());
