const { Worker } = require('worker_threads');
const { fork } = require('child_process');
const fs = require('fs');
const fsPromises = require('fs/promises');
const express = require('express');
const { syncLoop, startPerf } = require('./utils');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.static('public-shared'));

app.get('/ping', (req, res) => {
  const stopPerf = startPerf(req.url);
  stopPerf();
  res.status(200).json({ message: 'pong' });
});

// Blocks until a single request finishes
app.get('/sync-write', (req, res) => {
  const stopPerf = startPerf(req.url);
  fs.writeFileSync(`/tmp/${Date.now()}.json`, 'hello'.repeat(50_000_000));
  stopPerf();
  res.json({ message: 'written' });
});

// This is non-blocking. We still see a few hundred ms lag sometimes.
app.get('/async-write', async (req, res) => {
  const stopPerf = startPerf(req.url);
  await fsPromises.writeFile(
    `/tmp/${Date.now()}.json`,
    'hello'.repeat(50_000_000)
  );
  stopPerf();
  res.json({ message: 'written' });
});

// Ping to sync-loop while it's running will wait until the current loop ends
app.get('/sync-loop', (req, res) => {
  const stopPerf = startPerf(req.url);
  const count = syncLoop(1_000_000_000);
  stopPerf();
  res.json({ count });
});

// Wrapped in a promise, but behavior is the same as sync-loop!
app.get('/promise-loop', async (req, res) => {
  const stopPerf = startPerf(req.url);
  const count = await syncLoop(1_000_000_000);
  stopPerf();
  res.json({ count });
});

// This will work where wrapping sync loop in a promise failed! Sends heavy
// sync work to a child process, which posts a message when done
app.get('/forked', (req, res) => {
  // Creates a new process
  const stopPerf = startPerf(req.url);
  const child = fork('./server/sync-fork.js');
  // send() method requires an argument even if it's unused by the child
  child.send(1_000_000_000);
  child.on('message', (count) => {
    stopPerf();
    res.json({ count });
  });
});

// This will do non-blocking synchronous work in a different thread, rather
// than a different process (like child.fork()). This uses less memory than
// forking a process, but would want to use a worker pool in a real app since
// too many workers can also use too many resources.
app.get('/worker', (req, res) => {
  // This could be further optimized if the heavy synchronous work can be
  // broken into smaller pieces and parallelized with multiple workers.
  const stopPerf = startPerf(req.url);
  const worker = new Worker('./server/sync-worker.js', {
    workerData: 1_000_000_000,
  });
  worker.on('message', (message) => {
    stopPerf();
    res.send({ message });
  });
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
