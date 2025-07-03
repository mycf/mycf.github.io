ZooKeeper 是 Apache 软件基金会的一个软件项目，它为大型分布式计算提供开源的分布式配置服务、同步服务和命名注册。

ZooKeeper 的架构通过冗余服务实现高可用性。

Zookeeper 的设计目标是将那些复杂且容易出错的分布式一致性服务封装起来，构成一个高效可靠的原语集，并以一系列简单易用的接口提供给用户使用。

一个典型的分布式数据一致性的解决方案，分布式应用程序可以基于它实现诸如数据发布/订阅、负载均衡、命名服务、分布式协调/通知、集群管理、Master 选举、分布式锁和分布式队列等功能。

## Zookeeper 数据同步流程

在 Zookeeper 中，主要依赖 ZAB 协议来实现分布式数据一致性。

ZAB 协议分为两部分：

- 消息广播
- 崩溃恢复

### 消息广播

Zookeeper 使用单一的主进程 Leader 来接收和处理客户端所有事务请求，并采用 ZAB 协议的原子广播协议，将事务请求以 Proposal 提议广播到所有 Follower 节点，当集群中有过半的Follower 服务器进行正确的 ACK 反馈，那么Leader就会再次向所有的 Follower 服务器发送commit 消息，将此次提案进行提交。这个过程可以简称为 2pc 事务提交，整个流程可以参考下图，注意 Observer 节点只负责同步 Leader 数据，不参与 2PC 数据同步过程。
![[zookeeper 2023-12-29 11.50.52.excalidraw]]

