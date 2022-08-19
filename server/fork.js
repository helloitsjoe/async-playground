const { syncLoop } = require('./utils');

process.on('message', (num) => {
  const count = syncLoop(num);
  process.send(count);
  process.exit();
});
