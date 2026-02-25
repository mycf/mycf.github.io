# 线程

## 线程状态

| 线程状态      | 解释                                                         |
| ------------- | ------------------------------------------------------------ |
| NEW           | 尚未启动的线程状态，即线程创建，**还未调用start方法**        |
| RUNNABLE      | **就绪状态**（调用start，等待调度）+**正在运行**             |
| BLOCKED       | **等待监视器锁**时，陷入阻塞状态                             |
| WAITING       | 等待状态的线程正在**等待**另一线程执行特定的操作（如notify） |
| TIMED_WAITING | 具有**指定等待时间**的等待状态                               |
| TERMINATED    | 线程完成执行，**终止状态**                                   |

![[Thread 2024-01-03 19.38.36.excalidraw|100%]]

```java
        Object lock = new Object();
        Thread thread = new Thread(() -> {
            synchronized (lock) {
                try {
                    System.out.println(Thread.currentThread().getName() + "开始运行了");
                    TimeUnit.SECONDS.sleep(10);
                } catch (InterruptedException e) {
                    System.out.println(Thread.currentThread().getName() + " 发生线程中断异常");
                    System.out.println(Thread.currentThread().getName() + " " + Thread.currentThread().isInterrupted());
                    try {
                        TimeUnit.SECONDS.sleep(3);
                    } catch (InterruptedException ex) {
                        System.out.println(Thread.currentThread().getName() + " 发生线程中断");
                    }
                    Thread.currentThread().interrupt();
                    System.out.println(Thread.currentThread().getName() + " 主动发起中断");
                    System.out.println(Thread.currentThread().getName() + " " + Thread.currentThread().isInterrupted());
                    System.out.println(Thread.currentThread().getName() + " 调用interrupted 返回：" + Thread.interrupted());
                    System.out.println(Thread.currentThread().getName() + " " + Thread.currentThread().isInterrupted());
                }
            }
        }, "状态线程");
        synchronized (lock) {
            System.out.println(Thread.currentThread().getName() + " " + thread.getState());
            thread.start();
            System.out.println(Thread.currentThread().getName() + " " + thread.getState());
            TimeUnit.SECONDS.sleep(1);
            System.out.println(Thread.currentThread().getName() + " " + thread.getState());
            System.out.println(Thread.currentThread().getName() + " " + thread.isInterrupted());
            thread.interrupt();
            System.out.println(Thread.currentThread().getName() + " 对" + thread.getName() + "发起中断");
            System.out.println(Thread.currentThread().getName() + " " + thread.isInterrupted());
        }

```

运行结果如下：
```sh
main NEW
main RUNNABLE
main BLOCKED
main false
main 对状态线程发起中断
main true
状态线程开始运行了
状态线程 发生线程中断异常
状态线程 false
状态线程 主动发起中断
状态线程 true
状态线程 调用interrupted 返回：true
状态线程 开始清除标志位
状态线程 false
```
# interrupt

> [!NOTE] 状态线程收到中断异常后为什么中断状态是`false`?
> 中断线程时，如果线程被下面方法阻塞，中断状态会被清除并且收到`InterruptedException`.
> 实例方法：`wait()`, `wait(long)`, or `wait(long, int)` 
> 类方法：`join()`, `join(long)`, `join(long, int)`, `sleep(long)`, or `sleep(long, int)`
> 见`java.lang.Thread#interrupt`源码注释

所以如果想要查看中断状态为true
- 当前线程中断`Thread.currentThread().interrupt();`
- 使用不会抛出`InterruptedException`的阻塞方法，例如`LockSupport.park();`

# onSpinWait
这是一种非常弱化的让步形式：它告诉你的 CPU，你正处于一个循环中，可能会消耗许多 CPU 周期的来等待某些事情发生（忙等待）。

这样，CPU 可以将更多资源分配给其他线程，而无需实际加载操作系统调度程序并使准备运行的线程出列（这可能会很昂贵）。

一个常见的用途是自旋锁，当您知道共享内存上的争用非常罕见或很快完成时，自旋锁可能比普通锁表现更好。
