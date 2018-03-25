const {generateUsers} = require(`../../../test/generate-data`);
const userStore = require(`../../server/stores/users-store`);

module.exports = {
  name: `--generate`,
  description: `наполнить базу тестовыми данными`,
  async execute() {
    console.log(`Подключение к базе..`);

    const users = generateUsers();

    for (let i = 0; i < users.length; i++) {
      await userStore.saveUser(users[i]);
    }

    console.log(`База успешно наполнена тестовыми данными`);
  }
};
