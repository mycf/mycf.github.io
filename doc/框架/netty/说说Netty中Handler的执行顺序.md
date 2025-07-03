#面试 
# 概述
我们知道，一个 Channel 包含了一个 ChannelPipeline，而 ChannelPipeline 中又维护了一个由 ChannelHandlerContext 组成的双向链表，并且每个 ChannelHandlerContext 中又关联着一个 ChannelHandler。如下图:
![[说说Netty中Handler的执行顺序 2024-03-17 14.13.01.excalidraw|100%]]
另外，ChannelHandler 又分为入站 Handler 和 出站 Handler 两种，很显然，***入站 Handler 的执行顺序都是顺序执行的***。而出站Handler 又分为两种情况:
1. **调用的是 Channel 或者 ChannelPipeline 上的 write()方法，则会从队尾向前遍历出站 Handler 依次执行;
2. **调用的是 Context 上的 write() 方法，则从当前的 Handler 处向前遍历出站 Handler 依次执行: