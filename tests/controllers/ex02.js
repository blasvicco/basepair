const fs = require('fs');
const timer = require('./components/timer');
const getMatchs = require('./components/matchs');

// Input filename paths from Docker image
const newRtr = '/home/tests/public/data/New-router.txt';
const oldRtr = '/home/tests/public/data/Old-router.txt';

// async function to read files
const readFile = (file) => (new Promise((Resolve, Reject) => {
  fs.readFile(file, 'utf8', (err, data) => {
    return (err) ? Reject(err) : Resolve(data);
  });
}));

module.exports = async () => {
  let output = [];
  let result = {};

  const t01 = timer('Whole process');
  try {
    const t02 = timer('Reading input files');
    // reading files
    const newRtrInput = await readFile(newRtr);
    const oldRtrInput = await readFile(oldRtr);
    output.push(t02.stop());

    const t03 = timer('Formatting data');
    // regexp for time
    const msPttrn = /time=(.+) ms/g;
    // regexp for statistic values
    const statsPttrn = /round-trip min\/avg\/max\/stddev = (.+)\/(.+)\/(.+)\/(.+) ms/g;

    // getting time data from new router file content
    const newRtrData = getMatchs(newRtrInput, msPttrn).map((match) => Number(match[1]));
    // getting time data from old router file content
    const oldRtrData = getMatchs(oldRtrInput, msPttrn).map((match) => Number(match[1]));

    // getting statistic data from new router file content
    const newStats = getMatchs(newRtrInput, statsPttrn)[0].splice(1)
      .map((val) => Number(val));
    const newStatsObj = { min: newStats[0], avg: newStats[1], max: newStats[2] , stddev: newStats[3] };

    // getting statistic data from old router file content
    const oldStats = getMatchs(oldRtrInput, statsPttrn)[0].splice(1)
      .map((val) => Number(val));
    const oldStatsObj = { min: oldStats[0], avg: oldStats[1], max: oldStats[2] , stddev: oldStats[3] };

    result = {
      new: {
        data: newRtrData,
        stats: newStatsObj,
      },
      old: {
        data: oldRtrData,
        stats: oldStatsObj,
      }
    };
    output.push(t03.stop());

  } catch (err) {
    output.push(err.message);
  }
  output.push(t01.stop());

  return {
    output,
    result
  };
};
