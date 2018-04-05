const users = [
  {
    login: `Alex`,
    password: `12`,
    rights: `admin`,
    tests: [`1`, `2`]
  },
  {
    login: `Nina`,
    password: `34`,
    rights: `user`,
    tests: [`2`]
  },
  {
    login: `Kurtov`,
    password: `12`,
    rights: ``
  },
];

const questions = [
  {
    id: `1`,
    pointsAvailable: 0.8,
    wording: `Material Design это – `,
    options: {
      a: `дизайн-система`,
      b: `разработка дизайнеров компании Apple`,
      c: `торговая марка компании Google`
    },
    correctOptions: [`a`],
  },
  {
    id: `2`,
    alternativeTo: `1`,
    pointsAvailable: 0.8,
    wording: `Material Design это – `,
    options: {
      a: `язык визуальных образов`,
      b: `разработка дизайнеров компании Samsung`,
      c: `торговая марка компании Google`,
      d: `эволюция визуального языка Holo`,
    },
    correctOptions: [`a`, `d`],
  },
  {
    id: `3`,
    pointsAvailable: 1,
    wording: `В чем отличие скевоморфизма от Material Design?`,
    options: {
      a: `Ни в чем, это синонимы`,
      b: `Скевоморфизм это основа Material Design`,
      c: `Material Design ничего общего с скеоморфизмом вообще не имеет`
    },
    correctOptions: [`b`],
  },
  {
    id: `4`,
    alternativeTo: `3`,
    pointsAvailable: 1,
    wording: `Как соотносятся скевоморфизм и Material Design?`,
    options: {
      a: `Никак. Это понятия из разных областей`,
      b: `Material Design использует принцип скевоморфизма`,
      c: `Скевоморфизм это торговая марка компании Apple, а Material Design — торговая марка Google`
    },
    correctOptions: [`b`],
  },
  {
    id: `5`,
    pointsAvailable: 1.2,
    wording: `Плоский дизайн отличается от Material Design тем, что`,
    options: {
      a: `это тенденция в веб дизайне, а не четкая система как в Material Design`,
      b: `он более новый`,
      c: `в нем отсутствует принцип скеоморфизма, а Material Design он иногда допускается`,
      d: `в Material Design допускаюся 3D эффекты, а в плоском дизайне от них предлагают вообще отказаться`
    },
    correctOptions: [`a`, `d`],
  },
  {
    id: `6`,
    pointsAvailable: 1.2,
    alternativeTo: `5`,
    wording: `Material Design отличается от плоского дизайна тем, что `,
    options: {
      a: `это всего лишь тенденция в веб дизайне, а не четкая система как в плоском дизайне`,
      b: `он более новый`,
      c: `в нем отсутствует принцип скеоморфизма`,
      d: `в Material Design допускаюся 3D эффекты, а настоящий плоский дизайн предлагают полностью от них отказаться`
    },
    correctOptions: [`b`, `c`, `d`],
  }
];

const tests = [
  {
    id: `1`,
    title: `Основы Material Design`,
    description: `Для набора на МК 1 сентября 2018 года в Школе Дизайна`,
    questions: [`1`, `2`, `3`],
    links: [`1`]
  },
  {
    id: `2`,
    title: `Основы Material Design`,
    description: `Для МК 1 сентября 2018 года`,
    questions: [`2`, `4`, `6`],
  },
];

const links = [
  {
    id: `1`,
    testId: `1`,
    name: `Для Фейсбук`,
    permalink: `md-fb`,
    enable: `true`,
    introText: `Этот тест предназначен для...`,
    gettingName: false,
    attempts: 2,
  }
];

module.exports = {
  users,
  questions,
  tests,
  links
};
