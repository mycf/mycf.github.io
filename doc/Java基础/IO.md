| IO     | NIO                 |
| ------ | ------------------- |
| 面向流 | 面向缓冲区          |
| 阻塞IO | 非阻塞IO            |
| （无） | 选择器（Selectors） | 

# 阻塞IO

# NIO
Java NIO核心组成部分：
- Channels
- Buffers:
- Selectors:

## Channel
Channel 是一个通道，可以通过它读取和写入数据，它就像水管一样，网络数据通过Channel 读取和写入。通道与流的不同之处在于通道是双向的，流只是在一个方向上移动(一个流必须是 InputStream 或者 OutputStream 的子类)，而且通道可以用于读、写或者同时用于读写。因为 Channel 是全双工的，所以它可以比流更好地映射底层操作系统的 API。“
NIO 中通过 channel 封装了对数据源的操作，通过 channel 我们可以操作数据源，又不必关心数据源的具体物理结构。这个数据源可能是多种的。比如，可以是文件也可以是网络 socket。在大多数应用中，channel 与文件描述符或者 socket是一对应的。Channel 用于在字节缓冲区和位于通道另一侧的实体 (通常是一个文件或套接字)之间有效地传输数据。


## 2、clear() 与 compact() 方法

一旦读完 Buffer 中的数据，需要让 Buffer 准备好再次被写入。可以通过 clear() 或 compact() 方法来完成

如果调用的是 clear () 方法，position 设置为 0 ， limit 被设置成 capactiy 的值。换句话说，Buffer 被清空了。 Buffer 中的数据并未清除，只是这些标记告诉我们从哪里开始往 Buffer 中写数据。

如果 Buffer 中有些数未读的数据，调用 clear() 方法，数据将 “被遗忘”，意味着不在有任何标记会告诉你那些数据被读过，那些还没有。

如果 Buffer 中依然有未读的数据，且后续还需要这些数据，但是此时想要先写这些数据，那么使用 compact() 方法。

compact() 方法将所有未读的数据拷贝到 Buffer 起始处。然后将 position 设置到最后一个未读元素正后面。 limit 属性依然像 clear() 方法一样。设置成 capacity. 现在 Buffer 准备好写数据了，但是不会覆盖未读的数据。