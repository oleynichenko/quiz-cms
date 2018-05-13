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

// const generateLinks = () => {
//   return links;
// };

module.exports = {
  generateUsers,
  generateQuestions,
  // generateLinks,
  generateTests
};
