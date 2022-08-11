const startPerf = (id) => {
  const start = Date.now();
  console.log(
    `${id} start:`,
    new Date().toISOString().replace('Z', '').split('T')[1]
  );

  return {
    stop() {
      console.log(`Took ${id} ${Date.now() - start} ms`);
    },
  };
};

const wrap = (fn) =>
  new Promise((resolve) => {
    const result = fn();
    resolve(result);
  });

const syncLoop = () => {
  let count = 0;
  for (let i = 0; i < 30_000; i++) {
    for (let j = 0; j < 100_000; j++) {
      count++;
    }
  }
  return count;
};

module.exports = {
  startPerf,
  syncLoop,
  wrap,
};
