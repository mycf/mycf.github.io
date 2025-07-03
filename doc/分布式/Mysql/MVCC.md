`MVCC`（Multi-Version Concurrency Control ，多版本并发控制）指的就是在使用`READ COMMITTED`、`REPEATABLE READ`这两种隔离级别的事务在执行普通的`SELECT`操作时访问记录的版本链的过程，这样可以使不同事务的`读-写`、`写-读`操作并发执行，从而提升系统性能。`READ COMMITTED`、`REPEATABLE READ`这两个隔离级别的一个很大不同就是：==生成ReadView的时机不同，READ COMMITTED在每一次进行普通SELECT操作前都会生成一个ReadView，而REPEATABLE READ只在第一次进行普通SELECT操作前生成一个ReadView，之后的查询操作都重复使用这个ReadView就好了。

# 版本链
对于使用InnoDB存储引擎的表来说，它的聚簇索引记录中都包含两个必要的隐藏列（row_id并不是必要的，我们创建的表中有主键或者非NULL的UNIQUE键时都不会包含row_id列）：

- `trx_id`：每次一个事务对某条聚簇索引记录进行改动时，都会把该事务的事务id赋值给`trx_id`隐藏列。
- `roll_pointer`：每次对某条聚簇索引记录进行改动时，都会把旧的版本写入到`undo日志`中，然后这个隐藏列就相当于一个指针，可以通过它来找到该记录修改前的信息。

该记录每次更新后，都会将旧值放到一条`undo日志`中，就算是该记录的一个旧版本，随着更新次数的增多，所有的版本都会被`roll_pointer`属性连接成一个链表，我们把这个链表称之为`版本链`，==版本链的头节点就是当前记录最新的值==。另外，每个版本中还包含生成该版本时对应的`事务id`。
 
# ReadView

对于使用`READ UNCOMMITTED`隔离级别的事务来说，由于可以读到未提交事务修改过的记录，所以直接读取记录的最新版本就好了；对于使用`SERIALIZABLE`隔离级别的事务来说，设计InnoDB的大佬规定使用加锁的方式来访问记录；对于使用`READ COMMITTED`和`REPEATABLE READ`隔离级别的事务来说，都必须保证读到已经提交了的事务修改过的记录，也就是说假如另一个事务已经修改了记录但是尚未提交，是不能直接读取最新版本的记录的，核心问题就是：==需要判断一下版本链中的哪个版本是当前事务可见的==。为此，设计InnoDB的大佬提出了一个`ReadView`的概念，这个`ReadView`中主要包含4个比较重要的内容：

- `m_ids`：表示在生成`ReadView`时当前系统中活跃的读写事务的`事务id`列表。

- `min_trx_id`：表示在生成`ReadView`时当前系统中活跃的读写事务中最小的事务id，也就是`m_ids`中的最小值。

- `max_trx_id`：表示生成`ReadView`时系统中应该分配给下一个事务的id值。
```
小贴士：注意max_trx_id并不是m_ids中的最大值，事务id是递增分配的。比方说现在有id为1，2，3这三个事务，之后id为3的事务提交了。那么一个新的读事务在生成ReadView时，m_ids就包括1和2，min_trx_id的值就是1，max_trx_id的值就是4。
```
- `creator_trx_id`：表示生成该`ReadView`的事务的事务id。

有了这个`ReadView`，这样在访问某条记录时，只需要按照下面的步骤判断记录的某个版本是否可见：

- 如果被访问版本的`trx_id`属性值与`ReadView`中的`creator_trx_id`值相同，意味着当前事务在访问它自己修改过的记录，所以该版本可以被当前事务访问。
- 如果被访问版本的`trx_id`属性值小于`ReadView`中的`min_trx_id`值，表明生成该版本的事务在当前事务生成`ReadView`前已经提交，所以该版本可以被当前事务访问。
- 如果被访问版本的`trx_id`属性值大于`ReadView`中的`max_trx_id`值，表明生成该版本的事务在当前事务生成`ReadView`后才开启，所以该版本不可以被当前事务访问。
如果被访问版本的`trx_id`属性值在`ReadView`的`min_trx_id`和`max_trx_id`之间，那就需要判断一下`trx_id`属性值是不是在`m_ids`列表中，如果在，说明创建`ReadView`时生成该版本的事务还是活跃的，该版本不可以被访问；如果不在，说明创建`ReadView`时生成该版本的事务已经被提交，该版本可以被访问。

