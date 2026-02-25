
```java
public class DelayQueue<E extends Delayed> extends AbstractQueue<E>
    implements BlockingQueue<E> {

    private final transient ReentrantLock lock = new ReentrantLock();
	// 使用优先队列保存元素
    private final PriorityQueue<E> q = new PriorityQueue<E>();

```

```
```

> [!NOTE] 思考：PriorityQueue
> 第一个元素是最小的过期时间，监控第一个元素就可以知道什么时候去取数据，类似redis监控过期key，最小的过期时间就是系统下次运行的时间

# offer

# poll

![[Queue#`E poll()`：]]
```java
public E poll() {
	final ReentrantLock lock = this.lock;
	lock.lock();
	try {
		E first = q.peek();
		// 队列为空或者首节点剩余延迟时间大于0，返回null
		return (first == null || first.getDelay(NANOSECONDS) > 0)
			? null
			// 否则返回首元素
			: q.poll();
	} finally {
		lock.unlock();
	}
}

```
![[Queue#`E peek()`：]]
# take
![[BlockingQueue#`E take()`：]]
```java
public E take() throws InterruptedException {
	final ReentrantLock lock = this.lock;
	// 可响应中断
	lock.lockInterruptibly();
	try {
		for (;;) {
			// 获取首节点
			E first = q.peek();
			if (first == null)
				// 等待被唤醒
				available.await();
			else {
				// 获取延迟时间
				long delay = first.getDelay(NANOSECONDS);
				if (delay <= 0L)
					// 获取首节点
					return q.poll();
				// 首节点没到期不能取出
				first = null; // don't retain ref while waiting
				if (leader != null)
					// 第一个排队的线程还在，你也去无限期等待
					available.await(); // 唤醒之后，继续循环
				else {
					Thread thisThread = Thread.currentThread();
					// 当前线程为leader
					leader = thisThread;
					try {
						// leader线程进入限期等待（timedout-waiting）
						// 非公平锁，锁到期后并不一定获取到锁，可能其他线程抢先获取到锁，获取了首节点
						available.awaitNanos(delay);// 唤醒之后，继续循环
					} finally {
						if (leader == thisThread)
							// 等待到期立马释放leader
							leader = null;
					}
				}
			}
		}
	} finally {
		if (leader == null && q.peek() != null)
			// 唤醒一个线程
			available.signal();
		lock.unlock();
	}
}
```

