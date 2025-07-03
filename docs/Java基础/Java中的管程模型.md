# [Java中的管程模型](https://segmentfault.com/a/1190000021557492)


![Java中的管程模型](https://segmentfault.com/img/bVbCCe8 "Java中的管程模型")

操作系统使用信号量解决并发问题，Java选择使用管程（Monitor）解决并发问题。信号量和管程是等价的，可以使用信号量实现管程，也可以使用管程实现信号量。

管程就是指管理共享变量，以及对共享变量的相关操作。具体到 Java 语言中，管程就是管理类的成员变量和方法，让这个类是线程安全的。管程的发展史中，先后出现过三种管程模型，Hasen 模型、Hoare 模型和 **MESA 模型**，Java 使用的是 MESA 模型。

我们用管程模型主要是解决并发编程中的两个核心问题，**互斥**和**同步**。互斥是指同一时刻只允许一个线程访问共享资源，同步则是指线程之间如何通信、写作。

那么，**Java 所采用的 MESA 模型是如何解决互斥和同步问题的呢？**

## MESA 解决互斥问题

管程模型解决互斥问题的方法是：**将共享变量及对共享变量的操作统一封装起来。**

如下图所示，管程 X 将共享变量 queue，及其入队出队操作 enq() 和 dep() 封装起来。线程 A 和线程 B 想要访问共享变量 queue，就需要通过 enq() 和 deq() 来实现，而 enq() 和 deq() 保证互斥，只允许一个线程进入管程。

![管程模型的代码化语义](https://segmentfault.com/img/bVbCCe9 "管程模型的代码化语义")

## MESA 解决同步问题

MESA 模型解决同步问题可以类比去医院就医。患者首先需要排队等待医生叫好，医生诊断被叫到号的患者。期间，患者如果需要进行其他辅助的检查，比如说排个 X 光，就需要去等待拍 X 光的医生叫好。患者拍完 X 光之后，再次回到上一个医生那里，等待医生再次诊断。

![医院排队](https://segmentfault.com/img/bVbCCfc "医院排队")

管程模型与看医生的流程类似，管程入口处有一个等待队列。当多个线程试图进入管程内部的时候，只允许一个线程进入，其他线程在等待队列中等待。就和看医生的时候排队一样。

管程中还有一个条件变量的概念，每个条件变量对应一个条件变量等待队列。比如说有一个条件变量 A，当执行线程 T1 时发现不满足条件变量 A，T1 就会进入条件变量 A 的等待队列中。就像去看医生，医生让你先去排个 X 光，就要去拍 X 光的地方排队。

当执行线程 T2 时发现满足条件变量 A，就会唤醒条件变量 A 等待中的线程 T1，线程 T1 就会再次进入到入口等待队列。就像拍完 X 光的人，再去看医生。

![MESA 管程模型](https://segmentfault.com/img/bVbCCfd "MESA 管程模型")
```java
public class BlockedQueue<T>{
  final Lock lock =
    new ReentrantLock();
  // 条件变量：队列不满  
  final Condition notFull =
    lock.newCondition();
  // 条件变量：队列不空  
  final Condition notEmpty =
    lock.newCondition();

  // 入队
  void enq(T x) {
    lock.lock();
    try {
      while (队列已满){
        // 等待队列不满 
        notFull.await();
      }  
      // 省略入队操作...
      //入队后,通知可出队
      notEmpty.signal();
    }finally {
      lock.unlock();
    }
  }
  // 出队
  void deq(){
    lock.lock();
    try {
      while (队列已空){
        // 等待队列不空
        notEmpty.await();
      }
      // 省略出队操作...
      //出队后，通知可入队
      notFull.signal();
    }finally {
 lock.unlock();
    }  
  }
}
```


## Monitor（管程/监视器）详解

说明

　　Monitor，直译为“监视器”，而操作系统领域一般翻译为“管程”。管程是指管理共享变量以及对共享变量操作的过程，让它们支持并发。在Java 1.5之前，Java语言提供的唯一并发语言就是管程，Java 1.5之后提供的SDK并发包也是以管程为基础的。除了Java之外，C/C++、C#等高级语言也都是支持管程的。synchronized关键字和wait()、notify()、notifyAll()这三个方法是Java中实现管程技术的组成部分。

MESA模型分析

　　在管程的发展史上，先后出现过三种不同的管程模型，分别是Hasen模型、Hoare模型和 MESA模型。现在正在广泛使用的是MESA模型。下面我们便介绍MESA模型：

![](https://ask.qcloudimg.com/http-save/yehe-1346526/9068f714cf16a36fe8500498eb3a8d7f.png)

　　管程中引入了条件变量的概念，而且每个条件变量都对应有一个等待队列。条件变量和等待 队列的作用是解决线程之间的同步问题。

　　分析作用：

　　　　　入口等待队列：试图要获取锁的线程都必须要进入到这个队列，只有在这个队列里面才能获取锁，而且每次都是获取到锁才会出队。

　　　　　条件变量等待队列：这个是为已获得锁的成员进入等待阻塞准备的，当需要等待条件满足时，为了更好的利用CPU，让线程进入等待阻塞，而什么时候再次获得锁，也就是当等待的条件满足了，就会从这个队列中出去，进入到入口等待队列中，再次获取锁。

wait()的正确使用姿势

　　对于MESA管程来说，有一个编程范式：

```javascript
while(条件不满足) {
 wait();
}
```

复制

　　唤醒的时间和获取到锁继续执行的时间是不一致的，被唤醒的线程再次执行时可能条件又不满足了，所以循环检验条件。MESA模型的wait()方法还有一个超时参数，为了避免线程进入等待 队列永久阻塞。

notify()和notifyAll()分别何时使用

　　满足以下三个条件时，可以使用notify()，其余情况尽量使用notifyAll()：

1. 1. 所有等待线程拥有相同的等待条件；
    2. 所有等待线程被唤醒后，执行相同的操作；
    3. 只需要唤醒一个线程。

　　要知道notify()是随机唤醒一个，而notifyAll()则是唤醒全部。如果是要唤醒特定的线程，最好用notifyAll() + while(条件不满足)来保证指定线程会被唤醒。

实际案例：Java语言的内置管程synchronized

　　　　Java 参考了 MESA 模型，语言内置的管程（synchronized）对 MESA 模型进行了精简。MESA模型中，条件变量可以有多个，Java 语言内置的管程里只有一个条件变量。模型如下图所示：

![](https://ask.qcloudimg.com/http-save/yehe-1346526/b3094e437398d8e71ca75b86f2677e48.png)

　　　　Monitor机制在Java中的实现

　　　　　　说明

　　　　　　　　java.lang.Object 类定义了 wait()，notify()，notifyAll() 方法，这些方法的具体实现，依赖于 ObjectMonitor 实现，这是 JVM 内部基于 C++ 实现的一套机制。

　　　　　　　　所谓ObjectMonitor ，是独立的对象监视器，其中的_object便是用于存储synchronized (lock)中的lock。

　　　　　　　　ObjectMonitor其主要数据结构如下（hotspot源码ObjectMonitor.hpp）：

```javascript
ObjectMonitor() {
    _header = NULL; //对象头 markOop
    _count = 0;
    _waiters = 0,
    _recursions = 0; // 锁的重入次数
    _object = NULL; //存储锁对象
    _owner = NULL; // 标识拥有该monitor的线程（当前获取锁的线程）
    _WaitSet = NULL; // 等待线程（调用wait）组成的双向循环链表，_WaitSet是第一个节点
    _WaitSetLock = 0;
    _Responsible = NULL ;
    _succ = NULL ;
    _cxq = NULL ; //多线程竞争锁会先存到这个单向链表中 （FILO栈结构）
    FreeNext = NULL ;
    _EntryList = NULL ; //存放在进入或重新进入时被阻塞(blocked)的线程 (也是存竞争锁失败的线程)
    _SpinFreq = 0;
    _SpinClock = 0;
    OwnerIsThread = 0;
    _previous_owner_tid = 0;
}
```

复制

　　　　　　图示流程：

![](https://ask.qcloudimg.com/http-save/yehe-1346526/c61c81675ea229953097b3d233acc528.png)

　　　　　　说明

在获取锁时，是将当前线程插入到cxq的头部，而释放锁时，默认策略（QMode=0）是：如果EntryList为空，则将cxq中的元素按原有顺序插入到EntryList，并唤醒第一个线程，也就是当EntryList为空时，是后来的线程先获取锁。_EntryList不为空，直接从_EntryList中唤醒线程。

　　　　　　示例演示：

　　　　　　　　1.情况1，三个线程ABC，分别去获取锁，顺序为A,B,C，如果A业务时间较长，则BC都应该进入到_cxq中（FILO栈结构）【C，B】，由于_EntryList为空，则将cxq中的元素按原有顺序插入到EntryList【B，C】,此时C先获取锁。结果为：

```javascript
A get lock
A release lock
C get lock
C release lock
B get lock
B release lock
```

复制

　　　　　　　　2.情况2，三个线程ABC，分别去获取锁，顺序为A,B,C，如果A业务时间较短，进入等待状态，进入_WaitSet中等待，则B进入时_cxq和_EntryList为空，B直接获取锁，执行业务时间较长，且C进入到_cxq中，而A也从_WaitSet中满足条件进入到了_EntryList中，当B释放锁时，应该在_EntryList中的A先获取锁，当_EntryList为空时，将_cxq中的C转入到_EntryList，等A释放后，C才能获取锁。结果为：

```javascript
A get lock
B get lock
B release lock
A release lock
C get lock
C release lock
```

复制

　　　　　　　　3.示例代码展示：

```javascript
public class SyncQModeDemo {

    public static void main(String[] args) throws InterruptedException {

        SyncQModeDemo demo = new SyncQModeDemo();

        demo.startThreadA();
        //控制线程执行时间
        Thread.sleep(100);
        demo.startThreadB();
        Thread.sleep(100);
        demo.startThreadC();
    }

    final Object lock = new Object();

    public void startThreadA() {
        new Thread(() -> {
            synchronized (lock) {
                log.debug("A get lock");
                try {
                    Thread.sleep(300);  //对应情况1，模拟业务时间
                    //lock.wait(300);  //对应情况2
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                log.debug("A release lock");
            }
        }, "thread-A").start();
    }

    public void startThreadB() {
        new Thread(() -> {
            synchronized (lock) {
                try {
                    log.debug("B get lock");
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                log.debug("B release lock");
            }
        }, "thread-B").start();
    }

    public void startThreadC() {
        new Thread(() -> {
            synchronized (lock) {
                log.debug("C get lock");
            }
        }, "thread-C").start();
    }

}
```
