import { createRequester } from './utils.mjs';

function main() {
  createRequester('/cluster');
  createRequester('/ping');
}

main();
