# 基本概念
==Kafka传统定义==: Kafka是一个==分布式==的基于<mark>发布/订阅模式</mark>的==消息队列== (MessageQueue) ，主要应用于大数据实时处理领域。
发布/订阅: 消息的发布者不会将消息直接发送给特定的订阅者，而是将==发布的消息分为不同的类别==，订阅者==只接收感兴趣的消息。==
==Kafka最新定义==:Kafka是一个开源的==分布式事件流平台 ==( Event StreamingPlatform)，被数千家公司用于==高性能数据管道、流分析、数据集成和关键任务应用。==
# 消息队列
目前企业中比较常见的消息队列产品主要有 Kafka、ActiveMO、RabbitMQ、RocketMQ 等。
在大数据场景主要采用 Kaka 作为消息队列。在 JavaEE 开发中主要采用 ActiveMQ、RabbitMQ、RocketMQ。
# 传统消息队列的应用场景
传统的消息队列的主要应用场景包括：==缓存/消峰、解耦和异步通信==。

**缓冲/消峰**:有助于控制和优化数据流经过系统的速度，解决生产消息和消费消息的==处理速度不一致==的情况。

**解耦**:允许你==独立的扩展或修改两边==的处理过程，只要确保它们遵守同样的接口约束。

**异步通信**:允许用户把一个消息放入队列，但并不立即处理它，然后在需要的时候再去处理它们

# 消费者
消费者（Consumer）负责订阅Kafka中的主题（Topic），并且从订阅的主题上拉取消息。==每个消费者都有一个对应的消费组==。当消息发布到主题后，只会被投递给订阅它的==每个消费组中的一个消费者==。

某个主题中共有4个分区（Partition）：P0、P1、P2、P3。有两个消费组A和B都订阅了这个主题，消费组A中有4个消费者（C0、C1、C2和C3），消费组B中有2个消费者（C4和C5）。按照Kafka默认的规则，最后的分配结果是消费组A中的每一个消费者分配到1个分区，消费组B中的每一个消费者分配到2个分区，==两个消费组之间互不影响。每个消费者只能消费所分配到的分区中的消息==。换言之，==每一个分区只能被一个消费组中的一个消费者所消费==。

消费者与消费组这种模型可以让整体的消费能力具备横向伸缩性，我们可以增加（或减少）消费者的个数来提高（或降低）整体的消费能力。对于分区数固定的情况，一味地增加消费者并不会让消费能力一直得到提升，如果消费者过多，出现了消费者的个数大于分区个数的情况，就会有消费者分配不到任何分区。

