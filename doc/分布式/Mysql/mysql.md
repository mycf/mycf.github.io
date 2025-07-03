## 存储引擎

可以通过SHOW ENGINES语句查看当前使用的MySQL数据库所支持的存储引擎，也可以通过查找information_schema架构下的ENGINES表



mysql> show engines\g;
+--------------------+---------+----------------------------------------------------------------+--------------+------+------------+
| Engine             | Support | Comment                                                        | Transactions | XA   | Savepoints |
+--------------------+---------+----------------------------------------------------------------+--------------+------+------------+
| ARCHIVE            | YES     | Archive storage engine                                         | NO           | NO   | NO         |
| BLACKHOLE          | YES     | /dev/null storage engine (anything you write to it disappears) | NO           | NO   | NO         |
| MRG_MYISAM         | YES     | Collection of identical MyISAM tables                          | NO           | NO   | NO         |
| FEDERATED          | NO      | Federated MySQL storage engine                                 | NULL         | NULL | NULL       |
| MyISAM             | YES     | MyISAM storage engine                                          | NO           | NO   | NO         |
| PERFORMANCE_SCHEMA | YES     | Performance Schema                                             | NO           | NO   | NO         |
| InnoDB             | DEFAULT | Supports transactions, row-level locking, and foreign keys     | YES          | YES  | YES        |
| MEMORY             | YES     | Hash based, stored in memory, useful for temporary tables      | NO           | NO   | NO         |
| CSV                | YES     | CSV storage engine                                             | NO           | NO   | NO         |
+--------------------+---------+----------------------------------------------------------------+--------------+------+------------+
9 rows in set (0.27 sec)

# 文件

## 参数文件

在默认情况下，MySQL实例会按照一定的顺序在指定的位置进行读取，用户只需通过命令`mysql --help|grep my.cnf`来寻找即可。

可以通过命令SHOW VARIABLES查看数据库中的所有参数，也可以通过LIKE来过滤参数名。从MySQL 5.1版本开始，还可以通过information_schema架构下的GLOBAL_VARIABLES视图来进行查找

## 日志文件

日志文件记录了影响MySQL数据库的各种类型活动。MySQL数据库中常见的日志文件有：
❑错误日志（error log）
❑二进制日志（binlog）
❑慢查询日志（slow query log）
❑查询日志（log）

### 二进制日志

二进制日志（binary log）记录了对MySQL数据库执行更改的所有操作，但是不包括SELECT和SHOW这类操作，因为这类操作对数据本身并没有修改。然而，若操作本身并没有导致数据库发生变化，那么该操作可能也会写入二进制日志。

此外，二进制日志还包括了执行数据库更改操作的时间等其他额外信息。总的来说，二进制日志主要有以下几种作用。
❑恢复（recovery）：某些数据的恢复需要二进制日志，例如，在一个数据库全备文件恢复后，用户可以通过二进制日志进行point-in-time的恢复。
❑复制（replication）：其原理与恢复类似，通过复制和执行二进制日志使一台远程的MySQL数据库（一般称为slave或standby）与一台MySQL数据库（一般称为master或primary）进行实时同步。
❑审计（audit）：用户可以通过二进制日志中的信息来进行审计，判断是否有对数据库进行注入的攻击。
通过配置参数log-bin[=name]可以启动二进制日志。如果不指定name，则默认二进制日志文件名为主机名，后缀名为二进制日志的序列号，所在路径为数据库所在目录（datadir）

当使用事务的表存储引擎（如InnoDB存储引擎）时，所有未提交（uncommitted）的二进制日志会被记录到一个缓存中去，等该事务提交（committed）时直接将缓冲中的二进制日志写入二进制日志文件

## InnoDB存储引擎文件



## 锁

InnoDB存储引擎实现了如下两种标准的行级锁：
❑共享锁（S Lock），允许事务读一行数据。
❑排他锁（X Lock），允许事务删除或更新一行数据。
如果一个事务T1已经获得了行r的共享锁，那么另外的事务T2可以立即获得行r的共享锁，因为读取并没有改变行r的数据，称这种情况为锁兼容（Lock Compatible）。但若有其他的事务T3想获得行r的排他锁，则其必须等待事务T1、T2释放行r上的共享锁——这种情况称为锁不兼容。



