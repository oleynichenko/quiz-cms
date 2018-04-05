const {generateUsers, generateTests, generateQuestions, generateLinks} = require(`../../../test/generate-data`);
const usersStore = require(`../../server/stores/users-store`);
const testsStore = require(`../../server/stores/tests-store`);
const questionsStore = require(`../../server/stores/questions-store`);
const linksStore = require(`../../server/stores/links-store`);

module.exports = {
  name: `--generate`,
  description: `наполнить базу тестовыми данными`,
  async execute() {
    console.log(`Подключение к базе..`);

    const users = generateUsers();

    for (let i = 0; i < users.length; i++) {
      await usersStore.saveUser(users[i]);
    }

    const tests = generateTests();

    for (let i = 0; i < tests.length; i++) {
      await testsStore.saveTest(tests[i]);
    }

    const links = generateLinks();

    for (let i = 0; i < links.length; i++) {
      await linksStore.saveLink(links[i]);
    }

    const questions = generateQuestions();

    for (let i = 0; i < questions.length; i++) {
      await questionsStore.saveQuestion(questions[i]);
    }

    console.log(`База успешно наполнена тестовыми данными`);
  }
};
