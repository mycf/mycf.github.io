# 作用
1. ThreadLocal 可以实现资源对象的线程隔离，让每个线程各用各的[资源对象]，避免争用引发的线程安全问题
2. ThreadLocal 同时实现了线程内的资源共享
3. 其原理是，每个线程内有一个 ThreadLocalMap 类型的成员变量，用来存储资源对象
    - 调用 set 方法，就是以ThreadLocal自己作为 key,资源对象作为 value，放入当前线程的ThreadLocalMap 集合中
    - 调用 get 方法，就是以 ThreadLocal 自己作为 key，到当前线程中查找关联的资源值
    - 调用 remove 方法，就是以 ThreadLocal 自己作为 key，移除当前线程关联的资源值

> [!NOTE] 为什么 ThreadLocalMap 中的 key (即 TheadLocal ) 要设计为弱引用?
> Thread 可能需要长时间运行 (如线程池中的线程)，如果 key(也就是threadLocal对象) 不再使用，需要在内存不足 (GC) 时释放其占用的内存
>
	> 解释一下：thread对象内有ThreadLocalMap的成员变量，如果每次使用ThreadLocal都重新new一个，而线程长时间运行，ThreadLocal不主动释放就会导致内存泄漏，所以设计ThreadLocalMap的key为弱引用，如果ThreadLocal对象不再使用，垃圾回收时自动回收。
	> 我认为ThreadLocal一般应该为静态类变量，<s>不应该会有需要回收的场景</s>，主要为了防止滥用
  

 GC 仅是让 key 的内存释放，后续还更根据 key 是否为 null 来进一步释放值的内存，释放时机有
      1. 获取 key， 发现 null key
      2. set key 时，会使用启发式扫描，清除临近的 null key，启发次数与元素个数、是否发现 null key 有关
      3. remove 时 (推荐)，因为一般使用 ThreadLocal 时都把它作为静态变量，因此 GC 无法回收

> TheadLocal一般是类静态变量，

### 为什么 ThreadLocalMap 中的 key (即 TheadLocal ) 要设计为弱引用?

我们先结合源码来看一下, 下面`ThreadLocalMap`源码中我们可以看到键和值它们合在一起, 用下面这个entry类型来表示, 其中entry继承自了`WeakReference`, 就是弱引用,  在构造方法里, 它会把键和值都传递进来, 键是我们的`ThreadLocal`,值是资源对象, 但是我们发现, 只有键调用了父类的构造, 会把它变成一个真正的弱引用, 而值并没有做特殊的处理, 它仍然是一个强引用, 

```java
static class ThreadLocalMap {

    static class Entry extends WeakReference<ThreadLocal<?>> {
        Object value;

        Entry(ThreadLocal<?> k, Object v) {
            super(k);
            value = v;
        }
    }
```
回到我们的问题啊, 为什么key要设计成弱引用的, 我们来思考这样一个场景, 比如说我现在这个thread线程啊, 在长时间的运行啊, 一直没停, 是不是意味着它里面这个map集合也一直存在, 如果你没有一个良好的编程习惯, 你自己没有主动去释放这里的键和值的内存, 那么当它 一直长时间运行, 那它里面的这些键值也会存储的越来越多, 那么只能等到垃圾回收的时候才能释放。

当我们整个java虚拟机的内存都不够的时候, 它会触发垃圾回收, 如果你这里的键设计成了强引用, 那即使将来触发了垃圾回收, 即使其他的地方都不再使用你这个键, 都不再使用你这个`ThreadLocal`, ,但只要你这个map里使用强引用引用它, 那它占用的内存是得不到释放的, 所以我们现在这个`ThreadLocalMap`中的key, 设计成了弱引用, 那这样的话将来垃圾回收的时候, 只要别的地方不再引用你这个key, 那我就可以把你这种弱引用对象, 占用的内存给你释放掉, 这是我们这个`ThreadLocalMap`中的key, 为什么要设计成弱引用的原因，就是为了你自己没有一个好的编程习惯, 忘了把它们的内存释放掉了, 将来垃圾回收的时候, 还有机会把你key占用的内存给你进行释放, 

