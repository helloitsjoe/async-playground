const { createServer } = require('http');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const express = require('express');

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 3000;
const MS_IN_NANO = BigInt(1000000);

app.use(express.static(path.join(process.cwd())));

const loop = () => {
  let count = 0;
  for (let i = 0; i < 30_000; i++) {
    for (let j = 0; j < 100_000; j++) {
      count++;
    }
  }
  return count;
};

// Sync loop blocks endpoint and all other endpoints
// Async loop just wrapping in a promise does the same
// Async loop with fs.writeFile() blocks that endpoint but not others
// For sync processing, use cluster or worker_threads
// TODO: What's the diff? Experiment with this...
app.get('/sync-loop', (req, res) => {
  // const start = process.hrtime.bigint();
  // console.log('sync start', new Date());
  // const count = loop();
  // console.log(`Took ${(process.hrtime.bigint() - start) / MS_IN_NANO} ms`);
  // res.json({ count });
  res.json({ quick: true });
});

app.get('/async-loop', (req, res) => {
  const start = process.hrtime.bigint();
  console.log('async start', new Date());
  const promise = () =>
    new Promise((resolve) => {
      fs.writeFile(
        `./temp/${Date.now()}.json`,
        'hello'.repeat(50000000),
        resolve
      );
      // const count = loop();
      // resolve(count);
    });

  promise().then((count) => {
    console.log(`Took ${(process.hrtime.bigint() - start) / MS_IN_NANO} ms`);
    res.json({ count });
  });
});

app.get('/empty-test-dir', () => {
  execSync('rm -rf ./test/*');
});

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
