4、`ps aux| grep java` 查看到当前java进程使用cpu、内存、磁盘的情况，获取使用量异常的进程
5、`top -Hp 进程pid` 检查当前使用异常线程的pid
6、把线程tid变为16进制如 31695 - 》 7bcf 然后得到0x7bcf `printf "%x\n" ti
7、`jstack 进程的pid|grep -A20 0x7bcf` 得到相关进程的代码

### **一.简介**

最近一段时间 某台[服务器](https://cloud.tencent.com/act/pro/promotion-cvm?from_column=20065&from=20065)上的一个应用总是隔一段时间就自己挂掉 用top看了看 从重新部署应用开始没有多长时间CPU占用上升得很快

排查步骤

1.使用top 定位到占用CPU高的进程PID `top`

2.通过ps aux | grep PID命令 获取线程信息，并找到占用CPU高的线程 `ps -mp pid -o THREAD,tid,time | sort -rn`

3.将需要的线程ID转换为16进制格式 `printf "%x\n" tid`

4.打印线程的堆栈信息 到了这一步具体看堆栈的日志来定位问题了 `jstack pid |grep tid -A 30`

### **二.例子**

1.`top` 可以看出PID 733进程 的占用CPU 172%

![](https://ask.qcloudimg.com/http-save/7250484/ig1picpkrr.png)

2.查找进程733下的线程 可以看到TID 线程775占用了96%且持有了很长时间 其实到这一步基本上能猜测到应该是 肯定是那段代码发生了死循环 `ps -mp 733 -o THREAD,tid,time | sort -rn`

![](https://ask.qcloudimg.com/http-save/7250484/xbuz4f26ci.png)

3.线程ID转换为16进制格式 `printf "%x\n" 775`

![](https://ask.qcloudimg.com/http-save/7250484/nfd7nz6hdf.png)

4.查看java的堆栈信息，打印30行 `jstack -l pid号 |grep 0x线程号 -A 30`

![](https://ask.qcloudimg.com/http-save/7250484/oss56r63pw.png)

![](https://ask.qcloudimg.com/http-save/7250484/5w4kjcy5qp.png)

# 哪些场景会导致cpu过高
 在 Java 应用中，以下几种常见的情况可能导致 CPU 飙高：

1. 无限循环：如果代码中存在无限循环而没有合适的退出条件，CPU 可能会一直执行循环，导致高CPU占用。这通常是由于逻辑错误或编程错误引起的。

2. 大量的计算任务：如果应用程序执行大量的计算任务或复杂的计算操作，可能会导致CPU飙高。这可能是因为算法复杂度较高、数据量过大或计算逻辑不够优化等原因导致的。

3. 死锁：如果在多线程环境中存在死锁情况，即多个线程相互等待对方释放资源，导致所有线程无法继续执行，CPU 可能会被持续占用。

4. 长时间的IO操作：如果应用程序中存在长时间的IO操作，例如网络请求、数据库查询等，当IO操作阻塞时，CPU 可能会被空闲，但一旦IO操作完成，CPU 可能会突然飙高，因为需要处理大量的数据。

5. 大量线程活动：如果应用程序创建了大量的线程，并且这些线程都在活跃状态，CPU 可能会因为线程切换和调度的开销而飙高。

6. 高频率的定时任务：如果应用程序中存在高频率的定时任务，这些任务会在短时间内不断触发，导致CPU负载增加。

在面对高CPU占用的情况时，可以通过以下方法来定位和解决问题：

- 使用性能分析工具，如 Java VisualVM、JProfiler等，来检测和分析CPU占用高的原因。
- 检查代码逻辑和算法，确保没有死循环、长时间阻塞的IO操作等问题。
- 使用合适的并发控制机制，如使用锁的时候确保正确地释放锁，避免死锁情况。
- 合理设置线程池大小，避免创建过多的线程。
- 进行性能优化，如改进算法、减少不必要的计算、使用缓存等，以降低CPU负载。

需要根据具体情况来分析和解决高CPU占用问题，往往需要结合实际代码和应用场景进行调查和优化。
