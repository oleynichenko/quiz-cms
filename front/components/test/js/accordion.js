export default class Accordion {
  constructor(parent, accordionClass) {
    this.titleClass = accordionClass;
    this.titleClassActive = `${this.titleClass}--active`;
    this.titles = parent.querySelectorAll(`.${accordionClass}`);
  }

  _setActiveElem(title) {
    this.activeTitle = title;
    this.activePanel = title.nextElementSibling;
  }

  _switchOffActiveElem() {
    this.activeTitle.classList.remove(this.titleClassActive);
    this.activePanel.style.maxHeight = `0px`;
  }

  _isTitleActive(title) {
    return title.classList.contains(this.titleClassActive);
  }

  _turnOnActiveElem() {
    this.activeTitle.classList.add(this.titleClassActive);
    this.activePanel.style.maxHeight = `${this.activePanel.scrollHeight}px`;
  }

  _setPrimaryHeight(title) {
    const panel = title.nextElementSibling;

    if (this._isTitleActive(title)) {
      panel.style.maxHeight = `${panel.scrollHeight}px`;

      this._setActiveElem(title);
    } else {
      panel.style.maxHeight = `0px`;
    }
  }

  init() {
    for (let i = 0; i < this.titles.length; i++) {
      const title = this.titles[i];

      this._setPrimaryHeight(title);

      title.addEventListener(`click`, () => {
        if (!this._isTitleActive(title)) {
          this._switchOffActiveElem();
          this._setActiveElem(title);
          this._turnOnActiveElem();
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
