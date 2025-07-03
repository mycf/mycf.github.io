# 简介
Seata 是一款开源的分布式事务解决方案，致力于提供高性能和简单易用的分布式事务服务。Seata 将为用户提供了 AT、TCC、SAGA 和 XA 事务模式，为用户打造一站式的分布式解决方案。 
# Seata架构
#### TC (Transaction Coordinator) - 事务协调者[​](https://seata.io/zh-cn/docs/overview/terminology#tc-transaction-coordinator---%E4%BA%8B%E5%8A%A1%E5%8D%8F%E8%B0%83%E8%80%85 )

维护全局和分支事务的状态，驱动全局事务提交或回滚。

#### TM (Transaction Manager) - 事务管理器[​](https://seata.io/zh-cn/docs/overview/terminology#tm-transaction-manager---%E4%BA%8B%E5%8A%A1%E7%AE%A1%E7%90%86%E5%99%A8 )

定义全局事务的范围：开始全局事务、提交或回滚全局事务。

#### RM (Resource Manager) - 资源管理器[​](https://seata.io/zh-cn/docs/overview/terminology#rm-resource-manager---%E8%B5%84%E6%BA%90%E7%AE%A1%E7%90%86%E5%99%A8 )

管理分支事务处理的资源，与TC交谈以注册分支事务和报告分支事务的状态，并驱动分支事务提交或回滚。

