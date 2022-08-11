const { Worker } = require('worker_threads');
const { fork } = require('child_process');
const fs = require('fs');
const express = require('express');
const { syncLoop, startPerf, wrap } = require('./utils');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.static('public-shared'));

// Ping to sync-loop while it's running will wait until the current loop ends
app.get('/sync-loop', (req, res) => {
  const perf = startPerf(req.url);
  const count = syncLoop();
  perf.stop();
  res.json({ count });
});

// Wrapped in a promise, but behavior is the same as sync-loop!
app.get('/async-loop', (req, res) => {
  const perf = startPerf(req.url);
  wrap(syncLoop).then((count) => {
    perf.stop();
    res.json({ count });
  });
});

// Blocks until a single request finishes
app.get('/sync-write-file', (req, res) => {
  const perf = startPerf(req.url);
  const count = fs.writeFileSync(
    `/tmp/${Date.now()}.json`,
    'hello'.repeat(90000000)
  );
  perf.stop();
  res.json({ count });
});

// This is non-blocking. We still see a few hundred ms lag sometimes.
app.get('/async-write-file', (req, res) => {
  const perf = startPerf(req.url);
  fs.writeFile(`/tmp/${Date.now()}.json`, 'hello'.repeat(90000000), (count) => {
    perf.stop();
    res.json({ count });
  });
});

// This will work where wrapping sync loop in a promise failed! Sends heavy
// sync work to a thread, which posts a message when done
app.get('/sync-loop-fork', (req, res) => {
  // Creates a new process
  const perf = startPerf(req.url);
  const child = fork('./server/sync-loop-fork.js');
  // send() method requires an argument even if it's unused by the child
  child.send('Do a loop please');
  child.on('message', (count) => {
    perf.stop();
    res.json({ count });
  });
});

// This will do non-blocking synchronous work in a different thread, rather
// than a different process (like child.fork()). This uses less memory than
// forking a process, but would want to use a worker pool in a realapp since
// too many workers can also use too many resources.
app.get('/sync-loop-worker', (req, res) => {
  // This could be further optimized if the heavy synchronous work can be
  // broken into smaller pieces and parallelized with multiple workers.
  const perf = startPerf(req.url);
  const worker = new Worker('./server/sync-loop-worker.js');
  worker.on('message', (message) => {
    perf.stop();
    res.send({ message });
  });
  worker.on('error', (message) => {
    perf.stop();
    res.status(500).send({ message });
  });
  worker.on('exit', (code) => console.log(`Worker exited with code ${code}.`));
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
