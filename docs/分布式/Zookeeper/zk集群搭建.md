# 搭建zookeeper集群 https://cloud.tencent.com/developer/article/1820033

搭建Zookeeper集群至少需要三台服务器，并且服务器应该是奇数台。

假如集群只有两台服务器，那么其中任意一台服务器发生故障，集群就不可用了（集群中可用节点数量需要大于一半才可用），由于存在两个单点故障，因此两个服务器还不如单个服务器稳定。

下面将介绍如何在单台机器上搭建三个Zookeeper服务组成的集群。

###### 1.创建三个dataDir：

```javascript
mkdir /opt/zkdata1 /opt/zkdata2 /opt/zkdata3
```



###### 2.分别在三个dataDir中创建myid文件，并在myid文件中指定服务器标识：

```javascript
[root@localhost opt]# touch ./zkdata1/myid ./zkdata2/myid ./zkdata3/myid
[root@localhost opt]# echo 1 > ./zkdata1/myid
[root@localhost opt]# echo 2 > ./zkdata2/myid
[root@localhost opt]# echo 3 > ./zkdata3/myid
```



###### 3.创建三个Zookeeper配置文件，并添加集群配置：

zoo1.cfg：

```javascript
tickTime=2000
initLimit=10
syncLimit=5
# 指定数据存储位置
dataDir=/opt/zkdata1
# 指定客户端连接的端口
clientPort=2181
# 指定集群中服务器
# 端口1：用于数据同步
# 端口2：用于leader选举
server.1=localhost:2880:3881
server.2=localhost:2882:3883
server.3=localhost:2884:3885
```



zoo2.cfg：

```javascript
tickTime=2000
initLimit=10
syncLimit=5
# 指定数据存储位置
dataDir=/opt/zkdata2
# 指定客户端连接的端口
clientPort=2182
# 指定集群中服务器
# 端口1：用于数据同步
# 端口2：用于leader选举
server.1=localhost:2880:3881
server.2=localhost:2882:3883
server.3=localhost:2884:3885
```



zoo3.cfg：

```javascript
tickTime=2000
initLimit=10
syncLimit=5
# 指定数据存储位置
dataDir=/opt/zkdata3
# 指定客户端连接的端口
clientPort=2183
# 指定集群中服务器
# 端口1：用于数据同步
# 端口2：用于leader选举
server.1=localhost:2880:3881
server.2=localhost:2882:3883
server.3=localhost:2884:3885
```



###### 4.分别启动各个服务器：

依次启动服务器1、2、3。

```javascript
[root@localhost opt]# ./apache-zookeeper-3.6.3-bin/bin/zkServer.sh start ./apache-zookeeper-3.6.3-bin/conf/zoo1.cfg 
ZooKeeper JMX enabled by default
Using config: ./apache-zookeeper-3.6.3-bin/conf/zoo1.cfg
Starting zookeeper ... STARTED

[root@localhost opt]# ./apache-zookeeper-3.6.3-bin/bin/zkServer.sh start ./apache-zookeeper-3.6.3-bin/conf/zoo2.cfg 
ZooKeeper JMX enabled by default
Using config: ./apache-zookeeper-3.6.3-bin/conf/zoo2.cfg
Starting zookeeper ... STARTED

[root@localhost opt]# ./apache-zookeeper-3.6.3-bin/bin/zkServer.sh start ./apache-zookeeper-3.6.3-bin/conf/zoo3.cfg 
ZooKeeper JMX enabled by default
Using config: ./apache-zookeeper-3.6.3-bin/conf/zoo3.cfg
Starting zookeeper ... STARTED
```



###### 5.集群搭建完毕，可以使用客户端连接任意一台服务器进行操作：

连接服务器3，创建新的节点，连接服务器1，查看新创建的节点。

```javascript
[root@localhost opt]# ./apache-zookeeper-3.6.3-bin/bin/zkCli.sh -server localhost:2183

[zk: localhost:2183(CONNECTED) 1] ls /
[zookeeper]
[zk: localhost:2183(CONNECTED) 2] create /mynode1 mydata1
Created /mynode1

[root@localhost opt]# ./apache-zookeeper-3.6.3-bin/bin/zkCli.sh -server localhost:2181

[zk: localhost:2181(CONNECTED) 1] ls /
[mynode1, zookeeper]
```



##### 选举机制

集群中节点状态分为以下几种：

1.  **LOOKING**：表示当前集群中没有leader节点，需要进行选举。 
2.  **LEADING**：表示当前节点为leader。 
3.  **FOLLOWING**：表示leader已经被选出，当前节点为follower。 
4.  **OBSERVER**：表示当前节点为observer。 

查看集群中各个服务器角色信息：

```javascript
[root@localhost opt]# ./apache-zookeeper-3.6.3-bin/bin/zkServer.sh status ./apache-zookeeper-3.6.3-bin/conf/zoo1.cfg 
ZooKeeper JMX enabled by default
Using config: ./apache-zookeeper-3.6.3-bin/conf/zoo1.cfg
Client port found: 2181. Client address: localhost. Client SSL: false.
Mode: follower

[root@localhost opt]# ./apache-zookeeper-3.6.3-bin/bin/zkServer.sh status ./apache-zookeeper-3.6.3-bin/conf/zoo2.cfg 
ZooKeeper JMX enabled by default
Using config: ./apache-zookeeper-3.6.3-bin/conf/zoo2.cfg
Client port found: 2182. Client address: localhost. Client SSL: false.
Mode: leader

[root@localhost opt]# ./apache-zookeeper-3.6.3-bin/bin/zkServer.sh status ./apache-zookeeper-3.6.3-bin/conf/zoo3.cfg 
ZooKeeper JMX enabled by default
Using config: ./apache-zookeeper-3.6.3-bin/conf/zoo3.cfg
Client port found: 2183. Client address: localhost. Client SSL: false.
Mode: follower
```

可以看出服务器2被选举为leader，服务器1和服务器3为follower。
