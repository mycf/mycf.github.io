一些常见的参数配置：  
堆配置：  
●-Xms:初始堆大小  
●-Xms：最大堆大小  
●-XX:NewSize=n:设置年轻代大小  
●-XX:NewRatio=n:设置年轻代和年老代的比值。如：为3表示年轻代和年老代比值为1：3，年轻代占整个年轻代年老代和的1/4  
●-XX:SurvivorRatio=n:年轻代中Eden区与两个Survivor区的比值。注意Survivor区有两个。如3表示Eden：3 Survivor：2，一个Survivor区占整个年轻代的1/5  
●-XX:MaxPermSize=n:设置持久代大小  
gc设置：  
●-XX:+UseSerialGC:设置串行收集器  
●-XX:+UseParallelGC:设置并行收集器  
●-XX:+UseParalledlOldGC:设置并行年老代收集器  
●-XX:+UseConcMarkSweepGC:设置并发收集器  
● -XX:+UseG1GC  
并行收集器设置  
●-XX:ParallelGCThreads=n:设置并行收集器收集时使用的CPU数。并行收集线程数  
●-XX:MaxGCPauseMillis=n:设置并行收集最大的暂停时间（如果到这个时间了，垃圾回收器依然没有回收完，也会停止回收）  
●-XX:GCTimeRatio=n:设置垃圾回收时间占程序运行时间的百分比。公式为：1/(1+n)  
●-XX:+CMSIncrementalMode:设置为增量模式。适用于单CPU情况  
●-XX:ParallelGCThreads=n:设置并发收集器年轻代手机方式为并行收集时，使用的CPU数。并行收集线程数  
打印GC回收的过程日志信息  
●-XX:+PrintGC  
●-XX:+PrintGCDetails  
●-XX:+PrintGCTimeStamps  
●-Xloggc:filename