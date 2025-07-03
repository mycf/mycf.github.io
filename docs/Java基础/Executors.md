Java 中的 Executors 类提供了一组静态方法，用于创建和管理线程池。下面是一些 Executors 类中常用的重要方法的介绍：

1. `newFixedThreadPool(int nThreads)`：创建一个固定大小的线程池，该线程池包含指定数量的线程。当提交的任务数量超过线程池的大小时，任务将被放入队列中等待执行。

2. `newCachedThreadPool()`：创建一个可根据需要自动调整大小的线程池。线程池的大小会根据任务的数量动态地增加或减少。如果线程在 60 秒内没有执行任务，则会被终止并从线程池中移除。

3. `newSingleThreadExecutor()`：创建一个只有一个线程的线程池。所有提交的任务都将按顺序执行。如果线程在执行任务时发生异常而终止，将会创建一个新的线程来取代它。

4. `newScheduledThreadPool(int corePoolSize)`：创建一个可以执行定时任务和周期性任务的线程池。它可以按照给定的时间间隔执行任务，或者按照给定的延迟时间执行任务。

5. `newWorkStealingPool()`：创建一个基于工作窃取算法的线程池。该线程池使用 `ForkJoinPool` 实现，可以用于执行递归和分治类型的任务。

# `newFixedThreadPool`

`LinkedBlockingQueue`队列长度没有设置，默认为`Integer.MAX_VALUE`

```java
public static ExecutorService newFixedThreadPool(int nThreads, ThreadFactory threadFactory) {
	return new ThreadPoolExecutor(nThreads, nThreads,
								  0L, TimeUnit.MILLISECONDS,
								  new LinkedBlockingQueue<Runnable>(),
								  threadFactory);
}

```

# `newCachedThreadPool`

最大线程数量为`Integer.MAX_VALUE`，[[SynchronousQueue]]是一个长度为0的阻塞队列。

> [!NOTE] 为什么要用`SynchronousQueue`
> 可能为了任务快速执行

```java
public static ExecutorService newCachedThreadPool() {
	return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
							j	  60L, TimeUnit.SECONDS,
								  new SynchronousQueue<Runnable>());
}

```

# `newSingleThreadExecutor`

队列长度没有设置，默认为`Integer.MAX_VALUE`

```java
public static ExecutorService newSingleThreadExecutor(ThreadFactory threadFactory) {
	return new AutoShutdownDelegatedExecutorService
		(new ThreadPoolExecutor(1, 1,
								0L, TimeUnit.MILLISECONDS,
								new LinkedBlockingQueue<Runnable>(),
								threadFactory));
}

```


# `newScheduledThreadPool`

`ScheduledThreadPoolExecutor`默认最大线程数没有限制，为`Integer.MAX_VALUE`

```java
public static ScheduledExecutorService newScheduledThreadPool(
		int corePoolSize, ThreadFactory threadFactory) {
	return new ScheduledThreadPoolExecutor(corePoolSize, threadFactory);
}

```

# `newWorkStealingPool`

```java
public static ExecutorService newWorkStealingPool(int parallelism) {
	return new ForkJoinPool
		(parallelism,
		 ForkJoinPool.defaultForkJoinWorkerThreadFactory,
		 null, true);
}
```
在 Java 1.8 中，引入了 `ForkJoinPool` 类的 `newWorkStealingPool` 方法，用于创建一个基于工作窃取算法的线程池。

工作窃取算法（Work Stealing）是一种并行任务调度算法，用于优化任务执行的负载均衡。它适用于一种特殊的任务模型，即任务可以被划分为更小的子任务，这些子任务可以并行执行。

`newWorkStealingPool` 方法创建的线程池是一个 `ForkJoinPool`，它是 Java 并发框架中的一部分。与传统的线程池不同，`ForkJoinPool` 使用工作窃取算法来平衡任务的执行负载。

以下是 `newWorkStealingPool` 方法的一些特点和行为：

1. 动态线程数量：`ForkJoinPool` 会根据任务的需求自动调整线程的数量，以充分利用可用的处理器资源。它可以根据需要创建新的线程，并在任务执行完毕后关闭不再需要的线程。

2. 工作窃取：每个线程都维护了一个工作队kk'kk列（work queue），线程会从自己的队列中获取任务执行。当一个线程的工作队列为空时，它可以从其他线程的工作队列中窃取任务来执行。这种方式可以实现负载均衡，避免线程因为某些任务执行时间较长kk而空闲的情况。

3. 分治任务：`ForkJoinPool` 适用于分治任务模型，其中大任务可以划分为多个较小的子任务并行执行。线程池会递归地将任务拆分为更小的子任务，直到达到某个终止条件，然后将子任务分配给线程执行。

4. `ForkJoinTask`：`ForkJoinPool` 中的任务是 `ForkJoinTask` 的实例，它是一个可以被分割的可执行任务。常见的子类有 `RecursiveActiokkn`（无返回值的任务）和 `RecursiveTask`（有返回值的任务）。

使用 `newWorkStealingPool` 方法创建的线程池可以简化并行任务的编程，特别适用于递归和分治类型的任务。它提供了自动的线程管理和负载均衡，可以更好地利用多核处理器的性能。
