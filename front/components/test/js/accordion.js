export default class Accordion {
  constructor(parent, accordionClass) {
    this.accordionClass = accordionClass;
    this.accordionClassActive = `${this.accordionClass}--active`;
    this.elems = parent.querySelectorAll(`.${accordionClass}`);
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

  _setElemsHeight() {
    for (let i = 0; i < this.elems.length; i++) {
      const elem = this.elems[i];
      const panel = elem.nextElementSibling;

      panel.style.maxHeight = this._isElemActive(elem)
        ? `${panel.scrollHeight}px`
        : `0px`;
    }
  }

  init() {
    // const _setElemsHeight = this._setElemsHeight.bind(this);
    // setTimeout(_setElemsHeight, 500);
    this._setElemsHeight();

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

  start() {
    if (document.readyState === `complete`) {
      this.init();
    } else {
      document.addEventListener(`readystatechange`, () => {
        if (document.readyState === `complete`) {
          this.init();
        }
      });
    }
  }
}
