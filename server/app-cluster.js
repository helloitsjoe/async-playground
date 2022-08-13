const express = require('express');
const cluster = require('cluster');
const path = require('path');
const { cpus } = require('os');
const { syncLoop, startPerf } = require('./utils');

const PORT = process.env.PORT || 3000;

// If you're using something like kubernetes to manage services, using
// multiple processes (or threads) will give you the ability to scale faster
// while waiting for the autoscaler to spin up new replicas.
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

  app.get('/ping', (req, res) => {
    const stopPerf = startPerf(req.url);
    stopPerf();
    res.status(200).json({ message: 'pong' });
  });

  app.get('/cluster', (req, res) => {
    console.log(`Processing on process ${process.pid}`);
    const stopPerf = startPerf(req.url);
    const count = syncLoop(1_000_000_000);
    stopPerf();
    res.json({ count });
  });

  app.listen(PORT, () => {
    console.log(`Process ${process.pid} listening on http://localhost:${PORT}`);
  });
}
