# ConcurrentHashMap 为何不能插入 null？HashMap 为何可以？
简单说为了解决二义性的问题,ConcurrentHashMap主要用于多线程下使用，目前没有原子方法判断get(null)返回null，是key不存在还是value是null。
而HashMap是在单线程下使用，不用关心这点

(资料一)[https://heapdump.cn/article/6524248]
