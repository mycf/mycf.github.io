## 回顾队列

阻塞队列可分为以下几种：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb9effa022494bf59959aa07b0c93351~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

阻塞队列(Blocking Queue)提供了可阻塞的 put 和 take 方法，它们与可定时的 offer 和 poll 是等价的。如果队列满了 put 方法会被阻塞等到有空间可用再将元素插入；如果队列是空的，那么take 方法也会阻塞，直到有元素可用。当队列永远不会被充满时，put 方法和 take 方法就永远不会阻塞。

## 理解SynchronousQueue

SynchronousQueue，**实际上它不是一个真正的队列，因为SynchronousQueue没有容量。与其他BlockingQueue（阻塞队列）不同,SynchronousQueue是一个不存储元素的BlockingQueue。只是它维护一组线程，这些线程在等待着把元素加入或移出队列。**

我们简单分为以下几种特点：

- 内部没有存储（容量为0）
    
- 阻塞队列（也是blockingqueue的一个实现）
    
- **发送或者消费线程会阻塞，只有有一对消费和发送线程匹配上，才同时退出。**
    
- **配对有公平模式和非公平模式(默认)**
    

为了演示我们上面所分析的特么 下面根据实例代码演示下：

## 代码案例

```java
SynchronousQueue<String> queue = new SynchronousQueue<>();
new Thread(()->{
	try {
		System.out.println(1 + "put");
		queue.put("1");
		System.out.println(2 + "put");
		queue.put("2");
		System.out.println(3 + "put");
		queue.put("3");
	} catch (InterruptedException e) {
		throw new RuntimeException(e);
	}
}).start();
new Thread(()->{
	try {
		System.out.println(queue.take());
		System.out.println(queue.take());
		System.out.println(queue.take());
	} catch (InterruptedException e) {
		throw new RuntimeException(e);
	}
}).start();

```

看下控制台打印
```sh
1
1put
2put
2
3
3put
```
由于两个线程，打印顺序不能代表全部

接着代码中删掉一句`System.out.println(queue.take());`，重新运行
```sh
1
1put
2put
2
```
发现线程阻塞了，直接dump一下线程看下原因，发现put方法阻塞线程了，他需要等待一个take()
```sh
"Thread-0@585" prio=5 tid=0x11 nid=NA waiting
  java.lang.Thread.State: WAITING
	  at jdk.internal.misc.Unsafe.park(Unsafe.java:-1)
	  at java.util.concurrent.locks.LockSupport.park(LockSupport.java:341)
	  at java.util.concurrent.SynchronousQueue$TransferStack$SNode.block(SynchronousQueue.java:288)
	  at java.util.concurrent.ForkJoinPool.unmanagedBlock(ForkJoinPool.java:3465)
	  at java.util.concurrent.ForkJoinPool.managedBlock(ForkJoinPool.java:3436)
	  at java.util.concurrent.SynchronousQueue$TransferStack.transfer(SynchronousQueue.java:397)
	  at java.util.concurrent.SynchronousQueue.put(SynchronousQueue.java:839)
	  at com.example.demo.Ta.lambda$main$0(Ta.java:20)
	  at com.example.demo.Ta$$Lambda$1/0x0000000133000a08.run(Unknown Source:-1)
	  at java.lang.Thread.run(Thread.java:840)
```

看到没，这个就是开头所说“配对”队列，也就是验证了入和出必须是配对的。否则阻塞。

**所以说这是一个很有意思的阻塞队列，其中每个插入操作必须等待另一个线程的移除操作，同样任何一个移除操作都等待另一个线程的插入操作。因此此队列内部其 实没有任何一个元素，因此不能调用peek操作，因为只有移除元素时才有元素。**

我们接下来看下它的应用场景

## 应用场景

我们拿newCachedThreadPool线程池来了解下

java

复制代码

`public static ExecutorService newCachedThreadPool(ThreadFactory threadFactory) {         return new ThreadPoolExecutor(0, Integer.MAX_VALUE,                                       60L, TimeUnit.SECONDS,                                       new SynchronousQueue<Runnable>(),                                       threadFactory); }`

SynchronousQueue的一个使用场景是在线程池里。Executors.newCachedThreadPool()就使用了SynchronousQueue，这个线程池根据需要（新任务到来时）创建新的线程，如果有空闲线程则会重复使用，线程空闲了60秒后会被回收。

> 由于ThreadPoolExecutor内部实现任务提交的时候调用的是工作队列（BlockingQueue接口的实现类）的非阻塞式入队列方法（offer方法），因此，在使用SynchronousQueue作为工作队列的前提下，客户端代码向线程池提交任务时，而线程池中又没有空闲的线程能够从SynchronousQueue队列实例中取一个任务，那么相应的offer方法调用就会失败（即任务没有被存入工作队列）。
> 
> 此时，ThreadPoolExecutor会新建一个新的工作者线程用于对这个入队列失败的任务进行处理（假设此时线程池的大小还未达到其最大线程池大小）。

是不是设计的贼精彩。我们可以去里面跟一下代码

## 简单看下源码

开头说过，SynchronousQueue 与其他BlockingQueue一样，SynchronousQueue同样继承AbstractQueue和实现BlockingQueue接口：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a240812d43c4c059fc7158214829874~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

SynchronousQueue提供了两个构造函数：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/638a3804380743ccb0191ad2eabeb6ad~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

java

复制代码

`public SynchronousQueue(boolean fair) {         // 通过 fair 值来决定公平性和非公平性         // 公平性使用TransferQueue，非公平性采用TransferStack         transferer = fair ? new TransferQueue<E>() : new TransferStack<E>();     }`

TransferQueue、TransferStack继承Transferer，Transferer为SynchronousQueue的内部类，它提供了一个方法transfer()，该方法定义了转移数据的规范，如下：

java

复制代码

`abstract static class Transferer<E> {         abstract E transfer(E e, boolean timed, long nanos);     }`

**transfer()方法主要用来完成转移数据的，如果e != null，相当于将一个数据交给消费者，如果e == null，则相当于从一个生产者接收一个消费者交出的数据。**

好的 今天的同步队列SynchronousQueue 就先讲到这里，我们简单做下总结

## 总结

**使用SynchronousQueue的目的就是保证“对于提交的任务，如果有空闲线程，则使用空闲线程来处理；否则新建一个线程来处理任务”。**

**SynchronousQueue也是blockingqueue的一个实现，内部采用的就是ArrayBlockingQueue的阻塞原语，所以在功能上完全可以用ArrayBlockingQueue替换之，但是SynchronousQueue 是轻量级的，SynchronousQueue 不具有任何内部容量，甚至不具有一的容量，我们可以用来在线程间安全的交换单一元素。所以功能比较单一，优势应该就在于轻量吧~**
