https://hedon954.github.io/noteSite/backend/middleware/redis/redis_cache.html#_3-1-%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B%E6%94%AF%E6%8C%81%E4%B8%8D%E5%90%8C
# 缓存的概念

缓存是介于应用程序和物理数据源之间的一种数据，其作用是降低应用程序对物理数据源访问的频次，从而提高应用的运行性能。缓存内的数据是对物理数据源中的数据的拷贝，应用程序在运行时从缓存读取数据，在特定的时刻或事件会同步缓存和数据源数据。比如说我们通常是直接查询 MySQL 数据库，那在高并发场景下，大量查询 MySQL 数据库会导致数据库性能变慢，因此我们在应用层与 MySQL 之间搭建一个 Cache 层，让请求先访问 Cache，这样就能大大降低数据库的压力，提高性能。

## 2. Redis 缓存方式

使用 Redis 做缓存的话，数据的存储结构有 2 种，一种采用 `string` 存储，另外一种是使用 `hash` 存储。

- `strings` 的存储比较简单，适合固定的数据，比如存储一个简单的用户信息（用户名、昵称、头像、年龄等）。存储时需要将数据进行序列化，获取时要反序列化。在数据量较小的情况下还是可以忽略这种开销的。
- 但如果存储的数据某些属性可能会有变化，那么 `hash` 会更好，因为 `hash` 提供了 `hset` 和 `hget`，不需要取出所有的数据就可以进行修改，而且存储的时候没有序列化开销。
- 官方推荐使用 `hash`。

> 参考：https://blog.csdn.net/xiaoliangtx/article/details/117374361

## 3. 分布式缓存

在分布式系统开发中，系统与系统之间都属于进程级别，如果缓存系统也能跨进程的话，那就称之为分布式缓存，市面上的分布式缓存技术有 Memcached 和 Redis 这两种。


Redis 的作者 Salvatore Sanfilippo 曾经对这两种基于内存的数据存储系统进行过比较：

1. Redis 支持服务器端的数据操作：Redis 相比 Memcached 来说，拥有更多的数据结构和并支持更丰富的数据操作，通常在 Memcached 里，你需要将数据拿到客户端来进行类似的修改再 set 回去。这大大增加了网络 IO 的次数和数据体积。在 Redis 中，这些复杂的操作通常和一般的 GET/SET 一样高效。所以，如果需要缓存能够支持更复杂的结构和操作，那么 Redis 会是不错的选择。
2. 内存使用效率对比：使用简单的 key-value 存储的话，Memcached 的内存利用率更高，而如果 Redis 采用 hash 结构来做 key-value 存储，由于其组合式的压缩，其内存利用率会高于 Memcached。
3. 性能对比：由于 Redis 只使用单核，而 Memcached 可以使用多核，所以平均每一个核上 Redis 在存储小数据时比 Memcached 性能更高。而在 100k 以上的数据中，Memcached 性能要高于 Redis，虽然 Redis 最近也在存储大数据的性能上进行优化，但是比起 Memcached，还是稍有逊色。

二者的区别大致如下：

### [#](https://hedon954.github.io/noteSite/backend/middleware/redis/redis_cache.html#_3-1-%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B%E6%94%AF%E6%8C%81%E4%B8%8D%E5%90%8C)3.1 数据类型支持不同

与 Memcached 仅支持简单的 key-value 结构的数据记录不同，Redis 支持的数据类型要丰富得多。最为常用的数据类型主要由五种：String、Hash、List、Set 和 Sorted Set。Redis 内部使用一个 redisObject 对象来表示所有的 key 和 value。redisObject 最主要的信息如图所示：

