import app from './app.js';
import info from './info.js';

const param = location.search.replace(`?`, ``);
const infoBtn = document.querySelector(`.js-info__btn`);

if (infoBtn) {
  info.init(infoBtn);
}

app.init(param);