但是请大家注意, 我们刚才也说了, 这个key是弱引, 它在垃圾回收时, 内存会是释放, 但是值不行, 值还是强引用, 所以值的内存释放我们还得另找机会。

为什么要设计成弱引用, 就是因为我们的线程, 有可能需要长时间的运行, 比如说咱们线程池中的那个核心线程, 它就是一直在运行啊, 只要你的线程池不关, 他就一直在, 那, 这个时候, 为了让我们这个key的内存能够得到一个释放, 作为最后一道防线, 那我们需要在内存不足, 也就是垃圾回收的时候, 能把这种弱引用的key 它占用的内存释放掉, 

垃圾回收只能让我们这个key的内存释放, 那后续还要根据这个key是否为null, 来进一步释放值的内存, 我们刚才说了, 也是它是强引用的, 他不能垃圾回收, 是释放掉啊, 所以我们还得考虑值的内存释放, 释放的时机又分了三种,


`ThreadLocalMap`是一个类似HashMap结构的数据结构，用于存储`ThreadLocal`和对应的值，它的内部结构由元素数组table和散列方法组成 
==元素数组：== `ThreadLocalMap`中的table数组用于存储entry类型的元素，每个entry由ThreadLocal对象的弱引用作为key，对应的值作为value，table的长度是一个二的幂次方，这是为了优化散列方法的运算效率。

==列方法：== `ThreadLocalMap` 使用哈希取余法来确定key在table数组中的位置，具体的计算方式是通过将的`threadLocalHashCode`与 (table.length-1)进行&运算来得到下标i 
`threadLocalHashCode` 是ThreadLocal对象的一个特殊值，每次创建一个ThreadLocal对象，他的`threadLocalHashCode`会自增 `0x61c88647` 这个值也叫波那契数或黄金分割数。

哈希增量： ThreadLocal的增量值`0x61c88647`是一个特殊的数字，它的带来的好处是能够使散列分布得非常均匀，这样可以减少散列冲突，提高存取效率。

总结虽然ThreadLocalMap的结构相似 但它并没有实现map接口 它通过持有ThreadLocal的弱引用和对应的值，使用哈希取余法来存储和定位数据，这种数据结构的设计和散列方法的优化，使得ThreaLocal对象能够高效地存储和获取对应的值。

==`ThreadLocalMap`开放寻址法来解决冲突hash冲突==


