
# 任务提交
![[ThreadPoolExecutor 2023-12-26 21.48.29.excalidraw|100%]]
# 任务运行
![[ThreadPoolExecutor 2024-01-05 22.43.29.excalidraw|100%]]

> [!NOTE] 线程什么时候执行完成
> getTask为null的时候

# 线程回收
![[ThreadPoolExecutor 2024-01-07 13.27.24.excalidraw|100%]]

# 线程池的构造函数
```java
public ThreadPoolExecutor(int corePoolSize,
						  int maximumPoolSize,
						  long keepAliveTime,
						  TimeUnit unit,
						  BlockingQueue<Runnable> workQueue,
						  ThreadFactory threadFactory,
						  RejectedExecutionHandler handler) {
	if (corePoolSize < 0 ||
		maximumPoolSize <= 0 ||
		maximumPoolSize < corePoolSize ||
		keepAliveTime < 0)
		throw new IllegalArgumentException();
	if (workQueue == null || threadFactory == null || handler == null)
		throw new NullPointerException();
	this.corePoolSize = corePoolSize;
	this.maximumPoolSize = maximumPoolSize;
	this.workQueue = workQueue;
	this.keepAliveTime = unit.toNanos(keepAliveTime);
	this.threadFactory = threadFactory;
	this.handler = handler;
}
```
分别介绍一下：
1. `corePoolSize`（核心线程数）：线程池中保留的核心线程数量。即使线程处于空闲状态，核心线程也会一直存在，除非设置了 `allowCoreThreadTimeOut` 参数为 `true`，才会在空闲一定时间后被回收。

2. `maximumPoolSize`（最大线程数）：线程池中允许创建的最大线程数量。当工作队列已满且活动线程数达到最大线程数时，新的任务将会触发创建额外的线程，直到达到最大线程数。

3. `keepAliveTime`（线程空闲时间）：非核心线程在空闲一定时间后会被回收，以控制线程池的大小。这个参数指定了非核心线程的最大空闲时间。

4. `unit`（时间单位）：用于指定 `keepAliveTime` 的时间单位，例如 `TimeUnit.SECONDS`。

5. `workQueue`（工作队列）：用于存储等待执行的任务的队列。常见的队列类型有 `ArrayBlockingQueue`、`LinkedBlockingQueue`、`SynchronousQueue` 等。

6. `threadFactory`（线程工厂）：用于创建新线程的工厂。可以通过自定义线程工厂来对线程进行一些自定义设置，如线程名称、优先级等。

7. `rejectedExecutionHandler`（拒绝策略）：当线程池和工作队列都已满时，无法处理新提交的任务时的处理策略。常见的策略有 `AbortPolicy`（默认，抛出异常）、`CallerRunsPolicy`（在调用者线程中执行）等。

> [!NOTE] 为什么线程池使用阻塞队列`BlockingQueue`
> 在线程池任务执行完成后，调用 `workQueue.take();` 阻塞线程等待新任务到来


先对线程池里面的一些属性介绍一下：
```java
private static final int COUNT_BITS = Integer.SIZE - 3;
private static final int COUNT_MASK = (1 << COUNT_BITS) - 1;
private static int runStateOf(int c)     { return c & ~COUNT_MASK; }
private static int workerCountOf(int c)  { return c & COUNT_MASK; }
```


上面用到了`Integer.SIZE`值是32
```java
@Native public static final int SIZE = 32;
```

```java
private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));
```

看一下任务是如何提交的
```java
public Future<?> submit(Runnable task) {
	if (task == null) throw new NullPointerException();
	RunnableFuture<Void> ftask = newTaskFor(task, null);
	execute(ftask);
	return ftask;
}

```

```java
public void execute(Runnable command) {
	if (command == null)
		throw new NullPointerException();
	/*
	 * Proceed in 3 steps:
	 *
	 * 1. If fewer than corePoolSize threads are running, try to
	 * start a new thread with the given command as its first
	 * task.  The call to addWorker atomically checks runState and
	 * workerCount, and so prevents false alarms that would add
	 * threads when it shouldn't, by returning false.
	 *
	 * 2. If a task can be successfully queued, then we still need
	 * to double-check whether we should have added a thread
	 * (because existing ones died since last checking) or that
	 * the pool shut down since entry into this method. So we
	 * recheck state and if necessary roll back the enqueuing if
	 * stopped, or start a new thread if there are none.
	 *
	 * 3. If we cannot queue task, then we try to add a new
	 * thread.  If it fails, we know we are shut down or saturated
	 * and so reject the task.
	 */
	int c = ctl.get();
	// 当还没有达到核心线程池的数量时，直接添加1个新线程，然后让其执行任务即可
	if (workerCountOf(c) < corePoolSize) {
		// 添加新线程，且执行command任务
		// 添加成功，即不需要后续操作了，添加失败，则说明外部环境变化了
		if (addWorker(command, true))
			return;
		c = ctl.get();
	}
	// 当核心线程达到后，则尝试添加到阻塞队列中，具体添加方法由阻塞队列实现
	if (isRunning(c) && workQueue.offer(command)) {
		int recheck = ctl.get();
		// 添加队列成功后，还要再次检测线程池的运行状态，决定启动线程或者状态过期
		// 当线程池已关闭，则将刚刚添加的任务移除，走reject策略
		if (! isRunning(recheck) && remove(command))
			reject(command);
		else if (workerCountOf(recheck) == 0)
			addWorker(null, false);
	}
	else if (!addWorker(command, false))
		reject(command);
}

```

