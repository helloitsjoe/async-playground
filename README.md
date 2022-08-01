# Let's Block the Event Loop!

## Here's what we're doing

Setting up a Node server that compares blocking vs non-blocking tasks.

## Here's why

I want to show how Node handles synchronous tasks compared to async and why you
don't want to block the event loop. I also want to show that it's not always as
simple as just wrapping in a Promise. I also _think_ I have a good mental model
for all this, but I also often expose a blind spot or two when I build things
like this!

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