接下来我们来看这道面试题啊, 谈一谈对`ThreadLocal`的理解, 那我们都知道, 对于一个共享变量, 或者说一个共享的资源对象来讲, 那多个线程如果同时对它进行读啊写呀, 这样的操作, 那你就必须考虑它的线程安全问题, 你可以用枷锁的手段呀, 或者是用cs同事啊, 唉来保证它没有这种限制安全问题, 而我们接下来要说的这个`ThreadLocal`, 它可以说是采用了一种完全相反的思路, 来解决的这个现场安全问题, 那他是怎么做的呢, 虽然local呢可以实现资源对象的一个线程隔离, 让每个线程各用各的资源对象, 啥意思啊, 也就是我不共享了啊, 不存在同一个资源对象, 被多个线程大家同时访问这个问题了, 每个线程你是各用各的资源啊, 线程e用资源一, 线程二呢用资源二啊, 大家不去争抢了, 自然我们就可以避免征用, 引发的线程安全问题啊, 这就是所谓的线程隔离啊, 那有同学可能说了, 那你这种线程所谓的线程隔离, 那我用局部的对象也可以实现呀, 不牵扯到共享, 那是不是也没有这种检查安全问题呢, 是的, 但是啊局部变量它有个缺点, 它不能够跨越方法啊, 比如说同一个线程内, 我要调方法一, 方法二, 方法三, 那局部变量它的生命周期就局限在一个方法内, 我在方法二里我想用方法一的局部变量行不行, 那肯定不行对吧, 所以呢, 我们的`ThreadLocal`, 具备一个局部变量不具备的特点啊, 它可以实现线程内的资源共享, 哎换句话说就是我如果是用slogo的话, 那我可以在方法一里使用获得这个这个对象啊, 接下来只要是同一个线程, 我在方法二里, 我还可以通过clo取到相同的这个对象啊, 它可以实现线程内的这个资源共享好, 这就是`ThreadLocal`两大特点, 简单的总结一下, 就是线程间用slogo可以实现资源对象隔离, 线程内呢可以实现资源的一个共享好, 那下面我们通过代码来加深一下大家的印象, 这里呢我举了这么一个例子啊, 我们来看这个方法, 这个方法, 那样我最终的目的可能是要获取这个connection对象, 一个数据库连接对象来使用, 那这个数据库连接对象它是不是线程安全的呢, 不是啊, 他呢如果是多个线程, 大家要访问同一个数据库连接啊, 那就乱了套了, 那怎么办呢, 唉我们就要用`ThreadLocal`对它实现一个线程间的隔离, 也就是让每个线程用自己的一个connection对象好, 那我们来看这段代码, 这段代码里啊, 我会循环五次创建五个线程, 每个线程呢都会调用这个工具类的get connection, 那我们最终要达到的效果, 就是, 将来每个线程他们拿到的connection对象, 应该是不一样, 我们先来看结果, 唉我这是调用的二该调用这个一, 好大家看我一共有五线程对吧, t一到t5 , 那么他们拿到的肯定是对象是不是同一的, 显然不是对吧, 哎从这个后面的哈希值我们就看看出来, 他每个线程用的是各自不同的一个单元式对象, 那怎么实现的呢, 我们看一下下面的代码, 这个代码里啊, 我们就创建了一个server local对象, 它的作用就是可以把这个需要被保护, 或者是需要被隔离的这个资源对象, 存入当前线程, 或者是从当前线程获取这个资源, 那我们来看看下面这段代码, 看这个get connection这个方法, 这个方法里啊, 其中虽然local.get, 它的作用呢就是到当前线程获取这个资源好, 这是get方法, 它还有个set方法, 这个set方法呢就是将资源存入当前线程, 好那我们来读一下这段代码, 刚开始呢他会到当前线程获取资源啊, 比如说我现在是其中第一个线程, 来执行这段代码了, 那第一个线程中有没有这个这个connection的资源呢, 暂时还没有对吧, 一开始大家每个线程内都是空的啊, 没有, 所以呢他拿到的这个connection对象就是啊, 这个if条件就成立了, if条件成立了, 它就会调用, 接下来这个叫inner get connection, 这个方法大家很熟悉, 它就是创建一个新的线程对象啊, 说错了, connection连接对象, 新的连接对象好, 创建完这个新的连接对象之后呢, 调用了这个set方法, 就把这个连接资源对象存入了当前线程好, 接下来直接返回使用就可以了, 那如果是这时候来的是另外一个线程, 另外一个线程也调到这个get的站上了, 那他会不会啊拿到同一个线程对象呢, 不会为什么, 第二个线程他自己当前线整容获取资源时, 有这个资源吗, 没有, 我们刚才呢只是把这个资源存入了, 刚才的线程一啊, 并没有存到你现在这个线程二对吧, 所以线程二拿到的资源仍然是, 那所以线程二呢会创建它自己的连接对象, 然后存入自己那个线程, 同样接下来的线程三来了, 它也会啊发现线程三也没有这个可能性资源, 所以线程三也会创建自己的连接对象, 然后把它存入线程三, 自己那个线程好, 这样呢我们就实现了一个呃通过`ThreadLocal`啊, 实现了一个线程间的资源隔离, 那我们再来看一个线程内的资源共享啊, 看这个test 2 test 2, 这个方法呢我就循环了两次, 有两个线程, 每个线程呢它都会多次调用get connection啊, 那我们来看一下线程间, 他应该是不同的connection对吧, 但是在线程内是不是他虽然你调了多次, 应该获取的是同一个connection上, 好看一下效果, 好咱们看是不是同一个单式, 先看t一的t的这三个线程啊, 连接对象是不是同一个, 是的吧, 好再看t2 的这三个是不是同一个链接, 也是的啊, 那这是为什么呢





接下来我们来讲讲`ThreadLocal`它的实现原理, 刚才这个例子, 我们通过`ThreadLocal`实现了connection, 这个资源的线程隔离啊, 让每个线程呢他们用的connection对象是不同的, 那可能有同学就会问了, 这个`ThreadLocal`对象, 它只有一个从哪看出来啊, 哎他是static修饰的是吧, 所以只有一个`ThreadLocal`对象, 那一个词的构对象是怎么实现多个connection资源, 它们的隔离的呢, 