# 消息队列的两种模式
## 点对点模式
## 发布/订阅模式
![image.png](https://gitee.com/ycfan/images/raw/master/img/20231223200714.png)


一般有两种消息投递模式： 点对点（P2P，Point-to-Point）模式和发布/订阅（Pub/Sub）模式。
**点对点模式**是基于队列的，消息生产者发送消息到队列，消息消费者从队列中接收消息。
**发布订阅模式**定义了如何向一个内容节点发布和订阅消息，这个内容节点称为主题（Topic），主题可以认为是消息传递的中介，消息发布者将消息发布到某个主题，而消息订阅者从主题中订阅消息。主题使得消息的==订阅者和发布者互相保持独立==，不需要进行接触即可保证消息的传递，发布/订阅模式在消息的==一对多广播==时采用。

> [!NOTE] Kafka 如何支持两种消息投递模式
> - 如果所有的消费者都隶属于同一个消费组，那么所有的消息都会被均衡地投递给每一个消费者，即每条消息只会被一个消费者处理，这就相当于点对点模式的应用。
> - 如果所有的消费者都隶属于不同的消费组，那么所有的消息都会被广播给所有的消费者，即每条消息会被所有的消费者处理，这就相当于发布/订阅模式的应用。


# 基础架构
1. 为方便扩展，并提高吞吐量，一个topic分为多个partition
2. 配合分区的设计，提出消费者组的概念，组内每个消费者并行消费
3. 为提高可用性，为每个partition增加若干副本，类似NameNode HA
4. ZK中记录谁是leader，Kafka2.8.0以后也可以配置不采用ZK
![[kafka 2023-12-23 20.26.05.excalidraw|1000]]

(1) Producer：消息生产者，就jj是向 Kafka broker 发消息的客户端。
(2) Consumer：消息消费者，向 Kafka broker 取消息的客户端。
(3) Consumer Group (CG)： 消费者组，由多个 consumer组成。==消费者组内每个消费者负责消费不同分区的数据，一个分区只能由一个组内消费者消费;消费者组之间互不影响。==所有的消费者都属于某个消费者组，即==消费者组是逻辑上的一个订阅者。==
(4) Broker：一台 Kafka 服务器就是一个 broker。一个集群由多个 broker 组成。一个broker可以容纳多个 topic
(5) Topic： 可以理解为一个队列，==生产者和消费者面向的都是一个 topic。==
(6) Partition：为了实现扩展性，一个非常大的 topic 可以分布到多个 broker (即服务器) 上，==一个 topic 可以分为多个 partition==，每个 partition 是一个==有序的队列。==
(7) Replica: 副本。一个 topic 的每个分区都有若干个副本，一个 Leader 和若干个Follower
(8) Leader： 每个分区多个==副本的“主”==，生产者发送数据的对象，以及消费者消费数据的对象都是 Leader。
(9) Follower： 每个分区多个==副本中的“从”==，实时从 Leader 中同步数据，保持和Leader 数据的同步。Leader 发生故障时，某个 Follower 会成为新的 Leader。


---

### 二、Kafka 快速入门

#### 1、集群规划

![集群规划](https://img-blog.csdnimg.cn/bd375373afaa45b9968e9b61194bf900.png)

#### 2、集群部署

[下载地址](http://kafka.apache.org/downloads.html)

1 ）**解压安装包**：

```cmd
tar -zxvf kafka_2.12-3.0.0.tgz -C /opt/module/
```

2 ）**修改解压后的文件名称**:

```cmd
mv kafka_2.12-3.0.0/ kafka
```

3 ）**进入到/opt/module/kafka 目录，修改配置文件**

```cmd
cd config/
vim server.properties
```

输入以下内容：  
```properties
#broker 的全局唯一编号，不能重复，只能是数字。
broker.id=0
#处理网络请求的线程数量
num.network.threads=3
#用来处理磁盘 IO 的线程数量
num.io.threads=8
#发送套接字的缓冲区大小
socket.send.buffer.bytes=102400
#接收套接字的缓冲区大小
socket.receive.buffer.bytes=102400
#请求套接字的缓冲区大小
socket.request.max.bytes=104857600
#kafka 运行日志(数据)存放的路径，路径不需要提前创建，kafka 自动帮你创建，可以配置多个磁盘路径，路径与路径之间可以用"，"分隔
log.dirs=/opt/module/kafka/datas
#topic 在当前 broker 上的分区个数
num.partitions=1
#用来恢复和清理 data 下数据的线程数量
num.recovery.threads.per.data.dir=1
# 每个 topic 创建时的副本数，默认时 1 个副本
offsets.topic.replication.factor=1
#segment 文件保留的最长时间，超时将被删除
log.retention.hours=168
#每个 segment 文件的大小，默认最大 1G
log.segment.bytes=1073741824
# 检查过期数据的时间，默认 5 分钟检查一次是否数据过期
log.retention.check.interval.ms=300000
#配置连接 Zookeeper 集群地址（在 zk 根目录下创建/kafka，方便管理）
zookeeper.connect=hadoop102:2181,hadoop103:2181,hadoop104:2181/kafka
```

#### 3、集群 启停脚本

在/home/atguigu/bin 目录下创建文件 kf.sh 脚本文件

```cmd
vim kf.sh
```

**脚本如下**：

```shell
#! /bin/bash
case $1 in
"start"){
	for i in hadoop102 hadoop103 hadoop104
	do
		echo " --------启动 $i Kafka-------"
		ssh  $i  "/opt/module/kafka/bin/kafka-server-start.sh  -daemon /opt/module/kafka/config/server.properties"
	done
};;
"stop"){
	for i in hadoop102 hadoop103 hadoop104
	do
		echo " --------停止 $i Kafka-------"
		ssh $i "/opt/module/kafka/bin/kafka-server-stop.sh "
	done
};;
esac
```

**添加执行权限**

```sh
chmod +x kf.sh
```

**启动集群命令**

```cmd
kf.sh start
```

**停止集群命令**

```cmd
kf.sh stop
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/81c48cd2799049418ff9af762f6adc59.png)

---

#### 3、Kafka 命令行操作
##### `kafka-topics.sh`
是 Kafka 提供的一个脚本工具，用于管理 Kafka 主题。
###### 查看操作主题相关命令
```sh
./bin/kafka-topics.sh
```

| 参数                                             | 描述                                 |
| ------------------------------------------------ | ------------------------------------ |
| --bootstrap-server <String: server toconnect to> | 连接的 Kafka Broker 主机名称和端口号 |
| -topic <String: topic>                           | 操作的 topic 名称。                  |
| -create                                          | 创建主题                             |
| -delete                                          | 删除主题                             |
| -alter                                           | 修改主题                             | 
| list                                             | 查看所有主题                         |
| -describe                                        | 查看主题详细描述                     |
| -partitions <Integer: # of partitions>           | 设置分区数                           |
| -replication-factor<lnteger: replication factor> | 设置分区副本                         |
| --config <String:name value>                     | 更新系统默认的配置                   |
###### 查看当前服务器所有的topic
```sh
./bin/kafka-topics.sh --bootstrap-server node1:9092 --list
```
###### 创建first topic
```sh
bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --topic first --partitions 1  --replication-factor 3
Created topic first.
```
选项说明：
- `--bootstrap-server`：指定 Kafka 服务器的地址和端口。在这个例子中，`localhost:9092` 表示 Kafka 服务器运行在本地主机的 9092 端口上。
- `--create`：指定要创建一个新的主题。
- `--topic`：指定要创建的主题的名称。在这个例子中，主题名称为 `first`。
- `--partitions`：指定要为主题创建的分区数。在这个例子中，主题 `first` 将有 1 个分区。
- `--replication-factor`：指定主题的副本因子，即每个分区的副本数。在这个例子中，主题 `first` 的每个分区将有 3 个副本。
因此，上述命令的作用是在本地 Kafka 服务器上创建一个名为 `first` 的主题，该主题有 1 个分区和 3 个副本。成功执行后，命令会输出 `Created topic first`。
###### 查看主题详情
```sh
bin/kafka-topics.sh --bootstrap-server localhost:9092 --describe --topic first
```
![[kafka 2023-12-24 23.09.53.excalidraw|1000]]
###### 修改分区数
```sh
bin/kafka-topics.sh --bootstrap-server localhost:9092 --alter --topic first --partitions 4
```
###### 删除topic
```sh
bin/kafka-topics.sh --bootstrap-server localhost:9092 --delete --topic first
```

#### 4、生产者命令 行操作

###### 查看操作生产者命令参数
```sh
bin/kafka-console-producer.sh
```
###### 发送消息
```sh
bin/kafka-console-producer.sh --bootstrap-server localhost:9092 --topic first
```
#### 消费者命令行操作
##### 查看操作消费者命令行参数
```sh
bin/kafka-console-consumer.sh
```

|                                                 |                                      |
| ----------------------------------------------- | ------------------------------------ |
| -bootstrap-server <String: server toconnect to> | 连接的 Kafka Broker 主机名称和端口号 |
| --topic <String: topic>                         | 操作的 topic 名称                    |
| --from-beginning                                | 从头开始消费                         |
| -group <String: consumer group id>              | 指定消费组名称                       | 
##### 消费消息
###### 消费first主题中的数据
```sh
bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic first
```
##### 把主题中所有的数据都读取出来（包括历史数据）
```sh
bin/kafka-console-consumer.sh --bootstrap-server localhost:9092  --from-beginning --topic first
```

### 三、Kafka 生产者

#### 1、生产者 消息发送流程

##### ①发送原理

在消息发送的过程中，涉及到了 `两个线程` ——`main 线程`和`Sender 线程`。
	
在 main 线程中创建了 一个 `双端列队列 RecordAccumulator`。

main线程将消息发送给RecordAccumulator，Sender线程不断从 RecordAccumulator 中拉取消息发送到 Kafka Broker。
![[kafka 2023-12-23 22.57.27.excalidraw|1000]]
![在这里插入图片描述](https://img-blog.csdnimg.cn/75b56fcd25924969910b152df3e9f40a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

##### ②生产者重要参数列表
| 参数名称｜描述｜ |
| ---------------- |
|                  |
![在这里插入图片描述](https://img-blog.csdnimg.cn/7bb3fb26f5494ab28db91a57c56a417a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
![在这里插入图片描述](https://img-blog.csdnimg.cn/12d10673ff1c45ac9cbb0a6b472618c4.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

---

#### 2、异步送 发送 API

##### ①普通异步发送

需求：创建 Kafka生产者，采用异步的方式发送到 Kafka Broker

**导入依赖**

```xml
<dependencies>
	<dependency>
		<groupId>org.apache.kafka</groupId>
		<artifactId>kafka-clients</artifactId>
		<version>3.0.0</version>
	</dependency>
</dependencies>
```

**编写不带回调函数的 API代码**:

```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import java.util.Properties;

public class CustomProducer {
	public  static  void  main(String[]  args)  throws InterruptedException {
		// 1. 创建 kafka 生产者的配置对象
		Properties properties = new Properties();
		// 2. 给 kafka 配置对象添加配置信息：bootstrap.servers
		properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG,
		"hadoop102:9092");
		// key,value 序列化（必须）：key.serializer，value.serializer
		properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
		"org.apache.kafka.common.serialization.StringSerializer");
		properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
		"org.apache.kafka.common.serialization.StringSerializer");
		
		// 3. 创建 kafka 生产者对象
		KafkaProducer<String,  String>  kafkaProducer  =  new
		KafkaProducer<String, String>(properties);
		
		// 4. 调用 send 方法,发送消息
		for (int i = 0; i < 5; i++) {
		kafkaProducer.send(new
		ProducerRecord<>("first","atguigu " + i));
		}
		
		// 5. 关闭资源
		kafkaProducer.close();
	}
}
```

##### ②带回调函数的 异步发送

回调函数会在 producer 收到 ack 时调用，为异步调用，该方法有两个参数，分别是元  
数据信息（RecordMetadata）和异常信息（Exception）

如果 Exception 为 null，说明消息发送成功，如果 Exception 不为 null，说明消息发送失败。

**注意**：_消息发送失败会自动重试，不需要我们在回调函数中手动重试。_

```java
import org.apache.kafka.clients.producer.*;
import java.util.Properties;
public class CustomProducerCallback {
	public  static  void  main(String[]  args)  throws InterruptedException {
	// 1. 创建 kafka 生产者的配置对象
	Properties properties = new Properties();
	
	// 2. 给 kafka 配置对象添加配置信息
	properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG,
	"hadoop102:9092");
	// key,value 序列化（必须）：key.serializer，value.serializer
	properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
	StringSerializer.class.getName());
	properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
	StringSerializer.class.getName());
	
	// 3. 创建 kafka 生产者对象
	KafkaProducer<String,  String>  kafkaProducer  =  new KafkaProducer<String, String>(properties);
	
	// 4. 调用 send 方法,发送消息
	for (int i = 0; i < 5; i++) {
		// 添加回调
		kafkaProducer.send(new  ProducerRecord<>("first","atguigu " + i), new Callback() {
		// 该方法在 Producer 收到 ack 时调用，为异步调用
		@Override
		public void onCompletion(RecordMetadata metadata,Exception exception) {
			if (exception == null) {
				// 没有异常,输出信息到控制台
				System.out.println(" 主 题 ： "  +
				metadata.topic() + "->" + "分区：" + metadata.partition());
			} else {
				// 出现异常打印
				exception.printStackTrace();
			}
		}
	});
	// 延迟一会会看到数据发往不同分区
	Thread.sleep(2);
	}
	// 5. 关闭资源
	kafkaProducer.close();
	}
}
```

##### ③同步发送 API

只需在异步发送的基础上，再调用一下 `get()`方法即可。  
![在这里插入图片描述](https://img-blog.csdnimg.cn/171ddcecb7ae4dac95a8ba913c921cfa.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

---

### 四、生产者分区

#### 1、分区好处

1. ==便于合理使用存储资源==，每个Partition在一个Broker上存储，可以把海量的数据按照分区切割成块一块数据存储在多台Broker上。合理控制分区的任务，可以实现==负载均衡==的效果。
2. ==提高并行度==，生产者可以以==分区为单位==发送数据；消费者可以以分区为单位进行消费数据
![[kafka 2023-12-24 18.34.21.excalidraw|1000]]

#### 2、生产者发送消息的分区策略

##### ①默认的分区器 DefaultPartitioner

![在这里插入图片描述](https://img-blog.csdnimg.cn/075c6a134f554e478d300143871cf7c0.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

##### ②自定义分区器

**实现步骤**：

- （1）定义类实现 Partitioner 接口。
- （2）重写 partition()方法。

```java
import org.apache.kafka.clients.producer.Partitioner;
import org.apache.kafka.common.Cluster;
import java.util.Map;
/**
* 1. 实现接口 Partitioner
* 2. 实现 3 个方法:partition,close,configure
* 3. 编写 partition 方法,返回分区号
*/
public class MyPartitioner implements Partitioner {
	/**
	* 返回信息对应的分区
	* @param topic 主题
	* @param key 消息的 key
	* @param keyBytes 消息的 key 序列化后的字节数组
	* @param value 消息的 value
	* @param valueBytes 消息的 value 序列化后的字节数组
	* @param cluster 集群元数据可以查看分区信息
	* @return
	*/
	@Override
	public  int  partition(String  topic,  Object  key,  byte[]
	keyBytes, Object value, byte[] valueBytes, Cluster cluster) {
		// 获取消息
		String msgValue = value.toString();
		// 创建 partition
		int partition;
		// 判断消息是否包含 atguigu
		if (msgValue.contains("atguigu")){
		partition = 0;
		}else {
		partition = 1;
		}
		// 返回分区号
		return partition;
	}
	
