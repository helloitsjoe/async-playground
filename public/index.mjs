import { createRequester } from './utils.mjs';

function main() {
  createRequester('/sync-loop');
  createRequester('/async-loop');
  createRequester('/sync-write-file');
  createRequester('/async-write-file');
  createRequester('/sync-loop-fork');
  createRequester('/sync-loop-worker');
}

main();