其实这个资源的线程隔离, 关键点还不在于这个threadLocal, 它在于我们每个线程中都有自己独立的一个map集合, 每个线程内有一个自己的map成员变量, 这个成员变量类型是一个ThreadLocalMap的key是`ThreadLocal,`值是用来存储资源的, 每个线程都有自己的map, 每个线程自己的map存储了不同的资源, 这样就让这个资源是各个线程用各自的啊, 大家互不干扰, 

那`ThreadLocal`起到一个什么作用呢, `ThreadLocal`只起到了一个关联资源的作用, 那当我们调用这个`ThreadLocal`它的set方法的时候, 他就是把这个`ThreadLocal`对象自己作为key, 然后资源作为值,  存入到当前线程的map集合中, 将来你就要用这个`ThreadLocal`它的get方法, 他就是这个`ThreadLocal`对象自己作为key, 到当前线程的那个map集合中去找关联的词啊, 所以我们看出来`ThreadLocal`, 他其实只起到了一个关联资源的作用, 真正起到这个资源的隔离呢, 是每个线程中那个map集合, 当然还有个remove方法, remove方法就是以`ThreadLocal`自己作为key, 然后到当前线程的map中去移除关联的值好, 其实这就是`ThreadLocal`它的一个原理啊, 其中起到线程隔离的, 是每个线程内的一个map集合, `ThreadLocal`起到的作用是关联这个资源对象

当然这样说呢可能不够形象, 所以我这也准备了一个网页, 我们一起看一下这个图上一共有三个线程, 线程一线程二线程三, 那每个线程内啊都会有自己的一个map集合啊, 用来实现这个资源隔离的啊, 当然这个map集合一开始都是none啊, 所以它图上并没有显示出来, 那什么时候会创建这个map集合呢, 啊是当你第一次用到它时, 它才会创建啊, 那现在呢比如说我有一个这个server local对象, 这个`ThreadLocal`对象呢, 我就是用不同的这个字符串, 来区分这个slogo对象啊, 比如说这里的a他们其实都对应同一个`ThreadLocal`对象, 将来呢我想代表另外一个`ThreadLocal`对象, 我就再用一个b代表另一个`ThreadLocal`对象, 好比如说啊, 我现在已经创建好了一个slo对象了, 接下来线程一调用它的set方法会发生什么呢, 哎它就是会在线程一内部创建一个map集合啊, 第一次使用它是创建, 创建完了map集合呢, 就把我们的这个`ThreadLocal`对象作为key, 然后呢一个资源对象作为值存入到map集合中啊, 当然资源这里啊并不是特别重要, 我就用一个数字来代表好, 那接下来线程二, 线程二还是对同一个sr logo对象, 去调用它的set方法, 但这回呢它是为线程二内部创建一个map集合, 还是我们的`ThreadLocal`啊, 作为key, 但是资源值呢, 可能关联的就是另外一个不同的资源值了啊, 比如这里的一是代表一个链接一啊, 那这里的二呢是代表另一个链接二啊, 他俩就是不同的资源了啊, 好所以从这儿我们也看到了, 是线程内的这个map集合隔离了资源, 当然这里的server local对象他们可以是同一个, 因为它只起到一个key的作用吧, 去用这个k关联资源的好, 当然线程三呢, 他也会有自己独立的这个map集合啊, 关联的资源自然也不一样啊, 给大家演示一下这个`ThreadLocal` map啊, `ThreadLocal` map也就是每个线程中这个map集合, 它的一个作用, 那对这个map集合呢, 我们再来深入看一看, 先来看一下啊, `ThreadLocal`对象在其中这个索引是如何计算的啊, 比如说刚才我们的a这个`ThreadLocal`啊, 它是放在了零这个索引, 那这个是怎么计算的呢, 啊其实啊当你每创建一个新的`ThreadLocal`对象啊, 他就会为我们这个`ThreadLocal`啊分配一个哈希值啊, 这个哈希值是有规律的, 刚开始啊哈希值是零, 所以大家看到我们这个a这个slogo对象, 它的索引也计算出来是零, 那当我再创建一个啊`ThreadLocal`对象, 比如说一个b啊, 它是一个新的`ThreadLocal`对象了, 那它的哈希值呢, 它是在零的基础上加这么一个数字啊, 1640531527啊, 加这么一个数字, 根据这个数字呢再去计算它的索引啊, 结果算出来是七, 所以将来这个b这个对象啊, 放入这个map集合中的时候, 它就会放到七这个位置去了, 好这是, 计算所有的计算啊, 那如果你再创建一个新的slog对象, 他就是在这个基础上再对这个数字再加一点, 加完以后啊, 变成负的了也没关系, 因为啊他计算出来这个同下标啊, 是正的就可以啊, 计算出来是14, 那他就会放在这个位置, 好以此类推啊, 好这是关于一个索引的计算啊, 他每次都会为新的slogo对象啊, 去在一个数额, 在一个零的基础上, 每次去累加一个特别大的一个整数



