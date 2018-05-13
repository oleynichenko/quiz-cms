const {roundUp} = require(`../../../libs/util`);

const getSumLinksReportData = (linksReportData) => {
  const sumLinksReportData = {
    total: 0,
    average: 0,
    profies: 0,
    experts: 0
  };

  linksReportData.forEach((linkData) => {
    sumLinksReportData.total += linkData.total;
    sumLinksReportData.average += linkData.average;
    sumLinksReportData.profies += linkData.profies;
    sumLinksReportData.experts += linkData.experts;
  });

  if (linksReportData.length) {
    const average = sumLinksReportData.average / linksReportData.length;
    sumLinksReportData.average = roundUp(average, 2);
  }

  return sumLinksReportData;
};

module.exports = getSumLinksReportData;
