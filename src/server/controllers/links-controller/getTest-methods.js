const canPass = (usedAttempts, attempts) => {
  return (usedAttempts === void 0) || (attempts === void 0) || usedAttempts < attempts;
};

module.exports = {
  canPass,
};
