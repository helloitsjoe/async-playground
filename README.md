# Let's Block the Event Loop!

[Watch the YouTube video here!](https://youtu.be/OUWI-Euts64)

## Why?

- It's important when running a server not to block
- Blocking the event loop will block all endpoints
- Most important with CPU-bound tasks
- Best case: users will see latency
- Worst case: server will timeout/crash

## What we'll be doing

- Built-in Node async file writing
- Using child process and worker threads to handle CPU tasks

## What's the event loop?

- Node's mechanism for asynchronous processing
- [What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)
- [In the Loop](https://www.youtube.com/watch?v=cCOL7MC4Pl0)
