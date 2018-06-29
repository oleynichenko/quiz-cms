const async = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const roundUp = (number, fraction = 1) => {
  return (number % 1 === 0) ? number : +number.toFixed(fraction);
};

const ceilUp = (number, fraction = 0) => {
  const multiplier = Math.pow(10, fraction);

  return (number % 1 === 0) ? number : Math.ceil(number * multiplier) / multiplier;
};

const getPercent = (a, b) => {
  const percent = (a / b) * 100;
  return ceilUp(percent, 1);
};

const getDate = (date) => {
  const months = [
    `января`,
    `февраля`,
    `марта`,
    `апреля`,
    `мая`,
    `июня`,
    `июля`,
    `августа`,
    `сентября`,
    `октября`,
    `ноября`,
    `декабря`
  ];

  const month = months[date.getMonth()];

  return `${date.getDate()} ${month}`;
};

module.exports = {
  async,
  roundUp,
  getPercent,
  getDate,
  ceilUp
};
