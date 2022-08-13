const simplifiedDateString = new Date()
  .toISOString()
  .replace('Z', '')
  .split('T')[1];

const startPerf = (id) => {
  const start = Date.now();
  console.log(`${id} start:`, simplifiedDateString);

  return () => {
    console.log(`Took ${id} ${Date.now() - start} ms`);
  };
};

module.exports = {
  startPerf,
};
