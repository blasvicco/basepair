const fs = require('fs');
const readline = require('readline');
const file = '/home/tests/public/data/differential-expression.txt'; // TSV file

module.exports = (io) => {
  // creating a socket connection
  io.on('connection', (socket) => {

    // on click EX03 submit button
    socket.on('Ex03 start', () => {
      let colsIndex = {};

      // we start the reading large file process
      const lineReader = readline.createInterface({
        input: fs.createReadStream(file)
      });

      // on line read
      lineReader.on('line', (line) => {
        // split by tabs (TSV file)
        const cols = line.split('\t');

        // if first col is empty (first line)
        if (cols[0] === '') {
          // create object with the index of the needed cols
          colsIndex = {
            'Name': cols.indexOf('Name'),
            'log2FoldChange': cols.indexOf('log2FoldChange'),
            'pvalue': cols.indexOf('pvalue')
          };
        } else { // else means the rest of the lines in the file
          // emmit line data to client
          // line data is formatted by Object.keys(colsIndex).map
          socket.emit('Add dot', Object.keys(colsIndex).map((key) => {
            // if pvalue
            return (key === 'pvalue')
              // apply - Math.log10 to value
              ? - Math.log10(cols[colsIndex[key]])
              // if log2FoldChange
              : (key === 'log2FoldChange')
                // cast to number
                ? Number(cols[colsIndex[key]])
                // return string
                : cols[colsIndex[key]];
          }));
        }
      });

      // on close file
      lineReader.on('close', () => {
        // emmit close file to client
        socket.emit('File closed');
      });

    });
  });
};