如果某个版本的数据对当前事务不可见的话，那就顺着版本链找到下一个版本的数据，继续按照上面的步骤判断可见性，依此类推，直到版本链中的最后一个版本。如果最后一个版本也不可见的话，那么就意味着该条记录对该事务完全不可见，查询结果就不包含该记录。
	
**MVCC，多版本的并发控制，Multi-Version Concurrency Control。**

使用版本来控制并发情况下的数据问题，在B事务开始修改账户且事务未提交时，当A事务需要读取账户余额时，此时会读取到B事务修改操作之前的账户余额的副本数据，但是如果A事务需要修改账户余额数据就必须要等待B事务提交事务。

**MVCC使得数据库读不会对数据加锁，普通的SELECT请求不会加锁，提高了数据库的并发处理能力**。借助MVCC，数据库可以实现READ COMMITTED，REPEATABLE READ等隔离级别，用户可以查看当前数据的前一个或者前几个历史版本，保证了ACID中的I特性（隔离性)。

### InnoDB的MVCC实现逻辑

#### InnoDB存储引擎保存的MVCC的数据

InnoDB的MVCC是通过在每行记录后面保存两个隐藏的列来实现的。
- 事务ID（DB_TRX_ID）
- 回滚指针（DB_ROLL_PT）

每开始一个新的事务，都会自动递增产生一个新的事务id。事务开始时刻的会把事务id放到当前事务影响的行事务id中，当查询时需要用当前事务id和每行记录的事务id进行比较。

下面看一下在REPEATABLE READ隔离级别下，MVCC具体是如何操作的。

**SELECT**

InnoDB 会根据以下两个条件检查每行记录：

1. InnoDB只查找版本早于当前事务版本的数据行（也就是，行的事务编号小于或等于当前事务的事务编号），这样可以确保事务读取的行，要么是在事务开始前已经存在的，要么是事务自身插入或者修改过的。
    
2. 删除的行要事务ID判断，读取到事务开始之前状态的版本，只有符合上述两个条件的记录，才能返回作为查询结果。
    

**INSERT**

InnoDB为新插入的每一行保存当前事务编号作为行版本号。

**DELETE**

InnoDB为删除的每一行保存当前事务编号作为行删除标识。

**UPDATE**

InnoDB为插入一行新记录，保存当前事务编号作为行版本号，同时保存当前事务编号到原来的行作为行删除标识。

保存这两个额外事务编号，使大多数读操作都可以不用加锁。这样设计使得读数据操作很简单，性能很好，并且也能保证只会读取到符合标准的行。不足之处是每行记录都需要额外的存储空间，需要做更多的行检查工作，以及一些额外的维护工作。

> MVCC只在REPEATABLE READ和READ COMMITIED两个隔离级别下工作。其他两个隔离级别都和 MVCC不兼容 ，因为READ UNCOMMITIED总是读取最新的数据行，而不是符合当前事务版本的数据行。而SERIALIZABLE则会对所有读取的行都加锁。

**MVCC 在mysql 中的实现依赖的是 undo log 与 read view 。**

#### undo log

根据行为的不同，undo log分为两种：**insert undo log** 和 **update undo log**

- **insert undo log：**
    

insert 操作中产生的undo log，因为insert操作记录只对当前事务本身可见，对于其他事务此记录不可见，所以 insert undo log 可以在事务提交后直接删除而不需要进行purge操作。

> purge的主要任务是将数据库中已经 mark del 的数据删除，另外也会批量回收undo pages