![Redis 存储对象信息是用Hash 还是String_又拍云- MdEditor](https://hedonspace.oss-cn-beijing.aliyuncs.com/img2/008i3skNly1gsyyvc5q1yj30yg0in75s.jpg)

- type 代表一个 value 对象具体是何种数据类型
- encoding 是不同数据类型在 redis 内部的存储方式，比如：
    - type=string 代表 value 存储的是一个普通字符串，那么对应的 encoding 可以是 raw 或者是 int，如果是 int 则代表实际 Redis 内部是按数值型类存储和表示这个字符串的，当然前提是这个字符串本身可以用数值表示，比如:”123″ “456”这样的字符串。
- 只有打开了 Redis 的虚拟内存功能，vm 字段字段才会真正的分配内存，该功能默认是关闭状态的。

**1）String**

- 常用命令：set, get, decr, incr, mget 等；
- 应用场景：String 是最常用的一种数据类型，普通的 key/value 存储都可以归为此类；
- 实现方式：String 在 Redis 内部存储默认就是一个字符串，被 redisObject 所引用，当遇到 incr、dec r等操作时会转成数值型进行计算，此时 redisObject 的 encoding 字段为 int。

**2）Hash**

- 常用命令：hget, hset, hgetall, hmget, hmset 等；
    
- 应用场景：在 Memcached 中，我们经常将一些结构化的信息打包成 HashMap，在客户端序列化后存储为一个字符串的值，比如用户的昵称、年龄、性别、积分等，这时候在需要修改其中某一项时，通常需要将所有值取出反序列化后，修改某一项的值，再序列化存储回去。 **这样不仅增大了开销，也不适用于一些可能并发操作的场合** （比如两个并发的操作都需要修改积分）。而 Redis 的 Hash结构可以使你像在数据库中 Update 一个属性一样只修改某一项属性值。
    
- 实现方式：Redis 的 Hash 实际是内部存储的 Value 为一个 HashMap，并提供了直接存取这个 Map 成员的接口。当前 HashMap 的实现有两种方式：
    
    - **ziplist（压缩列表）**：当哈希类型元素个数小于 hash-max-ziplist-entries 配置（默认512个）同时所有值都小于 hash-max-ziplist-value 配置（默认64个字节）时，Redis 会使用 ziplist 作为哈希的内部实现。
        
        ziplist 使用更加紧凑的结构实现多个元素的连续存储，所以在节省内存方面比 hashtable 更加优秀。
        
    - **hashtable（哈希表）**：当哈希类型无法满足 ziplist 的条件时，Redis 会使用 hashtable 作为哈希的内部实现。因为此时 ziplist 的读写效率会下降，而 hashtable 的读写时间复杂度为 O(1)。
        

**3）List**

- 常用命令：lpush, rpush, lpop, rpop, lrange 等；
    
- 应用场景：list 的应用场景非常多，也是 Redis 最重要的数据结构之一，比如 twitter 的关注列表，粉丝列表等都可以用 Redis 的 list 结构来实现。
    
    list 就是链表，我们可以轻松地实现最新消息排行等功能。
    
    list 的另一个应用就是消息队列，可以利用 list 的 push 操作，将任务存在 list 中，然后工作线程再用 pop 操作将任务取出进行执行。
    
    Redis 还提供了操作 list 中某一段的 API，你可以直接查询，删除 list 中某一段的元素。
    
- 实现方式：Redis list 的实现为一个双向链表，即可以支持反向查找和遍历，更方便操作，不过带来了部分额外的内存开销，Redis 内部的很多实现，包括发送缓冲队列等也都是用的这个数据结构。
    

**4）Set**

- 常用命令：sadd, spop, smembers, sunion 等；
    
- 应用场景：Redis set 对外提供的功能与 list 类似是一个列表的功能，特殊之处在于 set 是可以自动排重的，当你需要存储一个列表数据，又不希望出现重复数据时，set 是一个很好的选择，并且 set 提供了判断某个成员是否在一个 set 集合内的重要接口，这个也是 list 所不能提供的。
    
    set 集合的概念就是一堆不重复值的组合。利用 Redis 提供的 set 数据结构，可以存储一些集合性的数据，比如在微博应用中，可以将一个用户所有的关注人存在一个集合中，将其所有粉丝存在一个集合。
    
    Redis 还为集合提供了求交集、并集、差集等操作，可以非常方便的实现如共同关注、共同喜好、二度好友等功能，对上面的所有集合操作，你还可以使用不同的命令选择将结果返回给客户端还是存集到一个新的集合中。
    
- 实现方式：set 的内部实现是一个 value 永远为 null 的 HashMap，实际就是通过计算 hash的 方式来快速排重的，这也是 set 能提供判断一个成员是否在集合内的原因。
    

**5）Sorted Set**

- 常用命令：zadd, zrange, zrem, zcard 等；
- 使用场景：Redis sorted set 的使用场景与 set 类似，区别是 set 不是自动有序的，而 sorted set 可以通过用户额外提供一个优先级（score）的参数来为成员排序，并且是插入有序的，即自动排序。当你需要一个有序的并且不重复的集合列表，那么可以选择 sorted set 数据结构，比如 twitter 的 public timeline 可以以发表时间作为 score 来存储，这样获取时就是自动按时间排好序的。另外还可以用 sorted set 来做带权重的队列，比如普通消息的 score 为 1，重要消息的 score 为 2，然后工作线程可以选择按 score 的倒序来获取工作任务。让重要的任务优先执行。
- 实现方式：Redis sorted set 的内部使用 HashMap 和跳跃表（SkipList）来保证数据的存储和有序，HashMap 里放的是成员到 score 的映射，而跳跃表里存放的是所有的成员，排序依据是 HashMap 里存的 score，使用跳跃表的结构可以获得比较高的查找效率，并且在实现上比较简单。

### [#](https://hedon954.github.io/noteSite/backend/middleware/redis/redis_cache.html#_3-2-%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86%E6%9C%BA%E5%88%B6%E4%B8%8D%E5%90%8C)3.2 内存管理机制不同

> 在 Redis 中，并不是所有的数据都一直存储在内存中的，这是和 Memcached 相比一个最大的区别。

**Memcached**

Memcached 默认使用 `Slab Allocation` 机制管理内存，其主要思想是 **按照预先规定的大小，将分配的内存分割成特定长度的块以存储相应长度的 key-value 数据记录，以完全解决内存碎片问题。**

Slab Allocation 机制只为存储外部数据而设计，也就是说所有的 key-value 数据都存储在 Slab Allocation 系统里，而 Memcached 的其它内存请求则通过普通的 malloc/free 来申请，因为这些请求的数量和频率决定了它们不会对整个系统的性能造成影响。

Slab Allocation 的原理相当简单。 如下图所示，它首先从操作系统申请一大块内存，并将其分割成各种尺寸的块 Chunk，并把尺寸相同的块分成组 Slab Class。其中，Chunk 就是用来存储 key-value 数据的最小单位。每个 Slab Class 的大小，可以在 Memcached 启动的时候通过制定 Growth Factor 来控制。假定图中 Growth Factor 的取值为 1.25，如果第一组 Chunk 的大小为 88 个字节，第二组 Chunk 的大小就为 112 个字节，依此类推。

![img](https://hedonspace.oss-cn-beijing.aliyuncs.com/img2/008i3skNly1gsyzhcg1yaj30dm0azdg7.jpg)

当 Memcached 接收到客户端发送过来的数据时首先会根据收到数据的大小选择一个最合适的 Slab Class，然后通过查询 Memcached 保存着的该 Slab Class 内空闲 Chunk 的列表就可以找到一个可用于存储数据的 Chunk。当一条数据库过期或者丢弃时，该记录所占用的 Chunk 就可以回收，重新添加到空闲列表中。

从以上过程我们可以看出 Memcached的 内存管理制效率高，而且不会造成内存碎片，但是它最大的缺点就是会导致空间浪费。因为每个Chunk 都分配了特定长度的内存空间，所以变长数据无法充分利用这些空间。如下图所示，将 100 个字节的数据缓存到 128 个字节的 Chunk 中，剩余的 28 个字节就浪费掉了。

![img](https://hedonspace.oss-cn-beijing.aliyuncs.com/img2/008i3skNly1gsyzj0bngoj309n03ya9z.jpg)

**Redis**

Redis 的内存管理主要通过源码中 `zmalloc.h` 和 `zmalloc.c` 两个文件来实现的。Redis 为了方便内存的管理，在分配一块内存之后，会将这块内存的大小存入内存块的头部。如图所示，real_ptr 是 Redis 调用 malloc 后返回的指针。Redis 将内存块的大小 size 存入头部，size 所占据的内存大小是已知的，为 size_t 类型的长度，然后返回 ret_ptr。当需要释放内存的时候，ret_ptr 被传给内存管理程序。通过 ret_ptr，程序可以很容易的算出 real_ptr 的值，然后将 real_ptr 传给 free 释放内存。

![img](https://hedonspace.oss-cn-beijing.aliyuncs.com/img2/008i3skNly1gsyzk9azvqj309p02nwec.jpg)

Redis 通过定义一个数组来记录所有的内存分配情况，这个数组的长度为 `ZMALLOC_MAX_ALLOC_STAT`。数组的每一个元素代表当前程序所分配的内存块的个数，且内存块的大小为该元素的下标。在源码中，这个数组为 zmalloc_allocations。zmalloc_allocations[16] 代表已经分配的长度为 16 bytes 的内存块的个数。zmalloc.c 中有一个静态变量 `used_memory` 用来记录当前分配的内存总大小。所以，总的来看，Redis 采用的是包装的 malloc/free，相较于 Memcached 的内存管理方法来说，要简单很多。

在 Redis 中，并不是所有的数据都一直存储在内存中的。这是和 Memcached 相比一个最大的区别。当物理内存用完时，Redis 可以将一些很久没用到的 value 交换到磁盘。Redis 只会缓存所有的 key 的信息，如果 Redis 发现内存的使用量超过了某一个阀值，将触发 swap 的操作，Redis 根据 `“swappability = age*log(size_in_memory)”` 计算出哪些 key 对应的 value 需要 swap 到磁盘。然后再将这些 key 对应的 value 持久化到磁盘中，同时在内存中清除。

这种特性使得 Redis 可以保持超过其机器本身内存大小的数据。当然，机器本身的内存必须要能够保持所有的 key，毕竟这些数据是不会进行 swap 操作的。同时由于 Redis 将内存中的数据 swap 到磁盘中的时候，提供服务的主线程和进行 swap 操作的子线程会共享这部分内存，所以如果更新需要 swap 的数据，Redis 将阻塞这个操作，直到子线程完成 swap 操作后才可以进行修改。当从 Redis 中读取数据的时候，如果读取的 key 对应的 value 不在内存中，那么 Redis 就需要从 swap 文件中加载相应数据，然后再返回给请求方。 这里就存在一个 I/O 线程池的问题。在默认的情况下，Redis 会出现阻塞，即完成所有的 swap 文件加载后才会相应。这种策略在客户端的数量较小，进行批量操作的时候比较合适。但是如果将 Redis 应用在一个大型的网站应用程序中，这显然是无法满足大并发的情况的。所以 Redis 运行我们设置I/O线程池的大小，对需要从 swap 文件中加载相应数据的读取请求进行并发操作，减少阻塞的时间。

### [#](https://hedon954.github.io/noteSite/backend/middleware/redis/redis_cache.html#_3-3-%E6%95%B0%E6%8D%AE%E6%8C%81%E4%B9%85%E5%8C%96%E7%9A%84%E4%B8%8D%E5%90%8C)3.3 数据持久化的不同

> Redis 虽然是基于内存的存储系统，但是它本身是支持内存数据的持久化的，而且提供两种主要的持久化策略：RDB 快照和 AOF 日志。而 Memcached 是不支持数据持久化操作的。

### [#](https://hedon954.github.io/noteSite/backend/middleware/redis/redis_cache.html#_3-4-%E9%9B%86%E7%BE%A4%E7%AE%A1%E7%90%86%E6%9C%BA%E5%88%B6%E4%B8%8D%E5%90%8C)3.4 集群管理机制不同

**Memcached**

Memcached 是全内存的数据缓冲系统，Redis 虽然支持数据的持久化，但是全内存毕竟才是其高性能的本质。作为基于内存的存储系统来说，机器物理内存的大小就是系统能够容纳的最大数据量。如果需要处理的数据量超过了单台机器的物理内存大小，就需要构建分布式集群来扩展存储能力。

Memcached 本身并不支持分布式，因此只能在客户端通过像一致性哈希这样的分布式算法来实现 Memcached 的分布式存储。下图给出了 Memcached 的分布式存储实现架构。

![img](https://hedonspace.oss-cn-beijing.aliyuncs.com/img2/008i3skNly1gsyzr0prm9j30aw07omxa.jpg)

当客户端向 Memcached 集群发送数据之前，首先会通过内置的分布式算法计算出该条数据的目标节点，然后数据会直接发送到该节点上存储。但客户端查询数据时，同样要计算出查询数据所在的节点，然后直接向该节点发送查询请求以获取数据。

**Redis**

相较于 Memcached 只能采用客户端实现分布式存储，Redis 更偏向于在服务器端构建分布式存储。最新版本的 Redis 已经支持了分布式存储功能。Redis Cluster 是一个实现了分布式且允许单点故障的 Redis 高级版本，它没有中心节点，具有线性可伸缩的功能。下图给出 Redis Cluster 的分布式存储架构。

![img](https://hedonspace.oss-cn-beijing.aliyuncs.com/img2/008i3skNly1gsyzrw7c5qj308a09nt90.jpg)

其中节点与节点之间通过二进制协议进行通信，节点与客户端之间通过 ASCII 协议进行通信。在数据的放置策略上，Redis Cluster 将整个 key 的数值域分成 4096 个哈希槽，每个节点上可以存储一个或多个哈希槽，也就是说当前 Redis Cluster 支持的最大节点数就是 4096。Redis Cluster 使用的分布式算法也很简单：`crc16( key ) % HASH_SLOTS_NUMBER`。

为了保证单点故障下的数据可用性，Redis Cluster 引入了 Master 节点和 Slave 节点。在 Redis Cluster 中，每个 Master 节点都会有对应的两个用于冗余的 Slave 节点。这样在整个集群中，任意两个节点的宕机都不会导致数据的不可用。当 Master 节点退出后，集群会自动选择一个 Slave 节点成为新的 Master 节点。

![img](https://hedonspace.oss-cn-beijing.aliyuncs.com/img2/008i3skNly1gsyzsus7nxj30dm05gt9b.jpg)

### [#](https://hedon954.github.io/noteSite/backend/middleware/redis/redis_cache.html#_3-5-%E6%95%B0%E6%8D%AE%E4%B8%80%E8%87%B4%E6%80%A7%E7%9A%84%E4%B8%8D%E5%90%8C)3.5 数据一致性的不同

Memcached 提供了`cas` 命令，可以保证多个并发访问操作同一份数据的一致性问题。

Redis 没有提供 `cas` 命令，并不能保证这点，不过 Redis 提供了事务的功能，可以保证一串命令的原子性，中间不会被任何操作打断。

总结

区别：

1. 存储支持：Redis 和 Memcache 都是将数据存放在内存中，都是内存数据库。不过 Memcache 还可用于缓存其他东西，例如图片、视频等等；
2. 数据类型：Redis 不仅仅支持简单的k/v类型的数据，同时还提供 list，set，hash 等数据结构的存储；
3. 虚拟内存：Redis 当物理内存用完时，可以将一些很久没用到的 value 交换到磁盘；
4. 过期策略：Memcache 在 set 时就指定，例如 set key1 0 0 8，即永不过期。Redis 可以通过例如 expire 设定，例如 expire name 10；
5. 集群管理：Memcache 集群，利用 magent 做一主多从；Redis 可以做一主多从。二者都可以一主一从；
6. 数据持久：Memcache 挂掉后，数据没了；Redis 可以定期保存到磁盘（持久化）；
7. 灾难恢复：Memcache 挂掉后，数据不可恢复；Redis 数据丢失后可以通过 AOF 恢复；
8. 数据备份：Redis 支持数据的备份，即 master-slave 模式的数据备份；
9. 应用场景：Redis 出来作为 NoSQL 数据库使用外，还能用做消息队列、数据堆栈和数据缓存等；Memcached 适合于缓存 SQL 语句、数据集、用户临时性数据、延迟查询数据和 session 等。

使用场景：

1. 如果有持久方面的需求或对数据类型和处理有要求的应该选择 Redis。
2. 如果简单的 key/value 存储应该选择 Memcached。

## 4. 缓存异常解决策略

### 4.1 缓存击穿

缓存击穿是指缓存中没有但数据库中有的数据（一般是缓存时间到期），这时由于并发用户特别多，同时读缓存没读到数据，又同时去数据库去取数据，引起数据库压力瞬间增大，造成过大压力。

**解决：**

1. 设置热点数据永远不过期。
    
2. 设置热点数据逻辑过期，当逻辑过期的时候程序异步自动更新过期时间。
    
3. 加互斥锁，互斥锁参考代码如下：
    
    ![img](https://hedonspace.oss-cn-beijing.aliyuncs.com/img2/008i3skNly1gt27ltgn9zj60l60fvgng02.jpg)
    

说明：

1）缓存中有数据，直接走上述代码 13 行后就返回结果了

2）缓存中没有数据，第1个进入的线程，获取锁并从数据库去取数据，没释放锁之前，其他并行进入的线程会等待100ms，再重新去缓存取数据。这样就防止都去数据库重复取数据，重复往缓存中更新数据情况出现。

3）当然这是简化处理，理论上如果能根据 key 值加锁就更好了，就是线程 A 从数据库取 key1 的数据并不妨碍线程 B 取 key2 的数据，上面代码明显做不到这点。

### [#](https://hedon954.github.io/noteSite/backend/middleware/redis/redis_cache.html#_4-2-%E7%BC%93%E5%AD%98%E7%A9%BF%E9%80%8F)4.2 缓存穿透

当查询缓存是无此 key 对应的值，后去数据库查询，数据库有值时存入缓存无值时返回无此值，但再一次查此 key 是还是一样的结果，但大量的访问此 key 是对数据库会造成更大的压力。

**解决：**

1. 空值存储：当查询缓存是无此而已的值时，查询数据库，有值时存入缓存，物质是同样存入一个 null 并设置较短的有效时间，但再次查询此 key 时，查询结果的结果为 null 时展示无数据。
2. 布隆过滤器

布隆过滤器

**布隆过滤器**（英语：Bloom Filter）是 1970 年由布隆提出的。它实际上是一个很长的二进制向量和一系列随机映射函数。布隆过滤器可以用于 **检索一个元素是否在一个集合中** 。它的优点是空间效率和查询时间都远远超过一般的算法，缺点是有一定的误识别率和删除困难。

![img](https://hedonspace.oss-cn-beijing.aliyuncs.com/img2/008i3skNly1gt27wygm0vj60oi0d80tr02.jpg)

**基本概念：**

- 如果想判断一个元素是不是在一个集合里，一般想到的是将集合中所有元素保存起来，然后通过比较确定。链表、树、散列表（又叫哈希表，Hash table）等等数据结构都是这种思路。但是随着集合中元素的增加，我们需要的存储空间越来越大。同时检索速度也越来越慢，上述三种结构的检索时间复杂度分别为 O(n)、O(log n)、O(1)。
- 布隆过滤器的原理是：当一个元素被加入集合时，通过 K 个散列函数将这个元素映射成一个位数组中的 K 个点，把它们置为 1。检索时，我们只要看看这些点是不是都是 1 就（大约）知道集合中有没有它了：如果这些点有任何一个 0，则被检元素一定不在；如果都是 1，则被检元素很可能在。这就是布隆过滤器的基本思想。

**优点：**

- 相比于其它的数据结构，布隆过滤器在空间和时间方面都有巨大的优势。布隆过滤器存储空间和插入和查询时间都是常数 O(k)。另外，散列函数相互之间没有关系，方便由硬件并行实现。布隆过滤器不需要存储元素本身，在某些对保密要求非常严格的场合有优势。
- 布隆过滤器可以表示全集，其它任何数据结构都不能。
- 使用同一组散列函数的两个布隆过滤器的交并运算可以使用位操作进行。

**缺点：**

- 但是布隆过滤器的缺点和优点一样明显。误算率是其中之一。随着存入的元素数量增加，误算率随之增加。但是如果元素数量太少，则使用散列表足矣。
- 另外，一般情况下不能从布隆过滤器中删除元素。我们很容易想到把位数组变成整数数组，每插入一个元素相应的计数器加 1, 这样删除元素时将计数器减掉就可以了。然而要保证安全地删除元素并非如此简单。首先我们必须保证删除的元素的确在布隆过滤器里面。这一点单凭这个过滤器是无法保证的。另外计数器回绕也会造成问题。

**解决缓存穿透：**

- 当客户端进行查询时，先经过布隆过滤器，判断要查询的数据 key 是否在布隆数组当中，如果可能存在，则查询数据库，如果不可能存在，则返回空。

### [#](https://hedon954.github.io/noteSite/backend/middleware/redis/redis_cache.html#_4-3-%E7%BC%93%E5%AD%98%E9%9B%AA%E5%B4%A9)4.3 缓存雪崩

在缓存服务器重启或大规模的缓存时间到期导致请求到访问数据库查询，使 MySQL压力太大奔溃。

**雪崩后的解决方案：**

- 雪崩后关闭外网服务，对数据库 **预热缓存** 再开启外网服务。

> 缓存预热：将常用的缓存提前存入缓存中。

**解决：**

1. 将缓存的 key 的到期时间设置为不同个的时间，避免同一个时间段大规模的缓存失效。
2. 将缓存备份。
3. 如果缓存数据库是分布式部署，将热点数据均匀分布在不同搞得缓存数据库中。
4. 设置热点数据永远不过期。

##  内存淘汰策略

Redis 的最大缓存、主键失效、淘汰机制等参数都是通过 `redis.conf` 配置文件来配置的。

**4.4.1 最大内存参数**

`maxmemory <bytes>`：设置最大内存，比如：`maxmemory 500mb`

![image-20210802102325148](https://hedonspace.oss-cn-beijing.aliyuncs.com/img2/008i3skNly1gt28dqv11lj316o04qq3r.jpg)

**4.4.2 内存淘汰策略**

`maxmemory policy`：设置缓存淘汰策略

（1）volatile-lru：从已设置过期时间的数据集中挑选最近最少使用的数据淘汰。

（2）volatile-ttl：从已设置过期时间的数据集中挑选将要过期的数据淘汰。

（3）volatile-random：从已设置过期时间的数据集中任意选择数据淘汰。

（4）volatile-lfu：从已设置过期时间的数据集挑选使用频率最低的数据淘汰。

（5）allkeys-lru：从数据集中挑选最近最少使用的数据淘汰。

（6）allkeys-lfu：从数据集中挑选使用频率最低的数据淘汰。

（7）allkeys-random：从数据集（server.db[i].dict）中任意选择数据淘汰

（8）no-enviction：禁止驱逐数据，这也是默认策略。意思是当内存不足以容纳新入数据时，新写入操作就会报错，请求可以继续进行，线上任务也不能持续进行，采用 no-enviction 策略可以保证数据不被丢失。

这八种大体上可以分为 5 种：lru、lfu、random、ttl、no-enviction

**4.4.3 淘汰机制的实现**

1. 惰性删除：在主键被访问时如果发现它已经失效，那么就删除它。Redis 在实现 GET、MGET、HGET、LRANGE 等所有涉及到读取数据的命令时都会调用 expireIfNeeded，它存在的意义就是在读取数据之前先检查一下它有没有失效，如果失效了就删除它。
    
    expireIfNeeded 函数中调用的另外一个函数 propagateExpire，这个函数用来在正式删除失效主键，并且广播告诉其他地方，目的地有俩：
    
    - AOF 文件，将删除失效主键的这一操作以 DEL Key 的标准命令格式记录下来；
    - 另一个就是发送到当前 Redis 服务器的所有 Slave，同样将删除失效主键的这一操作以 DEL Key 的标准命令格式告知这些 Slave 删除各自的失效主键。
2. 定时删除：周期性地探测，发现失效就删除。惰性删除的缺点是，如果 key 迟迟不被访问，就会占用很多内存空间，所以才有定时删除。
    
3. 主动删除：当内存超过 maxmemory 限定时，触发主动清理策略，该策略由启动参数的配置决定。
    


> 参考：
> 
> - https://redis.io/
> - https://memcached.org/
> - https://blog.csdn.net/u010398838/article/details/79995636
> - https://www.biaodianfu.com/redis-vs-memcached.html?spm=a2c6h.12873639.0.0.746d5cfcE7ZNIw
> - https://www.bilibili.com/video/BV1dU4y1f7Pa
