const { parentPort } = require('worker_threads');
const { syncLoop } = require('./utils');

const count = syncLoop();

parentPort.postMessage(count);