数据库 Insert时的数据初始状态：

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/uChmeeX1FpwJKFFbFRxaw5IqeicribHhXUF3xzFfFBQeL8SNsvqnUw71LgTuOagzP9U9191r9RLzt12uIAIZMPgQ/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)

- **update undo log：**
    
    update 或 delete 操作中产生的 undo log。因为会对已经存在的记录产生影响，为了提供 MVCC机制，因此update undo log 不能在事务提交时就进行删除，而是将事务提交时放到入 history list 上，等待 purge 线程进行最后的删除操作。
    
    **数据第一次被修改时：**
    
    ![图片](https://mmbiz.qpic.cn/mmbiz_jpg/uChmeeX1FpwJKFFbFRxaw5IqeicribHhXUCV7aqgyYufAg75OCdW0NvX7tOMN9m0LEOQtY9BKrxJbOZ5ngTGDiavA/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)
    

**当另一个事务第二次修改当前数据：**

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/uChmeeX1FpwJKFFbFRxaw5IqeicribHhXU5X2wmfQ1UPMKlreE4GNjcA40jwhV5ic9rmJnZNf1HuVssHd2Qbo4Ujw/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)

为了保证事务并发操作时，在写各自的undo log时不产生冲突，InnoDB采用回滚段的方式来维护undo log的并发写入和持久化。回滚段实际上是一种 Undo 文件组织方式。

#### ReadView

对于 **RU(READ UNCOMMITTED)** 隔离级别下，所有事务直接读取数据库的最新值即可，和 **SERIALIZABLE** 隔离级别，所有请求都会加锁，同步执行。所以这对这两种情况下是不需要使用到 **Read View** 的版本控制。

对于 **RC(READ COMMITTED)** 和 **RR(REPEATABLE READ)** 隔离级别的实现就是通过上面的版本控制来完成。两种隔离界别下的核心处理逻辑就是判断所有版本中哪个版本是当前事务可见的处理。针对这个问题InnoDB在设计上增加了**ReadView**的设计，**ReadView**中主要包含当前系统中还有哪些活跃的读写事务，把它们的事务id放到一个列表中，我们把这个列表命名为为**m_ids**。

对于查询时的版本链数据是否看见的判断逻辑：

- 如果被访问版本的 trx_id 属性值小于 m_ids 列表中最小的事务id，表明生成该版本的事务在生成 ReadView 前已经提交，所以该版本可以被当前事务访问。
    
- 如果被访问版本的 trx_id 属性值大于 m_ids 列表中最大的事务id，表明生成该版本的事务在生成 ReadView 后才生成，所以该版本不可以被当前事务访问。
    
- 如果被访问版本的 trx_id 属性值在 m_ids 列表中最大的事务id和最小事务id之间，那就需要判断一下 trx_id 属性值是不是在 m_ids 列表中，如果在，说明创建 ReadView 时生成该版本的事务还是活跃的，该版本不可以被访问；如果不在，说明创建 ReadView 时生成该版本的事务已经被提交，该版本可以被访问。
    

**举个例子：**

#### READ COMMITTED 隔离级别下的ReadView

**每次读取数据前都生成一个ReadView (m_ids列表)**

|**时间**|**Transaction 777**|**Transaction 888**|**Trasaction 999**|
|---|---|---|---|
|T1|begin;|||
|T2||begin;|begin；|
|T3|UPDATE user SET name = 'CR7' WHERE id = 1;|||
|T4||...||
|T5|UPDATE user SET name = 'Messi' WHERE id = 1;||SELECT * FROM user where id = 1;|
|T6|commit;|||
|T7||UPDATE user SET name = 'Neymar' WHERE id = 1;||
|T8|||SELECT * FROM user where id = 1;|
|T9||UPDATE user  SET name = 'Dybala' WHERE id = 1;||
|T10||commit;||
|T11|||SELECT * FROM user where id = 1;|

这里分析下上面的情况下的ReadView

时间点 T5 情况下的 SELECT 语句：

当前时间点的版本链：

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/uChmeeX1FpwJKFFbFRxaw5IqeicribHhXU7kJktspicJ7mjhT7CE2bgUxrFdLGYY30ztzvP0ROhLZU1CoR5Rkyd4g/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)

