# async-playground

## Here's what we're doing

Setting up a Node server that compares different types of tasks, some synchronous some async. Some CPU-bound, some not. Then we're going to do it in Go.

## Here's why

I want to show you how sync tasks compare to async and why you don't want to
block the event loop. I also want to show you that it's not always as simple
as just wrapping in a Promise. I think I know how this all works but sometimes
I like to build little things like this to make sure I'm not missing anything.
I don't know as much about Golang, and I want to see how the concurrency model
compares for CPU-bound async tasks.

## Tasks

- [ ] Set up an endpoint
  - [ ] Long running CPU task (O(n^2) for loop)
- [ ] Set up a fetch call with perf timers
- [ ] Hit endpoint once at a time to see what happens
- [ ] Hit endpoint 2-3 times at once to see what happens
  - [ ] Can I get logs to see what thread each is on, or do I have to manually set up workers?
- [ ] Hit endpoint many times at once to see what happens
- [ ] Set up another endpoint
  - [ ] Wrap CPU task in a Promise
- [ ] Do it again
- [ ] Do both endpoints again with fs.writeFile + sync to see what happens
- [ ] Do it again with non-CPU-bound tasks
- [ ] Now do it with go/goroutines
