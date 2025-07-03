java线程之间的通信方式总共有 8 种，分别是 `volatile、synchronized、interrupt、wait、notify、notifyAll、join、管道输入/输出`， 我们一个一个的来说明！

**1.volatile**
![[volatile]]


**2.synchronized**

![](https://ask.qcloudimg.com/http-save/4069641/5aegnci5xn.jpeg)

monitor可以理解为一个同步工具，成功则获得了对象的锁，失败，则进入同步队列进行等待

代码演示： [java 如何优雅的停止一个线程](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2Fb614a1f32853&source=article&objectId=1579294)

**3. interrupt** 代码演示： [java 如何优雅的停止一个线程](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2Fb614a1f32853&source=article&objectId=1579294)
![[Thread#interrupt]]
**4. wait、notify、notifyAll** 代码演示：

```javascript
/**
 * @author shengjk1
 * @date 2019/8/29
 */

/*
等待/通知的经典范式
 */
public class WaitNotify {
	static boolean flag = true;
	static Object lock = new Object();
	
	public static void main(String[] args) {
		
		Thread waitThread = new Thread(new Wait(), "WaitThread");
		waitThread.start();
		try {
			TimeUnit.SECONDS.sleep(1);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		Thread notifyThread = new Thread(new Notify(), "notifyThread");
		notifyThread.start();
	}
	
	static class Wait implements Runnable {
		@Override
		public void run() {
			//加锁，拥有lock的Moitor
			synchronized (lock) {
				while (flag) {
					try {
						System.out.println(Thread.currentThread() + " flag is true. waitting@" + new SimpleDateFormat("HH:mm:ss").format(new Date()));
						//执行wait之后会放弃锁并进入对象的等待队列中，进入等待状态
						// 当被唤醒后会自动重新获得锁
						//而sleep就是直接去睡觉不会释放锁
						/*
						线程状态由 RUNNING 变为 WAITING，并将当前线程放置到对象的等待队列中
						 */
						lock.wait();
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}
				System.out.println(Thread.currentThread() + " flag is false. running@" + new SimpleDateFormat("HH:mm:ss").format(new Date()));
			}
		}
	}
	
	
	static class Notify implements Runnable {
		@Override
		public void run() {
			synchronized (lock) {
				//获取lock的锁，然后进行通知，通知是不会释放lock的锁，
				//直到当前线程释放了 lock 后，WaitThread才能从 wait 方法中返回
				System.out.println(Thread.currentThread() + " hold lock. notify@" + new SimpleDateFormat("HH:mm:ss").format(new Date()));
				/*
				使用 nofity() 会更加的高效。需要注意的是，nofity() 在某些情况下却会导致死锁，所以只有在经过精细地设计后，才能使用 nofity()。
				总的来讲，一开始应该总是使用 notifyAll()，只有在发现确实它导致性能问题时，才考虑 notify()，并且对死锁问题给予足够的关注。
				唤醒并一定真得能立刻唤醒，它需要等待调用 notify()或notifyAll() 的线程释放锁之后，等待线程才有机会从 wait() 返回。
				
				notify() 方法将等待队列中的一个等待线程从等待队列中移到同步队列中，而 notifyAll() 方法则是将等待队列中所有线程全部移动到同步对象。
				被移动的线程状态由 WAITING 变为 BLOCKED
				 */
				flag = false;
				lock.notifyAll();
				try {
					TimeUnit.SECONDS.sleep(2);
				} catch (InterruptedException e) {
				}
			}
			
			synchronized (lock) {
				System.out.println(Thread.currentThread() + " hold lock. notify@" + new SimpleDateFormat("HH:mm:ss").format(new Date()));
				try {
					//而sleep就是直接去睡觉不会释放锁
					//所以 lock.wait() 想要 re-obtain ownership of the monitor and resumes execution
					// 必须等待 睡眠结束
					TimeUnit.SECONDS.sleep(1);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
		}
	}
}
```

复制

**5. join** 代码演示：

```javascript
/*
如果一个线程 A 执行了 thread.join 语句，其含义是 当前线程 A 等待 thread 线程终止后才从 thread.join 返回
这里涉及了 等待/通知 机制( 等待前驱线程结束，接受前驱线程结束通知 )
 */
public class Join {
	public static void main(String[] args) {
		Thread previout = Thread.currentThread();
		for (int i = 0; i < 10; i++) {
			Thread thread = new Thread(new Domino(previout), String.valueOf(i));
			thread.start();
			previout = thread;
		}
		try {
			TimeUnit.SECONDS.sleep(5);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		System.out.println(Thread.currentThread().getName() + " terminate");
	}
	
	static class Domino implements Runnable {
		private Thread thread;
		
		public Domino(Thread thread) {
			this.thread = thread;
		}
		
		@Override
		public void run() {
			try {
				//join线程终止后，线程的 this.notifyAll() 方法会被调用
				thread.join();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			System.out.println(Thread.currentThread().getName() + " terminate.");
		}
	}
}
```

复制

**6. 管道输入/输出** 代码演示：

```javascript
//管道输入/输出流，主要用于线程之间的数据传输，而传输的媒介是内存
public class Piped {
	public static void main(String[] args) throws IOException {
		PipedWriter out = new PipedWriter();
		PipedReader in = new PipedReader();
		//将 writer 的数据写入 reader 里面
		out.connect(in);
		
		//当没有数据过来时，相当于object.wait()
		Thread printThread = new Thread(new Print(in), "PrintThread");
		printThread.start();
		int receive = 0;
		try {
			while ((receive = System.in.read()) != -1) {
				out.write(receive);
				System.out.println("out====== " + receive);
			}
		} finally {
			out.close();
		}
	}
	
	
	static class Print implements Runnable {
		private PipedReader in;
		
		//PipedReader 传进来
		public Print(PipedReader in) {
			this.in = in;
		}
		
		@Override
		public void run() {
			int receive = 0;
			try {
				while ((receive = in.read()) != -1) {
					System.out.println("receive===== " + receive);
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}
```

