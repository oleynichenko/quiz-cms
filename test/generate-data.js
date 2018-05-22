const {users, questions, tests} = require(`./test-data`);

const generateUsers = () => {
  return users;
};

const generateQuestions = () => {
  return questions;
};

const generateTests = () => {
  return tests;
};

module.exports = {
  generateUsers,
  generateQuestions,
  generateTests
};
