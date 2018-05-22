const {generateUsers, generateTests, generateQuestions} = require(`../../../test/generate-data`);
const usersStore = require(`../../server/stores/users-store`);
const testsStore = require(`../../server/stores/tests-store`);
const questionsStore = require(`../../server/stores/questions-store`);

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

    const questions = generateQuestions();

    for (let i = 0; i < questions.length; i++) {
      await questionsStore.saveQuestion(questions[i]);
    }

    console.log(`База успешно наполнена тестовыми данными`);
  }
};
