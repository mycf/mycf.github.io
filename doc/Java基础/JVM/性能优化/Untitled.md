![image.png](https://gitee.com/ycfan/images/raw/master/img/20231218101846.png)

-Xms [堆内存](https://so.csdn.net/so/search?q=%E5%A0%86%E5%86%85%E5%AD%98&spm=1001.2101.3001.7020)的初始大小，默认为物理内存的1/64

-Xmx 堆内存的最大大小，默认为物理[内存](https://so.csdn.net/so/search?q=%E5%86%85%E5%AD%98&spm=1001.2101.3001.7020)的1/4

-Xmn 堆内新生代的大小。通过这个值也可以得到老生代的大小：-Xmx减去-Xmn

-Xss 设置每个线程可使用的内存大小，即栈的大小。在相同物理内存下，减小这个值能生成更多的线程，当然操作系统对一个进程内的线程数还是有限制的，不能无限生成。线程栈的大小是个双刃剑，如果设置过小，可能会出现栈溢出，特别是在该线程内有递归、大的循环时出现溢出的可能性更大，如果该值设置过大，就有影响到创建栈的数量，如果是多线程的应用，就会出现内存溢出的错误。

JDK8 之前可以通过 -XX:PermSize 和 -XX:MaxPermSize 来设置永久代大小，JDK8 之后，使用元空间替换了永久代，改为通过 -XX:MetaspaceSize 和 -XX:MaxMetaspaceSize 来设置元空间大小。

1. 堆设置
    - -Xms:初始堆大小
    - -Xmx:最大堆大小
    - -Xmn:新生代大小
    - -XX:NewRatio:设置新生代和老年代的比值。如：为3，表示年轻代与老年代比值为1：3
    - -XX:SurvivorRatio:新生代中Eden区与两个Survivor区的比值。注意Survivor区有两个。如：为3，表示Eden：Survivor=3：2，一个Survivor区占整个新生代的1/5  
    - -XX:MaxTenuringThreshold:设置转入老年代的存活次数。如果是0，则直接跳过新生代进入老年代
    - -XX:PermSize、-XX:MaxPermSize:分别设置永久代最小大小与最大大小（Java8以前）
    - -XX:MetaspaceSize、-XX:MaxMetaspaceSize:分别设置元空间最小大小与最大大小（Java8以后）
2. 收集器设置
    - -XX:+UseSerialGC:设置串行收集器
    - -XX:+UseParallelGC:设置并行收集器
    - -XX:+UseParalledlOldGC:设置并行老年代收集器
    - -XX:+UseConcMarkSweepGC:设置并发收集器
3. 垃圾回收统计信息
    - -XX:+PrintGC
    - -XX:+PrintGCDetails
    - -XX:+PrintGCTimeStamps
    - -Xloggc:filename
4. 并行收集器设置
    - -XX:ParallelGCThreads=n:设置并行收集器收集时使用的CPU数。并行收集线程数。
    - -XX:MaxGCPauseMillis=n:设置并行收集最大暂停时间
    - -XX:GCTimeRatio=n:设置垃圾回收时间占程序运行时间的百分比。公式为1/(1+n)
5. 并发收集器设置
    - -XX:+CMSIncrementalMode:设置为增量模式。适用于单CPU情况。
    - -XX:ParallelGCThreads=n:设置并发收集器新生代收集方式为并行收集时，使用的CPU数。并行收集线程数