	// 关闭资源
	@Override
	public void close() {
	}
	
	// 配置方法
	@Override
	public void configure(Map<String, ?> configs) {
	}
}
```

**使用分区器**的方法，在生产者的配置中添加分区器参数。

```java
import org.apache.kafka.clients.producer.*;
import java.util.Properties;
public class CustomProducerCallbackPartitions {
	public  static  void  main(String[]  args)  throws InterruptedException {
	Properties properties = new Properties();
	properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG,"hadoop102
	:9092");
	properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
	StringSerializer.class.getName());
	properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
	StringSerializer.class.getName());
	
	// 添加自定义分区器
	properties.put(ProducerConfig.PARTITIONER_CLASS_CONFIG,"com.atgui
	gu.kafka.producer.MyPartitioner");
	KafkaProducer<String,  String>  kafkaProducer  =  new
	KafkaProducer<>(properties);
	
	for (int i = 0; i < 5; i++) {
		kafkaProducer.send(new  ProducerRecord<>("first",
		"atguigu " + i), new Callback() {
		@Override
		public void onCompletion(RecordMetadata metadata,
		Exception e) {
		if (e == null){
		System.out.println(" 主 题 ： "  +
		metadata.topic() + "->" + "分区：" + metadata.partition()
		);
		}else {
		e.printStackTrace();
		}
		}
		});
	}
	kafkaProducer.close();
	}
}
```

---

### 五、生产者 如何提高吞吐量

![在这里插入图片描述](https://img-blog.csdnimg.cn/0ac5e1d186344778adb2ff6d14ec7482.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import java.util.Properties;
public class CustomProducerParameters {
	public  static  void  main(String[]  args)  throwsInterruptedException {
	// 1. 创建 kafka 生产者的配置对象
	Properties properties = new Properties();
	
	// 2. 给 kafka 配置对象添加配置信息：bootstrap.servers
	properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG,
	"hadoop102:9092");
	// key,value 序列化（必须）：key.serializer，value.serializer
	properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
	"org.apache.kafka.common.serialization.StringSerializer");
	properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
	"org.apache.kafka.common.serialization.StringSerializer");
	// batch.size：批次大小，默认 16K
	properties.put(ProducerConfig.BATCH_SIZE_CONFIG, 16384);
	// linger.ms：等待时间，默认 0
	properties.put(ProducerConfig.LINGER_MS_CONFIG, 1);
	// RecordAccumulator：缓冲区大小，默认 32M：buffer.memory
	properties.put(ProducerConfig.BUFFER_MEMORY_CONFIG,
	33554432);
	// compression.type：压缩，默认 none，可配置值 gzip、snappy、lz4 和 zstd
	properties.put(ProducerConfig.COMPRESSION_TYPE_CONFIG,"snappy");
	
	// 3. 创建 kafka 生产者对象
	KafkaProducer<String,  String>  kafkaProducer  =  new
	KafkaProducer<String, String>(properties);
	
	// 4. 调用 send 方法,发送消息
	for (int i = 0; i < 5; i++) {
		kafkaProducer.send(new
		ProducerRecord<>("first","atguigu " + i));
	}
	// 5. 关闭资源
	kafkaProducer.close();
	}
}
```

---

### 六、数据可靠性

