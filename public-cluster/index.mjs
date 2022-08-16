import { createRequester } from './utils.mjs';

function main() {
  createRequester('/ping');
  createRequester('/cluster');
}

main();