![image](https://user-images.githubusercontent.com/68344696/145942191-7a2d469f-94c8-4cd2-8c7e-46ad75683636.png)
# XA模式
![image.png](https://gitee.com/ycfan/images/raw/master/img/20231211191404.png)


![image.png](https://gitee.com/ycfan/images/raw/master/img/20231211191518.png)

![image.png](https://gitee.com/ycfan/images/raw/master/img/20231211191628.png)
![image.png](https://gitee.com/ycfan/images/raw/master/img/20231211191715.png)

# AT 模式

## [前提​](https://seata.io/zh-cn/docs/overview/what-is-seata#%E5%89%8D%E6%8F%90)

- 基于支持本地 ACID 事务的**关系型数据库**。
- Java 应用，通过 JDBC 访问数据库。

AT模式同样是分阶段提交的事务模型，不过却弥补了XA模型中资源锁定周期过长的缺陷

## 整体机制[​](https://seata.io/zh-cn/docs/overview/what-is-seata#%E6%95%B4%E4%BD%93%E6%9C%BA%E5%88%B6 )

两阶段提交协议的演变：

- 一阶段：业务数据和**回滚日志记录**在同一个本地事务中提交，释放本地锁和连接资源。**(执行并提交)**
    
- 二阶段：
    - 提交异步化，非常快速地完成。
    - 回滚通过一阶段的回滚日志进行反向补偿。

阶段一RM的工作：
- 注册分支事务
- 记录undo-log（数据快照）
- 执行业务sql并提交
- 报告事务状态

阶段二提交时RM的工作：
- 删除undo-log即可
阶段二回滚时RM的工作：
- 根据undo-log回滚到更新前

![image.png](https://gitee.com/ycfan/images/raw/master/img/20231213174816.png)

![image.png](https://gitee.com/ycfan/images/raw/master/img/20231213174847.png)

## 简述AT模式与XA模式最大的区别是什么?
- XA模式一阶段不提交事务，锁定资源:AT模式一阶段直接提交，不锁定资源。
- XA模式依赖数据库机制实现回滚;AT模式利用数据快照实现数据回滚。
- XA模式强一致;AT模式最终一致
## 读写隔离问题
![image.png](https://gitee.com/ycfan/images/raw/master/img/20231213175201.png)

![image.png](https://gitee.com/ycfan/images/raw/master/img/20231213180818.png)


![image.png](https://gitee.com/ycfan/images/raw/master/img/20231213181412.png)

全局锁和XA数据库事务锁的范围不同，
全局锁大部分情况下是成功的，回滚的情况比较小
避免多个不同事务操作同一个字段

## 总结：
### AT模式的优点:
- 一阶段完成直接提交事务，释放数据库资源，性能比较好
- 利用全局锁实现读写隔离
- 没有代码侵入，框架自动完成回滚和提交
### AT模式的缺点:
- 两阶段之间属于软状态，属于最终一致框架的快照功能会影响性能，但比XA模式要好很多
## 写隔离

- 一阶段本地事务提交前，需要确保先拿到 **全局锁** 。
- 拿不到 **全局锁** ，不能提交本地事务。
- 拿 **全局锁** 的尝试被限制在一定范围内，超出范围将放弃，并回滚本地事务，释放本地锁。

以一个示例来说明：

两个全局事务 tx1 和 tx2，分别对 a 表的 m 字段进行更新操作，m 的初始值 1000。

tx1 先开始，开启本地事务，拿到本地锁，更新操作 m = 1000 - 100 = 900。本地事务提交前，先拿到该记录的 **全局锁** ，本地提交释放本地锁。 tx2 后开始，开启本地事务，拿到本地锁，更新操作 m = 900 - 100 = 800。本地事务提交前，尝试拿该记录的 **全局锁** ，tx1 全局提交前，该记录的全局锁被 tx1 持有，tx2 需要重试等待 **全局锁** 。

![Write-Isolation: Commit](https://img.alicdn.com/tfs/TB1zaknwVY7gK0jSZKzXXaikpXa-702-521.png)

tx1 二阶段全局提交，释放 **全局锁** 。tx2 拿到 **全局锁** 提交本地事务。

![Write-Isolation: Rollback](https://img.alicdn.com/tfs/TB1xW0UwubviK0jSZFNXXaApXXa-718-521.png)

如果 tx1 的二阶段全局回滚，则 tx1 需要重新获取该数据的本地锁，进行反向补偿的更新操作，实现分支的回滚。

此时，如果 tx2 仍在等待该数据的 **全局锁**，同时持有本地锁，则 tx1 的分支回滚会失败。分支的回滚会一直重试，直到 tx2 的 **全局锁** 等锁超时，放弃 **全局锁** 并回滚本地事务释放本地锁，tx1 的分支回滚最终成功。

因为整个过程 **全局锁** 在 tx1 结束前一直是被 tx1 持有的，所以不会发生 **脏写** 的问题。

## 读隔离

在数据库本地事务隔离级别 **读已提交（Read Committed）** 或以上的基础上，Seata（AT 模式）的默认全局隔离级别是 **读未提交（Read Uncommitted）** 。

如果应用在特定场景下，必需要求全局的 **读已提交** ，目前 Seata 的方式是通过 SELECT FOR UPDATE 语句的代理。

![Read Isolation: SELECT FOR UPDATE](https://img.alicdn.com/tfs/TB138wuwYj1gK0jSZFuXXcrHpXa-724-521.png)

SELECT FOR UPDATE 语句的执行会申请 **全局锁** ，如果 **全局锁** 被其他事务持有，则释放本地锁（回滚 SELECT FOR UPDATE 语句的本地执行）并重试。这个过程中，查询是被 block 住的，直到 **全局锁** 拿到，即读取的相关数据是 **已提交** 的，才返回。

出于总体性能上的考虑，Seata 目前的方案并没有对所有 SELECT 语句都进行代理，仅针对 FOR UPDATE 的 SELECT 语句。

## 工作机制

以一个示例来说明整个 AT 分支的工作过程。

业务表：`product`

|Field|Type|Key|
|---|---|---|
|id|bigint(20)|PRI|
|name|varchar(100)||
|since|varchar(100)||

AT 分支事务的业务逻辑：

```
update product set name = 'GTS' where name = 'TXC';
```

## 一阶段[​](https://seata.io/zh-cn/docs/overview/what-is-seata#%E4%B8%80%E9%98%B6%E6%AE%B5 )

过程：

1. 解析 SQL：得到 SQL 的类型（UPDATE），表（product），条件（where name = 'TXC'）等相关的信息。
2. 查询前镜像：根据解析得到的条件信息，生成查询语句，定位数据。

```
select id, name, since from product where name = 'TXC';
```

得到前镜像：

|id|name|since|
|---|---|---|
|1|TXC|2014|

3. 执行业务 SQL：更新这条记录的 name 为 'GTS'。
4. 查询后镜像：根据前镜像的结果，通过 **主键** 定位数据。

```
select id, name, since from product where id = 1;
```

得到后镜像：

|id|name|since|
|---|---|---|
|1|GTS|2014|

5. 插入回滚日志：把前后镜像数据以及业务 SQL 相关的信息组成一条回滚日志记录，插入到 `UNDO_LOG` 表中。

```
{    "branchId": 641789253,    "undoItems": [{        "afterImage": {            "rows": [{                "fields": [{                    "name": "id",                    "type": 4,                    "value": 1                }, {                    "name": "name",                    "type": 12,                    "value": "GTS"                }, {                    "name": "since",                    "type": 12,                    "value": "2014"                }]            }],            "tableName": "product"        },        "beforeImage": {            "rows": [{                "fields": [{                    "name": "id",                    "type": 4,                    "value": 1                }, {                    "name": "name",                    "type": 12,                    "value": "TXC"                }, {                    "name": "since",                    "type": 12,                    "value": "2014"                }]            }],            "tableName": "product"        },        "sqlType": "UPDATE"    }],    "xid": "xid:xxx"}
```

6. 提交前，向 TC 注册分支：申请 `product` 表中，主键值等于 1 的记录的 **全局锁** 。
7. 本地事务提交：业务数据的更新和前面步骤中生成的 UNDO LOG 一并提交。
8. 将本地事务提交的结果上报给 TC。

## 二阶段-回滚[​](https://seata.io/zh-cn/docs/overview/what-is-seata#%E4%BA%8C%E9%98%B6%E6%AE%B5-%E5%9B%9E%E6%BB%9A )

1. 收到 TC 的分支回滚请求，开启一个本地事务，执行如下操作。
2. 通过 XID 和 Branch ID 查找到相应的 UNDO LOG 记录。
3. 数据校验：拿 UNDO LOG 中的后镜与当前数据进行比较，如果有不同，说明数据被当前全局事务之外的动作做了修改。这种情况，需要根据配置策略来做处理，详细的说明在另外的文档中介绍。
4. 根据 UNDO LOG 中的前镜像和业务 SQL 的相关信息生成并执行回滚的语句：

```
update product set name = 'TXC' where id = 1;
```

5. 提交本地事务。并把本地事务的执行结果（即分支事务回滚的结果）上报给 TC。

## 二阶段-提交[​](https://seata.io/zh-cn/docs/overview/what-is-seata#%E4%BA%8C%E9%98%B6%E6%AE%B5-%E6%8F%90%E4%BA%A4 )

1. 收到 TC 的分支提交请求，把请求放入一个异步任务的队列中，马上返回提交成功的结果给 TC。
2. 异步任务阶段的分支提交请求将异步和批量地删除相应 UNDO LOG 记录。

# 附录

## 回滚日志表[​](https://seata.io/zh-cn/docs/overview/what-is-seata#%E5%9B%9E%E6%BB%9A%E6%97%A5%E5%BF%97%E8%A1%A8 )

UNDO_LOG Table：不同数据库在类型上会略有差别。

以 MySQL 为例：

|Field|Type|
|---|---|
|branch_id|bigint PK|
|xid|varchar(100)|
|context|varchar(128)|
|rollback_info|longblob|
|log_status|tinyint|
|log_created|datetime|
|log_modified|datetime|

```
-- 注意此处0.7.0+ 增加字段 contextCREATE TABLE `undo_log` (  `id` bigint(20) NOT NULL AUTO_INCREMENT,  `branch_id` bigint(20) NOT NULL,  `xid` varchar(100) NOT NULL,  `context` varchar(128) NOT NULL,  `rollback_info` longblob NOT NULL,  `log_status` int(11) NOT NULL,  `log_created` datetime NOT NULL,  `log_modified` datetime NOT NULL,  PRIMARY KEY (`id`),  UNIQUE KEY `ux_undo_log` (`xid`,`branch_id`)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```

# TCC 模式

回顾总览中的描述：一个分布式的全局事务，整体是 **两阶段提交** 的模型。全局事务是由若干分支事务组成的，分支事务要满足 **两阶段提交** 的模型要求，即需要每个分支事务都具备自己的：

- 一阶段 prepare 行为
- 二阶段 commit 或 rollback 行为

![Overview of a global transaction](https://img.alicdn.com/tfs/TB14Kguw1H2gK0jSZJnXXaT1FXa-853-482.png)

根据两阶段行为模式的不同，我们将分支事务划分为 **Automatic (Branch) Transaction Mode** 和 **Manual (Branch) Transaction Mode**.

AT 模式基于 **支持本地 ACID 事务** 的 **关系型数据库**：

- 一阶段 prepare 行为：在本地事务中，一并提交业务数据更新和相应回滚日志记录。
- 二阶段 commit 行为：马上成功结束，**自动** 异步批量清理回滚日志。
- 二阶段 rollback 行为：通过回滚日志，**自动** 生成补偿操作，完成数据回滚。

相应的，TCC 模式，不依赖于底层数据资源的事务支持：

- 一阶段 prepare 行为：调用 **自定义** 的 prepare 逻辑。
- 二阶段 commit 行为：调用 **自定义** 的 commit 逻辑。
- 二阶段 rollback 行为：调用 **自定义** 的 rollback 逻辑。

所谓 TCC 模式，是指支持把 **自定义** 的分支事务纳入到全局事务的管理中。
## TCC 的空回滚和业务悬挂
当某分支事务的 try 阶段阻塞时，可能导致全局事务超时而触发二阶段的 cancel 操作。在未执行 try 操作时先执行了 cancel 操作，这时 cancel 不能做回滚，就是空回滚。
![image.png](https://gitee.com/ycfan/images/raw/master/img/20240121204539.png)

对于已经空回滚的业务，如果以后继续执行 try ，就永远不可能 confirm 或 cancel ，这就是业务悬挂。应当阻止执行空回滚后的 try 操作，避免悬挂。

为了实现空回滚、防止业务悬挂，以及幂等性要求。我们必须在数据库记录冻结金额的同时，记录当前事务id和执行状态，为此我们设计了一张表:
```mysql
CREATE TABLE account_freeze_tbl(
`xid` varchar(128) NOT NULL,
`user_id`,varchar(255) DEFAULT NULL COMMENT '用户id',
`freeze_money`int(11) unsigned DEFAULT 'O' COMMENT '冻结金额',
`state` int(1) DEFAULT NULL COMMENT '事务状态，0:try，1:confirm，2:cancel',
PRIMARY KEY(xid`) USING BTREE
) ENGINE=InNODB DEFAULT CHARSET=Utf8 ROW FORMAT=COMPACT;
```

# Saga 模式

Saga模式是SEATA提供的长事务解决方案，在Saga模式中，业务流程中每个参与者都提交本地事务，当出现某一个参与者失败则补偿前面已经成功的参与者，一阶段正向服务和二阶段补偿服务都由业务开发实现。

Saga模式是SEATA提供的长事务解决方案。也分为两个阶段
- 一阶段:直接提交本地事务
- 二阶段: 成功则什么都不做;失败则通过编写补偿业务来回滚

## Saga模式优点:
- 事务参与者可以基于事件驱动实现异步调用，吞吐高
- 一阶段直接提交事务，无锁，性能好
- 不用编写TCC中的三个阶段，实现简单

## 缺点:
软状态持续时间不确定，时效性差没有锁，没有事务隔离，会有脏写

![image.png](https://gitee.com/ycfan/images/raw/master/img/20231211192048.png)


![Saga模式示意图](https://img.alicdn.com/tfs/TB1Y2kuw7T2gK0jSZFkXXcIQFXa-445-444.png)

理论基础：Hector & Kenneth 发表论⽂ Sagas （1987）

## 适用场景：[​](https://seata.io/zh-cn/docs/overview/what-is-seata#%E9%80%82%E7%94%A8%E5%9C%BA%E6%99%AF )

- 业务流程长、业务流程多
- 参与者包含其它公司或遗留系统服务，无法提供 TCC 模式要求的三个接口

## 优势：[​](https://seata.io/zh-cn/docs/overview/what-is-seata#%E4%BC%98%E5%8A%BF )

- 一阶段提交本地事务，无锁，高性能
- 事件驱动架构，参与者可异步执行，高吞吐
- 补偿服务易于实现

## 缺点：[​](https://seata.io/zh-cn/docs/overview/what-is-seata#%E7%BC%BA%E7%82%B9 )

- 不保证隔离性（应对方案见[用户文档](https://seata.io/zh-cn/docs/user/mode/saga)）


![image.png](https://gitee.com/ycfan/images/raw/master/img/20231211192153.png)


