const timer = require('./components/timer');
const getMatchs = require('./components/matchs');

module.exports = (input = '') => {
  let output = [];
  if (input === '') {
    output.push('WARNING: No list of file names was provided.');
  }

  const t01 = timer('Whole process');
  // regexp for file names pattern
  const gPttrn = /([a-zA-Z0-9-]+)_(S\d)_(L\d{3}_R\d{1}_\d{3})\.fastq\.(gz|zip|bzip|bz)/ig;

  // regexp for fwd_files match
  const fPttrn = /L\d{3}_R1_\d{3}/;
  let groups = {};

  const t02 = timer('Grouping');
  // for each valid filename found in the input
  getMatchs(input, gPttrn).forEach((matchs) => {
    try {
      // retrieve or initialize group by filename ([a-zA-Z0-9-]+)
      const group = groups[matchs[1]] || {
        name: matchs[1],
        fwd_files: [],
        rev_files: []
      };

      // if matchs[3] (L\d{3}_R\d{1}_\d{3}) match with fPttrn L\d{3}_R1_\d{3}
      if (fPttrn.test(matchs[3])) {
        // add filename into the fwd_files
        group.fwd_files.push(matchs[0]);
      } else { // else means (L\d{3}_R\d{1}_\d{3}) match L\d{3}_R2_\d{3}
        // add filename into the rev_files
        group.rev_files.push(matchs[0]);
      }

      // update group
      groups[matchs[1]] = group;
    } catch (err) {
      console.log(err);
      output.push(`Error: not valid filename ${matchs[0]}.`);
    }
  });
  output.push(t02.stop());

  const t03 = timer('Formatting');
  // formatting groups to match with the result required in EX01
  const result = Object.keys(groups).map((key) => {
    return groups[key];
  });
  output.push(t03.stop());

  output.push(t01.stop());
  return {
    output,
    result,
  };
};
