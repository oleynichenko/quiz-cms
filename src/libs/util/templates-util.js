const getNumEnding = (iNumber, aEndings) => {
  let sEnding;
  let i;

  if (iNumber % 1 !== 0) {
    sEnding = aEndings[1];
  } else {
    iNumber = iNumber % 100;
    if (iNumber >= 11 && iNumber <= 19) {
      sEnding = aEndings[2];
    } else {
      i = iNumber % 10;

      switch (i) {
        case (1): sEnding = aEndings[0]; break;
        case (2):
        case (3):
        case (4): sEnding = aEndings[1]; break;
        default: sEnding = aEndings[2];
      }
    }
  }

  return sEnding;
};

const getConclusionPhrase = (previous, current, min, max) => {

  if (current >= max) {
    return `Уровень эксперта`;
  }

  if (current >= min) {
    return `Профессиональный уровень`;
  }

  if (previous && (current - previous >= 50)) {
    return `Отличный рост!`;
  }

  return null;
};

const QUESTION = [`вопрос`, `вопроса`, `вопросов`];
const SCORE = [`балл`, `балла`, `баллов`];
const PEOPLE = [`человек`, `человека`, `человек`];
const ONCE = [`раз`, `раза`, `раз`];
const SHOW = [`показал`, `показали`, `показал`];

const init = (app) => {
  app.locals.temp = {
    getNumEnding,
    getConclusionPhrase,
    QUESTION,
    SCORE,
    PEOPLE,
    ONCE,
    SHOW
  };
};

module.exports = {
  init
};
