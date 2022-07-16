if (process.env.CLUSTER) {
  require('./cluster-app');
} else {
  require('./app');
}
