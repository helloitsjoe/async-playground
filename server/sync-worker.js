const { parentPort, workerData } = require('worker_threads');
const { syncLoop } = require('./utils');

const count = syncLoop(workerData);

parentPort.postMessage(count);