> 此时 SELECT 语句执行，当前数据的版本链如上，因为当前的事务777，和事务888 都未提交，所以此时的活跃事务的ReadView的列表情况 **m_ids：[777, 888]**  ，因此查询语句会根据当前版本链中小于 **m_ids** 中的最大的版本数据，即查询到的是 Mbappe。

时间点 T8 情况下的 SELECT 语句：

当前时间的版本链情况：

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/uChmeeX1FpwJKFFbFRxaw5IqeicribHhXUwofkzdhEap6z3KusD0bckbxFK96UI0icRaosLfjYoKY62cZyXh2QxlA/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)

> 此时 SELECT 语句执行，当前数据的版本链如上，因为当前的事务777已经提交，和事务888 未提交，所以此时的活跃事务的ReadView的列表情况 **m_ids：[888]** ，因此查询语句会根据当前版本链中小于 **m_ids** 中的最大的版本数据，即查询到的是 Messi。

时间点 T11 情况下的 SELECT 语句：

当前时间点的版本链信息：

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/uChmeeX1FpwJKFFbFRxaw5IqeicribHhXUr1NGHYBTtwGLY3qZ2B5J0CF74p2T9G3bcUPuZtA5QTvMFrQHW6dh2Q/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)

> 此时 SELECT 语句执行，当前数据的版本链如上，因为当前的事务777和事务888 都已经提交，所以此时的活跃事务的ReadView的列表为空 ，因此查询语句会直接查询当前数据库最新数据，即查询到的是 Dybala。

**总结：** **使用READ COMMITTED隔离级别的事务在每次查询开始时都会生成一个独立的 ReadView。**

#### REPEATABLE READ 隔离级别下的ReadView

**在事务开始后第一次读取数据时生成一个ReadView（m_ids列表）**

|**时间**|**Transaction 777**|**Transaction 888**|**Trasaction 999**|
|---|---|---|---|
|T1|begin;|||
|T2||begin;|begin；|
|T3|UPDATE user SET name = 'CR7' WHERE id = 1;|||
|T4||...||
|T5|UPDATE user SET name = 'Messi' WHERE id = 1;||SELECT * FROM user where id = 1;|
|T6|commit;|||
|T7||UPDATE user SET name = 'Neymar' WHERE id = 1;||
|T8|||SELECT * FROM user where id = 1;|
|T9||UPDATE user  SET name = 'Dybala' WHERE id = 1;||
|T10||commit;||
|T11|||SELECT * FROM user where id = 1;|

时间点 T5 情况下的 SELECT 语句：

当前版本链：

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/uChmeeX1FpwJKFFbFRxaw5IqeicribHhXUtmTmlU8VxKUkKDtd43mcvW1pic70SE3VrGbhzHvnynorWrLJYLoJ93g/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)

> 再当前执行select语句时生成一个ReadView，此时 **m_ids** 内容是：[777,888]，所以但前根据ReadView可见版本查询到的数据为 Mbappe。

时间点 T8 情况下的 SELECT 语句：

当前的版本链：

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/uChmeeX1FpwJKFFbFRxaw5IqeicribHhXUnSvboNg5IFl0ic36E1K4lj6bSL1iabBOOaRBZHAYll58MOOT6yaQhzQA/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)

> 此时在当前的 Transaction 999 的事务里。由于T5的时间点已经生成了ReadView，所以再当前的事务中只会生成一次ReadView，所以此时依然沿用T5时的**m_ids：[777,999]**，所以此时查询数据依然是 Mbappe。

时间点 T11 情况下的 SELECT 语句：

当前的版本链：

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/uChmeeX1FpwJKFFbFRxaw5IqeicribHhXU8trSR8mnDL0uEg0MGnvKj3IV3nqvr012IBYHXw9sUAhT5h6KXibePOw/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)