```mysql
# 查询死锁表
SELECT * FROM INFORMATION_SCHEMA.INNODB_LOCKS;

# 查询死锁等待时间
SELECT * FROM information_schema.INNODB_LOCK_waits;
```



```mysql
 select * from performance_schema.data_locks;

 select * from performance_schema.data_lock_waits;
```

```mysql
select @@tx_isolation;
select @@transaction_isolation;
```



### 一致性非锁定读

之所以称其为非锁定读，因为不需要等待访问的行上X锁的释放。快照数据是指该行的之前版本的数据，该实现是通过undo段来完成。而undo用来在事务中回滚数据，因此快照数据本身是没有额外的开销。此外，**读取快照数据是不需要上锁的**，因为没有事务需要对历史的数据进行修改操作。

可以看到，非锁定读机制极大地提高了数据库的并发性。在InnoDB存储引擎的默认设置下，这是默认的读取方式，即读取不会占用和等待表上的锁。但是在不同事务隔离级别下，读取的方式不同，并不是在每个事务隔离级别下都是采用非锁定的一致性读。此外，即使都是使用非锁定的一致性读，但是对于快照数据的定义也各不相同。


一致性的非锁定读（consistent nonlocking read）是指InnoDB存储引擎通过行多版本控制（multi versioning）的方式来读取当前执行时间数据库中行的数据。如果读取的行正在执行DELETE或UPDATE操作，这时读取操作不会因此去等待行上锁的释放。相反地，InnoDB存储引擎会去读取行的一个快照数据。

快照数据其实就是当前行数据之前的历史版本，每行记录可能有多个版本。就图6-4所显示的，一个行记录可能有不止一个快照数据，一般称这种技术为行多版本技术。由此带来的并发控制，称之为多版本并发控制（Multi Version Concurrency Control，MVCC）。

在事务隔离级别READ COMMITTED和REPEATABLE READ（InnoDB存储引擎的默认事务隔离级别）下，InnoDB存储引擎使用非锁定的一致性读。然而，对于快照数据的定义却不相同。**在READ COMMITTED事务隔离级别下，对于快照数据，非一致性读总是读取被锁定行的最新一份快照数据。而在REPEATABLE READ事务隔离级别下，对于快照数据，非一致性读总是读取事务开始时的行数据版本。**

### 一致性锁定读

在默认配置下，即事务的隔离级别为REPEATABLE READ模式下，InnoDB存储引擎的SELECT操作使用一致性非锁定读。但是在某些情况下，用户需要显式地对数据库读取操作进行加锁以保证数据逻辑的一致性。而这要求数据库支持加锁语句，即使是对于SELECT的只读操作。InnoDB存储引擎对于SELECT语句支持两种一致性的锁定读（locking read）操作：
❑SELECT…FOR UPDATE
❑SELECT…LOCK IN SHARE MODE
SELECT…FOR UPDATE对读取的行记录加一个X锁，其他事务不能对已锁定的行加上任何锁。SELECT…LOCK IN SHARE MODE对读取的行记录加一个S锁，其他事务可以向被锁定的行加S锁，但是如果加X锁，则会被阻塞。

## 锁的算法

#### 行锁的3种算法

InnoDB存储引擎有3种行锁的算法，其分别是：
❑Record Lock：单个行记录上的锁
❑Gap Lock：间隙锁，锁定一个范围，但不包含记录本身
❑Next-Key Lock∶Gap Lock+Record Lock，锁定一个范围，并且锁定记录本身
Record Lock总是会去锁住索引记录，如果InnoDB存储引擎表在建立的时候没有设置任何一个索引，那么这时InnoDB存储引擎会使用隐式的主键来进行锁定。
Next-Key Lock是结合了Gap Lock和Record Lock的一种锁定算法，在Next-Key Lock算法下，InnoDB对于行的查询都是采用这种锁定算法。例如一个索引有10，11，13和20这四个值，那么该索引可能被Next-Key Locking的区间为：



