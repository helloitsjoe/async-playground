if (process.env.CLUSTER) {
  require('./app-cluster');
} else {
  require('./app');
}