> [!NOTE] 核心线程数为空的时候，线程池如何处理任务
> Contents


```java
final void runWorker(Worker w) {
	Thread wt = Thread.currentThread();
	Runnable task = w.firstTask;
	w.firstTask = null;
	w.unlock(); // allow interrupts
	boolean completedAbruptly = true;
	try {
		while (task != null || (task = getTask()) != null) {
			w.lock();
			// If pool is stopping, ensure thread is interrupted;
			// if not, ensure thread is not interrupted.  This
			// requires a recheck in second case to deal with
			// shutdownNow race while clearing interrupt
			if ((runStateAtLeast(ctl.get(), STOP) ||
				 (Thread.interrupted() &&
				  runStateAtLeast(ctl.get(), STOP))) &&
				!wt.isInterrupted())
				wt.interrupt();
			try {
				beforeExecute(wt, task);
				try {
					task.run();
					afterExecute(task, null);
				} catch (Throwable ex) {
					afterExecute(task, ex);
					throw ex;
				}
			} finally {
				task = null;
				w.completedTasks++;
				w.unlock();
			}
		}
		completedAbruptly = false;
	} finally {
		processWorkerExit(w, completedAbruptly);
	}
}
```

```java
private Runnable getTask() {
	boolean timedOut = false; // Did the last poll() time out?

	for (;;) {
		int c = ctl.get();

		// Check if queue empty only if necessary.
		if (runStateAtLeast(c, SHUTDOWN)
			&& (runStateAtLeast(c, STOP) || workQueue.isEmpty())) {
			decrementWorkerCount();
			return null;
		}

		int wc = workerCountOf(c);

		// Are workers subject to culling?
		// 此线程是否使用空闲时间
		boolean timed = allowCoreThreadTimeOut || wc > corePoolSize;

		// 如果线程池中的活动线程数大于最大线程数，并且启用了定时回收功能而且线程已经超过了空闲时间，或者线程池中的线程数大于 1 并且工作队列为空，那么就满足了执行线程回收的条件。 
		if ((wc > maximumPoolSize || (timed && timedOut))
			&& (wc > 1 || workQueue.isEmpty())) {
			if (compareAndDecrementWorkerCount(c))
				return null;
			continue;
		}

		try {
			// 1.允许空闲回收的线程，等待keepAliveTime时间获取任务
			// 2.不允许回收的核心线程，阻塞至新任务到来
			Runnable r = timed ?
				workQueue.poll(keepAliveTime, TimeUnit.NANOSECONDS) :
				workQueue.take();
			if (r != null)
				return r;
			timedOut = true;
		} catch (InterruptedException retry) {
			timedOut = false;
		}
	}
}

```


> [!NOTE] 上面代码中什么时候会出现工作线程数大于最大线程数，`wc > maximumPoolSize`
> 动态调整最大线程数：如果在线程池运行过程中，通过调用线程池的 `setMaximumPoolSize()` 方法动态减少了最大线程数，而此时活动线程数超过了原先的最大线程数，就会出现 `wc > maximumPoolSize` 的情况。

# Java 默认的线程拒绝策略有以下几种：

1. AbortPolicy（默认）：该拒绝策略会直接抛出 `RejectedExecutionException` 异常，终止执行并丢弃新提交的任务。

2. CallerRunsPolicy：当线程池无法处理新提交的任务时，会将任务返回给提交任务的线程来执行。这样做的效果是，如果线程池正在执行任务的线程数量已达到最大值，新的任务会由提交任务的线程直接执行，而不会被丢弃。

3. DiscardPolicy：该拒绝策略会默默地丢弃无法处理的新任务，没有任何异常抛出。

4. DiscardOldestPolicy：当线程池无法处理新提交的任务时，会丢弃队列中最旧的一个任务（即等待时间最长的任务），然后尝试再次提交新任务。

除了这些默认的拒绝策略外，还可以通过实现 `RejectedExecutionHandler` 接口来定义自定义的拒绝策略。自定义拒绝策略可以根据业务需求进行灵活的处理，例如将无法处理的任务记录日志、存储到队列中等。

在使用线程池时，可以通过 `ThreadPoolExecutor` 的构造方法或 `ExecutorService` 的 `newThreadPoolExecutor` 方法来指定拒绝策略。例如：

```java
// 使用 AbortPolicy 拒绝策略
ExecutorService executor = new ThreadPoolExecutor(corePoolSize, maximumPoolSize, keepAliveTime, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<>(queueSize));

// 使用自定义拒绝策略
RejectedExecutionHandler myRejectedHandler = new MyRejectedHandler();
ExecutorService executor = new ThreadPoolExecutor(corePoolSize, maximumPoolSize, keepAliveTime, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<>(queueSize), myRejectedHandler);
```

请注意，在使用自定义拒绝策略时，要确保拒绝策略的实现是线程安全的，以避免并发问题。