作为它的哈希值好索引计算, 我们说完了, 下面呢咱们看一下它的扩容啊, 啊对于我们这个刷新一下网页颜色不太好看, 对于我们这个这个`ThreadLocal` map, 它的初始容量是16啊, 初始容量16, 它的扩容因子是二分2/3, 也就是它元素个数啊, 只要是超过了我们这个数组长度的, 2/3的时候, 它就会触发过, 那这个值大概是多少呢, 我们可以看一下啊, 你就16x2÷3嘛, 啊大概是十点几对吧, 也就是只要它元素啊等于十了, 就会触发一次后, 我们可以看一下啊, 现在有三个元素, 我再多放几个, 第四个元素, 第五个元素, 第六个, 第七个, 第八个, 第九个九个是不是都没有扩容啊, 好我们放第十个的时候好, 它就是扩容了啊, 扩容跟我们之前的那个map也是类似的啊, 就是容量翻倍, 容量翻倍了以后, 那所有的这个k啊都要重新计算它的索引啊, 所以有的位置就变了啊, a没有变, 因为它的那个哈希值是零零, 它不怎么不管怎么去计算它的余数还是零对吧, 所以它始终在这个位置啊, 这是一个扩容啊, 那最后一个问题就是如果这个冲突了怎么办啊, 比如说我这个索引冲突了怎么办, 那之前呢我们讲的hashmap也好, 什么concurrent hashmap也好, hash table也好啊, 他们都是用拉链法解决这个索引冲突, 但是我们这个呃每个线程内这种叫做sd的local map, 它采用的是一种开放寻址法来解决冲突啊, 他不是用拉链吗, 啥意思呢, 也很简单, 比如说吧, 我接下来要放一个八, 好放这个slogo对象啊, 那他的这个哈希值啊, 我固定成零了, 那这个零和这里的a是不是就冲突了, 那它就是从这个零开始找下一个空弦的位置啊, 作为我这个所以位置好, 可以看到八, 他就放到一这个位置了, 那如果再有一个九呢, 好他的也是零啊, 计算出来的索引也是零, 那他就再找下一个空闲位置啊, 以此类推啊, 好, 所以它是采用的这种叫开放寻址法, 来解决索引冲突, 而不是用我们普通哈希map中的拉链法, 解决索引冲突, 好关于这个`ThreadLocal` map啊, 我们就给大家讲了这么几点一呢, 它最重要的作用是用来我们解决这个资源的, 线程隔离的, 二呢它的这个储容量16, 宽容因子2/3对吧, 然后三呢它的索引是如何计算的啊, 它都是针对每个`ThreadLocal`对象会从零开始, 每次累加一个数字作为这个`ThreadLocal`对象的哈希值, 最后呢它的呃冲突, 解决冲突的方式并不是用拉链法, 而是用开放寻址法来解决索引冲突, 好关于这个原理部分, 我们先给大家讲到这里



完整的要点提取

