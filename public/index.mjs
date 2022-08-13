import { createRequester } from './utils.mjs';

function main() {
  createRequester('/sync-write');
  createRequester('/async-write');
  createRequester('/sync-loop');
  createRequester('/promise-loop');
  createRequester('/forked');
  createRequester('/worker');
  createRequester('/ping');
}

main();
