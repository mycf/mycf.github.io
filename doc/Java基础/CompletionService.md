`CompletionService` 是 Java 并发编程中的一个接口，它提供了一种异步任务处理的机制，并可以获取已完成任务的结果。

`CompletionService` 接口定义了提交任务和获取任务结果的方法，它可以将任务的执行与结果的获取分离开来，从而充分利用多线程并行处理任务，并在任务完成后立即获得结果。

以下是 `CompletionService` 接口的主要方法：

- `submit(Callable<T> task)`: 提交一个可调用的任务给 `CompletionService`，返回一个表示该任务的 `Future` 对象。
- `submit(Runnable task, T result)`: 提交一个可运行的任务给 `CompletionService`，并指定结果对象，在任务完成后会将结果对象返回给对应的 `Future`。
- `take()`: 获取已完成的任务的 `Future` 对象，如果当前没有任务完成，则阻塞等待。
- `poll()`: 获取已完成的任务的 `Future` 对象，如果当前没有任务完成，则立即返回 `null`。
- `poll(long timeout, TimeUnit unit)`: 在指定的时间内获取已完成的任务的 `Future` 对象，如果在超时时间内没有任务完成，则返回 `null`。

使用 `CompletionService` 可以方便地处理一批任务，并在任务完成后按照完成的顺序获取结果。它适用于需要批量处理
# 使用
```java
ExecutorService executor = Executors.newFixedThreadPool(5); ExecutorCompletionService service = new ExecutorCompletionService(executor);
for (int i = 0; i < 10; i++) {
	int finalI = i;
	service.submit(() -> {
		TimeUnit.SECONDS.sleep(finalI);
		return "a" + finalI;
	});
}
for (int i = 0; i < 10; i++) {
	System.out.println(service.take().get());
}
executor.shutdown();
```

# 源码

```java
public ExecutorCompletionService(Executor executor) {
	if (executor == null)
		throw new NullPointerException();
	this.executor = executor;
	this.aes = (executor instanceof AbstractExecutorService) ?
		(AbstractExecutorService) executor : null;
	this.completionQueue = new LinkedBlockingQueue<Future<V>>();
}
```