const { syncLoop } = require('./utils');

process.on('message', () => {
  const count = syncLoop();
  process.send(count);
  process.exit();
});
