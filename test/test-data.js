const users = [
  {
    login: `Alexandr`,
    password: `123456789`
  },
  {
    login: `Nina`,
    password: `gftry567`
  },
  {
    login: `Kurtov`,
    password: `123456fgf`
  },
];


const QUESTIONS = [
  [
    {
      question: `Material Design это – `,
      options: {
        a: `дизайн-система`,
        b: `разработка дизайнеров компании Apple`,
        c: `торговая марка компании Google`
      },
      correctOption: `a`,
      pointsAvailable: 0.8,
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
      pointsAvailable: 0.8,
    },
  ],
  [
    {
      question: `В чем отличие скевоморфизма от Material Design?`,
      options: {
        a: `Ни в чем, это синонимы`,
        b: `Скевоморфизм это основа Material Design`,
        c: `Material Design ничего общего с скеоморфизмом вообще не имеет`
      },
      correctOption: `b`,
      pointsScored: 1,
    },
    {
      question: `Как соотносятся скевоморфизм и Material Design?`,
      options: {
        a: `Никак. Это понятия из разных областей`,
        b: `Material Design использует принцип скевоморфизма`,
        c: `Скевоморфизм это торговая марка компании Apple, а Material Design это торговая марка Google`
      },
      correctOption: `b`,
      pointsScored: 1,
    },
  ],
  [
    {
      question: `Плоский дизайн отличается от Material Design тем, что`,
      options: {
        a: `это тенденция в веб дизайне, а не четкая система как в Material Design`,
        b: `он более новый`,
        c: `в нем отсутствует принцип скеоморфизма, а Material Design он иногда допускается`,
        d: `в Material Design допускаюся 3D эффекты, а в плоском дизайне от них предлагают вообще отказаться`
      },
      correctOption: `a,d`,
      pointsAvailable: 1.2,
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
      pointsAvailable: 1.2,
    },
  ]
];

module.exports = {
  users,
  QUESTIONS
};