> 此时情况跟T8完全一样。由于T5的时间点已经生成了ReadView，所以再当前的事务中只会生成一次ReadView，所以此时依然沿用T5时的**m_ids：[777,999]**，所以此时查询数据依然是 Mbappe。

### MVCC总结：

所谓的MVCC（Multi-Version Concurrency Control ，多版本并发控制）指的就是在使用 **READ COMMITTD** 、**REPEATABLE READ** 这两种隔离级别的事务在执行普通的 SEELCT 操作时访问记录的版本链的过程，这样子可以使不同事务的 `读-写` 、 `写-读`操作并发执行，从而提升系统性能。

在 MySQL 中， READ COMMITTED 和 REPEATABLE READ 隔离级别的的一个非常大的区别就是它们生成 ReadView 的时机不同。在 READ COMMITTED 中每次查询都会生成一个实时的 ReadView，做到保证每次提交后的数据是处于当前的可见状态。而 REPEATABLE READ 中，在当前事务第一次查询时生成当前的 ReadView，并且当前的 ReadView 会一直沿用到当前事务提交，以此来保证可重复读（REPEATABLE READ）。





MVCC的工作原理是使用数据在某个时间点的快照来实现的。这意味着，无论事务运行多长时间，都可以看到数据的一致视图，也意味着不同的事务可以在同一时间看到同一张表中的不同数据！

InnoDB的MVCC，是通过在每行记录后面保存两个隐藏的列来实现的。
- **事务ID（DB_TRX_ID）** 指示插入或更新该行的最后一个事务的事务ID。此外，删除在内部被视为更新，其中设置行中的特殊位将其标记为已删除。
- **行的回滚指针（DB_ROLL_PT）** 回滚指针指向写入`rollback segment`的`undo log`记录。如果该行已更新，则`undo log`记录包含重建该行更新之前内容所需的信息。

每开始一个新的事务，系统版本号都会自动递增。事务开始时刻的系统版本号会作为事务的版本号，用来和查询到的每行记录的版本号进行比较。下面看一下在REPEATABLE READ隔离级别下，MVCC具体是如何操作的。

## SELECT

InnoDB会根据以下两个条件检查每行记录：

1. InnoDB只查找版本早于当前事务版本的数据行（也就是，**行的系统版本号小于或等于事务的系统版本号**），这样可以确保事务读取的行，要么是在事务开始前已经存在的，要么是事务自身插入或者修改过的。
2. 行的删除版本要么未定义，要么大于当前事务版本号。这可以确保事务读取到的行，**在事务开始之前未被删除**。

只有符合上述两个条件的记录，才能返回作为查询结果。

## INSERT

InnoDB为新插入的每一行保存当前系统版本号作为行版本号。

 |   |   |   |   | |
|---|---|---|---|---|
|id|name|db_trx_id(create version)|delete version|db_roll_pt|
|1|test|1|||
## UPDATE

InnoDB为插入一行新记录，保存当前系统版本号作为行版本号，同时保存当前系统版本号到原来的行作为行删除标识。

|   |   |   |   |
|---|---|---|---|
|id|name|create version|delete version|
|1|test|1|2|
|1|new_value|2|


## DELETE

InnoDB为删除的每一行保存当前系统版本号作为行删除标识。
 
 |   |   |   |   |
|---|---|---|---|
|id|name|create version|delete version|
|1|new_value|1|2|

保存这两个额外系统版本号，使大多数读操作都可以不用加锁。这样设计使得读数据操作很简单，性能很好，并且也能保证只会读取到符合标准的行。不足之处是每行记录都需要**额外的存储空间**，需要做**更多的行检查工作**，以及一些**额外的维护工作**。


MVCC*仅适用于*`REPEATABLE READ`和`READ COMMITTED`隔离级别。

在 MySQL 中， `READ COMMITTED` 和 `REPEATABLE READ` 隔离级别的的一个非常大的区别就是它们生成 ReadView 的时机不同。在 `READ COMMITTED` 中**每次查询都会生成一个实时的 ReadView**，做到保证每次提交后的数据是处于当前的可见状态。而 REPEATABLE READ 中，在当前事务第一次查询时生成当前的 ReadView，并且当前的 ReadView 会一直沿用到当前事务提交，以此来保证可重复读（REPEATABLE READ）。