(-∞,10]




(10,11]




(11,13]




(13，20]




(20,+∞)



采用Next-Key Lock的锁定技术称为Next-Key Locking。**其设计的目的是为了解决Phantom Problem**

若事务T1已经通过next-key locking锁定了如下范围：

```markdown
(10,11]、(11，13]
```

当插入新的记录12时，则锁定的范围会变成：

```markdown
(10,11]、(11,12]、(12，13]
```

然而，当查询的索引含有唯一属性时，InnoDB存储引擎会对Next-Key Lock进行优化，将其降级为Record Lock，即仅锁住索引本身，而不是范围。看下面的例子，首先根据如下代码创建测试表t：

```mysql
DROP TABLE IF EXISTS t;
CREATE TABLE t(a INT PRIMARY KEY);
INSERT INTO t SELECT 1;
INSERT INTO t SELECT 2;
INSERT INTO t SELECT 5;
```




# 事务

## 事务的实现

事务隔离性由锁来实现。原子性、一致性、持久性通过数据库的redo log和undo log来完成。redo log称为重做日志，用来保证事务的原子性和持久性。undo log用来保证事务的一致性。
redo和undo的作用都可以视为是一种恢复操作，redo恢复提交事务修改的页操作，而undo回滚行记录到某个特定版本。因此两者记录的内容不同，redo通常是物理日志，记录的是页的物理修改操作。undo是逻辑日志，根据每行记录进行记录。

### redo



#### 1.基本概念

重做日志用来实现事务的持久性，即事务ACID中的D。其由两部分组成：一是内存中的重做日志缓冲（redo log buffer），其是易失的；二是重做日志文件（redo log file），其是持久的。
InnoDB是事务的存储引擎，其通过Force Log at Commit机制实现事务的持久性，即当事务提交（COMMIT）时，必须先将该事务的所有日志写入到重做日志文件进行持久化，待事务的COMMIT操作完成才算完成。这里的日志是指重做日志，在InnoDB存储引擎中，由两部分组成，即redo log和undo log。redo log用来保证事务的持久性，undo log用来帮助事务回滚及MVCC的功能。redo log基本上都是顺序写的，在数据库运行时不需要对redo log的文件进行读取操作。而undo log是需要进行随机读写的。



### undo



#### 1.基本概念

重做日志记录了事务的行为，可以很好地通过其对页进行“重做”操作。但是事务有时还需要进行回滚操作，这时就需要undo。因此在对数据库进行修改时，InnoDB存储引擎不但会产生redo，还会产生一定量的undo。这样如果用户执行的事务或语句由于某种原因失败了，又或者用户用一条ROLLBACK语句请求回滚，就可以利用这些undo信息将数据回滚到修改之前的样子。
redo存放在重做日志文件中，与redo不同，undo存放在数据库内部的一个特殊段（segment）中，这个段称为undo段（undo segment）。undo段位于共享表空间内。

## 事务的隔离级别

SQL标准定义的四个隔离级别为：
❑READ UNCOMMITTED
❑READ COMMITTED
❑REPEATABLE READ
❑SERIALIZABLE

# mysql线上修改大表有哪些风险

在线修改大表的可能影响

- 在线修改大表的表结构执行时间往往不可预估，一般时间较长
- 由于修改表结构是表级锁，因此在修改表结构时，影响表写入操作
- 如果长时间修改表结构，中途修改失败，由于修改表结构是一个事务，因此失败后会还原表结构，在这个过程中表都是锁着的不可写入
- 修改大表结构容易导致数据库CPU、IO等性能消耗，使mysql服务器性能降低
- 在线修改大表结构容易导致主从延时，从而影响业务读取

修改方式：

1. 对表加锁（表此时只读）
2. 复制原表物理结构
3. 修改表的物理结构
4. 把原表数据导入中间表中，数据同步完成后，锁定中间表，并删除原表
5. rename中间表为原表
6. 刷新数据字典，并释放锁

