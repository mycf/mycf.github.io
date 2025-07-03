# 基本概念
bigkey 是指 key 对应的value所占的内存空间比较大，例如一个字符串类型的value可以最大存到512MB，一个列表类型的value最多可以存储$2^{23}-1$个元素。
如果==按照数据结构来细分==的话，一般分为字符串类型bigkey和非字符串类型bigkey。
字符串类型: 体现在单个value值很大，一般认为超过 `10KB` 就是bigkey，但这个值和具体的QPS相关。
非字符串类型：哈希、列表、集合、有序集合,体现在元素个数过多。
bigkey无论是空间复杂度和时间复杂度都不太友好。

# bigkey的危害
- `网络阻塞`
	对BigKey执行操作的时候，少量的QPS就可能导致带宽使用率被占满，导致Redis实例，乃至物理机变慢  
- `数据倾斜`
	BigKey所在Redis实例内存使用率远超其他实例，无法使数据分片的内存资源达到均衡  
- `Redis阻塞`
	对于元素较多的hash，list，zset，set做运算使主线程被阻塞  
- `CPU压力`
	对BigKey的数据序列化和反序列化会导致CPU的使用率飙升，影响Redis实例和本机其他应用
# 发现bigkey
- `redis-cli --bigkeys`
	利用redis-cli提供的`--bigkeys`参数，可以遍历分析所有key，并返回key的整体统计星系与每个数据的TOP1的big key  
- scan扫描
	自己编程，使用`scan`扫描Redis中的所有key，利用strlen，hlen等命令判断key的长度  
- 第三方工具  
	如`redis-rdb-tools`分析rdb快照文件  
- 网络监控
	自定义工具，监控进出redis的网络数据，超出预警值时主动告警
# 如何删除BigKey  
BigKey占内存较多，即使删除也要花费很长时间，导致Redis主线程阻塞，引发一系列问题  
●redis3.0及以下版本  
○如果是集合类型，遍历元素逐个删除，最后删除集合  
●redis4.0以后  
○提供了异步删除命令：unlink