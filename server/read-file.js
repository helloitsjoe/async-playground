const fs = require('fs');
const { startPerf } = require('./utils');

const count = process.argv[2] || 1;

console.log('count', count);

// const content = 'hello'.repeat(90_000_000);
// fs.writeFileSync('./temp/hello.json', content);

for (let i = 0; i < count; i++) {
  const perf = startPerf(i);
  fs.readFile(`./temp/hello.json`, () => {
    perf.stop(i);
  });
}
