const express = require('express');
const cluster = require('cluster');
const path = require('path');
const { cpus } = require('os');
const { syncLoop, startPerf } = require('./utils');

const PORT = process.env.PORT || 3000;

// This is a good option if you have limited infra, but if you're using
// something like kubernetes you're probably better off managing resources at
// the infra layer rather than here in Node.
if (cluster.isMaster) {
  console.log(`Master process is ${process.pid}`);
  for (let i = 0; i < cpus().length; i++) {
    console.log(`Forking process ${i}`);
    cluster.fork();
  }
  cluster.on('exit', (worker, code) => {
    console.log(`Process ${worker.process.pid} exited with code ${code}`);
    cluster.fork();
  });
} else {
  const app = express();

  app.use(express.static('public-cluster'));
  app.use(express.static('public-shared'));

  // Unfortunately can't make multiple concurrent requests to this endpoint
  // from the same browser, but multiple concurrent curls will work
  app.get('/sync-loop-cluster', (req, res) => {
    console.log(`Processing on process ${process.pid}`);
    const perf = startPerf(req.url);
    const count = syncLoop();
    perf.stop();
    res.json({ count });
  });

  app.listen(PORT, () => {
    console.log(`Process ${process.pid} listening on http://localhost:${PORT}`);
  });
}
