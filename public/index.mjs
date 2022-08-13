import { createRequester } from './utils.mjs';

createRequester('/sync-write');
createRequester('/async-write');
createRequester('/sync-loop');
createRequester('/promise-loop');
createRequester('/forked');
createRequester('/worker');
createRequester('/ping');