使用工具：pt-online-schema-change，是percona推出的针对mysql在线ddl的工具。

## pt-online-schema-change为什么不会阻塞

`pt-online-schema-change` 是 Percona Toolkit 中的一个工具，用于在线修改 MySQL 表的结构。它采用了一些技术和策略，以避免对数据库的阻塞和影响，使得结构修改过程可以在线进行。

下面是 `pt-online-schema-change` 不会阻塞的主要原因：

1. 使用复制和临时表：`pt-online-schema-change` 在执行结构修改时，会利用 MySQL 的主从复制机制和临时表来完成操作。它会创建一个与原表结构相同的临时表，然后通过复制和应用变更事件的方式，将原表的数据同步到临时表中。在这个过程中，原表可以继续接收读写操作，而不会受到锁定或阻塞。

2. 逐步应用变更：`pt-online-schema-change` 会将结构修改操作分解为多个小的变更步骤，并逐步应用到临时表上。这样可以使得每个步骤的执行时间较短，减少了对数据库的锁定时间，同时也降低了对系统资源的消耗。

3. 使用非阻塞的 DDL 操作：`pt-online-schema-change` 使用了一些 MySQL 引擎提供的非阻塞 DDL 操作，例如在 InnoDB 引擎上使用原地（in-place）操作来修改表的结构。这些操作能够避免对整个表的锁定，从而实现了在线的结构修改。

4. 监控和回滚机制：`pt-online-schema-change` 在执行过程中会监控表的状态和进度，并具备回滚机制。如果发生错误或意外情况，它能够自动回滚到修改前的状态，保证数据的一致性和完整性。

需要注意的是，尽管 `pt-online-schema-change` 不会阻塞数据库的正常操作，但它仍然会对系统资源产生一定的负载和影响。因此，在执行结构修改之前，建议进行充分的测试和评估，确保系统具备足够的资源和性能来支持修改操作。

总结起来，`pt-online-schema-change` 不会阻塞是因为它利用复制和临时表、逐步应用变更、非阻塞的 DDL 操作以及监控和回滚机制等技术策略，使得结构修改过程可以在线进行，并且不会对数据库的正常运行产生阻塞。



# 复制

复制（replication）是MySQL数据库提供的一种高可用高性能的解决方案，一般用来建立大型的应用。总体来说，replication的工作原理分为以下3个步骤：
1）主服务器（master）把数据更改记录到二进制日志（binlog）中。
2）从服务器（slave）把主服务器的二进制日志复制到自己的中继日志（relay log）中。
3）从服务器重做中继日志中的日志，把更改应用到自己的数据库上，以达到数据的最终一致性。

从服务器有2个线程，一个是I/O线程，负责读取主服务器的二进制日志，并将其保存为中继日志；另一个是SQL线程，复制执行中继日志。


## 快照+复制的备份架构

复制主要功能如下：
❑数据分布。由于MySQL数据库提供的复制并不需要很大的带宽要求，因此可以在不同的数据中心之间实现数据的复制。
❑读取的负载平衡。通过建立多个从服务器，可将读取平均地分布到这些从服务器中，并且减少了主服务器的压力。一般通过DNS的Round-Robin和Linux的LVS功能都可以实现负载平衡。
❑数据库备份。复制对备份很有帮助，但是从服务器不是备份，不能完全代替备份。
❑高可用性和故障转移。通过复制建立的从服务器有助于故障转移，减少故障的停机时间和恢复时间。
可见，复制的设计不是简简单单用来备份的，并且只是用复制来进行备份是远远不够的。假设当前应用采用了主从的复制架构，从服务器作为备份。这时，一个初级DBA执行了误操作，如DROP DATABASE或DROP TABLE，这时从用户怎样从服务器进行恢复呢？
因此，一个比较好的方法是通过对从服务器上的数据库所在分区做快照，以此来避免误操作对复制造成影响。当发生主服务器上的误操作时，只需要将从服务器上的快照进行恢复，然后再根据二进制日志进行point-in-time的恢复即可。因此快照+复制的备份架构如图8-5所示。