READ UNCOMMITTED与MVCC不兼容，是因为查询不会读取适合其事务版本的行版本，而是不管怎样都*读最新版本*。
SERIALIZABLE与MVCC也不兼容，是因为*读取会锁定它们返回的每一行*。

## READ_VIEW

read_view是MySQL底层实现的一个结构体，是和SQL语句绑定的，在每个SQL语句执行前申请或获取。可以将其理解为构造快照的前提或者依据，一个快照所呈现的数据是什么样子(版本)的基本依赖于read_view中所存储的数据。

#### READ_VIEW底层实现
构建当前可视版本（快照）主要用到的变量有low_limit_id、up_limit_id、trx_ids以及creator_trx_id：

**low_limit_id**：表示创建read_view时，当前事务活跃读写链表中最大的事务ID

**up_limit_id**：表示创建read_view时，当前事务活跃读写链表中最小的事务ID

**trx_ids**：创建read_view时，活跃事务链表里所有的事务ID

**creator_trx_id**：当前read_view所属事务的事务版本号

什么是当前事务活跃读写链表呢？可以将其理解为一个事务池，事务池中所存储的是当前所有正在运行（已开启但未提交）的事务。MySQL将当前所有活跃的事务保存在information_schema.innodb_trx表中，如下图所示：

READ_VIEW的作用

MVCC会根据read_view中所保存的信息来构建当前事务可视版本。

对于小于或者等于RC的隔离级别，事务开启后，每次执行SQL语句都会申请一个read_view，然后在执行完这个SQL语句后，调用read_view_close_for_mysql将read view从事务中删除。每次在执行SQL语句之前都会判断trx->read_view为空（理论下必为空），然后重新申请一个read_view（这就是为什么RC隔离级别下会产生不可重复读的原因）。

对于RR隔离级别，当申请一个read_view后，事务未提交不会删除，整个事务将不再申请新的read_view，保证事务中所使用的read_view都是同一个，从而实现可重复读的隔离级别。

MVCC-SELECT可见范围（总结）

了解了这么多，我们再回过头来总结一下MVCC的SELECT规则。因为除了上面所提到了部分内容，官方文档中也没有很详细的介绍MVCC的具体操作，我看了很多网上的总结，有人总结了三条，也有人总结了四条，但通过分析以后，本文总结六条供大家参考：

(1)：DB_TRX_ID >= view->low_limit_id的记录不可见。DB_TRX_ID >= view->low_limit_id的记录必为当前事务开启之后开启的事务更新或插入的，所以不可见；

(2)：DB_TRX_ID位于[view->up_limit_id，view->low_limit_id）区间时，如果存在于trx_ids集合中，则不可见。如果DB_TRX_ID存在于这个集合中，说明该记录的修改或创建者（事务）在当前事务开启时并未提交，所以不可见；

(3)：DB_TRX_ID up_limit_id的记录可见。DB_TRX_ID up_limit_id，说明该记录的修改或创建者（事务）在当前事务开启之前已经提交，所以可见；

(4)：DB_TRX_ID = creator_trx_id的记录可见。DB_TRX_ID = creator_trx_id说明该记录的修改或创建者（事务）是当前事务，所以可见；

(5)：DB_TRX_ID != creator_trx_id的被标记删除记录可见。所有被删除且已提交的事务将被真正删除（删除但未提交只是标记删除），所以不会查询到，标记删除的记录除自身删除的以外，当前事务可见，DB_TRX_ID = creator_trx_id为自身删除所以不可见，其余皆可见；

(6)：以上对于view不可见的记录，需要通过记录的DB_ROLL_PTR指针遍历回滚段中的undo_log构造当前view可见版本数据。不可见的记录只是说明该记录的当前版本不可见，但是它之前的某一版本是当前事务可见的，所以应当构建出该数据当前事务的可见版本。