const startPerf = (id) => {
  const simplifiedDateString = new Date()
    .toISOString()
    .replace('Z', '')
    .split('T')[1];

  const start = Date.now();
  console.log(`${id} start:`, simplifiedDateString);

  return () => {
    console.log(`Took ${id} ${Date.now() - start} ms`);
  };
};

const syncLoop = (num = 100) => {
  let count = 0;
  for (let i = 0; i < num; i++) {
    count++;
  }
  return count;
};

module.exports = {
  startPerf,
  syncLoop,
};