好接下来我们来看第二种情况, 比如说我现在有四组键值, 分别是abcd, 其中a b c呢, 我故意让他们离得比较近啊, 都是紧挨着的, d呢跟他们就离得比较远, 中间有几个空档, 接下来我们模拟一次垃圾回收的过程啊, 假设也没有其他的地方引用a b c d了, 那么他们作为这种弱引用的key啊, 都会被回收掉好, 但是它们的值呢都还保留了, 那什么时候他们的value值会被它们占用的, 内存会被释放呢, 这是第二种情况, 就是到我们去执行这个sk的操作时, 比如说啊我又有一个e, 那这个e呢我要把它放在八这个位置好, 当我执行set时, 它就检查, 如果你这个k是now诶, 他就认为哎这个k已经被回收掉了, 那我顺便就把它的值啊会进行一个清理, 不仅如此啊, 他会把它与与之邻近的一些nk啊, 也做一个清理啊, 也就是它不光是清理八的90的, 他也会清理, 我们来试验一下啊, 可以看到90的那两个y6 值也被释放掉了, 但是呢跟刚才的啊这个离得比较远的啊, 这个索引14这个索引它的value啊就没释放啊, 因为他只找一些临近的nk啊, 离得太远了, 他就不管了, 那这种查找的规则呢它叫做启发式的扫描, 什么叫启发式扫描啊, 就是我执行这个清理动作的时候, 一种极端的情况是我根本不清理, 另外一种极端情况呢, 就是我每这个数组里面每个索引我都要过一遍, 都要做这个垃圾的清理, 那这就是两个极端啊, 一种呢会导致垃圾越来越多, 另外一种呢虽然你垃圾很少啊, 但是你要都清理电, 那你得把整个数组过一遍, 效率就低, 所以这个启发式的扫描, 就是在这两种极端情况下取了一个折中哎, 我也不不会不清理, 我也不会全部清理, 我只清理它临近的这个nk, 那临近几个呢啊也就是这个启发次数有几次呢, 哎这个跟两个圆因素有关啊, 一个因素啊就是跟元素个数有关的, 元素个数多的情况下, 它就会扫描的范围就大一些, 元素个数少的情况下, 扫描范围就少一些了, 另外呢还跟你是否发现了nk有关, 如果发现了nk, 他就会多扫描几次, 如果没有发现nk呢, 它就会扫描次数就相对较少好, 这是这种使用启发式的扫描, 在set时发现你k是now, 他就会做一些相应的值的清理操作好, 这是第二种情况


# InheritableThreadLocal详解
`InheritableThreadLocal` 是`ThreadLocal`的子类，用于在线程创建时将值传递给子线程。每个线程都有自己的与 `InheritableThreadLocal` 对象相关联的值的映射，这个映射由 `InheritableThreadLocal` 类自己维护。

当创建一个新线程时，不论是显式还是隐式创建，父线程的 `InheritableThreadLocal` 值会自动传递给子线程。这意味着子线程将具有与父线程相同的一组值。子线程也可以独立地修改或更新这些值，而不会影响父线程或其他兄弟线程中的值。

这种机制在需要将某些上下文信息或状态从父线程传递给子线程的场景中非常有用，例如用户上下文、事务上下文或其他线程特定的数据。

通过使用 `InheritableThreadLocal`，您可以确保子线程可以访问相关数据，而无需显式地将其作为参数传递或使用其他同步机制。每个线程都可以通过与其相关联的 `InheritableThreadLocal` 对象访问自己的一组值。

需要注意的是，`InheritableThreadLocal` 的值是特定于每个线程的，而不是在多个线程或 `InheritableThreadLocal` 类的实例之间共享的。
```java
public class ThreadLocalTest {
private static final InheritableThreadLocal<String> inheritableThreadLocal = new InheritableThreadLocal<>();

    public static void main(String[] args) throws IOException {
        setInheritableThreadLocal();
    }

    public static void setInheritableThreadLocal() {
        inheritableThreadLocal.set("hello");
        System.out.println(Thread.currentThread().getName() + ":" +  inheritableThreadLocal.get());
        Thread p = new Thread(() -> {
            System.out.println(Thread.currentThread().getName() + ":" +  inheritableThreadLocal.get());
        }, "子线程");
        p.start();
    }
}
```
执行后打印如下：
```sh
> Task :ThreadLocalTest.main()
main:hello
子线程:hello
```