**回顾发送流程**：  
![在这里插入图片描述](https://img-blog.csdnimg.cn/06a6dd353ee14d98bc5788bd8cc87898.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

**ack 应答原理**：  
![在这里插入图片描述](https://img-blog.csdnimg.cn/66e4400c842e4ae980c98e3f7cc61ea8.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
**ACK应答级别**：  
![在这里插入图片描述](https://img-blog.csdnimg.cn/68d817e0bae048c38253025628e1bef9.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

![在这里插入图片描述](https://img-blog.csdnimg.cn/149bac8ad78c4965a1426861b6a0ba33.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
在配置properties中指定使用对应的`ack级别`  
![在这里插入图片描述](https://img-blog.csdnimg.cn/5dba4390983549a0b0fef1c450a29ff9.png)

---
## 服务端参数配置

headers字段是消息的头部，Kafka 0.11.x版本才引入这个属性，它大多用来设定一些与应用相关的信息，如无需要也可以不用设置。

key是用来指定消息的键，它不仅是消息的附加信息，还可以用来计算分区号进而可以让消息发往特定的分区。前面提及消息以主题为单位进行归类，而这个key可以让消息再进行二次归类，同一个key的消息会被划分到同一个分区中
value是指消息体，一般不为空，如果为空则表示特定的消息—墓碑消息，详情参见5.4节。timestamp是指消息的时间戳，它有CreateTime和LogAppendTime两种类型，前者表示消息创建的时间，后者表示消息追加到日志文件的时间
## 使用

properties
### 生产者拦截器

生产者拦截器既可以用来在消息发送前做一些==准备工作==，比如按照某个规则==过滤==不符合要求的消息、修改消息的内容等，也可以用来在发送回调逻辑前做一些定制化的需求，比如统计类工作。

## 位移提交
对于Kafka中的分区而言，它的每条消息都有唯一的offset，用来表示消息在分区中对应的位置。对于消费者而言，它也有一个offset的概念，==消费者使用offset来表示消费到分区中某个消息所在的位置==。

在每次调用poll（）方法时，它返回的是==还没有被消费过的消息集==（当然这个前提是消息已经存储在Kafka 中了，并且暂不考虑异常情况的发生），要做到这一点，就需要==记录上一次消费时的消费位移==。并且这个消费位移必须做==持久化保存==，而不是单单保存在内存中，否则消费者重启之后就无法知晓之前的消费位移。再考虑一种情况，当有新的消费者加入时，那么必然会有再均衡的动作，对于同一分区而言，它可能在再均衡动作之后分配给新的消费者，如果不持久化保存消费位移，那么这个新的消费者也无法知晓之前的消费位移。

在旧消费者客户端中，消费位移是存储在ZooKeeper中的。而在新消费者客户端中，消费位移存储在Kafka内部的主题__consumer_offsets中。这里把将消费位移存储起来（持久化）的动作称为“提交”，消费者在消费完消息之后需要执行消费位移的提交。

### 七、数据去重

#### 1、数据传递语义

![在这里插入图片描述](https://img-blog.csdnimg.cn/371eb595a09a48f0bdccd3f54b09d0d3.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

#### 2、幂等性

##### ①幂等性原理

![在这里插入图片描述](https://img-blog.csdnimg.cn/7852dd363c534be6a288136b17e0d6c3.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

##### ②如何使用幂等性

开启参数 `enable.idempotence` 默认为 `true，false`关闭。

#### 3、生产者事务

##### ①Kafka事务原理

![在这里插入图片描述](https://img-blog.csdnimg.cn/d807aef6755d47179849a4ef0b3e2943.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

##### ②Kafka的事务一共有如下 5个 API

```java
// 1 初始化事务
void initTransactions();

// 2 开启事务
void beginTransaction() throws ProducerFencedException;

// 3 在事务内提交已经消费的偏移量（主要用于消费者）
void sendOffsetsToTransaction(Map<TopicPartition, OffsetAndMetadata> offsets, String  consumerGroupId) throws ProducerFencedException;

// 4 提交事务
void commitTransaction() throws ProducerFencedException;

// 5 放弃事务（类似于回滚事务的操作）
void abortTransaction() throws ProducerFencedException;
```

##### ③单个 Producer，使用事务保证消息的仅一次发送

```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import java.util.Properties;
public class CustomProducerTransactions {
	public  static  void  main(String[]  args)  throws InterruptedException {
	// 1. 创建 kafka 生产者的配置对象
	Properties properties = new Properties();
	
	// 2. 给 kafka 配置对象添加配置信息
	properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG,
	"hadoop102:9092");
	// key,value 序列化
	properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
	StringSerializer.class.getName());
	properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
	StringSerializer.class.getName());
	
	// 设置事务 id（必须），事务 id 任意起名
	properties.put(ProducerConfig.TRANSACTIONAL_ID_CONFIG,
	"transaction_id_0");
	
	// 3. 创建 kafka 生产者对象
	KafkaProducer<String,  String>  kafkaProducer  =  new KafkaProducer<String, String>(properties);
	
	// 初始化事务
	kafkaProducer.initTransactions();
	
	// 开启事务
	kafkaProducer.beginTransaction();
	
	try {
		// 4. 调用 send 方法,发送消息
		for (int i = 0; i < 5; i++) {
			// 发送消息
			kafkaProducer.send(new  ProducerRecord<>("first",
			"atguigu " + i));
		}
		// int i = 1 / 0;
		
		// 提交事务
		kafkaProducer.commitTransaction();
		
	} catch (Exception e) {
		// 终止事务
		kafkaProducer.abortTransaction();
	} finally {
	
		// 5. 关闭资源
		kafkaProducer.close();
		}
	}
}
```

---

### 八、数据有序

![在这里插入图片描述](https://img-blog.csdnimg.cn/ee212b7344104bfcb69fa78a5b7d0cdd.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

### 九、数据乱序

![在这里插入图片描述](https://img-blog.csdnimg.cn/d1f32c9d78294bdab8d5c49d755500be.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

---

### 十、Broker 工作流程

#### 1、Zookeeper 存储的 Kafka 信息

**启动 Zookeeper 客户端**：

```shell
bin/zkCli.sh
```

**通过 ls命令可以查看 kafka 相关信息**:

```shell
[zk: localhost:2181(CONNECTED) 2] ls /kafka
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/9ae923ff11e64cbc8a5810a3c57d6fba.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

#### 2、Kafka Broker总体工作流程

![在这里插入图片描述](https://img-blog.csdnimg.cn/3a92435a435c4ebcb1f2ee0197e991ad.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

#### 3、Broker 重要参数

![在这里插入图片描述](https://img-blog.csdnimg.cn/a4385777790e45adac074a257e6671c2.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
![在这里插入图片描述](https://img-blog.csdnimg.cn/48101765e7174f319e3d13d0fbf6091d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

---

#### 4、生产经验 —— 节点服役和退役

- **服役新节点**

修改 haodoop105中 kafka的 broker.id为 `3`。`保证唯一即可`

- **执行 负载均衡 操作**

创建一个要均衡的主题:

```shell
vim topics-to-move.json
```

```json
{
	"topics": [
		{"topic": "first"}
	],
	"version": 1
}
```

生成一个负载均衡的计划:

```shell
bin/kafka-reassign-partitions.sh --bootstrap-server  hadoop102:9092  --topics-to-move-json-file topics-to-move.json --broker-list "0,1,2,3" --generate
```

```shell
Current partition replica assignment
{"version":1,"partitions":[{"topic":"first","partition":0,"replic
as":[0,2,1],"log_dirs":["any","any","any"]},{"topic":"first","par
tition":1,"replicas":[2,1,0],"log_dirs":["any","any","any"]},{"to
pic":"first","partition":2,"replicas":[1,0,2],"log_dirs":["any","
any","any"]}]}

Proposed partition reassignment configuration
{"version":1,"partitions":[{"topic":"first","partition":0,"replic
as":[2,3,0],"log_dirs":["any","any","any"]},{"topic":"first","par
tition":1,"replicas":[3,0,1],"log_dirs":["any","any","any"]},{"to
pic":"first","partition":2,"replicas":[0,1,2],"log_dirs":["any","
any","any"]}]}
```

创建副本存储计划（所有副本存储在 broker0、broker1、broker2、broker3中）:

```json
{
"version":1,
"partitions":[
	{"topic":"first",
	"partition":0,
	"replicas":[2,3,0],
	"log_dirs":["any","any","any"]
	},
	{"topic":"first",
	"partition":1,
	"replicas":[3,0,1],
	"log_dirs":["any","any","any"]
	},
	{"topic":"first",
	"partition":2,
	"replicas":[0,1,2],
	"log_dirs":["any","any","any"]
	}]
}
```

执行副本存储计划:

```shell
bin/kafka-reassign-partitions.sh --bootstrap-server  hadoop102:9092  --reassignment-json-file increase-replication-factor.json --execute
```

验证副本存储计划

```shell
bin/kafka-reassign-partitions.sh --bootstrap-server  hadoop102:9092  --reassignment-json-file increase-replication-factor.json --verify
```

```shell
Status of partition reassignment:
Reassignment of partition first-0 is complete.
Reassignment of partition first-1 is complete.
Reassignment of partition first-2 is complete.
Clearing broker-level throttles on brokers 0,1,2,3
Clearing topic-level throttles on topic first
```

---

- **退役旧节点**

执行负载均衡操作：

先按照退役一台节点，`生成执行计划`，然后按照服役时操作流程`执行负载均衡`。

创建一个要均衡的主题:

```shell
vim topics-to-move.json
```

```json
{
	"topics": [
		{"topic": "first"}
	],
	"version": 1
}
```

创建执行计划:

```shell
bin/kafka-reassign-partitions.sh --bootstrap-server  hadoop102:9092  --topics-to-move-json-file topics-to-move.json --broker-list "0,1,2" --generate
```

```shell
Current partition replica assignment
{"version":1,"partitions":[{"topic":"first","partition":0,"replicas":[2,0,1],"log_dirs":["any","any","any"]},{"topic":"first","partition":1,"replicas":[3,1,2],"log_dirs":["any","any","any"]},{"topic":"first","partition":2,"replicas":[0,2,3],"log_dirs":["any","any","any"]}]}

Proposed partition reassignment configuration
{"version":1,"partitions":[{"topic":"first","partition":0,"replicas":[2,0,1],"log_dirs":["any","any","any"]},{"topic":"first","partition":1,"replicas":[0,1,2],"log_dirs":["any","any","any"]},{"topic":"first","partition":2,"replicas":[1,2,0],"log_dirs":["any","any","any"]}]}
```

创建副本存储计划（所有副本存储在 broker0、broker1、broker2 中）。

```shell
vim increase-replication-factor.json

{"version":1,"partitions":[{"topic":"first","partition":0,"replicas":[2,0,1],"log_dirs":["any","any","any"]},{"topic":"first","partition":1,"replicas":[0,1,2],"log_dirs":["any","any","any"]},{"topic":"first","partition":2,"replicas":[1,2,0],"log_dirs":["any","any","any"]}]}
```

执行副本存储计划:

```shell
bin/kafka-reassign-partitions.sh --bootstrap-server  hadoop102:9092  --reassignment-json-file increase-replication-factor.json --execute
```

验证副本存储计划:

```shell
bin/kafka-reassign-partitions.sh --bootstrap-server  hadoop102:9092  --reassignment-json-file increase-replication-factor.json --verify

Status of partition reassignment:
Reassignment of partition first-0 is complete.
Reassignment of partition first-1 is complete.
Reassignment of partition first-2 is complete.
Clearing broker-level throttles on brokers 0,1,2,3
Clearing topic-level throttles on topic first
```

- **执行停止命令**

```shell
bin/kafka-server-stop.sh
```

---

#### 5、Kafka副本

##### ①副本基本信息

![在这里插入图片描述](https://img-blog.csdnimg.cn/71879204fdd9443bbb6c142883700c97.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

**ISR**，和Leader通讯正常的Follower集合  
**OSR**，和Leader通讯不正常的Follower集合

---

##### ②Leader 选举流程

Kafka 集群中有一个 broker 的 Controller 会被选举为 Controller Leader，负责`管理集群 broker的上下线`，所有 [topic](https://so.csdn.net/so/search?q=topic&spm=1001.2101.3001.7020) 的`分区副本分配`和 `Leader 选举`等工作。

Controller 的信息同步工作是依赖于 Zookeeper的。

##### ③Leader 和 Follower 故障处理

![在这里插入图片描述](https://img-blog.csdnimg.cn/fded89821c0b4281a6de6d6560576681.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
![在这里插入图片描述](https://img-blog.csdnimg.cn/03b09bc0f2d2456c805c733c889942c0.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

##### ④分区副本分配

如果 kafka 服务器只有 4 个节点，那么`设置 kafka 的分区数大于服务器台数`，在 kafka  
底层`如何分配存储副本`呢？  
![在这里插入图片描述](https://img-blog.csdnimg.cn/f6dbdd1cb8ad450b9d9b1cc02ca964f3.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

##### ⑤生产经验—— 手动 调整 分区 副本 存储

![在这里插入图片描述](https://img-blog.csdnimg.cn/e10ffc34a550480d8abbffa5739ad072.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
![在这里插入图片描述](https://img-blog.csdnimg.cn/7a2403cd7b1a4084af0d7bde00880a22.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
查看分区副本存储情况。

```shell
bin/kafka-topics.sh --bootstrap-server hadoop102:9092 --describe --topic three
```

##### ⑥生产经验 ——Leader Partition 负载 平衡

==推荐关闭，或设置percentage>20%==  
![在这里插入图片描述](https://img-blog.csdnimg.cn/1d746e0123d04cceba6b6aaa7f9ee669.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

##### ⑦生产经验 —— 增加副本因子

![在这里插入图片描述](https://img-blog.csdnimg.cn/2f3186881f654de0b9fe2b66c913592e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
![在这里插入图片描述](https://img-blog.csdnimg.cn/fc30ac6ef56e46daa66049f89111c2a0.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

```shell
{"version":1,"partitions":[{"topic":"four","partition":0,"replicas":[0,1,2]},{"topic":"four","partition":1,"replicas":[0,1,2]},{"topic":"four","partition":2,"replicas":[0,1,2]}]}

[atguigu@hadoop102 kafka]$ bin/kafka-reassign-partitions.sh --bootstrap-server  hadoop102:9092  --reassignment-json-file increase-replication-factor.json --execute
```

#### 6、文件存储

##### ①文件存储机制

![在这里插入图片描述](https://img-blog.csdnimg.cn/b4511d17ba98420dbe6e42158b0d494c.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

##### ②思考：Topic 数据到底存储 在什么位置？

![在这里插入图片描述](https://img-blog.csdnimg.cn/11411e47fa57474694ad52b144767767.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
![在这里插入图片描述](https://img-blog.csdnimg.cn/d56345570d704f9d800a0f9eb3afdc39.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

##### ③index 文件和 log 文件详解

![在这里插入图片描述](https://img-blog.csdnimg.cn/8e9094f2df394c6084d816c0ca4c28c3.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
![在这里插入图片描述](https://img-blog.csdnimg.cn/2607bc24d70344788649c3f987638acd.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

#### 7、文件清理策略

![在这里插入图片描述](https://img-blog.csdnimg.cn/6b066200c7684d388eadacaa9a82534f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

![在这里插入图片描述](https://img-blog.csdnimg.cn/0a272937dc124cb686bfa9279b194eea.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

#### 8、高效读写数据

![在这里插入图片描述](https://img-blog.csdnimg.cn/80720223cbc04c5aaf37d96f68392f3f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
![在这里插入图片描述](https://img-blog.csdnimg.cn/8a460b8938eb4b68ab960724d2cd56bd.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

---

### 十一、Kafka 消费者

#### 1、Kafka 消费方式

![在这里插入图片描述](https://img-blog.csdnimg.cn/b3855538a3a144cdbf80773286aa40fd.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

#### 2、消费者工作流程

##### ①消费者总体工作流程

![在这里插入图片描述](https://img-blog.csdnimg.cn/b3d26e76be0d42bfaa8fc690b8e57443.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

##### ②消费者组原理

- **消费者组**  
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/474c152bf0414475b9c062bfbd6be365.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/023996db77d14476a387d8b99c124456.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)
- **消费者组初始化流程**  
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/1863662037eb4c24a0dea170f8edfdfd.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)
- **消费者组详细消费流程**  
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/8cae27e6367046d6ae311a58cd4d516c.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

##### ③消费者重要参数

![在这里插入图片描述](https://img-blog.csdnimg.cn/c506756f5edd4434a2cd69f3bf5cb34b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
![在这里插入图片描述](https://img-blog.csdnimg.cn/a104610608084538a53ebd1a85aec12d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

#### 3、消费者API

##### ①独立 消费者 案例 （订阅主题）

- **需求**  
    创建一个独立消费者，消费 first主题中数据。  
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/24b4ca926d7f4c7a9a83a2d9d10662ee.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
    **注意**：  
    _在消费者 API 代码中必须配置消费者组 id。命令行启动消费者不填写消费者组id 会被自动填写随机的消费者组 id。_

```java
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Properties;

public class CustomConsumer {
	public static void main(String[] args) {
		// 1.创建消费者的配置对象
		Properties properties = new Properties();
		
		// 2.给消费者配置对象添加参数
		properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,
		"hadoop102:9092");
		
		// 配置序列化 必须
		properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
		StringDeserializer.class.getName());
		properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
		StringDeserializer.class.getName());
		
		// 配置消费者组（组名任意起名） 必须
		properties.put(ConsumerConfig.GROUP_ID_CONFIG, "test");
		
		// 创建消费者对象
		KafkaConsumer<String,  String>  kafkaConsumer  =  new KafkaConsumer<String, String>(properties);
		
		// 注册要消费的主题（可以消费多个主题）
		ArrayList<String> topics = new ArrayList<>();
		topics.add("first");
		kafkaConsumer.subscribe(topics);
		// 拉取数据打印
		while (true) {
			// 设置 1s 中消费一批数据
			ConsumerRecords<String,  String>  consumerRecords  = kafkaConsumer.poll(Duration.ofSeconds(1));
			// 打印消费到的数据
			for (ConsumerRecord<String, String> consumerRecord : consumerRecords) {
				System.out.println(consumerRecord);
			}
		}
	}
}
```

##### ②独立消费者 案例 （订阅分区）

**需求**：创建一个独立消费者，消费 first主题 0 号分区的数据。  
![在这里插入图片描述](https://img-blog.csdnimg.cn/e26fda1a0d4843ed8c933d0793b7fd98.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
**实现步骤**：

```java
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.TopicPartition;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Properties;

public class CustomConsumerPartition {
	public static void main(String[] args) {
		Properties properties = new Properties();
		properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,"hadoop102:9092");
		// 配置序列化 必须
		properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
		StringDeserializer.class.getName());
		properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
		StringDeserializer.class.getName());
		
		// 配置消费者组（必须），名字可以任意起
		properties.put(ConsumerConfig.GROUP_ID_CONFIG,"test");
		KafkaConsumer<String,  String>  kafkaConsumer  =  new KafkaConsumer<>(properties);
		
		// 消费某个主题的某个分区数据
		ArrayList<TopicPartition>  topicPartitions  =  new ArrayList<>();
		topicPartitions.add(new TopicPartition("first", 0));
		kafkaConsumer.assign(topicPartitions);
		
		while (true){
			ConsumerRecords<String,  String>  consumerRecords  = kafkaConsumer.poll(Duration.ofSeconds(1));
			for (ConsumerRecord<String, String> consumerRecord : consumerRecords) {
				System.out.println(consumerRecord);
			}
		}
	}
}
```

**测试**:  
![在这里插入图片描述](https://img-blog.csdnimg.cn/5d9ff591642243149a472ea790417964.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

##### ③消费者组案例

**需求**：测试同一个主题的分区数据，只能由一个消费者组中的一个消费。  
![在这里插入图片描述](https://img-blog.csdnimg.cn/4b848acb591b4d79995a361f6738f71d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
**案例实操**：

复制一份基础消费者的代码，在 IDEA 中同时启动，即可启动同一个消费者组中的两个消费者。

```java
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Properties;

public class CustomConsumer1 {
	public static void main(String[] args) {
		// 1.创建消费者的配置对象
		Properties properties = new Properties();
		// 2.给消费者配置对象添加参数
		properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,"hadoop102:9092");
		// 配置序列化 必须
		properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
		properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
		
		// 配置消费者组 必须
		properties.put(ConsumerConfig.GROUP_ID_CONFIG, "test");
		
		// 创建消费者对象
		KafkaConsumer<String,  String>  kafkaConsumer  =  new KafkaConsumer<String, String>(properties);
		// 注册主题
		ArrayList<String> topics = new ArrayList<>();
		topics.add("first");
		kafkaConsumer.subscribe(topics);
		
		// 拉取数据打印
		while (true) {
		// 设置 1s 中消费一批数据
		ConsumerRecords<String,  String>  consumerRecords  = kafkaConsumer.poll(Duration.ofSeconds(1));
		// 打印消费到的数据
			for (ConsumerRecord<String, String> consumerRecord :
			consumerRecords) {
				System.out.println(consumerRecord);
			}
		}
	}
}
```

启动代码中的生产者发送消息，在 IDEA 控制台即可看到两个消费者在消费不同分区的数据（如果只发生到一个分区，可以在发送时增加延迟代码 Thread.sleep(2);）。  
![在这里插入图片描述](https://img-blog.csdnimg.cn/f4c9e9b1eb2f461db1cb16bf42db08b4.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
重新发送到一个全新的主题中，由于默认创建的主题分区数为 1，可以看到只能有一个消费者消费到数据。  
![在这里插入图片描述](https://img-blog.csdnimg.cn/b07110cc713d4b828b2b540b09cc94ed.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
![在这里插入图片描述](https://img-blog.csdnimg.cn/e5ef713f572d41aba32cc49c54407cbe.png)

#### 4、生产经验 —— 分区的分配
1、一个consumer group中有多个consumer组成，一个 topic有多个partition组成，现在的问题是，==到底由哪个consumer来消费哪个partition的数据。==
2、Kafka有四种主流的分区分配策略：==Range、RoundRobin、Sticky、CooperativeSticky。==
可以通过配置参数`partition.assignment.strategy`，修改分区的分配策略。默认策略是Range + CooperativeSticky。Kafka可以同时使用多个分区分配策略。


![在这里插入图片描述](https://img-blog.csdnimg.cn/87cbedbe9cac421e89a4995d33765c36.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
![在这里插入图片描述](https://img-blog.csdnimg.cn/1bf1d7b1509243b08fd51d6de454cda5.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
![在这里插入图片描述](https://img-blog.csdnimg.cn/4568114b7eed4274b65978b88dce5709.png)

##### ①Range以及再平衡

- **Range分区策略原理**  
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/88366a4e2c514ef8ab13817675866086.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)
    
- **Range 分区分配策略案例**
    
    - 修改主题 first为 7个分区。
        
        ```java
        bin/kafka-topics.sh --bootstrap-server hadoop102:9092 --alter --topic first --partitions 7
        ```
        
        注意：分区数可以增加，但是不能减少。
    - 复制 CustomConsumer 类，创建 CustomConsumer2。这样可以由三个消费者  
        CustomConsumer、CustomConsumer1、CustomConsumer2 组成消费者组，组名都为“test”，同时启动 3 个消费者。  
        ![在这里插入图片描述](https://img-blog.csdnimg.cn/3afa205037774ac38aaf5fbe8252d264.png)
    - 启动 CustomProducer生产者，发送 500条消息，随机发送到不同的分区。
    
    ```java
    import org.apache.kafka.clients.producer.KafkaProducer;
    import org.apache.kafka.clients.producer.ProducerConfig;
    import org.apache.kafka.clients.producer.ProducerRecord;
    import java.util.Properties;
    
    public class CustomProducer {
    	public  static  void  main(String[]  args)  throws InterruptedException {
    	Properties properties = new Properties();
    	properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "hadoop102:9092");
    	properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
    	properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,StringDeserializer.class.getName());
    	KafkaProducer<String,  String>  kafkaProducer  =  new
    	KafkaProducer<>(properties);
    	for (int i = 0; i < 7; i++) {
    		kafkaProducer.send(new  ProducerRecord<>("first",  i,"test", "atguigu"));
    		}
    		kafkaProducer.close();
    	}
    }
    ```
    
    说明：Kafka 默认的分区分配策略就是 Range + CooperativeSticky，所以不需要修改策略。
    
    - 观看 3个消费者分别消费哪些分区的数据。  
        ![在这里插入图片描述](https://img-blog.csdnimg.cn/6aec417c49eb4b5d95809e24632e5666.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
        ![在这里插入图片描述](https://img-blog.csdnimg.cn/29f6564651824fe69bba934f8e5e83b6.png)
- **Range 分区分配再平衡案例**  
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/d3d7868051b7423983929491cc6f12b0.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)
    

#### 5、RoundRobin 以及再平衡

##### ①RoundRobin 分区策略原理

![在这里插入图片描述](https://img-blog.csdnimg.cn/fb57a06f0dc749189019d089ce072740.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

##### ②RoundRobin分区分配策略案例

（1）依次在 CustomConsumer、CustomConsumer1、CustomConsumer2 三个消费者代码中修改分区分配策略为 RoundRobin。

```java
// 修改分区分配策略
properties.put(ConsumerConfig.PARTITION_ASSIGNMENT_STRATEGY_CONFIG, "org.apache.kafka.clients.consumer.RoundRobinAssignor");
```

（2）重启 3个消费者，重复发送消息的步骤，观看分区结果。  
![在这里插入图片描述](https://img-blog.csdnimg.cn/455f2184d7eb454d8a0849e25e80f469.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
3 ）RoundRobin 分区分配再平衡案例  
![在这里插入图片描述](https://img-blog.csdnimg.cn/1be954a0a5d34f5197dbc03a85dc67fe.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

#### 6、Sticky 以及再平衡

![在这里插入图片描述](https://img-blog.csdnimg.cn/ad749c7e025f475ba916d4af2aab2649.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
![在这里插入图片描述](https://img-blog.csdnimg.cn/b8018dd2b11340359abbe987a15ca4de.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
![在这里插入图片描述](https://img-blog.csdnimg.cn/f5fb1a8045ad4fe8bae8f812df1be901.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
![在这里插入图片描述](https://img-blog.csdnimg.cn/510eced020fd48868bcae19be2a275d4.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

---

### 十二、offset 位移

#### 1、offset 的默认维护

![在这里插入图片描述](https://img-blog.csdnimg.cn/1f7f0f99380f4c22846f3e994dd7d22f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
__consumer_offsets 主题里面采用 key 和 value 的方式存储数据。

key 是group.id+topic+分区号，value 就是当前 offset 的值。

每隔一段时间，kafka 内部会对这个 topic 进行compact，也就是每个 group.id+topic+分区号就保留最新数据。

##### ①消费 offset 案例

![在这里插入图片描述](https://img-blog.csdnimg.cn/61778712a2ed4508a0010cfa48d1d429.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

##### ②自动提交 offset

![在这里插入图片描述](https://img-blog.csdnimg.cn/9dd0c2f76c634f28a4c91433b88ae69e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

- 消费者交自动提交 offset

```java
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import java.util.Arrays;
import java.util.Properties;
public class CustomConsumerAutoOffset {
	public static void main(String[] args) {
	// 1. 创建 kafka 消费者配置类
	Properties properties = new Properties();
	// 2. 添加配置参数
	// 添加连接
	properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,"hadoop102:9092");
	// 配置序列化 必须
	properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,"org.apache.kafka.common.serialization.StringDeserializer");
	properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,"org.apache.kafka.common.serialization.StringDeserializer");
	// 配置消费者组
	properties.put(ConsumerConfig.GROUP_ID_CONFIG, "test");
	
	// 是否自动提交 offset
	properties.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG,true);
	
	// 提交 offset 的时间周期 1000ms，默认 5s
	
	properties.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG,1000);
	
	//3. 创建 kafka 消费者
	KafkaConsumer<String,  String>  consumer  =  new KafkaConsumer<>(properties);
	
	//4. 设置消费主题 形参是列表
	consumer.subscribe(Arrays.asList("first"));
	
	//5. 消费数据
	while (true){
		// 读取消息
		ConsumerRecords<String,  String>  consumerRecords  = consumer.poll(Duration.ofSeconds(1));
		// 输出消息
		for (ConsumerRecord<String, String> consumerRecord : consumerRecords) {
			System.out.println(consumerRecord.value());
			}
		}
	}
}
```

##### ③手动交 提交 offset

![在这里插入图片描述](https://img-blog.csdnimg.cn/033a5b26a74c44e1a4f20f4276754a8e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
**交同步提交 offset**：

由于同步提交 offset 有失败重试机制，故更加可靠，但是由于一直等待提交结果，提交的效率比较低。以下为同步提交 offset的示例。

```java
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import java.util.Arrays;
import java.util.Properties;

public class CustomConsumerByHandSync {
	public static void main(String[] args) {
	// 1. 创建 kafka 消费者配置类
	Properties properties = new Properties();
	// 2. 添加配置参数
	// 添加连接
	properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,"hadoop102:9092");
	// 配置序列化 必须
	properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,"org.apache.kafka.common.serialization.StringDeserializer");
	properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,"org.apache.kafka.common.serialization.StringDeserializer");
	// 配置消费者组
	properties.put(ConsumerConfig.GROUP_ID_CONFIG, "test");
	
	// 是否自动提交 offset
	properties.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG,false);
	
	//3. 创建 kafka 消费者
	KafkaConsumer<String,  String>  consumer  =  new KafkaConsumer<>(properties);
	
	//4. 设置消费主题 形参是列表
	consumer.subscribe(Arrays.asList("first"));
	
	//5. 消费数据
	while (true){
		// 读取消息
		ConsumerRecords<String,  String>  consumerRecords  = consumer.poll(Duration.ofSeconds(1));
		// 输出消息
		for (ConsumerRecord<String, String> consumerRecord :
		consumerRecords) {
			System.out.println(consumerRecord.value());
		}
		// 同步提交 offset
		consumer.commitSync();
		}
	}
}
```

**异步提交 offset**:  
虽然同步提交 offset 更可靠一些，但是由于其会阻塞当前线程，直到提交成功。

因此吞吐量会受到很大的影响。

因此更多的情况下，会选用异步提交 offset的方式。

以下为异步提交 offset 的示例：

```java
import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.common.TopicPartition;
import java.util.Arrays;
import java.util.Map;
import java.util.Properties;
public class CustomConsumerByHandAsync {
	public static void main(String[] args) {
	// 1. 创建 kafka 消费者配置类
	Properties properties = new Properties();
	// 2. 添加配置参数
	// 添加连接
	properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,
	"hadoop102:9092");
	// 配置序列化 必须
	properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
	"org.apache.kafka.common.serialization.StringDeserializer");
	properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
	"org.apache.kafka.common.serialization.StringDeserializer");
	// 配置消费者组
	properties.put(ConsumerConfig.GROUP_ID_CONFIG, "test");
	// 是否自动提交 offset
	properties.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG,
	"false");
	//3. 创建 Kafka 消费者
	KafkaConsumer<String,  String>  consumer  =  new KafkaConsumer<>(properties);
	//4. 设置消费主题 形参是列表
	consumer.subscribe(Arrays.asList("first"));
	//5. 消费数据
	while (true){
		// 读取消息
		ConsumerRecords<String,  String>  consumerRecords  = consumer.poll(Duration.ofSeconds(1));
		// 输出消息
		for (ConsumerRecord<String, String> consumerRecord : consumerRecords) {
			System.out.println(consumerRecord.value());
			}
			// 异步提交 offset
			consumer.commitAsync();
		}
	}
}
```

##### ④指定 Offset 消费

![在这里插入图片描述](https://img-blog.csdnimg.cn/27132644fb4845a483d8a743234d7c20.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
![在这里插入图片描述](https://img-blog.csdnimg.cn/3a65a87308ec407e835244a0c73ce68e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

```java
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.serialization.StringDeserializer;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Properties;
import java.util.Set;
public class CustomConsumerSeek {
	public static void main(String[] args) {
	// 0 配置信息
	Properties properties = new Properties();
	// 连接
	properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,
	"hadoop102:9092");
	// key value 反序列化
	properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
	StringDeserializer.class.getName());
	properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
	StringDeserializer.class.getName());
	properties.put(ConsumerConfig.GROUP_ID_CONFIG, "test2");
	
	// 1 创建一个消费者
	KafkaConsumer<String,  String>  kafkaConsumer  =  new
	KafkaConsumer<>(properties);
	
	// 2 订阅一个主题
	ArrayList<String> topics = new ArrayList<>();
	topics.add("first");
	kafkaConsumer.subscribe(topics);
	Set<TopicPartition> assignment= new HashSet<>();
	while (assignment.size() == 0) {
		kafkaConsumer.poll(Duration.ofSeconds(1));
		// 获取消费者分区分配信息（有了分区分配信息才能开始消费）
		assignment = kafkaConsumer.assignment();
	}
	// 遍历所有分区，并指定 offset 从 1700 的位置开始消费
	for (TopicPartition tp: assignment) {
		kafkaConsumer.seek(tp, 1700);
	}
	// 3 消费该主题数据
	while (true) {
		ConsumerRecords<String,  String>  consumerRecords  = kafkaConsumer.poll(Duration.ofSeconds(1));
		for (ConsumerRecord<String, String> consumerRecord :consumerRecords) {
			System.out.println(consumerRecord);
			}
		}
	}
}
```

**注意**：每次执行完，需要修改消费者组名；

##### ⑤指定时间消费

**需求**：

在生产环境中，会遇到最近消费的几个小时数据异常，想重新按照时间消费。

例如要求按照时间消费前一天的数据，怎么处理？

```java
import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.serialization.StringDeserializer;
import java.time.Duration;
import java.util.*;
public class CustomConsumerForTime {
	public static void main(String[] args) {
	// 0 配置信息
	Properties properties = new Properties();
	
	// 连接
	properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,
	"hadoop102:9092");
	
