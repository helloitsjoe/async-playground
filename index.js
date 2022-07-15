const createPromise = (endpoint) =>
  fetch(`http://localhost:3000${endpoint}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status}`);
      }
      return res.json();
    })
    .catch(console.error);

function fetchAll(endpoint, concurrentRequests) {
  // Need to fill and then map otherwise promises all have the same reference
  // and resolve at the same time
  console.log('concurrentRequests', concurrentRequests);
  const reqs = Array(concurrentRequests)
    .fill(null)
    .map(() => createPromise(endpoint));
  return Promise.all(reqs);
}

function main() {
  const syncLoopButton = document.getElementById('sync-loop-req');
  const asyncLoopButton = document.getElementById('async-loop-req');
  const syncLoopRes = document.getElementById('sync-loop-res');
  const asyncLoopRes = document.getElementById('async-loop-res');
  const syncLoopInput = document.getElementById('sync-loop-input');
  const asyncLoopInput = document.getElementById('async-loop-input');

  syncLoopButton.onclick = () => {
    syncLoopRes.textContent = 'Fetching...';
    const start = Date.now();
    fetchAll('/sync-loop', Number(syncLoopInput.value) || 1).then((res) => {
      console.log('res', res);
      const elapsed = Date.now() - start;
      syncLoopRes.textContent = `Elapsed: ${elapsed}`;
    });
  };

  asyncLoopButton.onclick = () => {
    asyncLoopRes.textContent = 'Fetching...';
    const start = Date.now();
    fetchAll('/async-loop', Number(asyncLoopInput.value) || 1).then((res) => {
      console.log('res', res);
      const elapsed = Date.now() - start;
      asyncLoopRes.textContent = `Elapsed: ${elapsed}`;
    });
  };
}

main();
