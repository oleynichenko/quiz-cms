import app from './app.js';
import infoModule from './info.js';

const param = location.search.replace(`?`, ``);
const info = document.querySelector(`.js-info`);

if (info) {
  infoModule.init(info);
}

app.init(param);
