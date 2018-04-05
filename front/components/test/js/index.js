import app from './app.js';

const param = location.search.replace(`?`, ``);

app.init(param);
