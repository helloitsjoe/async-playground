export function createRequester(url) {
  const root = document.getElementById('root');
  const button = document.createElement('button');
  const output = document.createElement('div');
  const input = document.createElement('input');
  const form = document.createElement('form');

  button.textContent = url;
  button.type = 'submit';
  input.placeholder = '1';
  output.textContent = 'Click to request';
  output.classList.add('output');

  if (url.includes('sync')) {
    button.classList.add(url.includes('async') ? 'async' : 'sync');
  }

  form.appendChild(input);
  form.appendChild(button);
  form.appendChild(output);

  root.appendChild(form);

  form.onsubmit = (e) => {
    e.preventDefault();
    output.textContent = 'Standby...';
    button.disabled = true;
    const start = Date.now();
    fetchAll(url, Number(input.value) || 1)
      .then((res) => {
        console.log('res', res);
        const elapsed = Date.now() - start;
        output.textContent = `Elapsed: ${elapsed}`;
        button.disabled = false;
      })
      .catch((err) => {
        output.textContent = `Error: ${err.message}`;
        button.disabled = false;
      });
  };
}

function fetchAll(endpoint, concurrentRequests) {
  const reqs = Array(concurrentRequests)
    .fill(null)
    .map(() => createPromise(endpoint));
  return Promise.all(reqs);
}

function createPromise(endpoint) {
  return fetch(endpoint).then((res) => {
    if (!res.ok) {
      throw new Error(`${res.status}`);
    }
    return res.json();
  });
}