InheritableThreadLocal类重写了ThreadLocal的3个函数：

```java
/**
 * 该函数在父线程创建子线程，向子线程复制InheritableThreadLocal变量时使用
 */
protected T childValue(T parentValue) {
	return parentValue;
}
/**
 * 由于重写了getMap，操作InheritableThreadLocal时，
 * 将只影响Thread类中的inheritableThreadLocals变量，
 * 与threadLocals变量不再有关系
 */
ThreadLocalMap getMap(Thread t) {
   return t.inheritableThreadLocals;
}
/**
 * 类似于getMap，操作InheritableThreadLocal时，
 * 将只影响Thread类中的inheritableThreadLocals变量，
 * 与threadLocals变量不再有关系
 */
void createMap(Thread t, T firstValue) {
	t.inheritableThreadLocals = new ThreadLocalMap(this, firstValue);
}
```

注意：由于重写了getMap()和createMap()两个函数，所以当

## 4、线程间传值实现原理

说到InheritableThreadLocal，还要从Thread类说起：

```java
public class Thread implements Runnable {
   ......(其他源码)
    /* 
     * 当前线程的ThreadLocalMap，主要存储该线程自身的ThreadLocal
     */
    ThreadLocal.ThreadLocalMap threadLocals = null;

    /*
     * InheritableThreadLocal，自父线程集成而来的ThreadLocalMap，
     * 主要用于父子线程间ThreadLocal变量的传递
     * 本文主要讨论的就是这个ThreadLocalMap
     */
    ThreadLocal.ThreadLocalMap inheritableThreadLocals = null;
    ......(其他源码)
}
```

Thread类中包含 _threadLocals_ 和 _inheritableThreadLocals_ 两个变量，其中 **inheritableThreadLocals** 即主要存储可自动向子线程中传递的ThreadLocal.ThreadLocalMap。  
接下来看一下父线程创建子线程的流程，我们从最简单的方式说起：

#### 4.1、用户创建Thread

```cpp
Thread thread = new Thread();
```

#### 4.2、Thread创建

```java


        if (inheritThreadLocals && parent.inheritableThreadLocals != null)
            this.inheritableThreadLocals =
                ThreadLocal.createInheritedMap(parent.inheritableThreadLocals);

        ......（其他代码）
    }
```

可以看到，采用默认方式产生子线程时，inheritThreadLocals=true；若此时父线程inheritableThreadLocals不为空，则将父线程inheritableThreadLocals传递至子线程。

#### ThreadLocal.createInheritedMap

让我们继续追踪createInheritedMap：

```cpp
    static ThreadLocalMap createInheritedMap(ThreadLocalMap parentMap) {
        return new ThreadLocalMap(parentMap);
    }
```

```java
/**
 * 构建一个包含所有parentMap中Inheritable ThreadLocals的ThreadLocalMap
 * 该函数只被 createInheritedMap() 调用.
 */
private ThreadLocalMap(ThreadLocalMap parentMap) {
	Entry[] parentTable = parentMap.table;
	int len = parentTable.length;
	setThreshold(len);
	// ThreadLocalMap 使用 Entry[] table 存储ThreadLocal
	table = new Entry[len];

	// 逐一复制 parentMap 的记录
	for (int j = 0; j < len; j++) {
		Entry e = parentTable[j];
		if (e != null) {
			@SuppressWarnings("unchecked")
			ThreadLocal<Object> key = (ThreadLocal<Object>) e.get();
			if (key != null) {
				// 可能会有同学好奇此处为何使用childValue，而不是直接赋值，
				// 毕竟childValue内部也是直接将e.value返回；
				// 个人理解，主要为了减轻阅读代码的难度
				Object value = key.childValue(e.value);
				Entry c = new Entry(key, value);
				int h = key.threadLocalHashCode & (len - 1);
				while (table[h] != null)
					h = nextIndex(h, len);
				table[h] = c;
				size++;
			}
		}
	}
}
```

从ThreadLocalMap可知，子线程将parentMap中的所有记录逐一复制至自身线程。

## 5、总结

InheritableThreadLocal主要用于子线程创建时，需要自动继承父线程的ThreadLocal变量，方便必要信息的进一步传递。
