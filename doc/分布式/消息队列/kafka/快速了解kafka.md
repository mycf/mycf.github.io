### 什么是Kafka

Kafka基于Scala和Java语言开发，设计中大量使用了批量处理和异步的思想，最高可以每秒处理百万级别的消息，是用于构建实时数据管道和流的应用程序。

![](https://ask.qcloudimg.com/http-save/yehe-5086501/de2109zxbk.png)

### Kafka的应用场景

Kafka是一个分布式流式处理平台。流平台具有三个关键功能：

1. [消息队列](https://cloud.tencent.com/product/cmq?from_column=20065&from=20065)：发布和订阅消息流，这个功能类似于消息队列，这也是Kafka被归类为消息队列的原因。
2. 容错的持久方式存储记录消息流：Kafka会把消息持久化到磁盘，有效避免消息丢失的风险。
3. 流式处理平台：在消息发布的时候进行处理，Kafka提供了一个完整的流式处理类库。

Kafka主要有两大应用场景：

1. 消息队列：建立实时流数据管道，可靠地在系统或应用程序之间获取数据。
2. 数据处理：构建实时的流数据处理程序来转换或处理数据流。

![](https://ask.qcloudimg.com/http-save/yehe-5086501/35d878k16a.png)

> 注：Kafka在2.8预览版中，采用Raft元数据模式，取消了对Zookeeper的依赖。

#### Kafka的版本里程碑

|版本号|备注|
|---|---|
|0.8|引入了副本机制，成为了一个真正意义上完备的分布式高可靠消息队列解决方案|
|0.8.2|新版本 Producer API，即需要指定 Broker 地址的 Producer|
|0.9|增加了基础的安全认证 / 权限，Java 重写了新版本消费者 API|
|0.10|引入了 Kafka Streams|
|0.11|提供幂等性 Producer API 以及事务（Transaction） API，对 Kafka 消息格式做了重构。|
|1.0|Kafka Streams 的各种改进|
|2.0|Kafka Streams 的各种改进|

#### Kafka的优势

- 高吞吐、低延时：这是 Kafka 显著的特点，Kafka 能够达到百万级的消息吞吐量，延迟可达毫秒级。
- 持久化存储：Kafka 的消息最终持久化保存在磁盘之上，提供了顺序读写以保证性能，并且通过 Kafka 的副本机制提高了数据可靠性。
- 分布式可扩展：Kafka的数据是[分布式存储](https://cloud.tencent.com/product/cos?from_column=20065&from=20065)在不同broker节点的，以topic组织数据并且按Partition进行分布式存储，整体的扩展性都非常好。
- 高容错性：集群中任意一个 broker 节点宕机，Kafka 仍能对外提供服务。

### Kafka基本结构

Kafka具有四个核心API：

1. Producer API：发布消息到1个或多个topic（主题）中。
2. Consumer API：来订阅一个或多个topic，并处理产生的消息。
3. Streams API：充当一个流处理器，从1个或多个topic消费输入流，并生产一个输出流到1个或多个输出topic，有效地将输入流转换到输出流。
4. Connector API：可构建或运行可重用的生产者或消费者，将topic连接到现有的应用程序或数据系统。例如，连接到关系数据库的连接器可以捕获表的每个变更。

![](https://ask.qcloudimg.com/http-save/yehe-5086501/plh5vcqp8t.png)

#### Kafka的关键术语

- Producer：消息和数据的生产者，向Kafka的一个Topic发布消息的进程/代码/服务。
- Consumer：消息和数据的消费者，订阅数据（Topic）并且处理发布的消息的进程/代码/服务。
- Consumer Group：对于同一个Topic，会广播给不同的Group。在一个Group中，一条消息只能被消费组中一个的Consumer消费。

- Consumer Group中不能有比Partition数量更多的消费者，否则多出的消费者一直处于空等待，不会收到消息。

![](https://ask.qcloudimg.com/http-save/yehe-5086501/lqo6lb4dvx.png)

- Topic：每条发布到Kafka集群的消息都有一个类别，这个类别被称为Topic。作用是对数据进行区分、隔离。
- Broker：Kafka集群中的每个Kafka节点。保存Topic的一个或多个Partition。
- Partition：物理概念，Kafka下数据储存的基本单元。一个Topic数据，会被分散存储到多个Partition，每一个Partition都是一个顺序的、不可变的消息队列，并且可以持续的添加消息。

![](https://ask.qcloudimg.com/http-save/yehe-5086501/ln7jtblz0y.png)

> 注：

- 每一个Topic的信息被切分为多个Partitions。若Partition数量设置成1个，则可以保证消息消费的顺序性。
- 如果某Topic有N个Partition，集群有N个Broker，那么每个Broker存储该topic的一个Partition。
- 如果某Topic有N个Partition，集群有(N+M)个Broker，那么其中有N个Broker存储该Topic的一个Partition，剩下的M个Broker不存储该Topic的Partition数据。
- 如果某Topic有N个Partition，集群中Broker数目少于N个，那么一个Broker存储该Topic的一个或多个Partition。在实际生产环境中，尽量避免这种情况的发生，这种情况容易导致Kafka集群数据不均衡。
- 当Broker收到消息，根据分区算法选择将其存储到哪一个 Partition。其路由机制为优先按照指定Partition来路由；若未指定patition但指定key，则通过对key的value进行hash选出一个patition；如果patition和key都未指定，则轮询选出一个patition。
- Offset：偏移量，分区中的消息位置，由Kafka自身维护，Consumer消费时也要保存一份Offset以维护消费过的消息位置。
- Replication：同一个Partition可能会有多个副本，多个副本之间数据是一样的，增加容错性与可扩展性。

> 注：

- 当集群中的有Broker挂掉的情况，系统可以主动的使用Replication提供服务。
- 系统默认设置每一个Topic的Replication系数为1，可以在创建Topic时单独设置。
- Replication的基本单位是Topic的Partition。
- 所有的读和写都由Leader进，Followers只是做为数据的备份。
- Follower必须能够及时复制Leader的数据。
- Replication Leader：一个Partition的多个副本上，需要一个Leader负责该Partition上与Producer和Consumer交互。一个Partition只对应一个Replication Leader。
- Replication Follower：Follower跟随Leader，所有写请求都会广播给所有Follower，Follower与Leader保持数据同步。
- ReplicaManager：负责管理当前Broker所有分区和副本的信息，处理KafkaController发起的一些请求，副本状态的切换、添加/读取消息等。
- Rebalance。消费者组内某个消费者实例挂掉后，其他消费者实例自动重新分配订阅主题分区的过程。Rebalance是Kafka消费者端实现高可用的重要手段。

![](https://ask.qcloudimg.com/http-save/yehe-5086501/mgzzued1wz.png)

Kafka通过Zookeeper管理集群配置，选举Leader，以及在Consumer Group发生变化时进行Rebalance。

### Kafka的复制机制

#### 如何将所有Replication均匀分布到整个集群

为了更好的做[负载均衡](https://cloud.tencent.com/product/clb?from_column=20065&from=20065)，Kafka尽量将所有的Partition均匀分配到整个集群上。一个典型的部署方式是一个Topic的Partition数量大于Broker的数量。同时为了提高Kafka的容错能力，也需要将同一个Partition的Replication尽量分散到不同的机器。如果所有的Replication都在同一个Broker上，那一旦该Broker宕机，该Partition的所有Replication都无法工作，也就达不到HA的效果。同时，如果某个Broker宕机了，需要保证它上面的负载可以被均匀的分配到其它幸存的所有Broker上。

Kafka分配Replication的算法如下：

1. 将所有Broker（假设共n个Broker）和待分配的Partition排序。
2. 将第i个Partition分配到第（i % n）个Broker上。
3. 将第i个Partition的第j个Replication分配到第（(i + j) % n）个Broker上。

#### HW高水位与LEO

HW是High Watermark的缩写，俗称高水位，它标识了一个特定的消息偏移量（Offset），消费者只能拉取到这个Offset之前的消息。

![](https://ask.qcloudimg.com/http-save/yehe-5086501/sr72lkfbzr.jpeg)

如图所示，它代表一个日志文件，这个日志文件中有 9 条消息，第一条消息的Offset（LogStartOffset）为0，最后一条消息的Offset为8，Offset为9的消息用虚线框表示，代表下一条待写入的消息。日志文件的HW为6，表示消费者只能拉取到Offset在0至5之间的消息，而Offset为6的消息对消费者而言是不可见的。

LEO是Log End Offset的缩写，它标识当前日志文件中下一条待写入消息的Offset，图中Offset为9的位置即为当前日志文件的LEO，LEO的大小相当于当前日志分区中最后一条消息的Offset值加1。分区ISR集合中的每个副本都会维护自身的LEO，而ISR集合中最小的LEO即为分区的HW，对消费者而言只能消费HW之前的消息。

#### ISR副本集合

ISR全称是“In-Sync Replicas”，是分区中正在与Leader副本进行同步的Replication列表。正常情况下ISR必定包含Leader副本。

ISR列表是持久化在Zookeeper中的，任何在ISR列表中的副本都有资格参与Leader选举。

ISR列表是动态变化的，副本被包含在ISR列表中的条件是由参数`replica.lag.time.max.ms`控制的，参数含义是副本同步落后于Leader的最大时间间隔，默认10s，意思就是如果说某个Follower所在的Broker因为JVM FullGC之类的问题，卡顿相对Leader延时超过10s，就会被从 ISR 中排除。Kafka之所以这样设计，主要是为了减少消息丢失，只有与Leader副本进行实时同步的Follower副本才有资格参与Leader选举，这里指相对实时。

![](https://ask.qcloudimg.com/http-save/yehe-5086501/li1wltvlcx.png)

> 注：

1. 分区中的所有副本统称为AR（Assigned Replicas）。ISR集合是AR集合中的一个子集。
2. 与Leader副本同步滞后过多的副本（不包括Leader副本）组成OSR（Out-of-Sync Replicas）

#### 复制机制
`HW` （High Watermark）俗称高水位，它标识了一个特定的消息偏移量（offset），消费者只能拉取到这个offset之前的消息。
`LEO` （Log End Offset），标识当前日志文件中下一条待写入的消息的offset。

如图所示，假设某个分区的ISR集合中有3个副本，即一个Leader副本和2个Follower副本，此时分区的LEO和HW都为3。消息3和消息4从生产者发出之后会被先存入Leader副本。

![](https://ask.qcloudimg.com/http-save/yehe-5086501/jc7cizt1f0.jpeg)

![](https://ask.qcloudimg.com/http-save/yehe-5086501/49dwlspqwv.jpeg)

![](https://ask.qcloudimg.com/http-save/yehe-5086501/nmuwaggdct.jpeg)

![](https://ask.qcloudimg.com/http-save/yehe-5086501/73pcm2shri.jpeg)

在消息写入Leader副本之后，Follower副本会发送拉取请求来拉取消息3和消息4以进行消息同步。

在同步过程中，不同的Follower副本的同步效率也不尽相同。在某一时刻Follower1完全跟上了Leader副本而Follower2只同步了消息3，如此Leader副本的LEO为5，Follower1的LEO为5，Follower2的LEO为4，那么当前分区的HW取最小值4，此时消费者可以消费到offset为0至3之间的消息。

当所有的副本都成功写入了消息3和消息4，整个分区的HW和LEO都变为5，因此消费者可以消费到offset为4的消息了。

#### 关于读写分离

Kafka并不支持读写分区，生产消费端所有的读写请求都是由Replication Leader副本处理的，Replication Follower副本的主要工作就是从Leader副本处异步拉取消息，进行消息数据的同步，并不对外提供读写服务。

Kafka之所以这样设计，主要是为了保证读写一致性，因为副本同步是一个异步的过程，如果当Follower副本还没完全和Leader同步时，从Follower副本读取数据可能会读不到最新的消息。

### Kafka的消息发送机制

Producer采用push模式将消息发布到Broker，每条消息都被append到patition中，属于顺序写磁盘（顺序写磁盘效率比随机写内存要高，保障kafka吞吐率）。

Producer写入消息序列图如下所示：

![](https://ask.qcloudimg.com/http-save/yehe-5086501/sdqyfs57cz.png)

流程说明：

1. Producer先从Zookeeper的"/brokers/.../state"节点找到该Partition的Leader。
2. Producer将消息发送给该Leader。
3. Leader将消息写入本地log。
4. followers从Leader pull消息，写入本地log后Leader发送ACK。
5. Leader收到所有ISR中的replica的ACK后，增加HW并向Producer发送ACK。

#### Broker保存消息

每个patition物理上对应一个文件夹（该文件夹存储该patition的所有消息和索引文件）

无论消息是否被消费，Kafka都会保留所有消息。有两种策略可以删除旧数据：

1. 基于时间：log.retention.hours=168
2. 基于大小：log.retention.bytes=1073741824

#### Consumer消费消息

Kafka集群保持所有的消息，直到它们过期（无论消息是否被消费）。实际上消费者所持有的仅有的元数据就是这个offset（偏移量），也就是说offset由消费者来控制：正常情况当消费者消费消息的时候，偏移量也线性的的增加。但是实际偏移量由消费者控制，消费者可以将偏移量重置为更早的位置，重新读取消息。可以看到这种设计对消费者来说操作自如，一个消费者的操作不会影响其它消费者对此log的处理。

![](https://ask.qcloudimg.com/http-save/yehe-5086501/b7gio594yx.png)

参考：

1. 一文看懂大数据领域的六年巨变：https://www.infoq.cn/article/b8*EMm6AeiHDfI3SfT11
2. https://kafka.apache.org/documentation/
3. https://stackoverflow.com/questions/tagged/apache-kafka?sort=newest&pageSize=15
4. Kafka权威指南

