const users = [
  {
    login: `Alex`,
    password: `12`,
    rights: `admin`
  },
  {
    login: `Nina`,
    password: `34`,
    rights: `user`
  },
  {
    login: `Kurtov`,
    password: `123456fgf`,
    rights: ``
  },
];


const questions = [
  {
    id: 1,
    pointsAvailable: 0.8,
    versions: [
      {
        question: `Material Design это – `,
        options: {
          a: `дизайн-система`,
          b: `разработка дизайнеров компании Apple`,
          c: `торговая марка компании Google`
        },
        correctOption: `a`,
      },
      {
        question: `Material Design это – `,
        options: {
          a: `язык визуальных образов`,
          b: `разработка дизайнеров компании Samsung`,
          c: `торговая марка компании Google`,
          d: `эволюция визуального языка Holo`,
        },
        correctOption: `a,d`,
      }
    ],
  },
  {
    id: 2,
    pointsScored: 1,
    versions: [
      {
        question: `В чем отличие скевоморфизма от Material Design?`,
        options: {
          a: `Ни в чем, это синонимы`,
          b: `Скевоморфизм это основа Material Design`,
          c: `Material Design ничего общего с скеоморфизмом вообще не имеет`
        },
        correctOption: `b`,
      },
      {
        question: `Как соотносятся скевоморфизм и Material Design?`,
        options: {
          a: `Никак. Это понятия из разных областей`,
          b: `Material Design использует принцип скевоморфизма`,
          c: `Скевоморфизм это торговая марка компании Apple, а Material Design это торговая марка Google`
        },
        correctOption: `b`,
      },
    ],
  },
  {
    id: 3,
    pointsAvailable: 1.2,
    versions: [
      {
        question: `Плоский дизайн отличается от Material Design тем, что`,
        options: {
          a: `это тенденция в веб дизайне, а не четкая система как в Material Design`,
          b: `он более новый`,
          c: `в нем отсутствует принцип скеоморфизма, а Material Design он иногда допускается`,
          d: `в Material Design допускаюся 3D эффекты, а в плоском дизайне от них предлагают вообще отказаться`
        },
        correctOption: `a,d`,
      },
      {
        question: `Material Design отличается от плоского дизайна тем, что `,
        options: {
          a: `это всего лишь тенденция в веб дизайне, а не четкая система как в плоском дизайне`,
          b: `он более новый`,
          c: `в нем отсутствует принцип скеоморфизма`,
          d: `в Material Design допускаюся 3D эффекты, а настоящий плоский дизайн предлагают полностью от них отказаться`
        },
        correctOption: `b,c,d`,
      },
    ],
  },
];

const tests = [
  {
    id: 1,
    title: `Основы Material Design`,
    questions: [1, 2, 3],
    version: 1,
    links: [`md-fb`, `md-site`]
  },
  {
    id: 2,
    title: `Основы Material Design`,
    questions: [1, 2, 3],
    version: 2,
    links: [`md-start-mk`, `md-finish-mk`]
  },
];

// const links = [
//   {
//     title: `Для Фейсбук`,
//     address: `md-fb`,
//   }
// ];

module.exports = {
  users,
  questions,
  tests
};
