module.exports = (input, regexp) => {
  let match;
  let matchs = [];
  do {
    match = regexp.exec(input);
    if (match) {
      matchs.push(match);
    }
  } while (match);
  return matchs;
};
