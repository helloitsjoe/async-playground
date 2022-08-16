import { createRequester } from './utils.mjs';

function main() {
  createRequester('/ping');
  createRequester('/async-cluster');
}

main();
