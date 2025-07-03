#面试 

JDK 中的空轮询 BUG 是 NI0 中 Selector 的 BUG，它会导致 Selector 空轮询，最终造成 CPU 100%。JDK 官方声称在 JDK1.6 版本的 update18 修复了该问题，但是直到 JDK1.7 版本该问题仍旧存在，只不过该 BUG 发生概率降低了一些而已，但是它并没有被根本解决，甚至 JDK1.8 的 131 版本中依然存在。
该 BUG 的问题单，可以参见如下链接
	https://bugs.java.com/bugdatabase/view_bug.do?bug_id=6403933
	https://bugs.java.com/bugdatabase/view_bug.do?bug_id=2147719
	https://bugs.java.com/bugdatabase/view_bug.do?bug_id=6670302
	https://bugs.java.com/bugdatabase/view_bug.do?bug_id=6481709
其实，这个问题的本质原因是：在部分 Linux 2.6 内核中，当出现客户端的突然中断时，epoll 会将该 socket 返回的 eventSet 事件集合置为 POLLHUP 或 POLLERR，eventSet 事件集合发生了变化，就可能导致 Selector 被唤醒。但是这个时候 Selector 的select 方法返回的 numKeys 是 0，所以接下来本该对 key 进行遍历的处理事件就根本执行不了，此时就会回到 while 循环，循环执行、不断的轮询，直到 CPU 100% 而最终导致程序崩溃。

Netty 针对这个 BUG 进行了修复，其实修复的办法也谈不上高级。简单来说就是使用一个计数器统计 Selector 空轮询的次数，当超过设定的阈值(默认是 512)时，则会重新创建一个 Selector，并将原来注册在老的 Selector 上的Channel，重新注册到新的Selector 上，同时关闭老的 Selector。

具体源码可以参考 NioEventLoop 类，摘抄关键部分如下：