![img](https://www.runoob.com/wp-content/uploads/2020/09/zk-data-stream-async.png)

### 崩溃恢复

在正常情况消息广播情况下能运行良好，但是一旦 Leader 服务器出现崩溃，或者由于网络原理导致 Leader 服务器失去了与过半 Follower 的通信，那么就会进入崩溃恢复模式，需要选举出一个新的 Leader 服务器。在这个过程中可能会出现两种数据不一致性的隐患，需要 ZAB 协议的特性进行避免。

- 1、Leader 服务器将消息 commit 发出后，立即崩溃
- 2、Leader 服务器刚提出 proposal 后，立即崩溃

ZAB 协议的恢复模式使用了以下策略：

- 1、选举 zxid 最大的节点作为新的 leader
- 2、新 leader 将事务日志中尚未提交的消息进行处理

##  Leader 选举原理

zookeeper 的 leader 选举存在两个阶段，一个是服务器启动时 leader 选举，另一个是运行过程中 leader 服务器宕机。在分析选举原理前，先介绍几个重要的参数。

- 服务器 ID(myid)：编号越大在选举算法中权重越大
- 事务 ID(zxid)：值越大说明数据越新，权重越大
- 逻辑时钟(epoch-logicalclock)：同一轮投票过程中的逻辑时钟值是相同的，每投完一次值会增加

**选举状态：**

- **LOOKING**: 竞选状态
- **FOLLOWING**: 随从状态，同步 leader 状态，参与投票
- **OBSERVING**: 观察状态，同步 leader 状态，不参与投票
- **LEADING**: 领导者状态

### 1、服务器启动时的 leader 选举

每个节点启动的时候都 LOOKING 观望状态，接下来就开始进行选举主流程。这里选取三台机器组成的集群为例。第一台服务器 server1启动时，无法进行 leader 选举，当第二台服务器 server2 启动时，两台机器可以相互通信，进入 leader 选举过程。

- （1）每台 server 发出一个投票，由于是初始情况，server1 和 server2 都将自己作为 leader 服务器进行投票，每次投票包含所推举的服务器myid、zxid、epoch，使用（myid，zxid）表示，此时 server1 投票为（1,0），server2 投票为（2,0），然后将各自投票发送给集群中其他机器。
- （2）接收来自各个服务器的投票。集群中的每个服务器收到投票后，首先判断该投票的有效性，如检查是否是本轮投票（epoch）、是否来自 LOOKING 状态的服务器。
- （3）分别处理投票。针对每一次投票，服务器都需要将其他服务器的投票和自己的投票进行对比，对比规则如下：
  - a. 优先比较 epoch
  - b. 检查 zxid，zxid 比较大的服务器优先作为 leader
  - c. 如果 zxid 相同，那么就比较 myid，myid 较大的服务器作为 leader 服务器
- （4）统计投票。每次投票后，服务器统计投票信息，判断是都有过半机器接收到相同的投票信息。server1、server2 都统计出集群中有两台机器接受了（2,0）的投票信息，此时已经选出了 server2 为 leader 节点。
- （5）改变服务器状态。一旦确定了 leader，每个服务器响应更新自己的状态，如果是 follower，那么就变更为 FOLLOWING，如果是 Leader，变更为 LEADING。此时 server3继续启动，直接加入变更自己为 FOLLOWING。

![img](https://www.runoob.com/wp-content/uploads/2020/09/vote-01.png)

### 2、运行过程中的 leader 选举

当集群中 leader 服务器出现宕机或者不可用情况时，整个集群无法对外提供服务，进入新一轮的 leader 选举。

- （1）变更状态。leader 挂后，其他非 Oberver服务器将自身服务器状态变更为 LOOKING。
- （2）每个 server 发出一个投票。在运行期间，每个服务器上 zxid 可能不同。
- （3）处理投票。规则同启动过程。
- （4）统计投票。与启动过程相同。
- （5）改变服务器状态。与启动过程相同。
# 监听
## 永久监听

## ZK监听缺陷

早期版本的zk监听是使用的-w指令，但是这个指令是一次性的。也就是说该指令只能监听一次事件，后续如果要继续监听事件的话就需要再次使用该指令增加监听事务。两次监听之间必然会有时差，这就会导致会有某些事件未被捕捉到。

为了解决上述的问题，ZK在3.6.0版本以后添加了永久监听指令：addWatch，它能保证被触发之后仍然还有监听效果，可以继续监听Znode上的变更。

> addWatch使用方式
> 指令格式：addWatch [-m model] path
> model有两种模式：

- PERSISTENT：持久化订阅，针对当前节点的修改和删除事件，以及当前节点子节点的删除和新增事件；
- PERSISTENT_RECURSIVE：持久化递归订阅，在PERSISTENT的基础上，增加了子节点修改事件的触发，以及子节点的子节点的数据变化都会触发相关事件（满足递归订阅特性）

# ZooKeeper的顺序一致性
众所周知，ZooKeeper 专门设计了 Zab（Zookeeper Atomic Broadcast）协议作为其数据一致性协议。利用 Zab 协议的数据写入由 Leader 结点协调，使用两阶段提交的方式，达到数据的最终一致性。为什么是最终一致性呢？我们先了解下两阶段的过程，如图一所示：
![img](https://static001.geekbang.org/resource/image/21/7e/21acd912633271fbca4d795194747e7e.jpg?wh=822*298)
数据写入过程如下：
- 第一阶段：每次的数据写入事件作为提案广播给所有 Follower 结点；可以写入的结点返回确认信息 ACK；
- 第二阶段：Leader 收到一半以上的 ACK 信息后确认写入可以生效，向所有结点广播 COMMIT 将提案生效。
根据写入过程的两阶段的描述，可以知道 ZooKeeper 保证的是最终一致性，即 Leader 向客户端返回写入成功后，可能有部分 Follower 还没有写入最新的数据，所以是最终一致性。
ZooKeeper 保证的最终一致性也叫顺序一致性，即每个结点的数据都是严格按事务的发起顺序生效的。
ZooKeeper 是如何保证事务顺序的呢？
这里需要了解下它的事务 ID，即 ZXID。ZooKeeper 通过比较各结点的 ZXID 和机器 ID 选出新的主结点。ZXID 由 Leader 节点生成，有新写入事件时，Leader 生成新 ZXID 并随提案一起广播，每个结点本地都保存了当前最近一次事务的 ZXID，ZXID 是递增的，所以谁的 ZXID 越大，就表示谁的数据是最新的。
ZXID 的生成规则如下图所示：
![img](https://static001.geekbang.org/resource/image/9e/1b/9e883155dfa23d3fca28051acfe1c71b.jpg?wh=821*190)
ZXID 由两部分组成：
- 任期：完成本次选举后，直到下次选举前，由同一 Leader 负责协调写入；
- 事务计数器：单调递增，每生效一次写入，计数器加一。
ZXID 的低 32 位是计数器，所以同一任期内，ZXID 是连续的，每个结点又都保存着自身最新生效的 ZXID，通过对比新提案的 ZXID 与自身最新 ZXID 是否相差“1”，来保证事务严格按照顺序生效的。
ZooKeeper 集群的写入是由 Leader 结点协调的，真实场景下写入会有一定的并发量，那 Zab 协议的两阶段提交是如何保证事务严格按顺序生效的呢？Leader 在收到半数以上 ACK 后会将提案生效并广播给所有 Follower 结点，Leader 为了保证提案按 ZXID 顺序生效，使用了一个 ConcurrentHashMap，记录所有未提交的提案，命名为 outstandingProposals，key 为 ZXID，Value 为提案的信息。对 outstandingProposals 的访问逻辑如下：
- 每发起一个提案，会将提案的 ZXID 和内容放到 outstandingProposals 中，作为待提交的提案；-
- 收到 Follower 的 ACK 信息后，根据 ACK 中的 ZXID 从 outstandingProposals 中找到对应的提案，对 ACK 计数；
- 执行 tryToCommit 尝试将提案提交，判断流程是，先判断当前 ZXID 之前是否还有未提交提案，如果有，当前提案暂时不能提交；再判断提案是否收到半数以上 ACK，如果达到半数则可以提交；如果可以提交，将当前 ZXID 从 outstandingProposals 中清除并向 Followers 广播提交当前提案；
Leader 是如何判断当前 ZXID 之前是否还有未提交提案的呢？由于前提是保证顺序提交的，所以 Leader 只需判断 outstandingProposals 里，当前 ZXID 的前一个 ZXID 是否存在。代码如下：
![img](https://static001.geekbang.org/resource/image/0c/d1/0c853e6bcdebab9077aa44e3831d6ed1.jpg?wh=622*114)
所以 ZooKeeper 是通过两阶段提交保证数据的最终一致性，并且通过严格按照 ZXID 的顺序生效提案保证其顺序一致性的。