	// key value 反序列化
	properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
	StringDeserializer.class.getName());
	properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
	StringDeserializer.class.getName());
	properties.put(ConsumerConfig.GROUP_ID_CONFIG, "test2");
	
	// 1 创建一个消费者
	KafkaConsumer<String,  String>  kafkaConsumer  =  new KafkaConsumer<>(properties);
	
	// 2 订阅一个主题
	ArrayList<String> topics = new ArrayList<>();
	topics.add("first");
	kafkaConsumer.subscribe(topics);
	Set<TopicPartition> assignment = new HashSet<>();
	while (assignment.size() == 0) {
		kafkaConsumer.poll(Duration.ofSeconds(1));
		// 获取消费者分区分配信息（有了分区分配信息才能开始消费）
		assignment = kafkaConsumer.assignment();
	}
	HashMap<TopicPartition, Long> timestampToSearch = new HashMap<>();
	
	// 封装集合存储，每个分区对应一天前的数据
	for (TopicPartition topicPartition : assignment) {
		timestampToSearch.put(topicPartition,
		System.currentTimeMillis() - 1 * 24 * 3600 * 1000);
	}
	
	// 获取从 1 天前开始消费的每个分区的 offset
	Map<TopicPartition,  OffsetAndTimestamp>  offsets  = kafkaConsumer.offsetsForTimes(timestampToSearch);
	
	// 遍历每个分区，对每个分区设置消费时间。
	for (TopicPartition topicPartition : assignment) {
		OffsetAndTimestamp  offsetAndTimestamp  = offsets.get(topicPartition);
		// 根据时间指定开始消费的位置
		if (offsetAndTimestamp != null){
			kafkaConsumer.seek(topicPartition,
			offsetAndTimestamp.offset());
		}
	}
	// 3 消费该主题数据
	while (true) {
			ConsumerRecords<String,  String>  consumerRecords =kafkaConsumer.poll(Duration.ofSeconds(1));
			for (ConsumerRecord<String, String> consumerRecord : consumerRecords) {
				System.out.println(consumerRecord);
			}
		}
	}
}
```

##### ⑥漏消费和重复消费

**重复消费**：已经消费了数据，但是 offset没提交。

**漏消费**：先提交 offset后消费，有可能会造成数据的漏消费。  
![在这里插入图片描述](https://img-blog.csdnimg.cn/16786c63aa7847dead898fbbcfacaeb0.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

#### 2、生产经验 —— 消费者事务

![在这里插入图片描述](https://img-blog.csdnimg.cn/b786c0480e874c0e8336fbdf5bb1a18b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)
#### 生产经验-消息丢失


#### 3、生产经验 —— 数据积压 （ 消费者 如何提高吞吐量）

![在这里插入图片描述](https://img-blog.csdnimg.cn/6d81058678254fecb4999615fc19d64f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)  
![在这里插入图片描述](https://img-blog.csdnimg.cn/226f8888f41c4af4a6a7591a4438116f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Zi_5piM5Zac5qyi5ZCD6buE5qGD,size_20,color_FFFFFF,t_70,g_se,x_16)

- 增加消费者的数量
- 增加消费者一次拉取的消息条数
- 增加broker累计消息大小大小

