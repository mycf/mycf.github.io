# 构造函数
```java
public ScheduledThreadPoolExecutor(int corePoolSize) {
	super(corePoolSize, Integer.MAX_VALUE,
		  DEFAULT_KEEPALIVE_MILLIS, MILLISECONDS,
		  new DelayedWorkQueue());
}
```