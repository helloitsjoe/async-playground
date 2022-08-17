const express = require('express');
const { writeFileSync } = require('fs');
const { startPerf } = require('./utils');

const app = express();

app.use(express.static('public'));
app.use(express.static('public-shared'));

app.get('/ping', (req, res) => {
  const stopPerf = startPerf(req.url);
  stopPerf();
  res.status(200).json({ message: 'pong' });
});

app.get('/sync-write', (req, res) => {
  const stopPerf = startPerf(req.url);
  const largeFile = 'hello'.repeat(50_000_000);
  writeFileSync(`/tmp/${Date.now()}.json`, largeFile);
  stopPerf();
  res.status(200).json({ message: 'written' });
});

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
