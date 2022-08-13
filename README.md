# Let's Block the Event Loop!

## Why?

- Important when running a server not to block
- Blocking the event loop will block all endpoints
- Mostly important with CPU-bound tasks
- Best case: users will see latency
- Worst case: server will timeout/crash

## What we'll be doing

- Built-in Node async file writing
- Using child process and threads to handle CPU tasks

## What's the event loop?

- Node's mechanism for asynchronous processing
- [What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)
- [In the Loop](https://www.youtube.com/watch?v=cCOL7MC4Pl0)

## Tasks

- [ ] Set up an endpoint
- [ ] Set up a fetch call with perf timers
- [ ] Set up an endpoint with fs.writeFileSync
- [ ] Hit endpoint once at a time to see what happens
- [ ] Hit endpoint 2-3 times at once to see what happens
- [ ] Hit endpoint many times at once to see what happens
- [ ] Set up an endpoint with fs.writeFile promise
- [ ] Set up another endpoint: Long running CPU task (O(n^2) for loop)
- [ ] Wrap CPU task in a Promise (does nothing)
- [ ] Create a child.fork endpoint
- [ ] Create a Worker endpoint
- [ ] Explain a little about process vs thread (lighter weight, share memory space)
- [ ] Show cluster app
- [ ] Do it again with non-CPU-bound tasks (Is there even a good way to show bottleneck here?)

## TODO: Do this in Go to see how it compares
