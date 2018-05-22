const users = [
  {
    login: `Alex`,
    password: `12`,
    enable: true,
    rights: `admin`,
    tests: [`1`]
  },
  {
    login: `Nina`,
    password: `34`,
    enable: true,
    rights: `user`,
    tests: [`2`]
  },
  {
    login: `Kurtov`,
    password: `12`,
    enable: true,
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
    themes: [`material-design`]
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
    themes: [`material-design`]

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
    themes: [`material-design`]

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
    themes: [`material-design`]

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
    themes: [`material-design`]

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
    themes: [`material-design`]

  }
];

const tests = [
  {
    id: `1`,
    enable: true,
    title: `Основы Material Design`,
    questions: [`1`, `2`, `3`],
    canonLink: `material-design`,
    possibleScore: 2.6,
    levels: {
      profi: 93,
      expert: 97
    },
    images: {
      profi: `md-profi.jpg`,
      expert: `md-expert.jpg`,
      main: `md-main.jpg`
    },
    description: `Тест оценивает знание основ  Material Design. Создан в 2018 году на основе официальной документации, интервью автора методологии Матиауса Дуарте и нескольких статей из International Journal of Design.`,
    introText: `<p>Автор - Александр Олейниченко, веб разработчик с 10 летним опытом, руководитель рекламного агенства TESTO. Тест используется при подборе ведущих дизайнеров и руководителей проектов агентства.</p><p>Важно что кроме владения азами MD тест показывает знания ньансов похожих методологий, что определяет специалистов с действительно глубоким пониманием темы.</p>`,
    recommendText: `<p>Восполнить обнаруженные пробелы в знаниях можно как проработкой рекомендованной литературы так и посещением мастер-класса автора 25 апреля в Киеве. Сочетание обоих вариантов безусловно будет лучшим решением.</p>`,
    infoSources: [
      {title: `Основы дизайна`, link: `https://prjctr.com.ua/`},
      {title: `Основы дизайна`, link: `https://prjctr.com.ua/`},
      {title: `Основы дизайна`, link: `https://prjctr.com.ua/`},
    ],
    event: {
      title: `Мастер-класс "Основы Material Design"`,
      link: `https://prjctr.com.ua/`,
    },
    links: [
      {
        name: `Для мастер-класса`,
        permalink: `md-mk`,
        interval: 604800,
        time: 900,
        enable: true,
        enabledInfo: true,
        attempts: 2,
        retakeMessage: `Пересдача теста возможна по решению лектора `,
      },
      {
        name: `Для рекламы`,
        permalink: `material-design`,
        interval: 604800,
        time: 900,
        enable: true,
        enabledInfo: true,
        attempts: 2,
        retakeMessage: `Пересдача теста возможна ... `,
      }
    ]
  },
  {
    id: `2`,
    enable: true,
    title: `Javascript Ninja - Функции`,
    questions: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37],
    alternative: false,
    canonLink: `js-functions`,
    possibleScore: 100,
    levels: {
      profi: 93,
      expert: 97
    },
    images: {
      profi: `md-profi.jpg`,
      expert: `md-expert.jpg`,
      main: `md-main.jpg`
    },
    description: `Тест оценивает знание основ  Material Design. Создан в 2018 году на основе официальной документации, интервью автора методологии Матиауса Дуарте и нескольких статей из International Journal of Design.`,
    introText: `<p>Автор - Александр Олейниченко, веб разработчик с 10 летним опытом, руководитель рекламного агенства TESTO. Тест используется при подборе ведущих дизайнеров и руководителей проектов агентства.</p><p>Важно что кроме владения азами MD тест показывает знания ньансов похожих методологий, что определяет специалистов с действительно глубоким пониманием темы.</p>`,
    recommendText: `<p>Восполнить обнаруженные пробелы в знаниях можно как проработкой рекомендованной литературы так и посещением мастер-класса автора 25 апреля в Киеве. Сочетание обоих вариантов безусловно будет лучшим решением.</p>`,
    infoSources: [
      {title: `Основы дизайна`, link: `https://prjctr.com.ua/`},
      {title: `Основы дизайна`, link: `https://prjctr.com.ua/`},
      {title: `Основы дизайна`, link: `https://prjctr.com.ua/`},
    ],
    event: {
      title: `Мастер-класс "Основы Material Design"`,
      link: `https://prjctr.com.ua/`,
    },
    links: [
      {
        name: `Основная`,
        permalink: `js-functions`,
        interval: 604800,
        time: 900,
        enable: true,
        enabledInfo: true,
        attempts: 2,
        retakeMessage: `Пересдача теста возможна после..`,
      }
    ]
  }
];

module.exports = {
  users,
  questions,
  tests,
};
