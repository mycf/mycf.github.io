#面试 
HashTable 和 HashMap 都是一个基于哈希表实现的，KV结构的集合，HashTable 是 JDK1.0 引入的一个线程安全的集合类，因为所有数据访问的方法，都加了一个 Synchronize 同步锁，HashTable 内部采用了数组加链表来实现，链表主要是用来解决哈希表的一个哈希冲突的问题，HashMap 是 JDK1.2 引入的一个线程不安全的集合类，HashMap 内部也使用了数组加链表来实现，但是在JDK1.8里面做了一些优化，引入了红黑树，当链表长度大于等于8，并且数组的长度大于64的时候，就会把链表转化为红黑树，提升数据查找的一个性能。

从功能特性来说,可以分为两个点,
第一个 HashTable 是线程安全的，而 HashMap 不是。
第二个 HashMap 的性能要比 HashTable要好，因为 HashTable 采用了全局同步锁来保证线程安全性，所以它对性能的影响会比较大

从他们内部实现的角度来说,又可以分为三个点
第一个 HashTable使用数组+链表的方式来实现，HashMap 采用了数组+链表+红黑数
第二个 HashMap 初始容量是16，HashTable 初始容量是11。
第三个 HashMap 可以使用 null 作为key，因为 HashMap 会把null转化为一个零进行存储，而HashTable不允许
最后他们两个key的散列算法是不同的，HashTable 直接使用了key的 hashCode，对数组长度做取模，而 HashMap 对 key 的 hashCode 做了二次hash，从而避免key的分布不均匀，影响到性能
