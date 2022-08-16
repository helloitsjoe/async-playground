const express = require('express');
const http = require('http');
const { startPerf } = require('./utils');

const app = express();
const server = http.createServer(app);

app.use(express.static('public-cluster'));
app.use(express.static('public-shared'));

app.get('/ping', (req, res) => {
  const stopPerf = startPerf(req.url);
  stopPerf();
  res.status(200).json({ message: 'pong' });
});

app.get('/cluster', (req, res) => {
  const stopPerf = startPerf(req.url);
  let count = 0;
  for (let i = 0; i < 1_000_000_000; i++) {
    count++;
  }
  stopPerf();
  res.status(200).json({ count });
});

server.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
