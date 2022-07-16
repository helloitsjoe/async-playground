const { createServer } = require('http');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const express = require('express');

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 3000;

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

const wrap = (fn) =>
  new Promise((resolve) => {
    const result = fn();
    resolve(result);
  });

// Sync loop blocks endpoint and all other endpoints
// Async loop just wrapping in a promise does the same
// Async loop with fs.writeFile() blocks that endpoint but not others
// For sync processing, use cluster or worker_threads
// TODO: What's the diff? Experiment with this...
app.get('/ping', (req, res) => {
  res.json({ quick: true });
});

// Ping to sync-loop while it's running will wait until the current loop ends
app.get('/sync-loop', (req, res) => {
  const start = process.hrtime.bigint();
  console.log('sync start', new Date());
  const count = loop();
  console.log(`Took ${Date.now() - start} ms`);
  res.json({ count });
});

// Wrapped in a promise, but behavior is the same as sync-loop!
app.get('/async-loop', (req, res) => {
  const start = Date.now();
  console.log('async loop start', new Date());

  wrap(loop).then((count) => {
    console.log(`Took ${Date.now() - start} ms`);
    res.json({ count });
  });
});

app.get('/sync-write-file', () => {});

// This is non-blocking. We still see a few hundred ms lag sometimes.
app.get('/async-write-file', (req, res) => {
  const start = Date.now();
  console.log('async start', new Date());

  fs.writeFile(
    `./temp/${Date.now()}.json`,
    'hello'.repeat(50000000),
    (count) => {
      console.log(`Took ${Date.now() - start} ms`);
      res.json({ count });
    }
  );
});

app.get('/empty-temp-dir', (req, res) => {
  // TODO: Why isn't this emptying?
  execSync('ls');
  execSync('rm -rf ./temp/*');
  res.send({ message: 'Emptied' });
});

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
