# 1.8

## 初始化

```java
    public HashMap() {
        this.loadFactor = DEFAULT_LOAD_FACTOR; // all other fields defaulted
    }
```

## put插入
![[HashMap 2024-01-06 14.11.10.excalidraw|100%]]

## 数组扩容
![[HashMap 2024-01-06 15.31.21.excalidraw|100%]]
### 总结
- JDK1.8 同样是先生成新数组，长度是老数组的2倍;
- 遍历老数组桶中的每个元素;
- 如果桶节点没有形成链表，计算出新数组的索引位置，直接转移到新数组;
- 如果桶节点已经形成链表，将链表重新链接，按照低位区和高位区重新分配到新数组;
- 如果桶节点已经形成红黑树
	- 调用split方法将红黑树重新切分为低位区和高位区2个链表;
	- 判断低位区和高位区链表的长度，链表长小于6，则会进行取消树化的处理，否则会将新生成的链表重新树化;
- 所有元素转移完之后，将新数组赋值给HashMap对象的table属性。

# 1.7

> [!NOTE] 1.7 `HashMap` 为什么采用头插法
> HashMap的链表是单链表，如果插到尾部需要遍历整个链表。

> [!NOTE] HashMap为什么使用2的次方
> ==方便定位下标==，`HashMap`使用了`&`操作定位下标，indexFor =》h & (length - 1)
```java
static int indexFor(int h, int length) {
	// assert Integer.bitCount(length) == 1 : "length must be a non-zero power of 2";
	return h & (length-1);
}

```

## HashMap的扩容
```java
void addEntry(int hash, K key, V value, int bucketIndex) {
	// 到达阈值，并且下标的节点不为空
	if ((size >= threshold) && (null != table[bucketIndex])) {
		// 进行扩容
		resize(2 * table.length);
		hash = (null != key) ? hash(key) : 0;
		bucketIndex = indexFor(hash, table.length);
	}

	createEntry(hash, key, value, bucketIndex);
}
```

```java
void transfer(Entry<?,?>[] newTable, boolean rehash) {
	Entry<?,?>[] src = table;
	int newCapacity = newTable.length;
	for (int j = 0; j < src.length; j++) {
		Entry<K,V> e = (Entry<K,V>)src[j];
		while(null != e) {
			Entry<K,V> next = e.next;
			if (rehash) {
				e.hash = null == e.key ? 0 : hash(e.key);
			}
			int i = indexFor(e.hash, newCapacity);
			e.next = (Entry<K,V>)newTable[i];
			newTable[i] = e;
			e = next;
		}
	}
}

```
因此，HashMap正常情况下的扩容就是是这样一个过程。我们来看，旧HashMap的节点会依次转移到新的HashMap中，旧HashMap转移链表元素的顺序是A、B、C，而新HashMap使用的是头插法插入，所以，扩容完成后最终在新HashMap中链表元素的顺序是C、B、A。
![[头插法.excalidraw|100%]]

```java
final boolean initHashSeedAsNeeded(int capacity) {
	// hashSeed hash种子 hashSeed一开始是0，所以刚开始这里是false
	boolean currentAltHashing = hashSeed != 0;
	boolean useAltHashing = sun.misc.VM.isBooted() &&
			(capacity >= Holder.ALTERNATIVE_HASHING_THRESHOLD);
	// 异或不相同为true
	boolean switching = currentAltHashing ^ useAltHashing;
	if (switching) {
		// 重新生成hash种子 只有这里会改hash种子
		hashSeed = useAltHashing
			? sun.misc.Hashing.randomHashSeed(this)
			: 0;
	}
	return switching;
}

```

`Holder.ALTERNATIVE_HASHING_THRESHOLD`的赋值逻辑如下：正常都是`Integer.MAX_VALUE`
```java
static final int ALTERNATIVE_HASHING_THRESHOLD;

static {
	// 正常是空
	String altThreshold = java.security.AccessController.doPrivileged(
		new sun.security.action.GetPropertyAction(
			// 自己配置启动参数-Djdk.map.althashing.threshold
			// 一般不会自己配置
			"jdk.map.althashing.threshold"));

	int threshold;
	try {
		// 正常都是Integer.MAX_VALUE;
		threshold = (null != altThreshold)
				? Integer.parseInt(altThreshold)
				: ALTERNATIVE_HASHING_THRESHOLD_DEFAULT; // Integer.MAX_VALUE;

		// disable alternative hashing if -1
		if (threshold == -1) {
			threshold = Integer.MAX_VALUE;
		}

		if (threshold < 0) {
			throw new IllegalArgumentException("value must be positive integer.");
		}
	} catch(IllegalArgumentException failed) {
		throw new Error("Illegal value for 'jdk.map.althashing.threshold'", failed);
	}

	// 正常都是Integer.MAX_VALUE;
	ALTERNATIVE_HASHING_THRESHOLD = threshold;
```
### 总结
- 先生成长度是老数组的2倍的新数组;
- 遍历老数组中桶中的每个元素;
- 根据key计算新数组的索引下标;
- 按照索引将元素添加到新数组中去;
- 所有元素转移完之后，将新数组赋值给HashMap对象的table属性。

注意：JDK1.7多线程环境下扩容会产生链表环问题，引发严重的性能问题。JDK1.8中采用尾插法&链表重新链接解决了此问题。
# JDK7 头插法死锁问题
![[HashMap死循环.excalidraw|100%]]